import React, { useState, useRef } from 'react';
import {
  Box,
  Select,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  useTheme,
  Chip,
  MenuItem,
  FormControl,
  OutlinedInput,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { DynamicField } from './DynamicField';
import { NarrativeSection, Field } from '../types/narrative';

interface OptionType {
  value: string;
  label: string;
  triggers?: {
    showFields: string[];
  };
}

interface NarrativeField extends Omit<Field, 'type' | 'options'> {
  type: 'research_gap' | 'supporting_literature' | 'research_objective' | 'methodology_approach' | 'prior_evidence';
  placeholder: string;
  options?: OptionType[];
}

interface DynamicNarrativeSectionProps {
  section: NarrativeSection;
  values: { [key: string]: any };
  onUpdate: (fieldId: string, value: any) => void;
  errors?: { [key: string]: string[] };
}

export const DynamicNarrativeSection: React.FC<DynamicNarrativeSectionProps> = ({
  section,
  values,
  onUpdate,
  errors,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (fieldId: string, value: string | string[]) => {
    if (fieldId) {
      onUpdate(fieldId, value);
    }
  };

  const renderInteractiveElement = (field: Field | undefined) => {
    if (!field || !field.id) return null;

    const value = values[field.id];
    const isMultiSelect = field.type === 'multiSelect';
    const selectedValues = isMultiSelect ? (Array.isArray(value) ? value : []) : value ? [value] : [];
    const isError = Boolean(errors?.[field.id]?.length);
    const options = field.options ?? [];

    const getOptionLabel = (val: string) => {
      const opt = options.find(opt => opt.value === val);
      return opt?.label || val;
    };

    return (
      <FormControl 
        variant="outlined" 
        size="small" 
        error={isError}
        sx={{ 
          minWidth: 120,
          display: 'inline-flex',
          m: 0,
          '& .MuiOutlinedInput-notchedOutline': {
            borderStyle: 'dashed',
          },
        }}
      >
        <Select
          multiple={isMultiSelect}
          value={isMultiSelect ? selectedValues : value || ''}
          onChange={(event) => {
            const newValue = event.target.value;
            handleSelect(field.id, newValue);
          }}
          input={
            <OutlinedInput
              placeholder={field.placeholder}
              sx={{
                backgroundColor: selectedValues.length ? 'background.paper' : 'action.hover',
                '&:hover': {
                  backgroundColor: 'primary.50',
                },
              }}
            />
          }
          renderValue={(selected) => {
            if (!selected || (Array.isArray(selected) && selected.length === 0)) {
              return <Typography color="primary">{field.placeholder}</Typography>;
            }
            if (isMultiSelect) {
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip
                      key={value}
                      label={getOptionLabel(value)}
                      size="small"
                      onDelete={() => {
                        const newValues = selectedValues.filter(v => v !== value);
                        handleSelect(field.id, newValues);
                      }}
                      sx={{
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        '& .MuiChip-deleteIcon': {
                          color: 'primary.contrastText',
                          '&:hover': {
                            color: 'error.main',
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              );
            }
            return getOptionLabel(selected as string);
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                width: 320,
              },
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderField = (field: Field) => {
    if (!field || !field.id) return null;

    // For narrative-specific fields, use the interactive element
    if (['research_gap', 'supporting_literature', 'research_objective', 'methodology_approach', 'prior_evidence'].includes(field.type)) {
      return renderInteractiveElement(field);
    }

    // For standard form fields, use DynamicField component
    return (
      <Box sx={{ mb: 2 }}>
        <DynamicField
          field={field}
          value={values[field.id]}
          onChange={(value) => onUpdate(field.id, value)}
          error={errors?.[field.id]}
        />
      </Box>
    );
  };

  const renderNarrative = () => {
    if (!section.fields?.length) {
      return <Typography>No fields available</Typography>;
    }

    // If it's a narrative section with a template
    if (section.template) {
      let content = section.template;
      
      // Replace all field placeholders with interactive elements
      section.fields.forEach(field => {
        const placeholder = `{${field.id}}`;
        if (content.includes(placeholder)) {
          const element = renderInteractiveElement(field);
          content = content.replace(placeholder, `<field-${field.id}>`);
        }
      });

      // Split content into parts and render
      const parts = content.split(/(<field-[^>]+>)/);
      
      return (
        <Typography variant="body1" sx={{ lineHeight: 2, fontSize: '1rem' }}>
          {parts.map((part, index) => {
            const fieldMatch = part.match(/<field-(.+)>/);
            if (fieldMatch) {
              const fieldId = fieldMatch[1];
              const field = section.fields.find(f => f.id === fieldId);
              return (
                <React.Fragment key={index}>
                  {renderInteractiveElement(field)}
                </React.Fragment>
              );
            }
            return <React.Fragment key={index}>{part}</React.Fragment>;
          })}
        </Typography>
      );
    }

    // For standard form sections, render fields normally
    return (
      <Box>
        {section.fields.map(field => renderField(field))}
      </Box>
    );
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      p: 3,
      backgroundColor: 'background.paper',
      borderRadius: 1,
      boxShadow: 1,
      '&::before': {
        display: 'none'
      }
    }}>
      {renderNarrative()}
    </Box>
  );
}; 