export interface FieldOption {
  value: string;
  label: string;
  description?: string;
  additionalText?: string;
  triggers?: {
    showFields: string[];
  };
}

export interface Option {
  value: string;
  label: string;
  description?: string;
  triggers?: {
    showFields: string[];
  };
}

export interface ValidationStatus {
  errors: { [key: string]: string[] };
}

export interface ModuleCompletionStatus {
  total: number;
  completed: number;
  required: number;
  completedRequired: number;
  hasWarnings: boolean;
  isComplete: boolean;
}

export interface NarrativeState {
  [key: string]: any;
}

export interface Validation {
  type: 'required' | 'pattern' | 'custom' | 'min' | 'max';
  message: string;
  value?: any;
}

export interface DependsOn {
  fieldId: string;
  value: any;
  operator?: 'equals' | 'contains' | 'not' | 'in' | 'exists';
}

export interface Field {
  id: string;
  type: 'number' | 'select' | 'multiSelect' | 'text' | 'textArea' | 'date' | 'radio' | 'checkbox';
  label: string;
  placeholder?: string;
  description?: string;
  options?: Option[];
  allowOther?: boolean;
  optional?: boolean;
  required?: boolean;
  hidden?: boolean;
  noLabel?: boolean;
  helpText?: string;
  validation?: Validation[];
  dependsOn?: DependsOn;
  expansionFields?: { [key: string]: Field[] };
  generateText?: (values: any) => string;
}

export interface NarrativeSection {
  id: string;
  moduleId: string;
  moduleName: string;
  title: string;
  description?: string;
  guidance?: string;
  template: string;
  fields: Field[];
  dynamicContent?: {
    condition: {
      fieldId: string;
      value: any;
      operator?: string;
    };
    content: string;
  }[];
  conditionalSections?: NarrativeSection[];
}

export interface NarrativeModule {
  id: string;
  name: string;
  sections: NarrativeSection[];
}

export interface NarrativeSchema {
  sections: NarrativeSection[];
  metadata?: {
    version: string;
    lastUpdated: string;
    institution: string;
    type: string;
  };
} 