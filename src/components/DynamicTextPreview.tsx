import React, { useRef, useCallback } from 'react';
import { Box, Typography, Popper, ClickAwayListener, MenuList, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper, Checkbox, IconButton, Tooltip, Switch, FormControlLabel } from '@mui/material';
import { NarrativeSection, Field } from '../types/narrative';
import { Edit as EditIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { NarrativePreviewModal } from './NarrativePreviewModal';
import { DATA_SOURCES_SCHEMA } from '../data/irbNarrativeSchema';
import { AutocompleteText } from './AutocompleteText';
import { commonSuggestions } from '../data/commonSuggestions';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';

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

interface DynamicField {
  id: string;
  type: 'number' | 'select' | 'multiSelect' | 'text' | 'textArea' | 'date' | 'radio' | 'checkbox' | 'autocompleteText' | 'research_gap' | 'supporting_literature' | 'research_objective' | 'methodology_approach' | 'prior_evidence';
  label: string;
  placeholder?: string;
  description?: string;
  options?: OptionType[];
  expansionFields?: {
    [key: string]: ExpansionField[];
  };
  freeSolo?: boolean;
  allowOther?: boolean;
  suggestions?: string[];
  validation?: {
    type: string;
    value: any;
    message?: string;
  }[];
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

interface ExpansionField {
  id: string;
  type: 'text' | 'select' | 'multiSelect' | 'number';
  label: string;
  placeholder?: string;
  description?: string;
  options?: OptionType[];
  required?: boolean;
  allowOther?: boolean;
  freeSolo?: boolean;
  suggestions?: string[];
  validation?: {
    type: string;
    value: any;
    message?: string;
  }[];
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
    allowOther?: boolean;
    generateText?: (values: any) => string;
    freeSolo?: boolean;
  };
}

interface ExpansionMapping {
  [key: string]: {
    [value: string]: ExpansionContent;
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
      allowOther: false,
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

// Define expansion mappings for each data source
const EXPANSION_MAPPINGS: ExpansionMapping = {
  data_sources: {
    'external_dua': {
      sentence: "External data will be acquired from {external_provider} under a {dua_type}. This data will be in {data_format} format with an estimated volume of {data_volume}. The data will be {identifiability_level} with {security_measures} in place. The data includes sensitive information related to {sensitive_categories}."
    },
    'public_datasets': {
      sentence: "For the public dataset, named {dataset_name}, which is {dataset_access_type} and maintained by {data_maintainer}. This data will be in {data_format} format with an estimated volume of {data_volume}. The data will be {identifiability_level}."
    },
    'internal_ehr': {
      sentence: "Internal EHR data will be derived from Mayo Clinic's secure clinical repositories in the following domains: {clinical_domain}. This data will be in {data_format} format with an estimated volume of {data_volume}. The data will be {identifiability_level} with {security_measures} in place. The data includes sensitive information related to {sensitive_categories}."
    },
    'prospective_data': {
      sentence: "Prospectively, we will collect data from approximately {participant_count} participants through {collection_method} in {clinical_setting}. This data will be in {data_format} format with an estimated volume of {data_volume}. The data will be {identifiability_level} with {security_measures} in place. The data includes sensitive information related to {sensitive_categories}."
    }
  }
};

// Define fields for each data source
const EXPANSION_FIELDS: ExpansionFields = {
  external_provider: {
    type: 'text',
    label: 'External Provider',
    placeholder: 'Enter the name of the external data provider',
    description: 'The organization or institution providing the external data',
    freeSolo: true
  },
  dua_type: {
    type: 'select',
    label: 'DUA Type',
    options: [
      { value: 'standard', label: 'standard institutional DUA' },
      { value: 'custom', label: 'custom negotiated DUA' },
      { value: 'federal', label: 'federal DUA' }
    ]
  },
  dataset_name: {
    type: 'text',
    label: 'Dataset Name',
    placeholder: 'Enter the dataset name'
  },
  dataset_access_type: {
    type: 'select',
    label: 'Dataset Access Level',
    options: [
      { value: 'fully_open', label: 'fully open access' },
      { value: 'registered', label: 'available with registration' },
      { value: 'restricted', label: 'restricted access' }
    ]
  },
  data_maintainer: {
    type: 'text',
    label: 'Data Maintainer',
    placeholder: 'Enter the organization that maintains the data'
  },
  clinical_domain: {
    type: 'multiSelect',
    label: 'Clinical Domain',
    options: [
      { value: 'pediatrics', label: 'Pediatrics' },
      { value: 'cardiology', label: 'Cardiology' },
      { value: 'oncology', label: 'Oncology' },
      { value: 'neurology', label: 'Neurology' },
      { value: 'internal_medicine', label: 'Internal Medicine' },
      { value: 'psychiatry', label: 'Psychiatry' },
      { value: 'orthopedics', label: 'Orthopedics' },
      { value: 'dermatology', label: 'Dermatology' },
      { value: 'endocrinology', label: 'Endocrinology' },
      { value: 'gastroenterology', label: 'Gastroenterology' }
    ],
    placeholder: 'Select clinical domains'
  },
  participant_count: {
    type: 'text',
    label: 'Participant Count',
    placeholder: 'Enter the expected number of participants'
  },
  collection_method: {
    type: 'select',
    label: 'Collection Method',
    options: [
      { value: 'standard_care', label: 'standard of care visits' },
      { value: 'research_visits', label: 'dedicated research visits' },
      { value: 'remote', label: 'remote data collection' }
    ]
  },
  clinical_setting: {
    type: 'text',
    label: 'Clinical Setting',
    placeholder: 'Enter the clinical setting'
  },
  data_format: {
    type: 'multiSelect',
    label: 'Data Format',
    options: [
      { value: 'structured_clinical', label: 'structured clinical data' },
      { value: 'imaging', label: 'medical imaging data' },
      { value: 'genomic', label: 'genomic and molecular data' },
      { value: 'textual', label: 'unstructured clinical notes' }
    ]
  },
  data_volume: {
    type: 'select',
    label: 'Data Volume',
    options: [
      { value: 'small', label: 'a small dataset (less than 1GB)' },
      { value: 'moderate', label: 'a moderate dataset (1GB to 100GB)' },
      { value: 'large', label: 'a large dataset (more than 100GB)' }
    ]
  },
  identifiability_level: {
    type: 'select',
    label: 'Identifiability Level',
    options: [
      { value: 'fully_deidentified', label: 'fully de-identified using HIPAA Safe Harbor method' },
      { value: 'limited_dataset', label: 'a Limited Dataset containing only approved indirect identifiers' },
      { value: 'coded', label: 'coded with a secure key management system' },
      { value: 'identifiable', label: 'identifiable with strict access controls' }
    ]
  },
  security_measures: {
    type: 'multiSelect',
    label: 'Security Measures',
    options: [
      { value: 'encryption', label: 'end-to-end encryption' },
      { value: 'access_controls', label: 'role-based access controls' },
      { value: 'secure_transfer', label: 'secure data transfer protocols' },
      { value: 'audit_logging', label: 'comprehensive audit logging' },
      { value: 'phi_monitoring', label: 'PHI access monitoring' }
    ]
  },
  sensitive_categories: {
    type: 'multiSelect',
    label: 'Sensitive Data Categories',
    options: [
      { value: 'genetic', label: 'genetic information' },
      { value: 'mental_health', label: 'mental health' },
      { value: 'substance_abuse', label: 'substance abuse' },
      { value: 'hiv', label: 'HIV/AIDS' },
      { value: 'reproductive', label: 'reproductive health' },
      { value: 'abuse', label: 'abuse-related information' }
    ],
    generateText: (values: any) => {
      const categories = values.sensitive_categories;
      if (!categories || categories.length === 0) return '';
      const formattedCategories = categories.map((cat: string) => {
        const option = EXPANSION_FIELDS.sensitive_categories.options?.find(opt => opt.value === cat);
        return option?.label || cat;
      });
      return `This data includes sensitive information related to ${formattedCategories.join(', ')}.`;
    }
  }
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
      allowOther: EXPANSION_FIELDS[fieldId].allowOther
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

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>, field: Field) => {
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
      if (option) return option.label;
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
    setExpansionValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
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
      if (!mapping || !mapping.fields) return null;

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
          {mapping.fields.map((expansionField: ExpansionField) => {
            const fieldId = `${field.id}-${selectedValue}-${expansionField.id}`;
            const fieldValue = expansionValues[fieldId] || '';

            if (expansionField.type === 'text') {
              return (
                <Box key={`field-${fieldId}`} sx={{ mb: 2 }}>
                  <AutocompleteText
                    value={fieldValue ? [fieldValue] : []}
                    onChange={(value) => handleExpansionUpdate(fieldId, value[0] || '')}
                    options={[]}
                    label={expansionField.label}
                    placeholder={expansionField.placeholder}
                    description={expansionField.description}
                    required={expansionField.required}
                    helperText={expansionField.description}
                    multiple={false}
                    allowOther={expansionField.allowOther}
                  />
                </Box>
              );
            }

            return (
              <Box key={`field-${fieldId}`} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label={expansionField.label}
                  placeholder={expansionField.placeholder}
                  value={fieldValue}
                  onChange={(e) => handleExpansionUpdate(fieldId, e.target.value)}
                  select={expansionField.type === 'select'}
                  type={expansionField.type === 'number' ? 'number' : 'text'}
                  helperText={expansionField.description}
                  sx={{ mb: 1 }}
                >
                  {expansionField.type === 'select' && expansionField.options?.map((option: OptionType) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box>
                        <Typography variant="body1">{option.label}</Typography>
                        {option.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {option.description}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            );
          })}
        </Box>
      );
    });

    return expansionContent;
  };

  const renderValue = (field: Field, value: any) => {
    // Check if this is an expansion field
    const isExpansionField = field.id.includes('-');
    let currentField = field;
    
    if (isExpansionField) {
      const [parentFieldId, selectedValue, expansionFieldId] = field.id.split('-');
      const globalExpansionField = EXPANSION_FIELDS[expansionFieldId];
      if (globalExpansionField) {
        currentField = {
          ...globalExpansionField,
          id: field.id,
          type: globalExpansionField.type,
          label: globalExpansionField.label || '',
          options: globalExpansionField.options || [],
          allowOther: globalExpansionField.allowOther
        } as Field;
      }
    }

    const displayValue = (() => {
      if (currentField.type === 'select' || currentField.type === 'radio') {
        return getDisplayValue(value, currentField);
      }

      if (currentField.type === 'multiSelect') {
        const selectedValues = Array.isArray(value) ? value : value?._selectedValues || [];
        if (!selectedValues || selectedValues.length === 0) {
          return currentField.placeholder?.replace(/[\[\]]/g, '') || currentField.label;
        }
        
        // Get all selected options and format them properly
        const selectedOptions = selectedValues.map((val: string) => getDisplayValue(val, currentField));
        
        // Format the list with proper grammar
        return formatList(selectedOptions);
      }

      if (currentField.type === 'text' || currentField.type === 'textArea') {
        if (isDocumentPreview || readingMode) {
          return value || `[${currentField.placeholder || currentField.label}]`;
        }
        return value || currentField.placeholder?.replace(/[\[\]]/g, '') || currentField.label;
      }

      if (isDocumentPreview || readingMode) {
        return value || `[${currentField.placeholder || currentField.label}]`;
      }
      return value || currentField.placeholder?.replace(/[\[\]]/g, '') || currentField.label;
    })();

    if (isDocumentPreview || readingMode) {
      return <span key={`value-${currentField.id}`}>{displayValue}</span>;
    }

    const isEmptyMultiSelect = currentField.type === 'multiSelect' && 
      (!value || (Array.isArray(value) && value.length === 0) || 
       (value?._selectedValues && value._selectedValues.length === 0));

    return (
      <Box
        component="div"
        key={`value-container-${currentField.id}`}
        sx={{ 
          display: 'inline',
          maxWidth: 'fit-content',
          wordBreak: 'normal',
          whiteSpace: 'normal',
          mr: 0.5
        }}
      >
        <Box
          key={`value-box-${currentField.id}`}
          component="span"
          onClick={(e) => handleClick(e, currentField)}
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
          <span key={`display-value-${currentField.id}`}>{displayValue}</span>
          <EditIcon 
            key={`edit-icon-${currentField.id}`}
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

  const renderPlaceholder = (field: Field, index: number) => {
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
        allowOther: EXPANSION_FIELDS[fieldId].allowOther
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

    return result;
  };

  const renderFieldInput = (field: Field) => {
    // Check if this is an expansion field
    const isExpansionField = menuState.fieldId?.includes('-');
    let currentField = field;
    let currentValues = values[menuState.fieldId!];

    if (isExpansionField) {
      const [parentFieldId, selectedValue, expansionFieldId] = menuState.fieldId!.split('-');
      const globalExpansionField = EXPANSION_FIELDS[expansionFieldId];
      if (globalExpansionField) {
        currentField = {
          ...globalExpansionField,
          id: menuState.fieldId!,
          type: globalExpansionField.type,
          label: globalExpansionField.label || '',
          options: globalExpansionField.options || [],
          allowOther: globalExpansionField.allowOther
        } as DynamicField;
        // For expansion fields, we need to look up the value in the correct place
        const fullFieldId = `${parentFieldId}-${selectedValue}-${expansionFieldId}`;
        currentValues = values[fullFieldId];
      }
    }

    // Convert current values to array format for AutocompleteText
    const valueArray = (() => {
      if (!currentValues) return [];
      if (Array.isArray(currentValues)) return currentValues;
      if (typeof currentValues === 'string') return [currentValues];
      if (currentValues?._selectedValues) return currentValues._selectedValues;
      return [];
    })();
    
    return (
      <AutocompleteText
        value={valueArray}
        onChange={(newValues) => {
          if (currentField.type === 'multiSelect') {
            onUpdate(menuState.fieldId!, newValues);
          } else {
            onUpdate(menuState.fieldId!, newValues[0] || '');
          }
        }}
        options={currentField.options || []}
        label={currentField.label}
        placeholder={currentField.placeholder || "Type to search..."}
        description={currentField.description}
        required={currentField.required}
        helperText={currentField.description}
        multiple={currentField.type === 'multiSelect'}
        allowOther={currentField.allowOther !== false}
      />
    );
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
                        allowOther: globalExpansionField.allowOther
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