import React, { useState, useRef } from 'react';
import {
  Box,
  Popover,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputAdornment,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Import the correct type from your types file
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>, fieldId: string) => {
    setAnchorEl(event.currentTarget);
    setActiveField(fieldId);
    setSearchQuery('');
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveField(null);
    setSearchQuery('');
  };

  const handleSelect = (value: string) => {
    if (activeField) {
      onUpdate(activeField, value);
      handleClose();
    }
  };

  const getFieldByType = (type: NarrativeField['type']): Field | undefined => {
    return section.fields.find(f => f.type === type);
  };

  const renderInteractiveElement = (field: Field | undefined) => {
    if (!field || !field.id) return null;

    const value = values[field.id];
    const isError = Boolean(errors?.[field.id]?.length);
    const options = field.options ?? [];
    
    const filteredOptions = options.filter((option: OptionType) => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <React.Fragment key={field.id}>
        <Box
          component="span"
          className={`interactive-element ${value ? 'filled' : 'unfilled'} ${isError ? 'error' : ''}`}
          onClick={(e) => handleClick(e, field.id)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: value ? 'text.primary' : 'primary.main',
            textDecoration: value ? 'none' : 'none',
            position: 'relative',
            px: value ? 0.5 : 1,
            py: value ? 0 : 0.5,
            borderRadius: value ? 0 : 1,
            bgcolor: value ? 'transparent' : 'action.hover',
            border: value ? 'none' : '1px dashed',
            borderColor: 'primary.main',
            '&:hover': {
              bgcolor: value ? 'transparent' : 'primary.50',
              '& .edit-icon': {
                opacity: 1,
              },
              '&::after': {
                background: theme.palette.primary.main,
              }
            },
            ...(value && {
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: 0,
                right: 0,
                height: 1,
                background: `repeating-linear-gradient(90deg,
                  ${theme.palette.primary.main},
                  ${theme.palette.primary.main} 4px,
                  transparent 4px,
                  transparent 8px
                )`
              }
            })
          }}
        >
          {value ? options.find(opt => opt.value === value)?.label || value : field.placeholder}
          {value && <EditIcon className="edit-icon" sx={{ 
            ml: 0.5, 
            fontSize: '0.875rem',
            opacity: 0,
            transition: 'opacity 0.2s',
            color: 'primary.main'
          }} />}
        </Box>
        <Popover
          open={Boolean(anchorEl) && activeField === field.id}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              width: 320,
              maxHeight: 400,
              p: 1,
              '& .MuiList-root': {
                py: 0
              }
            }
          }}
        >
          <TextField
            inputRef={searchInputRef}
            size="small"
            fullWidth
            placeholder="Search options..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <List dense sx={{ maxHeight: 320, overflow: 'auto' }}>
            {filteredOptions.map((option: OptionType) => (
              <ListItem key={option.value} disablePadding>
                <ListItemButton
                  onClick={() => handleSelect(option.value)}
                  selected={value === option.value}
                >
                  <ListItemText primary={option.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Popover>
      </React.Fragment>
    );
  };

  const renderNarrative = () => {
    if (!section.fields?.length) {
      return <Typography>No fields available</Typography>;
    }

    const narrativeTemplate = (
      <Typography variant="body1" sx={{ lineHeight: 2, fontSize: '1rem' }}>
        This research project aims to address{' '}
        {renderInteractiveElement(getFieldByType('research_gap'))}{' '}
        in the field of AI/ML healthcare applications. Based on{' '}
        {renderInteractiveElement(getFieldByType('supporting_literature'))}{' '}
        , there is a clear need to explore new methods for{' '}
        {renderInteractiveElement(getFieldByType('research_objective'))}{' '}
        . Our project will specifically focus on{' '}
        {renderInteractiveElement(getFieldByType('methodology_approach'))}{' '}
        , which has shown promise in{' '}
        {renderInteractiveElement(getFieldByType('prior_evidence'))}{' '}
        .
      </Typography>
    );

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
        {narrativeTemplate}
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