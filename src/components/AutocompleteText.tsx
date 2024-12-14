import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Chip,
  Typography,
  Checkbox,
  createFilterOptions,
  Paper,
  Popper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox, Add as AddIcon, Clear as ClearIcon } from '@mui/icons-material';

interface Option {
  value: string;
  label: string;
  description?: string;
  inputValue?: string;
  isCustom?: boolean;
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
  freeSolo?: boolean;
}

const filter = createFilterOptions<Option>();

export const AutocompleteText: React.FC<AutocompleteTextProps> = ({
  value,
  onChange,
  options: initialOptions,
  label,
  placeholder,
  description,
  required,
  helperText,
  multiple = false,
  allowOther = false,
  freeSolo = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [localOptions, setLocalOptions] = useState<Option[]>(initialOptions);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const customOptions = value
      .filter(val => val && val.trim() && !initialOptions.some(opt => opt.value === val))
      .map(val => ({
        value: val,
        label: val.split('_').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' '),
        isCustom: true
      }));

    setLocalOptions([...initialOptions, ...customOptions]);

    // For single select, set the input value to the selected option's label
    if (!multiple && value.length > 0) {
      const selectedOption = [...initialOptions, ...customOptions].find(opt => opt.value === value[0]);
      setInputValue(selectedOption?.label || value[0]);
    }
  }, [value, initialOptions, multiple]);

  const handleOptionToggle = (optionValue: string) => {
    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      const isSameValue = value[0] === optionValue;
      onChange(isSameValue ? [] : [optionValue]);
      setSearchValue(''); // Clear search value after selection
      
      // For single select, update input value with selected option's label
      if (!isSameValue) {
        const selectedOption = localOptions.find(opt => opt.value === optionValue);
        setInputValue(selectedOption?.label || optionValue);
      } else {
        setInputValue('');
      }
    }
  };

  const handleAddCustom = () => {
    if (!searchValue.trim()) return;

    const snakeCaseValue = searchValue.toLowerCase().replace(/\s+/g, '_');
    const displayLabel = searchValue.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');

    const newOption = {
      value: snakeCaseValue,
      label: displayLabel,
      isCustom: true
    };

    setLocalOptions(prev => [...prev, newOption]);
    handleOptionToggle(snakeCaseValue);
    setSearchValue('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (multiple || (!multiple && value.length === 0)) {
      setSearchValue(newValue);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && freeSolo && searchValue.trim()) {
      event.preventDefault();
      handleAddCustom();
    }
  };

  const handleClearSelection = () => {
    onChange([]);
    setInputValue('');
    setSearchValue('');
  };

  const filteredOptions = localOptions.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <TextField
        fullWidth
        value={multiple ? searchValue : inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder || (multiple ? "Type to filter or add new..." : "Select or type to add new...")}
        label={label}
        required={required}
        helperText={helperText}
        InputProps={{
          readOnly: !multiple && value.length > 0,
          endAdornment: (
            <InputAdornment position="end">
              {(multiple ? searchValue : value.length > 0) && (
                <>
                  {freeSolo && searchValue && (
                    <IconButton
                      size="small"
                      onClick={handleAddCustom}
                      title="Add custom value"
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={multiple ? () => setSearchValue('') : handleClearSelection}
                    title={multiple ? "Clear search" : "Clear selection"}
                  >
                    <ClearIcon />
                  </IconButton>
                </>
              )}
            </InputAdornment>
          ),
        }}
      />

      {multiple && value.length > 0 && (
        <Box sx={{ mt: 1, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {value.map(val => {
            const option = localOptions.find(opt => opt.value === val);
            return (
              <Chip
                key={val}
                label={option?.label || val}
                onDelete={() => handleOptionToggle(val)}
                sx={{
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '& .MuiChip-deleteIcon': {
                    color: 'primary.contrastText',
                  },
                }}
              />
            );
          })}
        </Box>
      )}

      <Paper 
        elevation={2}
        sx={{ 
          mt: 1,
          maxHeight: 300,
          overflowY: 'auto',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {filteredOptions.map(option => (
          <Box
            key={option.value}
            onClick={() => handleOptionToggle(option.value)}
            sx={{
              p: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': {
                borderBottom: 'none',
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              ...(value.includes(option.value) && {
                backgroundColor: 'primary.lighter',
              }),
            }}
          >
            {multiple ? (
              <Checkbox
                checked={value.includes(option.value)}
                icon={<CheckBoxOutlineBlank />}
                checkedIcon={<CheckBox />}
                sx={{ pt: 0 }}
              />
            ) : (
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: value.includes(option.value) ? 'primary.main' : 'action.disabled',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1,
                }}
              >
                {value.includes(option.value) && (
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                    }}
                  />
                )}
              </Box>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                {option.label}
              </Typography>
              {option.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5, lineHeight: 1.3 }}
                >
                  {option.description}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
        {filteredOptions.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            {freeSolo 
              ? "No matches found. Press Enter or click + to add a custom value."
              : "No matches found."
            }
          </Box>
        )}
      </Paper>
    </Box>
  );
}; 