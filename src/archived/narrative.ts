export type AttestationType = 'phase_1_limitation' | 'data_privacy' | 'security_control' | 'regulatory_compliance';

export interface Attestation {
  type: AttestationType;
  statement: string;
  severity: 'critical' | 'important' | 'advisory';
  requiresEvidence: boolean;
  regulatoryReference?: string;
}

export interface Option {
  value: string;
  label: string;
  description?: string;
  attestation?: Attestation;
}

export interface FieldOption {
  value: string;
  label: string;
  description?: string;
  additionalText?: string;
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

export interface OptionType {
  value: string;
  label: string;
  description?: string;
}

export interface Field {
  id: string;
  type: 'text' | 'select' | 'multiSelect' | 'radio' | 'checkbox' | 'number' | 'textArea' | 'autocompleteText';
  label: string;
  placeholder?: string;
  description?: string;
  helpText?: string;
  options?: Option[];
  required?: boolean;
  optional?: boolean;
  validation?: Validation[];
  dependsOn?: DependsOn;
  expansionFields?: { [key: string]: ExpansionField[] };
  allowCustom?: boolean;
  formatAttestation?: (values: string[]) => string;
  generateText?: (values: any) => string;
}

export interface DynamicField extends Field {
  freeSolo?: boolean;
  suggestions?: string[];
  validation?: Validation[];
  optional?: boolean;
}

export interface DynamicContent {
  condition: {
    fieldId: string;
    value: any;
    operator?: string;
  };
  content: string;
}

export interface ConditionalSection {
  condition: {
    fieldId: string;
    value: any;
    operator?: string;
  };
  template: string;
  fields?: Field[];
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
  dynamicContent?: DynamicContent[];
  conditionalSections?: ConditionalSection[];
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
  type: 'number' | 'select' | 'multiSelect' | 'text' | 'textArea' | 'date' | 'radio' | 'checkbox' | 'autocompleteText' | 'research_gap' | 'supporting_literature' | 'research_objective' | 'methodology_approach' | 'prior_evidence';
  label: string;
  placeholder?: string;
  description?: string;
  helpText?: string;
  options?: Option[];
  validation?: {
    type: 'required' | 'pattern' | 'custom' | 'min' | 'max';
    value?: any;
    message?: string;
  }[];
  required?: boolean;
  allowCustom?: boolean;
  freeSolo?: boolean;
} 