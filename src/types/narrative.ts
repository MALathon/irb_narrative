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

export interface OptionType {
  value: string;
  label: string;
  description?: string;
}

export interface Field {
  id: string;
  type: 'text' | 'textArea' | 'select' | 'multiSelect' | 'number' | 'date' | 'radio' | 'checkbox' | 'autocompleteText' | 'research_gap' | 'supporting_literature' | 'research_objective' | 'methodology_approach' | 'prior_evidence';
  label: string;
  placeholder?: string;
  description?: string;
  helpText?: string;
  options?: Option[];
  allowOther?: boolean;
  freeSolo?: boolean;
  suggestions?: string[];
  validation?: {
    type: string;
    value: any;
    message?: string;
  }[];
  required?: boolean;
  optional?: boolean;
  dependsOn?: {
    fieldId: string;
    value: any;
    operator: 'equals' | 'contains';
  };
  expansionFields?: {
    [key: string]: Field[];
  };
}

export interface DynamicField {
  id: string;
  type: 'number' | 'select' | 'multiSelect' | 'text' | 'textArea' | 'date' | 'radio' | 'checkbox' | 'autocompleteText';
  label: string;
  placeholder?: string;
  description?: string;
  options?: Option[];
  expansionFields?: {
    [key: string]: ExpansionField[];
  };
  allowOther?: boolean;
  freeSolo?: boolean;
  suggestions?: string[];
  validation?: {
    type: string;
    value: any;
    message?: string;
  }[];
  required?: boolean;
  optional?: boolean;
  dependsOn?: {
    fieldId: string;
    value: any;
    operator: 'equals' | 'contains';
  };
}

export interface NarrativeSection {
  id: string;
  moduleId: string;
  moduleName: string;
  title: string;
  description: string;
  guidance?: string;
  template: string;
  fields: Field[];
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

export interface ExpansionField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  description?: string;
  options?: Option[];
  validation?: Validation[];
  required?: boolean;
} 