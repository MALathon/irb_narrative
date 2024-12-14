import React, { useRef, useCallback } from 'react';
import { Box, Typography, Popper, ClickAwayListener, MenuList, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper, Checkbox, IconButton, Tooltip, Switch, FormControlLabel } from '@mui/material';
import { NarrativeSection, Field } from '../types/narrative';
import { Edit as EditIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { NarrativePreviewModal } from './NarrativePreviewModal';

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

interface ExpansionField {
  id: string;
  type: 'text' | 'select' | 'number';
  label: string;
  placeholder?: string;
  options?: OptionType[];
}

interface ExpansionContent {
  sentence: string;
  fields?: ExpansionField[];
}

interface ExpansionFields {
  [key: string]: {
    type: 'number' | 'select' | 'multiSelect' | 'text' | 'textArea' | 'date' | 'radio' | 'checkbox' | 'research_gap' | 'supporting_literature' | 'research_objective' | 'methodology_approach' | 'prior_evidence';
    label?: string;
    placeholder?: string;
    options?: OptionType[];
  };
}

interface ExpansionMapping {
  [key: string]: {
    [value: string]: ExpansionContent;
  };
}

const EXPANSION_MAPPINGS: ExpansionMapping = {
  data_sources: {
    'internal_mayo_ehr': {
      sentence: "The internal EHR data will be derived from Mayo Clinic's secure clinical repositories in the {clinical_domain} department, focusing on {data_timeframe} data"
    },
    'external_dua': {
      sentence: "This external data will be acquired from {external_provider} under a {dua_type} Data Use Agreement and is maintained by {data_maintainer}"
    },
    'public_datasets': {
      sentence: "We will incorporate the {dataset_name} dataset, which is {dataset_access_type} and maintained by {data_maintainer}"
    },
    'prospective_mayo': {
      sentence: "We plan to collect data from approximately {participant_count} participants through {collection_method} in the {clinical_setting} setting"
    }
  },
  dataset_type: {
    'github': {
      sentence: "We will incorporate the {dataset_name} dataset, which is {dataset_access_type} and maintained by {data_maintainer}"
    },
    'public_repo': {
      sentence: "We will utilize the {dataset_name} repository, which is {dataset_access_type} and maintained by {data_maintainer}"
    }
  }
};

const EXPANSION_FIELDS: ExpansionFields = {
  clinical_domain: {
    type: 'select',
    label: 'Which clinical department?',
    options: [
      { value: 'cardiology', label: 'Cardiology' },
      { value: 'oncology', label: 'Oncology' },
      { value: 'neurology', label: 'Neurology' },
      { value: 'primary_care', label: 'Primary Care' }
    ]
  },
  data_timeframe: {
    type: 'select',
    label: 'What timeframe of data?',
    options: [
      { value: 'historical', label: 'historical (past 10 years)' },
      { value: 'recent', label: 'recent (past 2 years)' },
      { value: 'prospective', label: 'prospective (ongoing)' }
    ]
  },
  external_provider: {
    type: 'text',
    label: 'Who is providing the external data?',
    placeholder: 'Enter the name of the external data provider'
  },
  dua_type: {
    type: 'select',
    label: 'What type of Data Use Agreement?',
    options: [
      { value: 'standard', label: 'standard institutional' },
      { value: 'custom', label: 'custom negotiated' },
      { value: 'federal', label: 'federal data use' }
    ]
  },
  data_maintainer: {
    type: 'text',
    label: 'Who maintains the data?',
    placeholder: 'Enter the organization that maintains the data'
  },
  dataset_name: {
    type: 'text',
    label: 'What is the name of the dataset?',
    placeholder: 'Enter the dataset name'
  },
  dataset_access_type: {
    type: 'select',
    label: 'What is the access level of the dataset?',
    options: [
      { value: 'fully_open', label: 'fully open access' },
      { value: 'registered', label: 'available with registration' },
      { value: 'restricted', label: 'restricted access' }
    ]
  },
  participant_count: {
    type: 'text',
    label: 'How many participants?',
    placeholder: 'Enter the expected number of participants'
  },
  collection_method: {
    type: 'select',
    label: 'How will the data be collected?',
    options: [
      { value: 'standard_care', label: 'standard of care visits' },
      { value: 'research_visits', label: 'dedicated research visits' },
      { value: 'remote', label: 'remote data collection' }
    ]
  },
  clinical_setting: {
    type: 'text',
    label: 'In which clinical setting?',
    placeholder: 'Enter the clinical setting'
  },
  phi_rationale: {
    type: 'text',
    label: 'Why is identifiable PHI required?',
    placeholder: 'Explain why identifiable PHI is necessary'
  },
  security_measures: {
    type: 'select',
    label: 'What security measures will be implemented?',
    options: [
      { value: 'encryption', label: 'end-to-end encryption' },
      { value: 'access_controls', label: 'role-based access controls' },
      { value: 'secure_transfer', label: 'secure data transfer protocols' }
    ]
  },
  indirect_identifiers: {
    type: 'text',
    label: 'What indirect identifiers will be included?',
    placeholder: 'List the indirect identifiers'
  },
  research_purpose: {
    type: 'text',
    label: 'What is the research purpose for these identifiers?',
    placeholder: 'Explain why these identifiers are necessary'
  },
  deidentification_method: {
    type: 'select',
    label: 'Which de-identification method will be used?',
    options: [
      { value: 'safe_harbor', label: 'HIPAA Safe Harbor method' },
      { value: 'expert', label: 'Expert Determination method' },
      { value: 'automated', label: 'automated de-identification software' }
    ]
  },
  verification_process: {
    type: 'text',
    label: 'How will de-identification be verified?',
    placeholder: 'Describe the verification process'
  }
};

interface MenuState {
  fieldId: string | null;
  anchorPosition: { top: number; left: number } | null;
  isOpen: boolean;
}

const DATA_SOURCES_SCHEMA: DynamicSentence = {
  template: "We will utilize {data_source_type}",
  fields: {
    data_source_type: {
      id: 'data_source_type',
      type: 'multiSelect',
      label: 'What data sources will you use?',
      options: [
        { value: 'internal_mayo_ehr', label: 'internally sourced clinical data from Mayo EHR' },
        { value: 'external_dua', label: 'externally sourced data under Data Use Agreement' },
        { value: 'public_datasets', label: 'publicly available datasets' }
      ]
    }
  },
  branches: {
    data_source_type: {
      internal_mayo_ehr: [{
        template: "from the {clinical_domain} department, focusing on {timeframe} data",
        fields: {
          clinical_domain: {
            id: 'clinical_domain',
            type: 'select',
            label: 'Which clinical department?',
            options: [
              { value: 'cardiology', label: 'Cardiology' },
              { value: 'oncology', label: 'Oncology' }
            ]
          },
          timeframe: {
            id: 'timeframe',
            type: 'select',
            label: 'What timeframe of data?',
            options: [
              { value: 'historical', label: 'historical (past 10 years)' },
              { value: 'recent', label: 'recent (past 2 years)' }
            ]
          }
        }
      }],
      external_dua: [{
        template: "from {collaborator_name} under a {dua_type} agreement",
        fields: {
          collaborator_name: {
            id: 'collaborator_name',
            type: 'text',
            label: 'Who is providing the data?',
            placeholder: 'Enter the name of the collaborating institution'
          },
          dua_type: {
            id: 'dua_type',
            type: 'select',
            label: 'What type of Data Use Agreement?',
            options: [
              { value: 'standard', label: 'standard institutional' },
              { value: 'custom', label: 'custom negotiated' }
            ]
          }
        }
      }]
    }
  }
};

interface DynamicField {
  id: string;
  type: 'number' | 'select' | 'multiSelect' | 'text' | 'textArea' | 'date' | 'radio' | 'checkbox';
  label: string;
  placeholder?: string;
  options?: OptionType[];
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
  const parts = renderDynamicTemplate(
    sentence.template, 
    sentence.fields, 
    values, 
    renderValue, 
    renderPlaceholder,
    `${parentFieldId || 'root'}-${depth}`
  );
  let result: JSX.Element[] = [...parts];

  // Process branches immediately after their parent field
  Object.entries(sentence.fields).forEach(([fieldId, field], fieldIndex) => {
    const value = values[fieldId];
    if (value && sentence.branches?.[fieldId]?.[value]) {
      const branchSentences = sentence.branches[fieldId][value];
      branchSentences.forEach((branchSentence, branchIndex) => {
        // Add separator
        result.push(
          <React.Fragment key={`branch-separator-${fieldId}-${value}-${branchIndex}-${depth}-${fieldIndex}`}>
            <span> </span>
          </React.Fragment>
        );
        
        // Process branch sentence
        const branchParts = processDynamicSentence(
          branchSentence,
          values,
          renderValue,
          renderPlaceholder,
          `${fieldId}-${value}-${branchIndex}`,
          depth + 1
        );
        result = [...result, ...branchParts];
      });
    }
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
  const [otherValue, setOtherValue] = React.useState('');
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
    
    const currentValue = values[field.id];
    setOtherValue(currentValue?.toString() || '');
    
    if (field.type === 'select' || field.type === 'multiSelect') {
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuState({
        fieldId: field.id,
        anchorPosition: {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        },
        isOpen: true
      });
    } else {
      setMenuState({ fieldId: field.id, anchorPosition: null, isOpen: false });
      setOpenDialog(true);
    }
  }, [isDocumentPreview, values]);

  const handleClose = useCallback(() => {
    setMenuState(prev => ({ ...prev, isOpen: false }));
    setOpenDialog(false);
  }, []);

  const handleOptionSelect = useCallback((value: any) => {
    if (!menuState.fieldId) return;

    const field = section.fields.find(f => f.id === menuState.fieldId);
    if (!field) return;

    if (value === 'other') {
      setOpenDialog(true);
      return;
    }

    if (field.type === 'multiSelect') {
      const currentValues = Array.isArray(values[field.id]) 
        ? values[field.id] 
        : values[field.id]?._selectedValues || [];

      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: string) => v !== value)
        : [...currentValues, value];

      onUpdate(field.id, newValues);
    } else {
      onUpdate(field.id, value);
      handleClose();
    }
  }, [menuState.fieldId, section.fields, values, onUpdate, handleClose]);

  const handleOtherSubmit = () => {
    if (menuState.fieldId) {
      onUpdate(menuState.fieldId, otherValue);
      setOtherValue('');
      setOpenDialog(false);
    }
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
          {mapping.fields.map((expansionField: ExpansionField) => (
            <Box key={`field-${expansionField.id}`} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                label={expansionField.label}
                placeholder={expansionField.placeholder}
                value={expansionValues[`${field.id}-${selectedValue}-${expansionField.id}`] || ''}
                onChange={(e) => handleExpansionUpdate(
                  `${field.id}-${selectedValue}-${expansionField.id}`, 
                  e.target.value
                )}
                select={expansionField.type === 'select'}
                type={expansionField.type === 'number' ? 'number' : 'text'}
                sx={{ mb: 1 }}
              >
                {expansionField.type === 'select' && expansionField.options?.map((option: OptionType) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ))}
        </Box>
      );
    });

    return expansionContent;
  };

  const renderValue = (field: Field, value: any) => {
    const displayValue = (() => {
      if (field.type === 'select' || field.type === 'radio') {
        const option = field.options?.find(opt => opt.value === value);
        return option?.label || value;
      }

      if (field.type === 'multiSelect') {
        const selectedValues = Array.isArray(value) ? value : value?._selectedValues;
        if (!selectedValues || selectedValues.length === 0) {
          return field.placeholder?.replace(/[\[\]]/g, '') || field.label;
        }
        
        const selectedOptions = field.options?.filter(opt => selectedValues.includes(opt.value)) || [];
        if (selectedOptions.length === 0) return field.placeholder?.replace(/[\[\]]/g, '') || field.label;
        
        if (selectedOptions.length === 1) {
          return selectedOptions[0].label.toLowerCase();
        }
        
        if (selectedOptions.length === 2) {
          return `${selectedOptions[0].label.toLowerCase()} and ${selectedOptions[1].label.toLowerCase()}`;
        }
        
        const lastOption = selectedOptions[selectedOptions.length - 1];
        const otherOptions = selectedOptions.slice(0, -1);
        return `${otherOptions.map(opt => opt.label.toLowerCase()).join(', ')}, and ${lastOption.label.toLowerCase()}`;
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
        sx={{ display: 'inline-block' }}
      >
        <Box
          key={`value-box-${field.id}`}
          component="span"
          onClick={(e) => handleClick(e, field)}
          sx={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'baseline',
            borderBottom: '2px dashed',
            borderColor: isEmptyMultiSelect ? 'action.disabled' : 'primary.main',
            color: isEmptyMultiSelect ? 'text.secondary' : 'text.primary',
            position: 'relative',
            paddingBottom: '1px',
            paddingTop: '1px',
            wordBreak: 'break-word',
            wordWrap: 'break-word',
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

  const renderPlaceholder = (field: Field, index: number) => {
    if (isDocumentPreview || readingMode) {
      return <span key={`placeholder-${field.id}-${index}`} className="placeholder">[{field.placeholder || field.label}]</span>;
    }

    const displayText = (field.placeholder || field.label)?.replace(/[\[\]]/g, '');
    
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
        // Don't trim static text parts, just normalize multiple spaces to single space
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
      const field = section.fields.find(f => f.id === fieldId);
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

      result.push(
        <React.Fragment key={`value-${fieldId}-${index}`}>
          {renderValue(field, value)}
        </React.Fragment>
      );

      const selectedValues = Array.isArray(value) 
        ? value 
        : (field.type === 'multiSelect' ? value?._selectedValues : [value]);

      if (selectedValues?.length && EXPANSION_MAPPINGS[fieldId]) {
        // Add colon before list
        result.push(
          <React.Fragment key={`expansion-intro-${fieldId}`}>
            <span>: </span>
          </React.Fragment>
        );

        // If multiple values, create a list container
        if (selectedValues.length > 1) {
          const listItems = selectedValues.map((selectedValue: string, valueIndex: number) => {
            const mapping = EXPANSION_MAPPINGS[fieldId][selectedValue];
            if (!mapping?.sentence) return null;

            const expansionFieldsObj = Object.keys(EXPANSION_FIELDS).reduce((acc, key) => ({
              ...acc,
              [key]: {
                ...EXPANSION_FIELDS[key],
                id: key,
                displayId: `${fieldId}-${selectedValue}-${key}`,
                placeholder: EXPANSION_FIELDS[key].placeholder || `[${EXPANSION_FIELDS[key].label}]`
              }
            }), {});

            const expansionSentence = processDynamicSentence(
              {
                template: mapping.sentence,
                fields: expansionFieldsObj,
                branches: {}
              },
              values,
              renderValue,
              renderPlaceholder,
              `${fieldId}-expansion-${valueIndex}`
            );

            // Only add period if sentence doesn't end with punctuation
            const needsPeriod = !mapping.sentence.trim().match(/[.!?]$/);

            return (
              <Box
                component="li"
                key={`list-item-${fieldId}-${valueIndex}`}
                sx={{ 
                  mb: 1,
                  '&:last-child': { mb: 0 },
                  '& > span': {
                    display: 'inline'
                  }
                }}
              >
                {expansionSentence}
                {needsPeriod && <span>.</span>}
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
                  my: 1,
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

            // Check if next part starts with a new sentence and doesn't already have punctuation
            const nextPart = parts[index + 1];
            const nextPartTrimmed = nextPart?.trim() || '';
            const hasNextPart = nextPartTrimmed && !nextPartTrimmed.match(/^[.!?]/);
            const previousEndsWithPunctuation = result[result.length - 1]?.props?.children?.toString().match(/[.!?]$/);

            if (hasNextPart && !previousEndsWithPunctuation) {
              result.push(
                <React.Fragment key={`list-end-${fieldId}`}>
                  <span>. </span>
                </React.Fragment>
              );
            }
          }
        } else {
          // Single value - render inline
          const selectedValue = selectedValues[0];
          const mapping = EXPANSION_MAPPINGS[fieldId][selectedValue];
          if (mapping?.sentence) {
            const expansionFieldsObj = Object.keys(EXPANSION_FIELDS).reduce((acc, key) => ({
              ...acc,
              [key]: {
                ...EXPANSION_FIELDS[key],
                id: key,
                displayId: `${fieldId}-${selectedValue}-${key}`,
                placeholder: EXPANSION_FIELDS[key].placeholder || `[${EXPANSION_FIELDS[key].label}]`
              }
            }), {});

            const expansionSentence = processDynamicSentence(
              {
                template: mapping.sentence,
                fields: expansionFieldsObj,
                branches: {}
              },
              values,
              renderValue,
              renderPlaceholder,
              `${fieldId}-expansion-0`
            );

            result = [...result, ...expansionSentence];
            
            // Add period if needed for inline sentence
            const nextPart = parts[index + 1];
            if (nextPart && !nextPart.trim().startsWith('.') && !mapping.sentence.trim().match(/[.!?]$/)) {
              result.push(
                <React.Fragment key={`inline-period-${fieldId}`}>
                  <span>. </span>
                </React.Fragment>
              );
            }
          }
        }
      }

      // Only add final period if this is the last field and not followed by punctuation
      const isLastField = index === parts.length - 1;
      const nextPart = parts[index + 1];
      if (isLastField && !nextPart?.trim().startsWith('.') && !part.trim().match(/[.!?]$/)) {
        result.push(
          <React.Fragment key={`final-period-${fieldId}`}>
            <span>.</span>
          </React.Fragment>
        );
      }
    });

    return result;
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
                  maxHeight: 300,
                  width: 'auto',
                  maxWidth: 'none',
                  mt: 1,
                  overflow: 'auto'
                }}
              >
                <MenuList
                  autoFocus
                  id={`menu-${menuState.fieldId}`}
                  aria-labelledby={`menu-button-${menuState.fieldId}`}
                  sx={{ p: 0 }}
                >
                  {section.fields.find(f => f.id === menuState.fieldId)?.options?.map((option) => {
                    const currentValues = Array.isArray(values[menuState.fieldId!]) 
                      ? values[menuState.fieldId!] 
                      : values[menuState.fieldId!]?._selectedValues || [];
                    const isSelected = currentValues.includes(option.value);
                    
                    return (
                      <MenuItem
                        key={option.value}
                        onClick={() => handleOptionSelect(option.value)}
                        selected={isSelected}
                        sx={{
                          minWidth: 300,
                          py: 1.5,
                          px: 2,
                          whiteSpace: 'normal',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1
                        }}
                      >
                        {section.fields.find(f => f.id === menuState.fieldId)?.type === 'multiSelect' && (
                          <Checkbox
                            checked={isSelected}
                            sx={{ p: 0.5, alignSelf: 'flex-start' }}
                            tabIndex={-1}
                          />
                        )}
                        <Box>
                          <Typography variant="body1">{option.label}</Typography>
                          {option.description && (
                            <Typography variant="body2" color="text.secondary">
                              {option.description}
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    );
                  })}
                  {section.fields.find(f => f.id === menuState.fieldId)?.allowOther && (
                    <MenuItem onClick={() => handleOptionSelect('other')}>
                      Other...
                    </MenuItem>
                  )}
                </MenuList>
              </Paper>
            </ClickAwayListener>
          </div>
        </div>
      )}

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {menuState.fieldId && section.fields.find(f => f.id === menuState.fieldId)?.label}
          {menuState.fieldId && section.fields.find(f => f.id === menuState.fieldId)?.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {section.fields.find(f => f.id === menuState.fieldId)?.description}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {menuState.fieldId && section.fields.find(f => f.id === menuState.fieldId)?.type === 'textArea' ? (
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              placeholder={section.fields.find(f => f.id === menuState.fieldId)?.placeholder}
              helperText={section.fields.find(f => f.id === menuState.fieldId)?.description}
            />
          ) : menuState.fieldId && section.fields.find(f => f.id === menuState.fieldId)?.type === 'number' ? (
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              type="number"
              variant="outlined"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              placeholder={section.fields.find(f => f.id === menuState.fieldId)?.placeholder}
              helperText={section.fields.find(f => f.id === menuState.fieldId)?.description}
              inputProps={{
                min: section.fields.find(f => f.id === menuState.fieldId)?.validation?.find(v => v.type === 'min')?.value,
                max: section.fields.find(f => f.id === menuState.fieldId)?.validation?.find(v => v.type === 'max')?.value,
              }}
            />
          ) : menuState.fieldId && section.fields.find(f => f.id === menuState.fieldId)?.type === 'date' ? (
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              type="date"
              variant="outlined"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              helperText={section.fields.find(f => f.id === menuState.fieldId)?.description}
              InputLabelProps={{
                shrink: true,
              }}
            />
          ) : (
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              variant="outlined"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              placeholder={section.fields.find(f => f.id === menuState.fieldId)?.placeholder}
              helperText={section.fields.find(f => f.id === menuState.fieldId)?.description}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button 
            onClick={handleOtherSubmit} 
            variant="contained" 
            color="primary"
            disabled={!otherValue.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
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