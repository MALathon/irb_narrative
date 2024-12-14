import React, { useState } from 'react';
import { Autocomplete, TextField, Box, Typography, Popper } from '@mui/material';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface AutocompleteTextProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  helperText?: string;
  multiple?: boolean;
  allowOther?: boolean;
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
  allowOther = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Convert snake_case to display format
  const toDisplayFormat = (value: string) => {
    return value.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Convert display format to snake_case
  const toSnakeCase = (value: string) => {
    return value.toLowerCase().replace(/\s+/g, '_');
  };

  // Get display value for a stored value
  const getDisplayValue = (storedValue: string) => {
    const predefinedOption = options.find(opt => opt.value === storedValue);
    if (predefinedOption) return predefinedOption.label;
    return toDisplayFormat(storedValue);
  };

  return (
    <Box>
      <Autocomplete
        multiple={multiple}
        freeSolo={allowOther}
        options={options}
        value={value}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        disableCloseOnSelect={true}
        openOnFocus={true}
        autoComplete={true}
        autoHighlight={true}
        open={isOpen}
        onOpen={() => {
          setIsOpen(true);
          setInputValue('');
        }}
        onClose={(event, reason) => {
          if (reason === 'escape' || (reason === 'blur' && !event.currentTarget.contains(document.activeElement))) {
            setIsOpen(false);
          }
        }}
        componentsProps={{
          paper: {
            elevation: 8,
            sx: {
              width: '100%',
              mt: 1,
              borderRadius: 1,
            }
          }
        }}
        filterOptions={(options, params) => {
          const filtered = params.inputValue === ''
            ? options // Show all options when input is empty
            : options.filter(option => {
                const label = typeof option === 'string' ? option : option.label;
                return label.toLowerCase().includes(params.inputValue.toLowerCase());
              });
          
          if (allowOther && params.inputValue !== '' && !filtered.some(option => 
            (typeof option === 'string' ? option : option.label).toLowerCase() === params.inputValue.toLowerCase()
          )) {
            filtered.push(params.inputValue);
          }
          
          return filtered;
        }}
        PopperComponent={props => (
          <Popper
            {...props}
            placement="bottom-start"
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
            ]}
          />
        )}
        isOptionEqualToValue={(option: Option | string, value: string | Option) => {
          if (!option || !value) return false;
          if (typeof value === 'string') {
            const optionValue = typeof option === 'string' ? option : option.value;
            return optionValue === value || (value.includes(':') && optionValue === value.split(':')[1]);
          }
          return (option as Option).value === value.value;
        }}
        onChange={(event, newValue, reason, details) => {
          if (reason === 'selectOption' || reason === 'removeOption') {
            setIsOpen(true);
          }

          if (!multiple) {
            if (!newValue) {
              onChange([]);
              return;
            }
            if (typeof newValue === 'string') {
              const option = options.find(opt => 
                opt.value === newValue || 
                opt.label.toLowerCase() === newValue.toLowerCase()
              );
              if (option) {
                onChange([option.value]);
                return;
              }
              onChange([`${newValue}:${toSnakeCase(newValue)}`]);
              return;
            }
            if ('value' in newValue) {
              onChange([newValue.value]);
            }
            return;
          }

          const processedValues = (Array.isArray(newValue) ? newValue : [newValue])
            .filter(Boolean)
            .map(val => {
              if (typeof val === 'string') {
                const option = options.find(opt => 
                  opt.value === val || 
                  opt.label.toLowerCase() === val.toLowerCase()
                );
                if (option) return option.value;
                return `${val}:${toSnakeCase(val)}`;
              }
              return val?.value || '';
            })
            .filter(Boolean);
          onChange(processedValues);
        }}
        getOptionLabel={(option) => {
          if (!option) return '';
          if (typeof option === 'string') {
            if (option.includes(':')) {
              return option.split(':')[0] || '';
            }
            const predefinedOption = options.find(opt => opt.value === option);
            if (predefinedOption) return predefinedOption.label;
            return getDisplayValue(option) || '';
          }
          return option.label || '';
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={allowOther ? "Type to search or add custom..." : "Type to search..."}
            required={required}
            onClick={() => {
              setIsOpen(true);
              setInputValue('');
            }}
            onFocus={() => {
              setIsOpen(true);
              setInputValue('');
            }}
            helperText={
              <>
                {helperText && (
                  <Typography variant="caption" component="span" display="block">
                    {helperText}
                  </Typography>
                )}
                {allowOther && (
                  <Typography 
                    variant="caption" 
                    component="span"
                    color="secondary"
                    sx={{ 
                      display: 'block', 
                      mt: helperText ? 0.5 : 0,
                      fontStyle: 'italic'
                    }}
                  >
                    Type to add a custom value
                  </Typography>
                )}
              </>
            }
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: 'background.paper',
              },
            }}
          />
        )}
        renderOption={(props, option: Option | string, { selected }) => {
          const { key, ...otherProps } = props;
          let displayText = '';
          let description = '';
          let isSelected = selected;
          
          if (typeof option === 'string') {
            displayText = `Add "${option}"`;
          } else {
            displayText = option.label || '';
            description = option.description || '';
            isSelected = value.some(v => {
              if (v.includes(':')) {
                return v.split(':')[1] === option.value;
              }
              return v === option.value;
            });
          }
          
          return (
            <Box 
              component="li" 
              key={key} 
              {...otherProps}
              sx={{
                backgroundColor: isSelected ? 'primary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: isSelected ? 'primary.light' : 'action.hover',
                },
                '&.Mui-focused': {
                  backgroundColor: isSelected ? 'primary.light' : 'action.hover',
                },
                py: 1.5,
                px: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {typeof option === 'string' && (
                  <Typography 
                    variant="body2" 
                    color="secondary.main"
                    sx={{ mr: 1, fontSize: '1.2em' }}
                  >
                    +
                  </Typography>
                )}
                <Box>
                  <Typography 
                    variant="body1"
                    sx={{
                      fontWeight: isSelected ? 500 : 400,
                      color: isSelected ? 'primary.dark' : 'text.primary',
                    }}
                  >
                    {displayText}
                  </Typography>
                  {description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {description}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          );
        }}
        ListboxProps={{
          sx: {
            maxHeight: '300px',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 1,
            '& .MuiAutocomplete-option': {
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': {
                borderBottom: 'none',
              },
            },
          },
        }}
      />
    </Box>
  );
}; 