export type FieldType = 
  | 'text' 
  | 'select' 
  | 'multiSelect' 
  | 'date' 
  | 'dateRange'
  | 'number' 
  | 'checkbox'
  | 'radio'
  | 'textArea'
  | 'other';

export interface FieldOption {
  value: string;
  label: string;
  additionalText?: string;
  triggers?: {
    showFields?: string[];
    showSections?: string[];
    requireFields?: string[];
  };
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  customValidator?: (value: any) => boolean;
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  options?: FieldOption[];
  validation?: ValidationRule[];
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  dependsOn?: {
    fieldId: string;
    value: any;
    condition?: 'equals' | 'contains' | 'greater' | 'less' | 'not';
  };
  metadata?: {
    isHIPAAIdentifier?: boolean;
    isSensitiveData?: boolean;
    category?: string;
    subcategory?: string;
    importance?: 'required' | 'optional';
  };
}

export interface DynamicContent {
  condition: {
    fieldId: string;
    value: any;
    operator?: 'equals' | 'contains' | 'in' | 'not' | 'greater' | 'less';
  };
  content: string;
  priority?: number; // For ordering multiple dynamic contents
}

export interface NarrativeSection {
  id: string;
  title: string;
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