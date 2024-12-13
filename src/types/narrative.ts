export interface Field {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string; triggers?: { showFields: string[] } }>;
  validation?: Array<{
    type: string;
    message: string;
    value?: any;
    customValidator?: (value: any) => boolean;
  }>;
  dependsOn?: {
    fieldId: string;
    value?: any;
    operator?: string;
    condition?: string;
  };
  helpText?: string;
  metadata?: {
    category: string;
    importance: 'required' | 'recommended' | 'optional';
  };
}

export interface NarrativeSection {
  id: string;
  title: string;
  moduleId: string;
  moduleName: string;
  description?: string;
  template: string;
  fields: Field[];
  dynamicContent?: DynamicContent[];
  conditionalSections?: Array<{
    condition: {
      fieldId: string;
      value: any;
      operator?: 'equals' | 'contains' | 'in' | 'not';
    };
    template: string;
    fields: Field[];
  }>;
  metadata?: {
    category: string;
    importance: 'required' | 'recommended' | 'optional';
    reviewerNotes?: string;
  };
}

export interface NarrativeModule {
  id: string;
  name: string;
  sections: NarrativeSection[];
}

export interface NarrativeSchema {
  sections: NarrativeSection[];
  metadata: {
    version: string;
    lastUpdated: string;
    institution: string;
    type: 'AI/ML' | 'Clinical' | 'Other';
  };
}

export interface NarrativeState {
  [fieldId: string]: any;
  _metadata?: {
    lastUpdated: string;
    completionStatus: {
      [sectionId: string]: {
        completed: boolean;
        missingRequired?: string[];
      };
    };
    reviewStatus?: {
      status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected';
      comments?: string[];
    };
  };
}

export interface DynamicContent {
  condition: {
    fieldId: string;
    value: any;
    operator?: string;
  };
  content: string;
}

export interface DynamicSectionProps {
  section: NarrativeSection;
  values: { [key: string]: any };
  onUpdate: (fieldId: string, value: any) => void;
  errors?: { [fieldId: string]: string[] };
}

export type ValidationStatus = {
  isValid: boolean;
  errors: { [fieldId: string]: string[] };
  warnings: { [fieldId: string]: string[] };
  missingRequired: string[];
};

export interface NarrativeValidation {
  validateSection: (section: NarrativeSection, values: NarrativeState) => ValidationStatus;
  validateAll: (schema: NarrativeSchema, values: NarrativeState) => ValidationStatus;
}

export interface ModuleCompletionStatus {
  total: number;
  completed: number;
  required: number;
  completedRequired: number;
  hasWarnings: boolean;
  isComplete: boolean;
}

export interface FieldOption {
  value: string;
  label: string;
  additionalText?: string;
} 