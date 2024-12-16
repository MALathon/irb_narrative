import { FormValues, FieldValue, Option } from '../types/form';

export const getDisplayValue = (value: FieldValue, options?: Option[]): string => {
  if (Array.isArray(value)) {
    return value
      .map(v => options?.find(opt => opt.value === v)?.label || v)
      .join(', ');
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (options?.length) {
    return options.find(opt => opt.value === value)?.label || String(value);
  }

  return String(value);
};

export const isFieldComplete = (value: FieldValue): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== undefined && value !== '' && value !== null;
};

export const getNestedValue = (obj: FormValues, path: string[]): FieldValue | FormValues => {
  return path.reduce<FormValues | FieldValue>((current, key) => 
    (current as FormValues)?.[key], 
    obj
  );
};

export const setNestedValue = (obj: FormValues, path: string[], value: FieldValue): FormValues => {
  const result = { ...obj };
  let current = result;
  
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {} as FormValues;
    } else {
      current[key] = { ...current[key] as FormValues };
    }
    current = current[key] as FormValues;
  }
  
  current[path[path.length - 1]] = value;
  return result;
}; 