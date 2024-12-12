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
    onChange(event.target.value);
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
        return (
          <FormControl fullWidth size="small" error={!!error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={handleMultiSelectChange}
              label={field.label}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => {
                    const option = field.options?.find(opt => opt.value === value);
                    return (
                      <Chip
                        key={value}
                        label={option?.label || value}
                        size="small"
                      />
                    );
                  })}
                </Box>
              )}
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