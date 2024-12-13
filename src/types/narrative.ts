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

export interface Field {
  id: string;
  type: 'select' | 'multiSelect' | 'text' | 'textArea' | 'date' | 'radio' | 'number' | 'checkbox';
  label: string;
  placeholder?: string;
  description?: string;
  helpText?: string;
  options?: Option[];
  allowOther?: boolean;
  validation?: {
    type: 'required' | 'pattern' | 'custom' | 'min' | 'max';
    message: string;
    value?: any;
  }[];
  dependsOn?: {
    fieldId: string;
    value: any;
    operator?: 'equals' | 'contains' | 'not' | 'in' | 'exists';
    condition?: string;
  };
  optional?: boolean;
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