export type FieldType = 'text' | 'select' | 'multiSelect' | 'number' | 'boolean';

export interface Option {
  value: string;
  label: string;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern';
  value?: any;
  message: string;
}

export interface ValidationError {
  message: string;
  type: string;
}

export type FieldValue = string | string[] | number | boolean | null;

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  options?: Option[];
  expansions?: Record<string, Sentence>;
  validation?: ValidationRule[];
  conditions?: {
    field: string;
    value: FieldValue;
    show?: string[];
    hide?: string[];
  }[];
}

export interface Sentence {
  template: string;
  fields: Record<string, Field>;
  children?: Sentence[];
  metadata?: {
    id: string;
    title?: string;
    description?: string;
  };
}

export interface Submodule {
  id: string;
  title: string;
  required: boolean;
  dependencies: string[];
  sentence: Sentence;
}

export interface ModuleConfig {
  id: string;
  name: string;
  description?: string;
  guidance?: string;
  submodules: Record<string, Submodule>;
  submoduleOrder: string[];
}

// Helper type to allow nested access with string paths
export type FormValues = {
  [key: string]: FieldValue | FormValues;
};

export type UpdateValueFn = (path: string[], value: FieldValue) => void; 