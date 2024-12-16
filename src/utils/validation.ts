import { FieldValue, ValidationRule, ValidationError, Sentence, FormValues, Field } from '../types/form';
import { getNestedValue } from './form';

export const validateValue = (value: FieldValue, rules?: ValidationRule[]): ValidationError[] => {
  if (!rules) return [];
  const errors: ValidationError[] = [];

  rules.forEach(rule => {
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '' || 
            (Array.isArray(value) && value.length === 0)) {
          errors.push({ message: rule.message, type: 'required' });
        }
        break;

      case 'min':
        if (typeof value === 'number' && value < (rule.value as number)) {
          errors.push({ message: rule.message, type: 'min' });
        }
        if (typeof value === 'string' && value.length < (rule.value as number)) {
          errors.push({ message: rule.message, type: 'min' });
        }
        if (Array.isArray(value) && value.length < (rule.value as number)) {
          errors.push({ message: rule.message, type: 'min' });
        }
        break;

      case 'max':
        if (typeof value === 'number' && value > (rule.value as number)) {
          errors.push({ message: rule.message, type: 'max' });
        }
        if (typeof value === 'string' && value.length > (rule.value as number)) {
          errors.push({ message: rule.message, type: 'max' });
        }
        if (Array.isArray(value) && value.length > (rule.value as number)) {
          errors.push({ message: rule.message, type: 'max' });
        }
        break;

      case 'pattern':
        if (typeof value === 'string' && !(rule.value as RegExp).test(value)) {
          errors.push({ message: rule.message, type: 'pattern' });
        }
        break;
    }
  });

  return errors;
};

export const validateField = (field: Field, value: FieldValue): ValidationError[] => {
  return validateValue(value, field.validation);
};

export const validateSentence = (
  sentence: Sentence,
  values: FormValues,
  path: string[] = []
): Record<string, ValidationError[]> => {
  let errors: Record<string, ValidationError[]> = {};

  // Validate fields in current sentence
  Object.entries(sentence.fields).forEach(([fieldId, field]) => {
    const fieldPath = [...path, fieldId];
    const value = getNestedValue(values, fieldPath);
    const fieldErrors = validateValue(value as FieldValue, field.validation);
    
    if (fieldErrors.length > 0) {
      errors[fieldPath.join('.')] = fieldErrors;
    }

    // Validate expansions if they exist and are triggered
    if (value && field.expansions?.[value as string]) {
      const expansionErrors = validateSentence(
        field.expansions[value as string],
        values,
        [...fieldPath, `expansion_${value}`]
      );
      errors = { ...errors, ...expansionErrors };
    }
  });

  // Validate child sentences
  sentence.children?.forEach((child, index) => {
    const childErrors = validateSentence(
      child,
      values,
      [...path, `child_${index}`]
    );
    errors = { ...errors, ...childErrors };
  });

  return errors;
};

export const isFormValid = (errors: Record<string, ValidationError[]>): boolean => {
  return Object.keys(errors).length === 0;
};

export const getFieldError = (
  errors: Record<string, ValidationError[]>,
  path: string[]
): string | undefined => {
  const fieldErrors = errors[path.join('.')];
  return fieldErrors?.[0]?.message;
}; 