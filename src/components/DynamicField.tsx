import React from 'react';
import {
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
  FormHelperText,
  Chip,
  Box,
  Typography,
  SelectChangeEvent,
  FormLabel,
  OutlinedInput,
  ListItemText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import { Field, FieldOption } from '../types/narrative';

interface DynamicFieldProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  error?: string[] | string;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    onChange(event.target.value);
  };

  const handleMultiSelectChange = (event: SelectChangeEvent<string[]>) => {
    const newSelectedValues = event.target.value as string[];
    
    if (field.expansionFields) {
      onChange({
        ...value,
        _selectedValues: newSelectedValues
      });
    } else {
      onChange(newSelectedValues);
    }
  };

  const handleDateChange = (date: Date | null) => {
    onChange(date);
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value || ''}
            onChange={handleTextChange}
            placeholder={field.placeholder}
            error={!!error}
            helperText={error || field.helpText}
            size="small"
          />
        );

      case 'textArea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={value || ''}
            onChange={handleTextChange}
            placeholder={field.placeholder}
            error={!!error}
            helperText={error || field.helpText}
            size="small"
          />
        );

      case 'select':
        return (
          <FormControl fullWidth size="small" error={!!error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={handleSelectChange}
              label={field.label}
            >
              {field.options?.map((option: FieldOption) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                  {option.additionalText && (
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                      ({option.additionalText})
                    </Typography>
                  )}
                </MenuItem>
              ))}
            </Select>
            {(error || field.helpText) && (
              <FormHelperText>{error || field.helpText}</FormHelperText>
            )}
          </FormControl>
        );

      case 'multiSelect':
        const selectedValues = field.expansionFields 
          ? (value?._selectedValues || []) 
          : (Array.isArray(value) ? value : []);

        return (
          <FormControl fullWidth size="small" error={!!error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              multiple
              value={selectedValues}
              onChange={handleMultiSelectChange}
              label={field.label}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((selectedValue) => {
                    const option = field.options?.find(opt => opt.value === selectedValue);
                    return (
                      <Chip
                        key={selectedValue}
                        label={option?.label || selectedValue}
                        size="small"
                        onDelete={() => {
                          const newValues = selectedValues.filter((v: string) => v !== selectedValue);
                          if (field.expansionFields) {
                            onChange({
                              ...value,
                              _selectedValues: newValues
                            });
                          } else {
                            onChange(newValues);
                          }
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
                    );
                  })}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    width: 'auto',
                    maxWidth: 'none',
                  },
                },
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
            >
              {field.options?.map((option: FieldOption) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 1,
                    px: 2,
                    minWidth: 300,
                    whiteSpace: 'normal',
                  }}
                >
                  <Checkbox 
                    checked={selectedValues.includes(option.value)}
                    sx={{ p: 0.5 }}
                  />
                  <Box sx={{ ml: 1 }}>
                    <Typography>{option.label}</Typography>
                    {option.additionalText && (
                      <Typography variant="caption" color="text.secondary">
                        {option.additionalText}
                      </Typography>
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {(error || field.helpText) && (
              <FormHelperText>{error || field.helpText}</FormHelperText>
            )}
            {field.expansionFields && (
              <ExpansionFields
                field={field}
                value={value}
                onChange={onChange}
                error={error}
              />
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl error={!!error}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={handleTextChange}
            >
              {field.options?.map((option: FieldOption) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={
                    <Box>
                      {option.label}
                      {option.additionalText && (
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                          ({option.additionalText})
                        </Typography>
                      )}
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
            {(error || field.helpText) && (
              <FormHelperText>{error || field.helpText}</FormHelperText>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl error={!!error} component="fieldset">
            <FormLabel component="legend">{field.label}</FormLabel>
            <FormGroup>
              {field.options?.map((option: FieldOption) => (
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
                        onChange(newValues);
                      }}
                    />
                  }
                  label={
                    <Box>
                      {option.label}
                      {option.additionalText && (
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                          ({option.additionalText})
                        </Typography>
                      )}
                    </Box>
                  }
                />
              ))}
            </FormGroup>
            {(error || field.helpText) && (
              <FormHelperText>{error || field.helpText}</FormHelperText>
            )}
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={field.label}
              value={value || null}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  error: !!error,
                  helperText: error || field.helpText,
                },
              }}
            />
          </LocalizationProvider>
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            value={value || ''}
            onChange={handleTextChange}
            placeholder={field.placeholder}
            error={!!error}
            helperText={error || field.helpText}
            size="small"
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      {renderField()}
    </motion.div>
  );
};

const ExpansionFields: React.FC<{
  field: Field;
  value: any;
  onChange: (value: any) => void;
  error?: any;
}> = ({ field, value, onChange, error }) => {
  if (!field.expansionFields || !value?._selectedValues) return null;

  return (
    <Box sx={{ mt: 2, ml: 2 }}>
      {value._selectedValues.map((selectedValue: string) => {
        const expansionFields = field.expansionFields?.[selectedValue];
        if (!expansionFields) return null;

        return (
          <Box key={selectedValue} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Additional details for {field.options?.find(opt => opt.value === selectedValue)?.label}:
            </Typography>
            <Box sx={{ pl: 2 }}>
              {expansionFields.map((expansionField: Field) => {
                const fieldValue = value[selectedValue]?.[expansionField.id];
                
                return (
                  <Box key={expansionField.id} sx={{ mb: 1 }}>
                    <DynamicField
                      field={expansionField}
                      value={fieldValue}
                      onChange={(newValue) => {
                        onChange({
                          ...value,
                          [selectedValue]: {
                            ...(value[selectedValue] || {}),
                            [expansionField.id]: newValue
                          }
                        });
                      }}
                      error={error?.[expansionField.id]}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}; 