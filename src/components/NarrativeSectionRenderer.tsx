import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormGroup,
  FormLabel,
  Chip,
  Stack,
  Typography,
  OutlinedInput,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { NarrativeSection, NarrativeState, Field } from '../types/narrative';
import { useNarrative } from '../context/NarrativeContext';

interface NarrativeSectionRendererProps {
  section: NarrativeSection;
  values: NarrativeState;
}

export const NarrativeSectionRenderer: React.FC<NarrativeSectionRendererProps> = ({
  section,
  values,
}) => {
  const { updateField } = useNarrative();

  const renderField = (field: Field) => {
    const value = values[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <TextField
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            variant="outlined"
            size="small"
            label={field.label}
            placeholder={field.placeholder}
            fullWidth
            helperText={field.helpText}
            error={field.validation?.some(v => v.type === 'required' && !value)}
          />
        );

      case 'textArea':
        return (
          <TextField
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            variant="outlined"
            size="small"
            label={field.label}
            placeholder={field.placeholder}
            fullWidth
            multiline
            rows={4}
            helperText={field.helpText}
            error={field.validation?.some(v => v.type === 'required' && !value)}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => {
                updateField(field.id, e.target.value);
                const selectedOption = field.options?.find(opt => opt.value === e.target.value);
                if (selectedOption?.triggers) {
                  // Handle triggers
                }
              }}
              label={field.label}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multiSelect':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{field.label}</InputLabel>
            <Select
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => {
                const selectedValues = e.target.value as string[];
                updateField(field.id, selectedValues);
              }}
              input={<OutlinedInput label={field.label} />}
              renderValue={(selected) => (
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {(selected as string[]).map((value) => (
                    <Chip
                      key={value}
                      label={field.options?.find(opt => opt.value === value)?.label || value}
                      size="small"
                    />
                  ))}
                </Stack>
              )}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value}
              onChange={(e) => updateField(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{field.label}</FormLabel>
            <FormGroup>
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={Array.isArray(value) ? value.includes(option.value) : false}
                      onChange={(e) => {
                        const currentValues = Array.isArray(value) ? value : [];
                        const newValues = e.target.checked
                          ? [...currentValues, option.value]
                          : currentValues.filter(v => v !== option.value);
                        updateField(field.id, newValues);
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </FormControl>
        );

      case 'date':
        return (
          <TextField
            type="date"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            variant="outlined"
            size="small"
            label={field.label}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'number':
        return (
          <TextField
            type="number"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            variant="outlined"
            size="small"
            label={field.label}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        );

      default:
        return null;
    }
  };

  const renderTemplate = (template: string) => {
    const parts = template.split(/(\{[^}]+\})/g);
    return parts.map((part, index) => {
      if (part.match(/^\{([^}]+)\}$/)) {
        const fieldId = part.slice(1, -1);
        const field = section.fields.find(f => f.id === fieldId);
        if (!field) return null;

        // Check if field should be shown based on dependencies
        if (field.dependsOn) {
          const dependentValue = values[field.dependsOn.fieldId];
          if (field.dependsOn.condition === 'contains') {
            if (!Array.isArray(dependentValue) || !dependentValue.includes(field.dependsOn.value)) {
              return null;
            }
          } else if (dependentValue !== field.dependsOn.value) {
            return null;
          }
        }

        return (
          <Box
            key={index}
            component="span"
            sx={{ display: 'inline-block', verticalAlign: 'middle', mx: 1, my: 0.5 }}
          >
            {renderField(field)}
          </Box>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const shouldShowConditionalSection = (condition: { fieldId: string; value: any; operator?: string }) => {
    const value = values[condition.fieldId];
    
    switch (condition.operator) {
      case 'contains':
        return Array.isArray(value) && value.includes(condition.value);
      case 'not':
        return value !== condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      default:
        return value === condition.value;
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      {section.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {section.description}
        </Typography>
      )}

      <Box sx={{ typography: 'body1', lineHeight: 1.8 }}>
        {renderTemplate(section.template)}
      </Box>

      <AnimatePresence>
        {section.dynamicContent?.map((content, index) => (
          shouldShowConditionalSection(content.condition) && (
            <Box
              key={`dynamic-${index}`}
              component={motion.div}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              sx={{ mt: 2 }}
            >
              {renderTemplate(content.content)}
            </Box>
          )
        ))}

        {section.conditionalSections?.map((conditionalSection, index) => (
          shouldShowConditionalSection(conditionalSection.condition) && (
            <Box
              key={`conditional-${index}`}
              component={motion.div}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              sx={{ mt: 2 }}
            >
              {renderTemplate(conditionalSection.template)}
            </Box>
          )
        ))}
      </AnimatePresence>
    </Box>
  );
}; 