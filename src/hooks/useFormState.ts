import { useState, useCallback } from 'react';
import { get, set, cloneDeep } from 'lodash';
import { ModuleConfig, FormValues, FieldValue, ValidationError, Field } from '../types/form';
import { validateSentence, validateValue } from '../utils/validation';
import { isFieldComplete } from '../utils/form';

interface UseFormStateReturn {
  values: FormValues;
  updateValue: (path: string[], value: FieldValue) => void;
  expandedPaths: string[];
  validation: ValidationState;
  validateField: (path: string[]) => ValidationError[];
  validateForm: () => boolean;
  isFieldVisible: (path: string[]) => boolean;
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

  let current: any = submodule.sentence;
  let parentField: Field | undefined;
  
  // Walk through the path to find the field, starting after the submodule ID
  for (let i = 1; i < path.length - 1; i++) {
    const segment = path[i];
    if (!current) break;
    
    // Handle expansion paths
    if (segment.startsWith('expansion_')) {
      const parentFieldId = path[i-1];
      parentField = current?.fields?.[parentFieldId];
      const expansionKey = segment.replace('expansion_', '');
      if (parentField?.expansions?.[expansionKey]) {
        current = parentField.expansions[expansionKey];
      }
    } else if (segment.startsWith('child_')) {
      const childIndex = parseInt(segment.replace('child_', ''));
      current = current?.children?.[childIndex];
    } else {
      current = current?.fields?.[segment];
    }
  }

  return {
    field: current?.fields?.[fieldId],
    fieldId,
    parentField
  };
};

export const useFormState = (
  module: ModuleConfig,
  initialValues: FormValues = {}
): UseFormStateReturn => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [expandedPaths, setExpandedPaths] = useState<string[]>([]);
  const [validation, setValidation] = useState<ValidationState>({
    errors: {},
    isValid: true
  });

  const validateField = useCallback((path: string[]): ValidationError[] => {
    const { field } = getFieldFromPath(module, path);
    const value = get(values, path.join('.')) as FieldValue;

    if (!field) return [];
    return validateValue(value, field.validation);
  }, [values, module]);

  const validateForm = useCallback((): boolean => {
    let allErrors: Record<string, ValidationError[]> = {};
    
    // Validate each submodule
    for (const submoduleId of module.submoduleOrder) {
      const submodule = module.submodules[submoduleId];
      const submoduleErrors = validateSentence(submodule.sentence, values);
      allErrors = { ...allErrors, ...submoduleErrors };
    }

    const isValid = Object.keys(allErrors).length === 0;
    setValidation({ errors: allErrors, isValid });
    return isValid;
  }, [values, module]);

  const checkVisibility = useCallback((path: string[]): boolean => {
    const { field, fieldId } = getFieldFromPath(module, path);
    if (!field) return true;

    // Always show root level fields
    if (path.length === 2) {
      return true;
    }

    // For expansion fields
    const expansionIndex = path.findIndex(p => p.startsWith('expansion_'));
    if (expansionIndex !== -1) {
      const parentPath = path.slice(0, expansionIndex);
      const parentValue = get(values, parentPath.join('.'));
      const expansionKey = path[expansionIndex].replace('expansion_', '');
      return parentValue === expansionKey;
    }

    return checkFieldVisibility(field, fieldId, values);
  }, [values, module]);

  const updateValue = useCallback((path: string[], value: FieldValue) => {
    setValues(prev => {
      const newValues = cloneDeep(prev);
      const { field } = getFieldFromPath(module, path);
      const pathStr = path.join('.');
      
      // Set the new value
      set(newValues, pathStr, value);
      
      // Handle expansions recursively
      const expansionIndex = path.findIndex(p => p.startsWith('expansion_'));
      const isExpansionField = expansionIndex !== -1;
      
      if (field?.expansions && !isExpansionField) {
        const oldValue = get(prev, pathStr);
        if (oldValue !== value) {
          // Only clear expansion values for options that are no longer selected
          Object.keys(field.expansions).forEach(expansionKey => {
            // Skip clearing if this is the newly selected value
            if (expansionKey === value) return;
            
            const expansionPath = [...path, `expansion_${expansionKey}`].join('.');
            const expansionFields = field.expansions?.[expansionKey]?.fields || {};
            
            // Clear all nested fields recursively
            Object.keys(expansionFields).forEach(fieldKey => {
              const nestedPath = `${expansionPath}.${fieldKey}`;
              if (get(newValues, nestedPath)) {
                set(newValues, nestedPath, undefined);
              }
            });
          });
        }
      }
      
      return newValues;
    });

    // Update expanded paths
    const pathStr = path.join('.');
    setExpandedPaths(prev => {
      const newPaths = prev.filter(p => !p.startsWith(`${pathStr}.`));
      if (isFieldComplete(value)) {
        newPaths.push(pathStr);
      }
      return newPaths;
    });

    // Validate the updated field
    const fieldErrors = validateField(path);
    setValidation(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [pathStr]: fieldErrors
      },
      isValid: Object.keys(prev.errors).length === 0 && fieldErrors.length === 0
    }));
  }, [validateField, module, getFieldFromPath]);

  return {
    values,
    updateValue,
    expandedPaths,
    validation,
    validateField,
    validateForm,
    isFieldVisible: checkVisibility
  };
}; 