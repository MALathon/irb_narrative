import { Option } from '../../../types/form';

// Clinical domain options
export const CLINICAL_DOMAIN_OPTIONS: Option[] = [
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'endocrinology', label: 'Endocrinology' },
  { value: 'gastroenterology', label: 'Gastroenterology' },
  { value: 'internal_medicine', label: 'Internal Medicine' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'pathology', label: 'Pathology' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'radiology', label: 'Radiology' }
];

// Data related options
export const DATA_SOURCE_OPTIONS: Option[] = [
  { value: 'internal_ehr', label: 'Internal EHR Data' },
  { value: 'external_dua', label: 'External Data (with DUA)' },
  { value: 'public_datasets', label: 'Public Datasets' },
  { value: 'prospective_data', label: 'Prospective Data Collection' }
];

export const DATA_FORMAT_OPTIONS: Option[] = [
  { value: 'structured', label: 'Structured Data' },
  { value: 'unstructured', label: 'Unstructured Data' },
  { value: 'imaging', label: 'Imaging Data' },
  { value: 'mixed', label: 'Mixed Data Types' }
];

// Security and privacy options
export const SECURITY_MEASURES_OPTIONS: Option[] = [
  { value: 'encryption', label: 'Data Encryption' },
  { value: 'access_controls', label: 'Access Controls' },
  { value: 'audit_logging', label: 'Audit Logging' },
  { value: 'secure_transfer', label: 'Secure Data Transfer' }
];

export const IDENTIFIABILITY_LEVEL_OPTIONS: Option[] = [
  { value: 'identified', label: 'Identified' },
  { value: 'limited_dataset', label: 'Limited Dataset' },
  { value: 'deidentified', label: 'De-identified' },
  { value: 'anonymized', label: 'Anonymized' }
];

export const DEIDENTIFICATION_METHOD_OPTIONS: Option[] = [
  { value: 'safe_harbor', label: 'Safe Harbor Method' },
  { value: 'expert_determination', label: 'Expert Determination' },
  { value: 'statistical', label: 'Statistical De-identification' },
  { value: 'hybrid', label: 'Hybrid Approach' }
];

// Study and algorithm options
export const STUDY_TYPE_OPTIONS: Option[] = [
  { value: 'algorithm_development', label: 'Algorithm Development' },
  { value: 'clinical_validation', label: 'Clinical Validation' },
  { value: 'comparative_analysis', label: 'Comparative Analysis' },
  { value: 'feasibility', label: 'Feasibility Study' }
];

export const ALGORITHM_TYPE_OPTIONS: Option[] = [
  { value: 'prediction', label: 'Prediction Model' },
  { value: 'classification', label: 'Classification Algorithm' },
  { value: 'nlp', label: 'Natural Language Processing' },
  { value: 'imaging', label: 'Image Analysis' },
  { value: 'optimization', label: 'Clinical Optimization' }
];

export const CLINICAL_IMPACT_OPTIONS: Option[] = [
  { value: 'diagnosis', label: 'Diagnosis' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'prognosis', label: 'Prognosis' },
  { value: 'workflow', label: 'Clinical Workflow' },
  { value: 'cost', label: 'Cost Reduction' }
];

// Population related options
export const POPULATION_TYPE_OPTIONS: Option[] = [
  { value: 'general', label: 'General Population' },
  { value: 'specific_condition', label: 'Specific Condition' },
  { value: 'age_group', label: 'Age Group' },
  { value: 'high_risk', label: 'High Risk Population' }
];

export const INCLUSION_CRITERIA_OPTIONS: Option[] = [
  { value: 'age_range', label: 'Age Range' },
  { value: 'diagnosis', label: 'Specific Diagnosis' },
  { value: 'lab_values', label: 'Laboratory Values' },
  { value: 'medications', label: 'Medications' },
  { value: 'procedures', label: 'Procedures' }
];

export const EXCLUSION_CRITERIA_OPTIONS: Option[] = [
  { value: 'comorbidities', label: 'Comorbidities' },
  { value: 'contraindications', label: 'Contraindications' },
  { value: 'pregnancy', label: 'Pregnancy' },
  { value: 'prior_treatment', label: 'Prior Treatment' },
  { value: 'study_participation', label: 'Other Study Participation' }
];

// Access control options
export const ACCESS_CONTROL_OPTIONS: Option[] = [
  { value: 'role_based', label: 'Role-Based Access Control' },
  { value: 'multi_factor', label: 'Multi-Factor Authentication' },
  { value: 'ip_restriction', label: 'IP Address Restriction' },
  { value: 'time_based', label: 'Time-Based Access' },
  { value: 'group_based', label: 'Group-Based Permissions' }
];

// Fairness and bias options
export const FAIRNESS_METRICS_OPTIONS: Option[] = [
  { value: 'demographic_parity', label: 'Demographic Parity' },
  { value: 'equal_opportunity', label: 'Equal Opportunity' },
  { value: 'equalized_odds', label: 'Equalized Odds' },
  { value: 'predictive_parity', label: 'Predictive Parity' },
  { value: 'calibration', label: 'Calibration by Group' }
];

export const PROTECTED_ATTRIBUTES_OPTIONS: Option[] = [
  { value: 'age', label: 'Age' },
  { value: 'gender', label: 'Gender' },
  { value: 'race', label: 'Race/Ethnicity' },
  { value: 'socioeconomic', label: 'Socioeconomic Status' },
  { value: 'geography', label: 'Geographic Location' },
  { value: 'disability', label: 'Disability Status' },
  { value: 'language', label: 'Primary Language' }
]; 