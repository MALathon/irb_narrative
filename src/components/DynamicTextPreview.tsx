import React, { useRef, useCallback } from 'react';
import { Box, Typography, Popper, ClickAwayListener, MenuList, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper, Checkbox, IconButton, Tooltip, Switch, FormControlLabel } from '@mui/material';
import { NarrativeSection, Field, DynamicField, ExpansionField } from '../types/narrative';
import { Edit as EditIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { NarrativePreviewModal } from './NarrativePreviewModal';
import { DATA_SOURCES_SCHEMA, CLINICAL_DOMAIN_OPTIONS, DATA_FORMAT_OPTIONS, DATA_VOLUME_OPTIONS, IDENTIFIABILITY_LEVEL_OPTIONS, SECURITY_MEASURES_OPTIONS, SENSITIVE_CATEGORIES_OPTIONS, CLINICAL_SETTING_OPTIONS, EXPANSION_MAPPINGS, EXPANSION_FIELDS } from '../data/irbNarrativeSchema';
import { AutocompleteText } from './AutocompleteText';
import { commonSuggestions } from '../data/commonSuggestions';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface DynamicTextPreviewProps {
  section: NarrativeSection;
  values: { [key: string]: any };
  onUpdate: (fieldId: string, value: any) => void;
  isDocumentPreview?: boolean;
}

interface OptionType {
  value: string;
  label: string;
  description?: string;
}

interface DynamicSentence {
  template: string;
  fields: { [key: string]: DynamicField };
  branches?: {
    [fieldId: string]: {
      [value: string]: DynamicSentence[];
    };
  };
}

interface ExpansionContent {
  sentence: string;
  fields?: ExpansionField[];
}

interface ExpansionFields {
  [key: string]: {
    type: DynamicField['type'];
    label?: string;
    placeholder?: string;
    description?: string;
    options?: OptionType[];
    allowCustom?: boolean;
    generateText?: (values: any) => string;
    freeSolo?: boolean;
    helpText?: string;
  };
}

interface ExpansionMapping {
  [key: string]: {
    [value: string]: ExpansionContent;
  };
}

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

// Define the section using the schema - only include the data_sources field
const section: NarrativeSection = {
  id: 'data_resources',
  moduleId: 'data_access',
  moduleName: 'Data Access & Resources',
  title: 'Study Resources & Data Types',
  description: 'Define what resources and data types you need for your study.',
  guidance: `In this section, we need you to specify:
- What types of data sources you'll use
- For each data source:
  - Format and volume
  - Level of identifiability
  - Security measures
  - Sensitive data categories`,
  template: DATA_SOURCES_SCHEMA.template,
  fields: [
    {
      id: 'data_sources',
      type: 'multiSelect' as const,
      label: 'Data Sources',
      placeholder: 'Which data sources will you use?',
      description: 'Choose all the types of data you will need to access for your research',
      allowCustom: false,
      options: [
        { value: 'external_dua', label: 'external data requiring a Data Use Agreement', description: 'Data from outside organizations that requires a formal agreement to use' },
        { value: 'public_datasets', label: 'publicly available research datasets', description: 'Data that is freely available to researchers' },
        { value: 'internal_ehr', label: 'Mayo Clinic medical record data', description: 'Clinical data from Mayo Clinic electronic health records' },
        { value: 'prospective_data', label: 'new data collected from Mayo Clinic patients', description: 'Data that will be gathered during this study' }
      ],
      expansionFields: DATA_SOURCES_SCHEMA.fields.data_sources.expansionFields
    }
  ]
};

interface MenuState {
  fieldId: string | null;
  anchorPosition: { top: number; left: number } | null;
  isOpen: boolean;
}

// Helper function to render template parts
const renderDynamicTemplate = (
  template: string,
  fields: { [key: string]: DynamicField },
  values: { [key: string]: any },
  renderValue: (field: DynamicField, value: any) => JSX.Element,
  renderPlaceholder: (field: DynamicField, index: number) => JSX.Element,
  parentFieldId?: string
): JSX.Element[] => {
  const parts = template.split(/(\{[^}]+\})/g);
  return parts.map((part, index) => {
    const match = part.match(/^\{([^}]+)\}$/);
    if (!match) {
      return <React.Fragment key={`text-${parentFieldId || 'root'}-${index}-${part.slice(0, 10)}`}><span>{part}</span></React.Fragment>;
    }

    const fieldId = match[1];
    const field = fields[fieldId];
    if (!field) return <React.Fragment key={`empty-${parentFieldId || 'root'}-${fieldId}-${index}-${Date.now()}`} />;

    const value = values[fieldId];
    if (!value) {
      return (
        <React.Fragment key={`placeholder-${parentFieldId || 'root'}-${fieldId}-${index}-${Date.now()}`}>
          {renderPlaceholder(field, index)}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment key={`value-${parentFieldId || 'root'}-${fieldId}-${index}-${value}`}>
        {renderValue(field, value)}
      </React.Fragment>
    );
  });
};

// Process dynamic sentences recursively
const processDynamicSentence = (
  sentence: DynamicSentence,
  values: { [key: string]: any },
  renderValue: (field: DynamicField, value: any) => JSX.Element,
  renderPlaceholder: (field: DynamicField, index: number) => JSX.Element,
  parentFieldId?: string,
  depth: number = 0
): JSX.Element[] => {
  const parts = sentence.template.split(/(\{[^}]+\})/g);
  let result: JSX.Element[] = [];
  
  parts.forEach((part, index) => {
    const match = part.match(/^\{([^}]+)\}$/);
    if (!match) {
      const normalizedPart = part.replace(/\s+/g, ' ');
      if (normalizedPart) {
        result.push(
          <React.Fragment key={`text-${parentFieldId || 'root'}-${index}-${normalizedPart.slice(0, 10)}`}>
            <span>{normalizedPart}</span>
          </React.Fragment>
        );
      }
      return;
    }

    const fieldId = match[1];
    // For expansion fields, we need to get the field definition from EXPANSION_FIELDS
    const field = EXPANSION_FIELDS[fieldId] ? {
      ...EXPANSION_FIELDS[fieldId],
      id: parentFieldId ? `${parentFieldId}-${fieldId}` : fieldId,
      label: EXPANSION_FIELDS[fieldId].label || '',
      placeholder: EXPANSION_FIELDS[fieldId].placeholder || '',
      type: EXPANSION_FIELDS[fieldId].type,
      options: EXPANSION_FIELDS[fieldId].options || [],
      allowCustom: EXPANSION_FIELDS[fieldId].allowCustom
    } as DynamicField : sentence.fields[fieldId];

    if (!field) {
      result.push(<React.Fragment key={`empty-${parentFieldId || 'root'}-${fieldId}-${index}-${Date.now()}`} />);
      return;
    }

    // For expansion fields, we need to look up the value in the correct place
    const value = parentFieldId ? values[`${parentFieldId}-${fieldId}`] : values[fieldId];
    if (!value) {
      result.push(
        <React.Fragment key={`placeholder-${parentFieldId || 'root'}-${fieldId}-${index}-${Date.now()}`}>
          {renderPlaceholder(field, index)}
        </React.Fragment>
      );
      return;
    }

    result.push(
      <React.Fragment key={`value-${parentFieldId || 'root'}-${fieldId}-${index}-${value}`}>
        {renderValue(field, value)}
      </React.Fragment>
    );
  });

  return result;
};

export const DynamicTextPreview: React.FC<DynamicTextPreviewProps> = ({
  section,
  values,
  onUpdate,
  isDocumentPreview = false,
}) => {
  const [menuState, setMenuState] = React.useState<MenuState>({
    fieldId: null,
    anchorPosition: null,
    isOpen: false
  });
  
  const [openDialog, setOpenDialog] = React.useState(false);
  const [otherValue, setOtherValue] = React.useState<string | string[]>('');
  const [customValue, setCustomValue] = React.useState('');
  const [isModulePreviewOpen, setIsModulePreviewOpen] = React.useState(false);
  const [readingMode, setReadingMode] = React.useState(false);
  const [expansionValues, setExpansionValues] = React.useState<{ [key: string]: any }>({});
  const [visibleFields, setVisibleFields] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const newVisibleFields = new Set<string>();
    section.fields.forEach(field => {
      if (!field.dependsOn) {
        newVisibleFields.add(field.id);
      } else {
        const dependentValue = values[field.dependsOn.fieldId];
        if (field.dependsOn.operator === 'contains') {
          if (Array.isArray(dependentValue) && dependentValue.includes(field.dependsOn.value)) {
            newVisibleFields.add(field.id);
          }
        } else if (dependentValue === field.dependsOn.value) {
          newVisibleFields.add(field.id);
        }
      }
    });
    setVisibleFields(newVisibleFields);
  }, [section.fields, values]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>, field: DynamicField) => {
    if (isDocumentPreview) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    // Get the field ID - this could be either a regular field or an expansion field
    const fieldId = field.id;
    
    // For all field types, use AutocompleteText directly
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuState({
      fieldId: fieldId,
      anchorPosition: {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      },
      isOpen: true
    });
  }, [isDocumentPreview]);

  const handleClose = useCallback(() => {
    setMenuState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleOptionSelect = useCallback((value: string) => {
    if (!menuState.fieldId) return;

    // Check if this is an expansion field
    const isExpansionField = menuState.fieldId.includes('-');
    if (isExpansionField) {
      // This is an expansion field
      const [parentFieldId, selectedValue, expansionFieldId] = menuState.fieldId.split('-');
      const field = EXPANSION_FIELDS[expansionFieldId];
      if (field) {
        onUpdate(menuState.fieldId, value);
      }
      return;
    }

    const field = section.fields.find(f => f.id === menuState.fieldId);
    if (!field) return;

    // For multiSelect fields, handle array values
    if (field.type === 'multiSelect') {
      const values = Array.isArray(value) ? value : [value];
      onUpdate(field.id, values);
    } else if (field.type === 'select') {
      // For select fields, ensure we pass a single value
      onUpdate(field.id, Array.isArray(value) ? value[0] : value);
    } else {
      onUpdate(field.id, value);
    }
  }, [menuState.fieldId, section.fields, onUpdate]);

  const formatList = (items: string[]): string => {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
  };

  const getDisplayValue = (value: string, field: Field): string => {
    if (!value) return '';
    
    // For predefined options, use the label
    if (field.options) {
      const option = field.options.find(opt => opt.value === value);
      if (option) {
        // If this is an attestation field, use the attestation statement
        if (option.attestation) {
          return option.attestation.statement;
        }
        return option.label;
      }
    }
    
    // For expansion fields of type text, just return the value as is
    if (field.type === 'text') {
      return value;
    }
    
    // For custom values in display:snake_case format
    if (value.includes(':')) {
      return value.split(':')[0];
    }
    
    // For legacy values, convert from snake_case
    return value.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleExpansionUpdate = (fieldId: string, value: any) => {
    // For text fields, we want to store the raw value
    const [parentFieldId, selectedValue, expansionFieldId] = fieldId.split('-');
    const field = EXPANSION_FIELDS[expansionFieldId];
    
    if (field?.type === 'text') {
      // For text fields, store the raw value
      onUpdate(fieldId, value);
      setExpansionValues(prev => ({
        ...prev,
        [fieldId]: value
      }));
    } else {
      // For other fields, handle as before
      onUpdate(fieldId, value);
      setExpansionValues(prev => ({
        ...prev,
        [fieldId]: value
      }));
    }
  };

  const getExpansionContent = (field: Field, selectedValues: string[]): ExpansionContent[] => {
    if (!EXPANSION_MAPPINGS[field.id]) return [];

    return selectedValues.map(value => {
      const mapping = EXPANSION_MAPPINGS[field.id][value];
      if (!mapping) return null;
      return {
        sentence: mapping.sentence,
      };
    }).filter(Boolean) as ExpansionContent[];
  };

  const renderExpansionFields = (field: Field, value: any) => {
    if (!field.type || !EXPANSION_MAPPINGS[field.id]) return null;

    const selectedValues = Array.isArray(value) 
      ? value 
      : (field.type === 'multiSelect' ? value?._selectedValues : [value]);

    if (!selectedValues?.length) return null;

    const expansionContent = selectedValues.map((selectedValue: string) => {
      const mapping = EXPANSION_MAPPINGS[field.id][selectedValue];
      if (!mapping) return null;

      // Get the list of expansion fields for this value
      const expansionFields = field.expansionFields?.[selectedValue] || [];

      return (
        <Box 
          key={`expansion-${field.id}-${selectedValue}`}
          sx={{ 
            mt: 2,
            pl: 3,
            borderLeft: '2px solid',
            borderColor: 'primary.light',
            bgcolor: 'background.paper',
            py: 1,
            px: 2,
            borderRadius: 1
          }}
        >
          {expansionFields.map((expansionField: ExpansionField) => {
            if (!expansionField) return null;

            const fieldId = `${field.id}-${selectedValue}-${expansionField.id}`;
            const fieldValue = expansionValues[fieldId] || '';

            if (expansionField.type === 'text') {
              return (
                <Box key={`field-${fieldId}`} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    value={fieldValue}
                    onChange={(e) => handleExpansionUpdate(fieldId, e.target.value)}
                    label={expansionField.label}
                    placeholder={expansionField.placeholder}
                    helperText={expansionField.helpText}
                    variant="outlined"
                  />
                </Box>
              );
            }

            return (
              <Box key={`field-${fieldId}`} sx={{ mb: 2 }}>
                <AutocompleteText
                  value={Array.isArray(fieldValue) ? fieldValue : fieldValue ? [fieldValue] : []}
                  onChange={(value) => handleExpansionUpdate(fieldId, value[0] || '')}
                  options={expansionField.options || []}
                  label={expansionField.label}
                  placeholder={expansionField.placeholder}
                  description={expansionField.description}
                  required={expansionField.required}
                  helperText={expansionField.helpText}
                  multiple={expansionField.type === 'multiSelect'}
                  allowCustom={expansionField.allowCustom}
                />
              </Box>
            );
          })}
        </Box>
      );
    });

    return expansionContent;
  };

  const renderFieldInput = (field: DynamicField) => {
    // Convert current values to array format for AutocompleteText
    const valueArray = (() => {
      if (!values[field.id]) return [];
      if (Array.isArray(values[field.id])) {
        // If values are objects with value/label/description, extract just the value
        return values[field.id].map((v: { value: string; label?: string } | string) => 
          typeof v === 'object' && v !== null ? v.value : v
        );
      }
      if (typeof values[field.id] === 'string') return [values[field.id]];
      if (values[field.id]?._selectedValues) return values[field.id]._selectedValues;
      return [];
    })();
    
    // Determine if this field should be multiple select
    const isMultiSelect = field.type === 'multiSelect';
    
    // Determine if this field should allow custom values
    const allowCustom = field.allowCustom !== false && 
      (field.type === 'text' || field.type === 'textArea' || field.allowCustom);

    switch (field.type) {
      case 'autocompleteText':
      case 'multiSelect':
        return (
          <Box sx={{ minWidth: 400 }}>
            <AutocompleteText
              value={valueArray}
              onChange={(newValues) => {
                onUpdate(field.id, newValues);
              }}
              options={field.options || []}
              label={field.label}
              placeholder={field.placeholder || "Type to search..."}
              description={field.description}
              helperText={field.helpText}
              required={field.required}
              multiple={true}
              allowCustom={allowCustom}
            />
          </Box>
        );
      case 'select':
        // For select fields, ensure we're passing a single value
        const selectValue = valueArray.length > 0 ? [valueArray[0]] : [];
        return (
          <Box sx={{ minWidth: 400 }}>
            <AutocompleteText
              value={selectValue}
              onChange={(newValues) => {
                onUpdate(field.id, newValues[0] || '');
              }}
              options={field.options || []}
              label={field.label}
              placeholder={field.placeholder || "Type to search..."}
              description={field.description}
              helperText={field.helpText}
              required={field.required}
              multiple={false}
              allowCustom={allowCustom}
            />
          </Box>
        );
      case 'text':
      case 'textArea':
        return (
          <Box sx={{ minWidth: 400 }}>
            <AutocompleteText
              value={valueArray}
              onChange={(newValues) => {
                onUpdate(field.id, newValues[0] || '');
              }}
              options={[]}
              label={field.label}
              placeholder={field.placeholder || "Type to enter text..."}
              description={field.description}
              helperText={field.helpText}
              required={field.required}
              multiple={false}
              allowCustom={true}
            />
          </Box>
        );
      // ... rest of the cases ...
      default:
        return null;
    }
  };

  const renderValue = (field: DynamicField, value: any) => {
    const displayValue = (() => {
      if (field.type === 'select' || field.type === 'radio') {
        return getDisplayValue(value, field);
      }

      if (field.type === 'multiSelect') {
        const selectedValues = Array.isArray(value) ? value : value?._selectedValues || [];
        if (!selectedValues || selectedValues.length === 0) {
          return field.placeholder?.replace(/[\[\]]/g, '') || field.label;
        }
        
        // Use formatAttestation if available
        if (field.formatAttestation) {
          return field.formatAttestation(selectedValues);
        }
        
        // Get all selected options and format them properly
        const selectedOptions = selectedValues.map((val: string) => {
          // Check if this is an attestation field
          if (field.options) {
            const option = field.options.find(opt => opt.value === val);
            if (option?.attestation) {
              return option.attestation.statement;
            }
          }
          return getDisplayValue(val, field);
        });
        
        // Format the list with proper grammar
        return formatList(selectedOptions);
      }

      if (field.type === 'text' || field.type === 'textArea') {
        if (isDocumentPreview || readingMode) {
          return value || `[${field.placeholder || field.label}]`;
        }
        return value || field.placeholder?.replace(/[\[\]]/g, '') || field.label;
      }

      if (isDocumentPreview || readingMode) {
        return value || `[${field.placeholder || field.label}]`;
      }
      return value || field.placeholder?.replace(/[\[\]]/g, '') || field.label;
    })();

    if (isDocumentPreview || readingMode) {
      return <span key={`value-${field.id}`}>{displayValue}</span>;
    }

    const isEmptyMultiSelect = field.type === 'multiSelect' && 
      (!value || (Array.isArray(value) && value.length === 0) || 
       (value?._selectedValues && value._selectedValues.length === 0));

    return (
      <Box
        component="div"
        key={`value-container-${field.id}`}
        sx={{ 
          display: 'inline',
          maxWidth: 'fit-content',
          wordBreak: 'normal',
          whiteSpace: 'normal',
          mr: 0.5
        }}
      >
        <Box
          key={`value-box-${field.id}`}
          component="span"
          onClick={(e) => handleClick(e, field)}
          sx={{
            cursor: 'pointer',
            display: 'inline',
            alignItems: 'baseline',
            borderBottom: '2px dashed',
            borderColor: isEmptyMultiSelect ? 'action.disabled' : 'primary.main',
            color: isEmptyMultiSelect ? 'text.secondary' : 'text.primary',
            position: 'relative',
            paddingBottom: '1px',
            paddingTop: '1px',
            wordBreak: 'normal',
            whiteSpace: 'normal',
            backgroundColor: isEmptyMultiSelect 
              ? 'transparent'
              : 'rgba(25, 118, 210, 0.08)',
            px: 0.5,
            mx: 0,
            borderRadius: '2px',
            transition: 'all 0.2s ease',
            verticalAlign: 'baseline',
            lineHeight: 'inherit',
            fontWeight: isEmptyMultiSelect ? 'normal' : 500,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.12)',
              borderColor: 'primary.dark',
            }
          }}
        >
          <span key={`display-value-${field.id}`}>{displayValue}</span>
          <EditIcon 
            key={`edit-icon-${field.id}`}
            className="edit-icon" 
            sx={{
              opacity: 0,
              transition: 'opacity 0.2s ease',
              fontSize: '12px',
              ml: '2px',
              position: 'absolute',
              right: '-14px',
              top: '0px',
              color: 'primary.main',
              pointerEvents: 'none',
              '&:hover': {
                opacity: 1
              }
            }}
          />
        </Box>
      </Box>
    );
  };

  const renderPlaceholder = (field: DynamicField, index: number) => {
    // Convert the placeholder text to a question format
    const getQuestionText = (text: string) => {
      // Remove any existing question marks and brackets
      text = text.replace(/[\[\]?]/g, '').trim();
      
      // If it's already a question (starts with what, how, where, etc.), return as is
      if (/^(what|how|where|when|who|which|why)/i.test(text)) {
        return text;
      }
      
      // Otherwise, convert to question format
      if (text.toLowerCase().startsWith('enter')) {
        // For "Enter X" format, convert to "What is X?"
        return `What is ${text.replace(/^enter\s+/i, '')}?`;
      } else if (text.toLowerCase().startsWith('select')) {
        // For "Select X" format, convert to "Which X?"
        return `Which ${text.replace(/^select\s+/i, '')}?`;
      } else {
        // Default format: "What is X?"
        return `What is ${text}?`;
      }
    };

    const displayText = getQuestionText(field.placeholder || field.label || '');
    
    if (isDocumentPreview || readingMode) {
      return <span key={`placeholder-${field.id}-${index}`} className="placeholder">[{displayText}]</span>;
    }

    return (
      <Box
        key={`placeholder-box-${field.id}-${index}`}
        component="span"
        onClick={(e) => handleClick(e, field)}
        sx={{
          cursor: 'pointer',
          display: 'inline',
          color: 'warning.dark',
          borderBottom: '2px dashed',
          borderColor: 'warning.main',
          backgroundColor: 'warning.lighter',
          paddingY: '2px',
          paddingX: '6px',
          marginX: '2px',
          borderRadius: '4px',
          fontStyle: 'italic',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'warning.50',
            borderColor: 'warning.main',
            color: 'warning.dark'
          }
        }}
      >
        {displayText}
      </Box>
    );
  };

  const buildAdditionalNarrative = (field: Field, selectedValues: string[]): string => {
    if (!EXPANSION_MAPPINGS[field.id]) return '';

    const sentences = selectedValues
      .map(value => {
        const mapping = EXPANSION_MAPPINGS[field.id][value];
        return mapping?.sentence || '';
      })
      .filter(Boolean);

    if (sentences.length === 0) return '';
    if (sentences.length === 1) return sentences[0];
    if (sentences.length === 2) return `${sentences[0]} ${sentences[1]}`;
    
    const lastSentence = sentences[sentences.length - 1];
    const otherSentences = sentences.slice(0, -1);
    return `${otherSentences.join(' ')} ${lastSentence}`;
  };

  const renderTemplate = (template: string) => {
    const parts = template.split(/(\{[^}]+\})/g);
    let result: JSX.Element[] = [];
    
    parts.forEach((part, index) => {
      const match = part.match(/^\{([^}]+)\}$/);
      if (!match) {
        const normalizedPart = part.replace(/\s+/g, ' ');
        if (normalizedPart) {
          result.push(
            <React.Fragment key={`text-${index}-${normalizedPart.slice(0, 10)}`}>
              <span>{normalizedPart}</span>
            </React.Fragment>
          );
        }
        return;
      }

      const fieldId = match[1];
      // For expansion fields, we need to get the field definition from EXPANSION_FIELDS
      const field = EXPANSION_FIELDS[fieldId] ? {
        ...EXPANSION_FIELDS[fieldId],
        id: fieldId,
        label: EXPANSION_FIELDS[fieldId].label || '',
        placeholder: EXPANSION_FIELDS[fieldId].placeholder || '',
        type: EXPANSION_FIELDS[fieldId].type,
        options: EXPANSION_FIELDS[fieldId].options || [],
        allowCustom: EXPANSION_FIELDS[fieldId].allowCustom
      } as DynamicField : section.fields.find(f => f.id === fieldId);

      if (!field) {
        result.push(<React.Fragment key={`empty-${fieldId}-${index}`} />);
        return;
      }

      const value = values[fieldId];
      
      // Consider empty strings, null, undefined, and empty arrays as empty values
      const isEmpty = !value || (Array.isArray(value) && value.length === 0) || 
                     (value?._selectedValues && value._selectedValues.length === 0);
      
      if (isEmpty) {
        result.push(
          <React.Fragment key={`placeholder-${fieldId}-${index}`}>
            {renderPlaceholder(field, index)}
          </React.Fragment>
        );
        return;
      }

      // Show the clickable field
      result.push(
        <React.Fragment key={`value-${fieldId}-${index}`}>
          {renderValue(field, value)}
        </React.Fragment>
      );

      // Handle multi-select values properly
      const selectedValues = field.type === 'multiSelect'
        ? (Array.isArray(value) ? value : value?._selectedValues || [])
        : [value];

      if (selectedValues?.length && EXPANSION_MAPPINGS[fieldId]) {
        // Add colon before list
        result.push(
          <React.Fragment key={`expansion-intro-${fieldId}`}>
            <span>: </span>
          </React.Fragment>
        );

        // Create list container for data sources
        const listItems = selectedValues.map((selectedValue: string, valueIndex: number) => {
          // Get mapping for this data source
          const mapping = EXPANSION_MAPPINGS[fieldId]?.[selectedValue];
          if (!mapping?.sentence) return null;

          // Process the expansion sentence
          const expansionSentence = processDynamicSentence(
            {
              template: mapping.sentence,
              fields: {},  // Fields will be handled by EXPANSION_FIELDS lookup
              branches: {}
            },
            values,
            renderValue,
            renderPlaceholder,
            `${fieldId}-${selectedValue}`  // Pass the full parent field ID for proper value lookup
          );

          return (
            <Box
              component="li"
              key={`list-item-${fieldId}-${valueIndex}`}
              sx={{ 
                mb: 2,
                '&:last-child': { mb: 0 },
                '& > span': {
                  display: 'inline'
                }
              }}
            >
              {expansionSentence}
            </Box>
          );
        }).filter(Boolean);

        if (listItems.length > 0) {
          result.push(
            <Box
              component="ul"
              key={`list-${fieldId}`}
              sx={{
                listStyleType: 'disc',
                pl: 4,
                my: 2,
                '& li': {
                  pl: 1,
                  '& > span': {
                    display: 'inline'
                  }
                }
              }}
            >
              {listItems}
            </Box>
          );
        }
      }
    });

    // Handle dynamic content
    if (section.dynamicContent) {
      section.dynamicContent.forEach((content, index) => {
        const shouldShow = shouldShowConditionalContent(content.condition);
        if (shouldShow) {
          result.push(
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
          );
        }
      });
    }

    // Handle conditional sections
    if (section.conditionalSections) {
      section.conditionalSections.forEach((conditionalSection, index) => {
        const shouldShow = shouldShowConditionalContent(conditionalSection.condition);
        if (shouldShow) {
          result.push(
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
          );
        }
      });
    }

    return result;
  };

  const shouldShowConditionalContent = (condition: { fieldId: string; value: any; operator?: string }) => {
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
    <Box sx={{ mb: 4, position: 'relative' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'background.paper',
        p: 1,
        mb: 2
      }}>
        <FormControlLabel
          control={
            <Switch
              checked={readingMode}
              onChange={(e) => setReadingMode(e.target.checked)}
              color="primary"
              size="small"
            />
          }
          label={
            <Typography variant="body2" sx={{ 
              fontWeight: 500,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '0.875rem'
            }}>
              {readingMode ? "Reading Mode" : "Interactive Mode"}
            </Typography>
          }
          sx={{
            mr: 1,
            '& .MuiFormControlLabel-label': {
              minWidth: 120
            }
          }}
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: '4px solid',
          borderLeftColor: 'primary.main',
          backgroundColor: '#ffffff',
          position: 'relative',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          '& .MuiTypography-root': {
            lineHeight: 1.8,
            letterSpacing: '0.01em',
            color: 'text.primary',
            fontSize: '1rem',
            '& .placeholder': {
              color: 'warning.dark',
              fontStyle: 'italic',
              backgroundColor: 'warning.lighter',
              padding: '2px 6px',
              borderRadius: '4px'
            }
          },
          '& .warning': {
            lighter: '#FFF7E6',
            light: '#FFB74D',
            main: '#F9A825',
            dark: '#F57F17',
            '50': '#FFF3E0'
          }
        }}
      >
        <Typography 
          variant="body1" 
          component="div"
          sx={{
            '& > span': {
              transition: 'color 0.2s ease'
            }
          }}
        >
          {renderTemplate(section.template)}
        </Typography>
      </Paper>

      {menuState.isOpen && menuState.fieldId && menuState.anchorPosition && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1300,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              position: 'fixed',
              top: menuState.anchorPosition.top,
              left: menuState.anchorPosition.left,
              pointerEvents: 'auto'
            }}
          >
            <ClickAwayListener onClickAway={handleClose}>
              <Paper
                elevation={8}
                sx={{
                  width: 400,
                  maxWidth: '90vw',
                  mt: 1,
                  p: 2
                }}
              >
                {menuState.fieldId && (() => {
                  // Check if this is an expansion field
                  const isExpansionField = menuState.fieldId.includes('-');
                  if (isExpansionField) {
                    const [parentFieldId, selectedValue, expansionFieldId] = menuState.fieldId.split('-');
                    const globalExpansionField = EXPANSION_FIELDS[expansionFieldId];
                    if (globalExpansionField) {
                      const field = {
                        ...globalExpansionField,
                        id: menuState.fieldId,
                        type: globalExpansionField.type,
                        label: globalExpansionField.label || '',
                        options: globalExpansionField.options || [],
                        allowCustom: globalExpansionField.allowCustom
                      } as Field;
                      return renderFieldInput(field);
                    }
                  }
                  // If not an expansion field, look in section fields
                  const field = section.fields.find(f => f.id === menuState.fieldId);
                  if (!field) return null;
                  return renderFieldInput(field);
                })()}
              </Paper>
            </ClickAwayListener>
          </div>
        </div>
      )}
      
      <NarrativePreviewModal
        isOpen={isModulePreviewOpen}
        onClose={() => setIsModulePreviewOpen(false)}
        currentModule={{
          id: section.moduleId,
          name: section.moduleName,
          sections: [section]
        }}
        values={values}
        onUpdate={onUpdate}
      />
    </Box>
  );
}; 