import { useState, useCallback, useMemo } from 'react';
import { get, set, cloneDeep } from 'lodash';
import { ModuleConfig, FormValues, FieldValue, ValidationError, Field } from '../types/form';
import { validateSentence, validateValue } from '../utils/validation';

interface UseFormStateReturn {
  values: FormValues;
  updateValue: (path: string[], value: FieldValue) => void;
  expandedPaths: string[];
  validation: ValidationState;
  validateField: (path: string[]) => ValidationError[];
  validateForm: () => boolean;
  isFieldVisible: (path: string[]) => boolean;
  setExpandedPaths: React.Dispatch<React.SetStateAction<string[]>>;
}

interface ValidationState {
  errors: Record<string, ValidationError[]>;
  isValid: boolean;
}

const evaluateCondition = (
  condition: { field: string; value: FieldValue },
  values: FormValues
): boolean => {
  const conditionValue = get(values, condition.field);
  
  if (Array.isArray(condition.value)) {
    return Array.isArray(conditionValue) && 
      condition.value.some(v => conditionValue.includes(v));
  }
  
  return conditionValue === condition.value;
};

const checkFieldVisibility = (
  field: { conditions?: { field: string; value: FieldValue; show?: string[]; hide?: string[]; }[] },
  fieldId: string,
  values: FormValues
): boolean => {
  // If no conditions, always show the field
  if (!field.conditions?.length) {
    return true;
  }

  // Check hide conditions first - these take precedence
  const hideConditions = field.conditions.filter(condition => condition.hide?.includes(fieldId));
  if (hideConditions.length > 0) {
    const isHidden = hideConditions.some(condition => evaluateCondition(condition, values));
    if (isHidden) return false;
  }

  // Check show conditions
  const showConditions = field.conditions.filter(condition => condition.show?.includes(fieldId));
  if (showConditions.length > 0) {
    return showConditions.some(condition => evaluateCondition(condition, values));
  }

  // If there are conditions but no explicit show/hide rules for this field,
  // show the field by default
  return true;
};

const getFieldFromPath = (
  module: ModuleConfig,
  path: string[]
): { field?: Field; fieldId: string; parentField?: Field } => {
  const fieldId = path[path.length - 1];
  const submoduleId = path[0];
  const submodule = module.submodules[submoduleId];
  
  if (!submodule?.sentence) {
    return { fieldId };
  }

  interface CurrentContext {
    fields?: Record<string, Field>;
    children?: CurrentContext[];
    template?: string;
    expansions?: Record<string, {
      fields: Record<string, Field>;
      children: CurrentContext[];
      template: string;
    }>;
  }

  let current: CurrentContext = submodule.sentence;
  let parentField: Field | undefined;
  let lastParentField: Field | undefined;
  
  for (let i = 1; i < path.length - 1; i++) {
    const segment = path[i];
    if (!current) break;
    
    if (segment.startsWith('expansion_')) {
      const parentFieldId = path[i-1];
      
      if (current.fields?.[parentFieldId]) {
        parentField = current.fields[parentFieldId];
        lastParentField = parentField;
      } else {
        return { fieldId };
      }

      const expansionKey = segment.replace('expansion_', '');

      if (!parentField.expansions) {
        parentField.expansions = {};
      }

      if (!(expansionKey in parentField.expansions)) {
        parentField.expansions[expansionKey] = {
          fields: {},
          children: [],
          template: ''
        };
      }

      current = parentField.expansions[expansionKey];
      
      if (!current.fields) {
        current.fields = {};
      }
      
      if (i === path.length - 2) {
        const field = current.fields[fieldId];
        
        if (!field && parentField.expansions[expansionKey].fields?.[fieldId]) {
          const def = parentField.expansions[expansionKey].fields[fieldId];
          current.fields[fieldId] = {
            ...def,
            id: fieldId,
            type: def.type || 'text',
            label: def.label || fieldId,
            validation: def.validation || []
          };
        }
        
        return {
          field: current.fields[fieldId],
          fieldId,
          parentField: lastParentField
        };
      }
    } else if (segment.startsWith('child_')) {
      const childIndex = parseInt(segment.replace('child_', ''));
      const currentContext = current as CurrentContext;
      lastParentField = currentContext.fields?.[path[i+1]];
      current = currentContext.children?.[childIndex] || { fields: {}, children: [] };
    } else {
      const currentContext = current as CurrentContext;
      const nextField = currentContext.fields?.[segment];
      if (nextField) {
        lastParentField = currentContext.fields?.[segment];
        current = { fields: { [segment]: nextField }, children: [] };
      } else {
        return { fieldId };
      }
    }
  }

  const field = current?.fields?.[fieldId];
  return {
    field,
    fieldId,
    parentField: lastParentField
  };
};

export const useFormState = (
  config: ModuleConfig,
  initialValues: FormValues = {}
): UseFormStateReturn => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [expandedPaths, setExpandedPaths] = useState<string[]>([]);
  const [validation, setValidation] = useState<ValidationState>({
    errors: {},
    isValid: false
  });

  const updateValue = useCallback((path: string[], value: FieldValue) => {
    const parentPath = path.slice(0, -1);
    const expansionSegment = path.find(p => p.startsWith('expansion_'));
    
    setValues(prevValues => {
      const newValues = cloneDeep(prevValues);
      
      // If this is an expansion field update
      if (expansionSegment) {
        const parentPathStr = parentPath.join('.');
        const originalParentPath = path.slice(0, path.indexOf(expansionSegment));
        const originalParentValue = get(newValues, originalParentPath.join('.'));
        
        // Get current parent value
        const currentParentValue = get(newValues, parentPathStr);
        
        // Create or update parent object
        const updatedParentValue: { value?: FieldValue; [key: string]: FieldValue | FormValues | undefined } = 
          typeof currentParentValue === 'object' && currentParentValue !== null
            ? Object.entries(currentParentValue).reduce((acc, [key, val]) => ({
                ...acc,
                [key]: val
              }), {} as { [key: string]: FieldValue | FormValues | undefined })
            : {};
        
        // Always ensure the original value is preserved
        if (typeof originalParentValue !== 'object' || originalParentValue === null) {
          updatedParentValue.value = originalParentValue;
        }
        
        // Set the parent object first
        set(newValues, parentPathStr, updatedParentValue);
        
        // Then set the expansion field value
        set(newValues, path.join('.'), value);
        
        return newValues;
      }
      
      // For non-expansion fields
      const currentValue = get(newValues, path.join('.'));
      if (typeof currentValue === 'object' && currentValue !== null) {
        // Preserve expansion fields when updating a parent
        const expansionFields = Object.entries(currentValue)
          .filter(([key]) => key.startsWith('expansion_'))
          .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});
          
        set(newValues, path.join('.'), {
          value,
          ...expansionFields
        });
      } else {
        set(newValues, path.join('.'), value);
      }
      
      return newValues;
    });

    // Update expanded paths when a value changes
    const pathStr = path.join('.');
    setExpandedPaths(prev => prev.includes(pathStr) ? prev : [...prev, pathStr]);
  }, [values]);

  const validateField = useCallback((path: string[]): ValidationError[] => {
    const { field } = getFieldFromPath(config, path);
    if (!field) return [];
    
    const value = get(values, path.join('.')) as FieldValue;
    return validateValue(value, field.validation || []);
  }, [config, values]);

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, ValidationError[]> = {};
    let isValid = true;

    // Validate each submodule
    for (const submoduleId of config.submoduleOrder) {
      const submodule = config.submodules[submoduleId];
      const submoduleErrors = validateSentence(submodule.sentence, values);
      Object.assign(errors, submoduleErrors);
      if (Object.keys(submoduleErrors).length > 0) {
        isValid = false;
      }
    }

    setValidation({ errors, isValid });
    return isValid;
  }, [config, values]);

  const isFieldVisible = useCallback((path: string[]): boolean => {
    const { field, fieldId } = getFieldFromPath(config, path);
    if (!field) return false;

    return checkFieldVisibility(field, fieldId, values);
  }, [config, values]);

  const memoizedReturn = useMemo(() => ({
    values,
    updateValue,
    expandedPaths,
    validation,
    validateField,
    validateForm,
    isFieldVisible,
    setExpandedPaths
  }), [
    values,
    updateValue,
    expandedPaths,
    validation,
    validateField,
    validateForm,
    isFieldVisible,
    setExpandedPaths
  ]);

  return memoizedReturn;
}; 