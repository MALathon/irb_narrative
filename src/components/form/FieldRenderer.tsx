import React from 'react';
import { FormControl, FormHelperText, TextField, Select, MenuItem, Box } from '@mui/material';
import { Field, FieldValue, ValidationError } from '../../types/form';

interface FieldRendererProps {
  field: Field;
  value: FieldValue;
  path: string[];
  onUpdate: (path: string[], value: FieldValue) => void;
  errors?: ValidationError[];
  isVisible?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  path,
  onUpdate,
  errors = [],
  isVisible = true
}) => {
  const handleChange = (newValue: FieldValue) => {
    onUpdate(path, newValue);
  };

  const hasError = errors.length > 0;
  const errorMessage = errors.map(e => e.message).join(', ');

  const getSelectValue = (val: FieldValue): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object' && val !== null) {
      return String((val as any).value || '');
    }
    return String(val);
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <FormControl error={hasError} fullWidth>
            <TextField
              value={(value as string) || ''}
              onChange={e => handleChange(e.target.value)}
              placeholder={field.label}
              label={field.label}
              error={hasError}
              helperText={errorMessage}
              size="small"
              sx={{ minWidth: 200 }}
            />
          </FormControl>
        );

      case 'select':
        return (
          <FormControl error={hasError} fullWidth>
            <Select
              value={getSelectValue(value)}
              onChange={e => handleChange(e.target.value)}
              displayEmpty
              size="small"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">
                <em>Select {field.label}</em>
              </MenuItem>
              {field.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        );

      case 'multiSelect':
        const multiValue = Array.isArray(value) ? value : [];
        return (
          <FormControl error={hasError} fullWidth>
            <Select
              multiple
              value={multiValue}
              onChange={e => {
                const selectedOptions = Array.isArray(e.target.value) 
                  ? e.target.value
                  : [e.target.value];
                handleChange(selectedOptions);
              }}
              displayEmpty
              size="small"
              sx={{ minWidth: 200 }}
            >
              {field.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        );

      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  if (!isVisible) return null;

  return (
    <Box sx={{ display: 'inline-block' }}>
      {renderField()}
    </Box>
  );
}; 