import React, { useMemo, memo } from 'react';
import { FormControl, FormHelperText, TextField, Select, MenuItem } from '@mui/material';
import { Field, FieldValue, ValidationError, SelectOption } from '../../types/form';

const DEBUG_MODE = false;

const debugLog = (message: string, data: any) => {
  if (DEBUG_MODE) {
    console.error(message, data);
  }
};

interface FieldRendererProps {
  field: Field;
  value: FieldValue;
  path: string[];
  onUpdate: (path: string[], value: FieldValue) => void;
  errors?: ValidationError[];
  isVisible?: boolean;
}

interface ExpansionValue extends SelectOption {
  expansions?: Record<string, any>;
}

const MemoizedSelect = memo(({ field, value, handleChange, hasError, errorMessage, path }: {
  field: Field;
  value: string;
  handleChange: (value: string) => void;
  hasError: boolean;
  errorMessage: string;
  path: string[];
}) => (
  <FormControl error={hasError} fullWidth>
    <Select
      id={path.join('.')}
      name={path.join('.')}
      value={value}
      onChange={e => handleChange(e.target.value as string)}
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
));

export const FieldRenderer: React.FC<FieldRendererProps> = memo(({
  field,
  value,
  path,
  onUpdate,
  errors = [],
  isVisible = true
}) => {
  const handleChange = useMemo(() => 
    (newValue: FieldValue) => {
      debugLog('Value update:', {
        action: 'handleChange',
        field: field.id,
        path: path.join('.'),
        oldValue: value,
        newValue,
        isExpansionPath: path.some(p => p.startsWith('expansion_')),
        parentPath: path.slice(0, -1).join('.'),
        parentValue: value && typeof value === 'object' ? value : undefined
      });

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const expansionKeys = Object.keys(value).filter(k => k.startsWith('expansion_'));
        if (expansionKeys.length > 0) {
          const updatedValue: ExpansionValue = {
            ...value as ExpansionValue,
            value: typeof newValue === 'string' ? newValue : String(newValue)
          };
          onUpdate(path, updatedValue);
          return;
        }
      }

      if (field.type === 'select' && field.options && typeof newValue === 'string') {
        const selectedOption = field.options.find(opt => opt.value === newValue);
        if (selectedOption && field.expansions?.[selectedOption.value]) {
          const expansionKey = `expansion_${newValue}`;
          const updatedValue: ExpansionValue = {
            value: newValue,
            label: selectedOption.label,
            [expansionKey]: {}
          };
          onUpdate(path, updatedValue);
          return;
        }
      }

      onUpdate(path, newValue);
    },
    [path, onUpdate, field.id, value, field.type, field.options, field.expansions]
  );

  const hasError = errors.length > 0;
  const errorMessage = errors.map(e => e.message).join(', ');

  const selectValue = useMemo(() => {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const expansionKeys = Object.keys(value).filter(k => k.startsWith('expansion_'));
      const hasValue = 'value' in value;
      
      debugLog('Parent value transformation:', {
        fieldId: field.id,
        path: path.join('.'),
        originalValue: value,
        hasValue,
        valueProperty: hasValue ? (value as ExpansionValue).value : undefined,
        expansionKeys,
        willReturnEmpty: !hasValue && expansionKeys.length > 0,
        parentPath: path.slice(0, -1).join('.'),
        isExpansionPath: path.some(p => p.startsWith('expansion_'))
      });
      
      if (!hasValue && expansionKeys.length > 0) {
        return expansionKeys[0].replace('expansion_', '');
      }
      
      return hasValue ? String((value as ExpansionValue).value) : '';
    }

    return String(value);
  }, [value, field.id, path]);

  if (!isVisible) return null;

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <FormControl error={hasError} fullWidth>
            <TextField
              id={path.join('.')}
              name={path.join('.')}
              value={typeof value === 'string' ? value : ''}
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
          <MemoizedSelect
            field={field}
            value={selectValue}
            handleChange={handleChange}
            hasError={hasError}
            errorMessage={errorMessage}
            path={path}
          />
        );

      case 'multiSelect':
        const multiValue = Array.isArray(value) ? value : [];
        return (
          <FormControl error={hasError} fullWidth>
            <Select
              id={path.join('.')}
              name={path.join('.')}
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
  }

  return renderField();
}); 