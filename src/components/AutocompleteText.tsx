import React, { useState } from 'react';
import { Autocomplete, TextField, Box, Typography, Chip, Paper } from '@mui/material';

interface Option {
  value: string;
  label: string;
  description?: string;
  attestation?: {
    type: string;
    statement: string;
    severity: 'critical' | 'important' | 'advisory';
    requiresEvidence: boolean;
    regulatoryReference?: string;
  };
}

type OptionValue = Option | string;

interface AutocompleteTextProps {
  value: (string | Option)[];
  onChange: (value: string[]) => void;
  options: Option[];
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  helperText?: string | React.ReactNode;
  multiple?: boolean;
  allowCustom?: boolean;
}

export const AutocompleteText: React.FC<AutocompleteTextProps> = ({
  value = [],
  onChange,
  options,
  label,
  placeholder,
  description,
  required,
  helperText,
  multiple = false,
  allowCustom = true,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Update input value when value changes
  React.useEffect(() => {
    // Only update input value for non-free text fields
    if (!multiple && value.length > 0 && !allowCustom) {
      const currentValue = value[0];
      const option = options.find(opt => opt.value === currentValue);
      if (option) {
        setInputValue(option.label);
      } else if (typeof currentValue === 'string' && currentValue.includes(':')) {
        setInputValue(currentValue.split(':')[0]);
      } else {
        setInputValue(typeof currentValue === 'string' ? currentValue : currentValue.value);
      }
    }
  }, [value, options, multiple, allowCustom]);

  const getOptionFromValue = (val: string): Option | string => {
    if (!val) return '';
    const option = options.find(opt => opt.value === val);
    return option || val;
  };

  // Transform string values into Option objects
  const currentValues = (() => {
    if (!value || value.length === 0) {
      return multiple ? [] : null;
    }
    return value.map(val => {
      // Handle case where val is already an Option object
      if (typeof val === 'object' && val !== null && 'value' in val) {
        const option = options.find(opt => opt.value === val.value);
        return option || { value: val.value, label: val.label || val.value };
      }
      // Handle string values
      const option = options.find(opt => opt.value === val);
      return option || { value: val, label: val };
    }).filter(Boolean);
  })();

  // Get attestation text for selected values
  const getAttestationText = (selectedValues: (string | Option)[]) => {
    if (!selectedValues || selectedValues.length === 0) return '';
    
    const attestations = selectedValues.map(value => {
      const option = options.find(opt => opt.value === (typeof value === 'string' ? value : value.value));
      return option?.attestation?.statement || '';
    }).filter(Boolean);
    
    if (attestations.length === 0) return '';
    if (attestations.length === 1) return attestations[0];
    if (attestations.length === 2) return `${attestations[0]} and ${attestations[1]}`;
    
    const lastAttestation = attestations.pop();
    return `${attestations.join(', ')}, and ${lastAttestation}`;
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Autocomplete<Option, boolean, boolean, boolean>
        multiple={multiple}
        freeSolo={allowCustom}
        options={options}
        value={currentValues || (multiple ? [] : null)}
        inputValue={inputValue}
        open={isOpen}
        defaultValue={multiple ? [] : undefined}
        onOpen={() => setIsOpen(true)}
        disablePortal
        selectOnFocus
        handleHomeEndKeys
        clearOnBlur={false}
        blurOnSelect={!multiple}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !multiple && inputValue) {
            event.preventDefault();
            event.stopPropagation();
            
            // First try to find an exact match
            const exactMatch = options.find(opt => 
              opt.label.toLowerCase() === inputValue.toLowerCase() || 
              opt.value.toLowerCase() === inputValue.toLowerCase()
            );
            
            if (exactMatch) {
              // Use exact match value
              onChange([exactMatch.value]);
              setInputValue(exactMatch.label);
            } else if (allowCustom) {
              // Only apply snake case for custom values
              onChange([inputValue]);
              setInputValue(inputValue);
            }
            
            setIsOpen(false);
          }
        }}
        onInputChange={(_, newValue, reason) => {
          // Don't reset input value on blur or clear if we're in single select mode
          if (reason === 'reset' && !multiple) {
            return;
          }
          
          setInputValue(newValue);
          
          // For single select text fields, update the value immediately
          if (!multiple && allowCustom && options.length === 0) {
            onChange([newValue]);
          }
          
          // Only reset on explicit clear action for multiple select
          if (reason === 'clear' && multiple) {
            setInputValue('');
          }
        }}
        onChange={(_, newValue) => {
          const values = (Array.isArray(newValue) ? newValue : [newValue])
            .filter(val => val !== null && val !== undefined)
            .map(val => {
              if (!val) return '';
              // If it's already an Option object, just get its value
              if (typeof val === 'object' && 'value' in val) {
                return val.value;
              }
              // Handle string values
              if (typeof val === 'string') {
                const predefinedOption = options.find(opt => opt.value === val || opt.label === val);
                if (predefinedOption) {
                  return predefinedOption.value;
                }
                // For text fields with no options or custom values, just return the value as is
                return val;
              }
              return '';
            })
            .filter(Boolean)
            .filter((val, index, self) => self.indexOf(val) === index);
          
          // For single select, ensure we only pass a single value
          if (!multiple) {
            onChange(values.slice(0, 1));
          } else {
            onChange(values);
          }
        }}
        isOptionEqualToValue={(option, value) => {
          // Handle empty array case
          if (Array.isArray(value) && value.length === 0) {
            return false;
          }
          
          if (!option || !value) return false;
          
          const optionValue = typeof option === 'string' ? option : option.value;
          
          if (Array.isArray(value)) {
            return value.some(v => {
              const vValue = typeof v === 'string' ? v : v?.value;
              return optionValue === vValue;
            });
          }
          
          const valueToCompare = typeof value === 'string' ? value : value?.value;
          return optionValue === valueToCompare;
        }}
        getOptionLabel={(option): string => {
          if (Array.isArray(option)) return '';
          if (!option) return '';
          if (typeof option === 'string') {
            if (option.includes(':')) {
              return option.split(':')[0];
            }
            return option;
          }
          return option.label || '';
        }}
        ListboxProps={{
          sx: {
            maxHeight: '400px',
            overflowY: 'auto',
            backgroundColor: 'background.paper',
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            width: '100%',
            '& .MuiAutocomplete-option': {
              padding: 0,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&.Mui-focused': {
                backgroundColor: 'action.selected',
              },
            },
            '& .MuiAutocomplete-listbox': {
              padding: 0,
              width: '100%',
            },
          },
        }}
        PaperComponent={({ children, ...props }) => (
          <Paper 
            {...props} 
            elevation={8}
            sx={{ 
              mt: 1,
              overflow: 'hidden',
              backgroundColor: 'background.paper',
              width: '100%',
            }}
          >
            {children}
          </Paper>
        )}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          const label = typeof option === 'string' ? option : option.label;
          const description = typeof option === 'string' ? undefined : option.description;
          const attestation = typeof option === 'string' ? undefined : option.attestation;
          
          return (
            <Box 
              component="li" 
              key={key} 
              {...otherProps}
              sx={{ 
                width: '100%',
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <Box sx={{ 
                py: 1.5, 
                px: 2,
                width: '100%',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 500, 
                  mb: description ? 0.5 : 0,
                  width: '100%',
                }}>
                  {label}
                </Typography>
                {description && !attestation && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      display: 'block',
                      lineHeight: 1.4,
                      width: '100%',
                      fontSize: '0.875rem',
                    }}
                  >
                    {description}
                  </Typography>
                )}
                {attestation && (
                  <Typography 
                    variant="body2" 
                    color={attestation.severity === 'critical' ? 'error.main' : 'primary.main'}
                    sx={{ 
                      fontStyle: 'italic',
                      display: 'block',
                      lineHeight: 1.4,
                      width: '100%',
                      fontSize: '0.875rem',
                    }}
                  >
                    {attestation.statement}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        }}
        renderTags={(tagValue: (Option | string)[], getTagProps) =>
          tagValue.map((option: Option | string, index) => {
            const { key, onDelete, ...tagProps } = getTagProps({ index });
            const label = typeof option === 'string' ? 
              (option.includes(':') ? option.split(':')[0] : option) : 
              option.label;
            
            return (
              <Chip
                key={key}
                {...tagProps}
                label={label}
                sx={{
                  backgroundColor: typeof option === 'string' ? 'secondary.main' : 'primary.main',
                  color: 'white',
                  '& .MuiChip-deleteIcon': {
                    color: 'white',
                  },
                }}
              />
            );
          })
        }
        sx={{
          width: '100%',
          '& .MuiAutocomplete-inputRoot': {
            width: '100%',
          },
          '& .MuiAutocomplete-endAdornment': {
            right: 8,
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            required={required}
            FormHelperTextProps={{
              component: 'div',
              sx: { width: '100%' }
            }}
            sx={{ width: '100%' }}
            helperText={
              <Box sx={{ mt: 0.5, width: '100%' }}>
                {helperText && (
                  <Typography 
                    variant="body2" 
                    component="div" 
                    color="primary.main"
                    sx={{ 
                      width: '100%',
                      mb: description ? 1 : 0,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    {helperText}
                  </Typography>
                )}
                {description && !helperText && (
                  <Typography 
                    variant="body2" 
                    component="div" 
                    color="text.secondary" 
                    sx={{ 
                      width: '100%',
                      fontSize: '0.875rem',
                    }}
                  >
                    {description}
                  </Typography>
                )}
                {value.length > 0 && (
                  <Typography 
                    variant="body2" 
                    component="div" 
                    color="primary" 
                    sx={{ 
                      mt: 1, 
                      width: '100%',
                      fontSize: '0.875rem',
                      fontStyle: 'italic',
                    }}
                  >
                    {getAttestationText(value)}
                  </Typography>
                )}
              </Box>
            }
          />
        )}
        onClose={(event, reason) => {
          if (reason === 'escape' || reason === 'blur' || reason === 'selectOption') {
            setIsOpen(false);
            // Only reset input value if we have a selected option and are not in free text mode
            if (!multiple && value.length > 0 && options.length > 0 && !allowCustom) {
              const currentValue = value[0];
              const option = options.find(opt => opt.value === currentValue);
              if (option) {
                setInputValue(option.label);
              } else if (typeof currentValue === 'string' && currentValue.includes(':')) {
                setInputValue(currentValue.split(':')[0]);
              } else {
                setInputValue(typeof currentValue === 'string' ? currentValue : currentValue.value);
              }
            }
          }
        }}
        disableCloseOnSelect={multiple}
      />
    </Box>
  );
}; 