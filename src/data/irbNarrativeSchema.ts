import { NarrativeModule, Option, ExpansionField } from '../types/narrative';

// Common field definitions
export const CLINICAL_DOMAIN_OPTIONS = [
  { value: 'cardiology', label: 'Cardiology', description: 'Heart and cardiovascular system care' },
  { value: 'dermatology', label: 'Dermatology', description: 'Skin conditions and disorders' },
  { value: 'endocrinology', label: 'Endocrinology', description: 'Hormone and metabolic disorders' },
  { value: 'gastroenterology', label: 'Gastroenterology', description: 'Digestive system disorders' },
  { value: 'internal_medicine', label: 'Internal Medicine', description: 'General adult medical care' },
  { value: 'neurology', label: 'Neurology', description: 'Brain and nervous system disorders' },
  { value: 'oncology', label: 'Oncology', description: 'Cancer diagnosis and treatment' },
  { value: 'orthopedics', label: 'Orthopedics', description: 'Bone and joint conditions' },
  { value: 'pathology', label: 'Pathology', description: 'Laboratory diagnosis and tissue analysis' },
  { value: 'pediatrics', label: 'Pediatrics', description: 'Care for children and adolescents' },
  { value: 'psychiatry', label: 'Psychiatry', description: 'Mental health and behavioral disorders' },
  { value: 'radiology', label: 'Radiology', description: 'Medical imaging and diagnostics' }
];

export const DATA_FORMAT_OPTIONS = [
  { value: 'structured_clinical', label: 'structured clinical data', description: 'Organized data like lab results, vital signs, and medications' },
  { value: 'imaging', label: 'medical imaging data', description: 'Medical images like X-rays, MRIs, and CT scans' },
  { value: 'genomic', label: 'genomic and molecular data', description: 'Genetic and molecular information from lab tests' },
  { value: 'textual', label: 'unstructured clinical notes', description: 'Free-text notes and reports from healthcare providers' }
];

export const DATA_VOLUME_OPTIONS = [
  { value: 'small', label: 'a small dataset (less than 1GB)', description: 'Equivalent to about 200,000 pages of text' },
  { value: 'moderate', label: 'a moderate dataset (1GB to 100GB)', description: 'Equivalent to about 20 million pages of text' },
  { value: 'large', label: 'a large dataset (more than 100GB)', description: 'Larger than 20 million pages of text' }
];

export const IDENTIFIABILITY_LEVEL_OPTIONS = [
  { value: 'fully_deidentified', label: 'fully de-identified using HIPAA Safe Harbor method', description: 'All personal identifiers removed following HIPAA guidelines' },
  { value: 'limited_dataset', label: 'a Limited Dataset containing only approved indirect identifiers', description: 'Contains only dates and geographic information as allowed by HIPAA' },
  { value: 'coded', label: 'coded with a secure key management system', description: 'Uses codes instead of identifiers with secure key storage' },
  { value: 'identifiable', label: 'identifiable with strict access controls', description: 'Contains identifiable information with strict protections' }
];

export const SECURITY_MEASURES_OPTIONS = [
  { value: 'encryption', label: 'end-to-end encryption', description: 'Data is encrypted during storage and transmission' },
  { value: 'access_controls', label: 'role-based access controls', description: 'Access is restricted based on user roles' },
  { value: 'secure_transfer', label: 'secure data transfer protocols', description: 'Data transfers use secure, encrypted methods' },
  { value: 'audit_logging', label: 'comprehensive audit logging', description: 'All data access is tracked and monitored' },
  { value: 'phi_monitoring', label: 'PHI access monitoring', description: 'Special monitoring for protected health information' }
];

export const SENSITIVE_CATEGORIES_OPTIONS = [
  { value: 'genetic', label: 'genetic information', description: 'DNA, RNA, and other genetic test results' },
  { value: 'mental_health', label: 'mental health', description: 'Psychiatric and psychological health information' },
  { value: 'substance_abuse', label: 'substance abuse', description: 'Drug and alcohol use disorder information' },
  { value: 'hiv', label: 'HIV/AIDS', description: 'HIV/AIDS status and treatment information' },
  { value: 'reproductive', label: 'reproductive health', description: 'Pregnancy and reproductive care information' },
  { value: 'abuse', label: 'abuse-related information', description: 'Information about abuse or violence' }
];

export const CLINICAL_SETTING_OPTIONS = [
  { value: 'outpatient_clinic', label: 'outpatient clinic', description: 'Regular clinic visits' },
  { value: 'inpatient_ward', label: 'inpatient ward', description: 'Hospital ward setting' },
  { value: 'emergency_dept', label: 'emergency department', description: 'Emergency/urgent care setting' },
  { value: 'specialty_clinic', label: 'specialty clinic', description: 'Specialized medical clinics' },
  { value: 'research_center', label: 'dedicated research center', description: 'Research-specific facility' },
  { value: 'telehealth', label: 'telehealth platform', description: 'Remote healthcare setting' }
];

// Add to common field definitions
const DIAGNOSIS_OPTIONS = [
  { value: 'cardiovascular_disease', label: 'cardiovascular disease', description: 'Heart and blood vessel conditions including hypertension, arrhythmias' },
  { value: 'cancer', label: 'cancer', description: 'All types of cancer and neoplastic diseases' },
  { value: 'neurological_disorders', label: 'neurological disorders', description: 'Brain, spine, and nervous system conditions' },
  { value: 'chronic_conditions', label: 'chronic conditions', description: 'Long-term conditions requiring ongoing management' },
  { value: 'infectious_diseases', label: 'infectious diseases', description: 'Bacterial, viral, and other pathogenic infections' },
  { value: 'autoimmune_disorders', label: 'autoimmune disorders', description: 'Conditions where immune system attacks healthy cells' },
  { value: 'metabolic_disorders', label: 'metabolic disorders', description: 'Conditions affecting metabolism and endocrine system' },
  { value: 'mental_health', label: 'mental health conditions', description: 'Psychiatric and psychological disorders' }
];

// Add to common field definitions
const RESEARCH_APPROACH_OPTIONS = [
  { value: 'explainable_AI_techniques', label: 'explainable AI techniques', description: 'AI methods that provide clear reasoning for decisions' },
  { value: 'federated_learning_methods', label: 'federated learning methods', description: 'Distributed learning across multiple data sources' },
  { value: 'hybrid_machine_learning_approaches', label: 'hybrid machine learning approaches', description: 'Combining multiple AI/ML techniques' },
  { value: 'novel_deep_learning_architectures', label: 'novel deep learning architectures', description: 'New neural network designs and structures' },
  { value: 'reinforcement_learning', label: 'reinforcement learning methods', description: 'AI that learns through trial and error' },
  { value: 'natural_language_processing', label: 'natural language processing', description: 'AI for understanding and generating text' }
];

const APPROACH_JUSTIFICATION_OPTIONS = [
  { value: 'strong_theoretical_foundations', label: 'strong theoretical foundations and simulations', description: 'Based on established mathematical principles' },
  { value: 'successful_preliminary_studies', label: 'successful preliminary studies', description: 'Promising results from initial testing' },
  { value: 'demonstrated_effectiveness', label: 'demonstrated effectiveness in similar contexts', description: 'Success in related applications' },
  { value: 'validated_performance_metrics', label: 'validated performance metrics', description: 'Clear measures of success' },
  { value: 'expert_recommendations', label: 'expert recommendations', description: 'Supported by domain experts' },
  { value: 'industry_adoption', label: 'industry adoption in similar areas', description: 'Used successfully in related fields' }
];

// Add before other constants
const ATTESTATION_TYPES = {
  PHASE_1_LIMITATION: 'phase_1_limitation',
  DATA_PRIVACY: 'data_privacy',
  SECURITY_CONTROL: 'security_control',
  REGULATORY_COMPLIANCE: 'regulatory_compliance'
} as const;

// Update PHASE_LIMITATION_OPTIONS
const PHASE_LIMITATION_OPTIONS = [
  { 
    value: 'no_clinical_deployment', 
    label: 'will not be deployed in clinical settings', 
    description: 'Not deployed in clinical settings',
    attestation: {
      type: ATTESTATION_TYPES.PHASE_1_LIMITATION,
      statement: 'will not be deployed in clinical settings',
      severity: 'critical' as const,
      requiresEvidence: false,
      regulatoryReference: 'IRB Phase 1 Guidelines'
    }
  },
  { 
    value: 'no_medical_decisions', 
    label: 'will not be used for medical decision-making', 
    description: 'Not used for medical decision-making',
    attestation: {
      type: ATTESTATION_TYPES.PHASE_1_LIMITATION,
      statement: 'will not be used for medical decision-making',
      severity: 'critical' as const,
      requiresEvidence: false,
      regulatoryReference: 'IRB Phase 1 Guidelines'
    }
  },
  { 
    value: 'discovery_only', 
    label: 'is limited to discovery and validation', 
    description: 'Limited to discovery and validation',
    attestation: {
      type: ATTESTATION_TYPES.PHASE_1_LIMITATION,
      statement: 'is limited to discovery and validation',
      severity: 'critical' as const,
      requiresEvidence: false,
      regulatoryReference: 'IRB Phase 1 Guidelines'
    }
  },
  { 
    value: 'no_patient_contact', 
    label: 'involves no direct patient contact', 
    description: 'No direct patient contact',
    attestation: {
      type: ATTESTATION_TYPES.PHASE_1_LIMITATION,
      statement: 'involves no direct patient contact',
      severity: 'critical' as const,
      requiresEvidence: false,
      regulatoryReference: 'IRB Phase 1 Guidelines'
    }
  }
];

// Add before other constants
const ACCESS_CONTROL_OPTIONS = [
  { value: 'role_based', label: 'role-based access control (RBAC)', description: 'Different permissions for different user roles' },
  { value: 'mfa', label: 'multi-factor authentication (MFA)', description: 'Multiple steps to verify identity' },
  { value: 'audit_trails', label: 'detailed audit trails', description: 'Comprehensive logging of all access' },
  { value: 'time_limited', label: 'time-limited access grants', description: 'Access expires after set period' },
  { value: 'ip_restricted', label: 'IP address restrictions', description: 'Access limited to specific networks' },
  { value: 'device_control', label: 'approved device restrictions', description: 'Access limited to approved devices' }
];

export interface ExpansionContent {
  sentence: string;
  fields?: ExpansionField[];
}

export interface ExpansionMapping {
  [key: string]: {
    [value: string]: ExpansionContent;
  };
}

// Define expansion mappings for each data source
export const EXPANSION_MAPPINGS: ExpansionMapping = {
  data_sources: {
    'external_dua': {
      sentence: "External data will be acquired from {external_provider} under a {dua_type}. This data will be in {data_format} format with an estimated volume of {data_volume}. The data will be {identifiability_level} with {security_measures} in place. The data includes sensitive information related to {sensitive_categories}."
    },
    'public_datasets': {
      sentence: "For the public dataset, named {dataset_name}, which is {dataset_access_type} and maintained by {data_maintainer}. This data will be in {data_format} format with an estimated volume of {data_volume}. The data will be {identifiability_level}."
    },
    'internal_ehr': {
      sentence: "Internal EHR data will be derived from Mayo Clinic's secure clinical repositories in the following domains: {clinical_domain}. This data will be in {data_format} format with an estimated volume of {data_volume}. The data will be {identifiability_level} with {security_measures} in place. The data includes sensitive information related to {sensitive_categories}."
    },
    'prospective_data': {
      sentence: "Prospectively, we will collect data from approximately {participant_count} participants through {collection_method} in {clinical_setting}. This data will be in {data_format} format with an estimated volume of {data_volume}. The data will be {identifiability_level} with {security_measures} in place. The data includes sensitive information related to {sensitive_categories}."
    }
  }
};

// Define fields for each data source
export const EXPANSION_FIELDS: { [key: string]: ExpansionField } = {
  external_provider: {
    id: 'external_provider',
    type: 'text',
    label: 'External Provider',
    placeholder: 'Enter the name of the external data provider',
    description: 'The organization or institution providing the external data',
    helpText: 'This is the organization that owns and will provide the data. Make sure you have their correct legal name.',
    allowCustom: true
  },
  dua_type: {
    id: 'dua_type',
    type: 'select',
    label: 'DUA Type',
    options: [
      { value: 'standard', label: 'standard institutional DUA', description: 'A typical agreement between research institutions' },
      { value: 'custom', label: 'custom negotiated DUA', description: 'A specially negotiated agreement for unique requirements' },
      { value: 'federal', label: 'federal DUA', description: 'An agreement with a federal agency like NIH or CDC' }
    ],
    allowCustom: true
  },
  dataset_name: {
    id: 'dataset_name',
    type: 'text',
    label: 'Dataset Name',
    placeholder: 'Enter the dataset name',
    description: 'The official or common name of the dataset',
    helpText: 'Use the official name of the dataset as it appears in documentation or publications.',
    allowCustom: true
  },
  dataset_access_type: {
    id: 'dataset_access_type',
    type: 'select',
    label: 'Dataset Access Level',
    options: [
      { value: 'fully_open', label: 'fully open access', description: 'No registration or approval needed' },
      { value: 'registered', label: 'available with registration', description: 'Simple registration process required' },
      { value: 'restricted', label: 'restricted access', description: 'Formal approval process required' }
    ],
    allowCustom: true
  },
  data_maintainer: {
    id: 'data_maintainer',
    type: 'text',
    label: 'Data Maintainer',
    placeholder: 'Enter the organization that maintains the data',
    description: 'The organization responsible for maintaining and providing the dataset',
    helpText: 'This is who you\'ll contact for access or support. Include the specific department if known.',
    allowCustom: true
  },
  clinical_domain: {
    id: 'clinical_domain',
    type: 'multiSelect',
    label: 'Clinical Domain',
    options: CLINICAL_DOMAIN_OPTIONS,
    placeholder: 'Select clinical domains',
    description: 'The medical specialties or areas covered by this data',
    helpText: 'Choose all relevant medical specialties that your data covers.',
    allowCustom: true
  },
  participant_count: {
    id: 'participant_count',
    type: 'text',
    label: 'Participant Count',
    placeholder: 'Enter the expected number of participants',
    description: 'The total number of participants expected for this study',
    helpText: 'Consider your recruitment capabilities and statistical power requirements.',
    allowCustom: true
  },
  collection_method: {
    id: 'collection_method',
    type: 'select',
    label: 'Collection Method',
    options: [
      { value: 'standard_care', label: 'standard of care visits', description: 'Data collected during routine clinical care' },
      { value: 'research_visits', label: 'dedicated research visits', description: 'Data collected during special research appointments' },
      { value: 'remote', label: 'remote data collection', description: 'Data collected through remote or telehealth methods' }
    ],
    allowCustom: true
  },
  clinical_setting: {
    id: 'clinical_setting',
    type: 'select',
    label: 'Clinical Setting',
    placeholder: 'Where will data collection occur?',
    description: 'Select the clinical setting where data will be collected',
    helpText: 'Choose the primary location where you will interact with participants and collect data.',
    options: CLINICAL_SETTING_OPTIONS,
    allowCustom: true
  },
  data_format: {
    id: 'data_format',
    type: 'multiSelect',
    label: 'Data Format',
    options: DATA_FORMAT_OPTIONS,
    description: 'The format of the data',
    helpText: 'Select all types of data that will be included in your dataset.',
    allowCustom: true
  },
  data_volume: {
    id: 'data_volume',
    type: 'select',
    label: 'Data Volume',
    options: DATA_VOLUME_OPTIONS,
    description: 'The approximate size of the dataset',
    helpText: 'This helps plan for storage and processing requirements.',
    allowCustom: true
  },
  identifiability_level: {
    id: 'identifiability_level',
    type: 'select',
    label: 'Identifiability Level',
    options: IDENTIFIABILITY_LEVEL_OPTIONS,
    description: 'The level of identifiability for this dataset',
    helpText: 'Choose the minimum level of identifiability needed for your research.',
    allowCustom: false
  },
  security_measures: {
    id: 'security_measures',
    type: 'multiSelect',
    label: 'Security Measures',
    options: SECURITY_MEASURES_OPTIONS,
    description: 'The security measures used to protect this data',
    helpText: 'Select all security measures that will be implemented.',
    allowCustom: true
  },
  sensitive_categories: {
    id: 'sensitive_categories',
    type: 'multiSelect',
    label: 'Sensitive Data Categories',
    options: SENSITIVE_CATEGORIES_OPTIONS,
    description: 'The types of sensitive information included in this dataset',
    helpText: 'Select all types of sensitive information that will be included.',
    allowCustom: true
  }
};

// Define the schema first - only the data sources selection
export const DATA_SOURCES_SCHEMA = {
  template: "To accomplish our research objectives, we will utilize the following {data_sources}",
  fields: {
    data_sources: {
      id: 'data_sources',
      type: 'multiSelect' as const,
      label: 'Data Sources',
      placeholder: 'Which data sources will you use?',
      description: 'Choose all the types of data you will need to access for your research',
      helpText: 'Consider all the data you\'ll need to complete your research. Each source may have different access requirements.',
      allowCustom: false,
      options: [
        { value: 'external_dua', label: 'external data requiring a Data Use Agreement', description: 'Data from outside organizations that requires a formal agreement to use' },
        { value: 'public_datasets', label: 'publicly available research datasets', description: 'Data that is freely available to researchers' },
        { value: 'internal_ehr', label: 'Mayo Clinic medical record data', description: 'Clinical data from Mayo Clinic electronic health records' },
        { value: 'prospective_data', label: 'new data collected from Mayo Clinic patients', description: 'Data that will be gathered during this study' }
      ],
      expansionFields: {
        'external_dua': [
          'external_provider',
          'dua_type',
          'data_format',
          'data_volume',
          'identifiability_level',
          'security_measures',
          'sensitive_categories'
        ].map(id => EXPANSION_FIELDS[id]),
        'public_datasets': [
          'dataset_name',
          'dataset_access_type',
          'data_maintainer',
          'data_format',
          'data_volume',
          'identifiability_level'
        ].map(id => EXPANSION_FIELDS[id]),
        'internal_ehr': [
          'clinical_domain',
          'data_format',
          'data_volume',
          'identifiability_level',
          'security_measures',
          'sensitive_categories'
        ].map(id => EXPANSION_FIELDS[id]),
        'prospective_data': [
          'participant_count',
          'collection_method',
          'clinical_setting',
          'data_format',
          'data_volume',
          'identifiability_level',
          'security_measures',
          'sensitive_categories'
        ].map(id => EXPANSION_FIELDS[id])
      } as { [key: string]: ExpansionField[] }
    }
  }
};

export const studyOverviewModule: NarrativeModule = {
  id: 'study_overview',
  name: 'Study Overview',
  sections: [
    {
      id: 'study_purpose',
      moduleId: 'study_overview',
      moduleName: 'Study Overview',
      title: 'Study Purpose & Background',
      description: 'Define the core purpose and context of your AI/ML study.',
      guidance: `In this section, we need you to outline:
- The primary purpose of your study
- The clinical or research context
- The key background information`,
      template: 'This AI/ML discovery project aims to {research_action} {clinical_problem} in {clinical_domain}. Currently, {current_limitation} which impacts {affected_population}.',
      fields: [
        {
          id: 'research_action',
          type: 'select',
          label: 'Research Action',
          placeholder: 'Select the primary action of your research',
          description: 'Choose the main action your study will undertake',
          helpText: 'This describes what your study aims to do. For example, if you select "develop and validate", you\'ll be creating and testing a new approach.',
          allowCustom: true,
          options: [
            { value: 'develop_validate', label: 'develop and initially validate', description: 'Create and test a new approach or method' },
            { value: 'evaluate_compare', label: 'evaluate and compare', description: 'Test existing approaches against each other' },
            { value: 'optimize_improve', label: 'optimize and improve', description: 'Make an existing approach work better' },
            { value: 'identify_characterize', label: 'identify and characterize', description: 'Discover and describe new patterns or relationships' }
          ]
        },
        {
          id: 'clinical_problem',
          type: 'select',
          label: 'Clinical Problem',
          placeholder: 'Select the clinical problem to address',
          description: 'Choose the specific clinical challenge your study addresses',
          helpText: 'This is the core problem your research aims to solve. Think about what currently isn\'t working well in clinical practice.',
          allowCustom: true,
          options: [
            { value: 'diagnostic_accuracy', label: 'diagnostic accuracy challenges', description: 'Problems with making correct diagnoses' },
            { value: 'risk_prediction', label: 'risk prediction limitations', description: 'Difficulties predicting patient outcomes' },
            { value: 'treatment_selection', label: 'treatment selection barriers', description: 'Challenges choosing the best treatment' },
            { value: 'resource_utilization', label: 'resource utilization inefficiencies', description: 'Problems using resources effectively' }
          ]
        },
        {
          id: 'clinical_domain',
          type: 'multiSelect',
          label: 'Clinical Domain',
          placeholder: 'Select the clinical areas',
          description: 'Choose the medical specialties or domains',
          helpText: 'These are the medical areas your research will focus on. You can select multiple if your work spans different specialties.',
          allowCustom: true,
          options: CLINICAL_DOMAIN_OPTIONS
        },
        {
          id: 'current_limitation',
          type: 'select',
          label: 'Current Limitation',
          placeholder: 'Select the current limitation',
          description: 'Choose the main limitation in current practice',
          helpText: 'This describes what makes the current approach insufficient. Think about why existing methods aren\'t meeting clinical needs.',
          allowCustom: true,
          options: [
            { value: 'manual_intensive', label: 'current methods are labor-intensive and time-consuming', description: 'Takes too much time and effort to complete' },
            { value: 'accuracy_limited', label: 'existing approaches have limited accuracy and reliability', description: 'Not accurate or consistent enough' },
            { value: 'scalability_issues', label: 'traditional methods do not scale effectively', description: 'Doesn\'t work well with larger volumes' },
            { value: 'consistency_varies', label: 'interpretation consistency varies significantly', description: 'Different people get different results' }
          ]
        },
        {
          id: 'affected_population',
          type: 'select',
          label: 'Affected Population',
          placeholder: 'Select the affected population',
          description: 'Choose who is most impacted by this limitation',
          helpText: 'This identifies who is most affected by the current problems. Consider both direct and indirect impacts on different groups.',
          allowCustom: true,
          options: [
            { value: 'patients_treatment', label: 'patients requiring timely treatment decisions', description: 'People who need quick decisions about their care' },
            { value: 'healthcare_providers', label: 'healthcare providers managing complex cases', description: 'Doctors and other providers handling difficult cases' },
            { value: 'at_risk_patients', label: 'patients at risk of adverse outcomes', description: 'People who might have bad outcomes without better care' },
            { value: 'healthcare_systems', label: 'healthcare systems managing resource allocation', description: 'Hospitals and clinics trying to use resources well' }
          ]
        }
      ]
    },
    {
      id: 'research_rationale',
      moduleId: 'study_overview',
      moduleName: 'Study Overview',
      title: 'Research Rationale',
      description: 'Provide a clear, concise overview of your research project that helps reviewers understand the core purpose and approach.',
      guidance: `In this section, we need you to outline:
- The main problem or gap your research addresses
- The specific objective(s) of your project
- The general approach you'll take
- The evidence supporting your approach`,
      template: 'Based on {evidence_basis}, there is a clear need to explore new methods for {specific_objective}. Our project will specifically focus on {proposed_approach}, which has shown promise in {approach_justification}.',
      fields: [
        {
          id: 'evidence_basis',
          label: 'Evidence Basis',
          type: 'multiSelect',
          placeholder: 'What evidence supports the need for this research?',
          description: 'Select the primary evidence that demonstrates the need for your research',
          helpText: 'Strong evidence helps justify your research. Consider what existing research or data shows this work is needed.',
          allowCustom: true,
          options: [
            { value: 'multiple_clinical_validation_studies', label: 'multiple clinical validation studies', description: 'Previous studies that tested similar approaches' },
            { value: 'systematic_literature_reviews', label: 'systematic literature reviews', description: 'Comprehensive reviews of existing research' },
            { value: 'preliminary_pilot_data', label: 'preliminary pilot data', description: 'Early results from your own testing' },
            { value: 'expert_consensus_statements', label: 'expert consensus statements', description: 'Official recommendations from medical experts' }
          ]
        },
        {
          id: 'specific_objective',
          label: 'Specific Objective',
          type: 'text',
          placeholder: 'What specific objective will your project pursue?',
          description: 'Enter the primary objective or goal of your research project',
          helpText: 'Be specific and concrete. A good objective is measurable and clearly states what you want to achieve.'
        },
        {
          id: 'proposed_approach',
          label: 'Proposed Approach',
          type: 'select',
          placeholder: 'What is your proposed approach?',
          description: 'Select the primary approach or methodology you will use',
          helpText: 'This is your main technical strategy. Choose the AI/ML approach that best fits your objective.',
          allowCustom: true,
          options: RESEARCH_APPROACH_OPTIONS
        },
        {
          id: 'approach_justification',
          label: 'Approach Justification',
          type: 'select',
          placeholder: 'Why is this approach promising?',
          description: 'Select the primary justification for your chosen approach',
          helpText: 'Explain why you believe this approach will work. Consider what evidence supports your choice.',
          allowCustom: true,
          options: APPROACH_JUSTIFICATION_OPTIONS
        }
      ]
    },
    {
      id: 'literature_support',
      moduleId: 'study_overview',
      moduleName: 'Study Overview',
      title: 'Literature Support',
      description: 'Provide the key literature that supports your approach.',
      guidance: `In this section, we need you to specify:
- Key publications that support your methods
- Evidence for your data collection approach
- Literature that identifies the research gap`,
      template: 'Key literature supporting our approach includes {key_publications}. This evidence demonstrates {evidence_impact} and highlights {research_gap_evidence}.',
      fields: [
        {
          id: 'key_publications',
          type: 'multiSelect',
          label: 'Key Publications',
          placeholder: 'What key publications support your approach?',
          description: 'Select the types of publications that support your methods',
          helpText: 'Consider what published evidence best supports your work. Recent publications are often more relevant.',
          allowCustom: true,
          options: [
            { value: 'recent_systematic_reviews', label: 'recent systematic reviews from the past 2 years', description: 'Latest comprehensive research summaries' },
            { value: 'validation_studies', label: 'clinical validation studies', description: 'Studies testing similar approaches' },
            { value: 'technical_papers', label: 'technical methodology papers', description: 'Papers describing relevant methods' },
            { value: 'consensus_guidelines', label: 'consensus guidelines and recommendations', description: 'Expert-approved standards' }
          ]
        },
        {
          id: 'evidence_impact',
          type: 'multiSelect',
          label: 'Evidence Impact',
          placeholder: 'What does this evidence demonstrate?',
          description: 'Select how this evidence supports your approach',
          helpText: 'Think about how the literature strengthens your case. What key points does it prove?',
          allowCustom: true,
          options: [
            { value: 'feasibility', label: 'the feasibility of our proposed approach', description: 'Shows the approach can work' },
            { value: 'clinical_need', label: 'a clear clinical need for this solution', description: 'Demonstrates why it\'s needed' },
            { value: 'technical_validity', label: 'the technical validity of our methods', description: 'Proves the methods are sound' },
            { value: 'potential_impact', label: 'the potential impact on patient care', description: 'Shows how it could help patients' }
          ]
        },
        {
          id: 'research_gap_evidence',
          type: 'multiSelect',
          label: 'Gap Evidence',
          placeholder: 'How is the research gap documented?',
          description: 'Select how the literature documents the research gap',
          helpText: 'Look for clear statements in the literature about what\'s missing or needed in this field.',
          allowCustom: true,
          options: [
            { value: 'systematic_gap', label: 'systematic reviews identifying this specific gap', description: 'Reviews explicitly noting this need' },
            { value: 'failed_approaches', label: 'documentation of previous approaches that failed', description: 'Past attempts that didn\'t work' },
            { value: 'expert_calls', label: 'expert calls for solutions in this area', description: 'Experts requesting this research' },
            { value: 'unmet_needs', label: 'documented unmet clinical needs', description: 'Clear clinical problems needing solutions' }
          ]
        },
        {
          id: 'additional_literature',
          type: 'text',
          label: 'Additional Literature Context',
          placeholder: 'Any additional literature context?',
          description: 'Optional: Provide any additional context about the supporting literature',
          optional: true
        }
      ]
    }
  ]
};

export const dataAccessModule: NarrativeModule = {
  id: 'data_access',
  name: 'Data Access & Resources',
  sections: [
    {
      id: 'data_resources',
      moduleId: 'data_access',
      moduleName: 'Data Access & Resources',
      title: 'Study Resources & Data Types',
      description: 'Define what resources and data types you need for your study.',
      guidance: `In this section, we need you to specify:
- What types of data sources you'll use
- For each data source:
  - Format and volume
  - Level of identifiability
  - Security measures
  - Sensitive data categories`,
      template: "To accomplish our research objectives, we will utilize the following {data_sources}",
      fields: [DATA_SOURCES_SCHEMA.fields.data_sources]
    },
    {
      id: 'data_storage',
      moduleId: 'data_access',
      moduleName: 'Data Access & Resources',
      title: 'Data Storage & Management',
      description: 'Define how you will store and manage the study data.',
      guidance: `In this section, we need you to specify:
- Where data will be stored
- How data will be secured
- Data retention plans
- Access controls`,
      template: "Study data will be stored {storage_location} with {security_controls}. Data retention will follow {retention_plan}, and access will be controlled through {access_controls}.",
      fields: [
        {
          id: 'storage_location',
          type: 'select' as const,
          label: 'Storage Location',
          placeholder: 'Where will the data be stored?',
          description: 'Select the primary storage location for study data',
          helpText: 'Each location has different security features and access speeds. Match your choice to your data sensitivity and analysis needs.',
          allowCustom: true,
          options: [
            { value: 'mayo_secure', label: 'in Mayo Clinic secure research storage', description: 'Mayo\'s protected research environment' },
            { value: 'approved_cloud', label: 'in an approved cloud environment', description: 'Validated cloud storage service' },
            { value: 'dedicated_server', label: 'on a dedicated secure server', description: 'Specialized research server' }
          ]
        },
        {
          id: 'security_controls',
          type: 'multiSelect' as const,
          label: 'Security Controls',
          placeholder: 'What security controls will be in place?',
          description: 'Select all security controls that will be implemented',
          helpText: 'Layer your security measures - combine preventive controls (like encryption) with detective controls (like monitoring) for better protection.',
          allowCustom: true,
          options: SECURITY_MEASURES_OPTIONS
        },
        {
          id: 'retention_plan',
          type: 'select' as const,
          label: 'Retention Plan',
          placeholder: 'What is the data retention plan?',
          description: 'Select the data retention approach',
          helpText: 'Balance regulatory requirements with research needs. Longer retention periods need stronger justification and security measures.',
          options: [
            { value: 'standard_retention', label: 'standard Mayo Clinic retention policies', description: 'Following normal institutional rules' },
            { value: 'extended_retention', label: 'extended retention for long-term research', description: 'Keeping data longer for ongoing work' },
            { value: 'custom_retention', label: 'custom retention based on study requirements', description: 'Special retention needs' }
          ]
        },
        {
          id: 'access_controls',
          type: 'multiSelect' as const,
          label: 'Access Controls',
          placeholder: 'How will access be controlled?',
          description: 'Select all access control measures',
          helpText: 'Think about who needs access to the data and how they will use it. Multiple controls work together for better security.',
          allowCustom: true,
          options: ACCESS_CONTROL_OPTIONS
        }
      ]
    },
    {
      id: 'data_sharing',
      moduleId: 'data_access',
      moduleName: 'Data Access & Resources',
      title: 'Data Sharing & Collaboration',
      description: 'Define how data will be shared with collaborators.',
      guidance: `In this section, we need you to specify:
- Who data will be shared with
- How data will be shared
- What protections will be in place
- Any restrictions on use`,
      template: "Data will be shared with {collaborators} using {sharing_method}. Shared data will be protected by {sharing_protections} and subject to {usage_restrictions}.",
      fields: [
        {
          id: 'collaborators',
          type: 'multiSelect' as const,
          label: 'Collaborators',
          placeholder: 'Who will data be shared with?',
          description: 'Select all groups data will be shared with',
          helpText: 'Think about everyone who needs access to the data. Remember that each group may have different data access requirements.',
          allowCustom: true,
          options: [
            { value: 'internal', label: 'internal Mayo Clinic researchers', description: 'Other Mayo researchers working on this study' },
            { value: 'academic', label: 'academic research partners', description: 'Researchers at other universities or institutions' },
            { value: 'industry', label: 'industry collaborators', description: 'Commercial partners or companies' },
            { value: 'consortium', label: 'research consortium members', description: 'Members of formal research networks' }
          ]
        },
        {
          id: 'sharing_method',
          type: 'select' as const,
          label: 'Sharing Method',
          placeholder: 'How will data be shared?',
          description: 'Select the primary method for data sharing',
          helpText: 'Choose a method that balances ease of access with security requirements.',
          options: [
            { value: 'secure_transfer', label: 'secure file transfer protocol', description: 'Direct secure file transfers' },
            { value: 'api_access', label: 'secure API access', description: 'Programmatic access through secure API' },
            { value: 'shared_environment', label: 'shared secure environment', description: 'Common workspace for all collaborators' }
          ]
        },
        {
          id: 'sharing_protections',
          type: 'multiSelect' as const,
          label: 'Sharing Protections',
          placeholder: 'What protections will be in place?',
          description: 'Select all protections for shared data',
          helpText: 'Consider both technical and legal protections. Multiple layers of protection are often needed.',
          allowCustom: true,
          options: [
            { value: 'dua', label: 'data use agreements', description: 'Legal contracts governing data use' },
            { value: 'encryption', label: 'end-to-end encryption', description: 'Data encrypted during transfer and storage' },
            { value: 'access_controls', label: 'strict access controls', description: 'Limited access to authorized users' },
            { value: 'audit_trails', label: 'comprehensive audit trails', description: 'Tracking of all data access' }
          ]
        },
        {
          id: 'usage_restrictions',
          type: 'multiSelect' as const,
          label: 'Usage Restrictions',
          placeholder: 'What restrictions will apply?',
          description: 'Select all applicable usage restrictions',
          helpText: 'Define clear boundaries for how the data can be used. This helps prevent misuse and ensures compliance.',
          allowCustom: true,
          options: [
            { value: 'purpose_limited', label: 'purpose-limited use', description: 'Only for specified research purposes' },
            { value: 'no_redistribution', label: 'no redistribution', description: 'Cannot share data with others' },
            { value: 'time_limited', label: 'time-limited access', description: 'Access expires after set period' },
            { value: 'publication_review', label: 'publication review requirements', description: 'Must review publications before release' }
          ]
        }
      ]
    }
  ]
};

export const studyPopulationModule: NarrativeModule = {
  id: 'study_population',
  name: 'Study Population & Scope',
  sections: [
    {
      id: 'population_details',
      moduleId: 'study_population',
      moduleName: 'Study Population & Scope',
      title: 'Study Population Details',
      description: 'Define the population and scope of your study.',
      guidance: `In this section, we need you to specify:
- The diagnosis/disease of interest
- Whether you'll include healthy controls
- Age range of subjects
- Sample size requirements for statistical validity`,
      template: 'Our study will focus on patients with {diagnosis} {healthy_controls}. The study population will include subjects aged {age_range}, with a target enrollment of {sample_size} participants to ensure statistical validity. Of these, {mayo_sample_size} will be from Mayo Clinic. {additional_population_details}',
      fields: [
        {
          id: 'diagnosis',
          label: 'Diagnosis/Disease',
          type: 'select',
          placeholder: 'What is the primary diagnosis or disease of interest?',
          description: 'Select the main condition your study focuses on',
          helpText: 'Your choice affects recruitment strategy and required expertise. Consider both prevalence and accessibility of the patient population.',
          allowCustom: true,
          options: DIAGNOSIS_OPTIONS
        },
        {
          id: 'healthy_controls',
          label: 'Healthy Controls',
          type: 'select',
          placeholder: 'Will you include healthy controls?',
          description: 'Specify if and how you will include healthy controls',
          helpText: 'Control groups strengthen your findings but add complexity. Consider matching criteria and recruitment challenges.',
          allowCustom: true,
          options: [
            { value: 'with_matched_controls', label: 'and matched healthy controls for comparison', description: 'Controls matched on key characteristics' },
            { value: 'no_controls', label: 'without a control group', description: 'No control group needed' },
            { value: 'with_historical_controls', label: 'with historical healthy controls', description: 'Using existing control data' }
          ]
        },
        {
          id: 'age_range',
          label: 'Age Range',
          type: 'select',
          placeholder: 'What is the age range for subjects?',
          description: 'Select the age range for your study population',
          helpText: 'Broader ranges increase recruitment options but may introduce variability. Consider age-specific regulatory requirements and consent processes.',
          allowCustom: true,
          options: [
            { value: 'adults_18_plus', label: '18 years and older', description: 'Adult participants only' },
            { value: 'adults_65_plus', label: '65 years and older', description: 'Older adult participants' },
            { value: 'all_ages', label: 'all ages', description: 'No age restrictions' },
            { value: 'pediatric', label: 'under 18 years', description: 'Children and adolescents' }
          ]
        },
        {
          id: 'sample_size',
          label: 'Total Sample Size',
          type: 'number',
          placeholder: 'How many total participants do you need?',
          description: 'Enter the total number of participants needed for statistical validity',
          helpText: 'Consider effect size, variability, and desired power. Factor in potential dropouts and data quality issues.',
          validation: [
            {
              type: 'min',
              value: 1,
              message: 'Sample size must be greater than 0'
            }
          ]
        },
        {
          id: 'mayo_sample_size',
          label: 'Mayo Sample Size',
          type: 'number',
          placeholder: 'How many participants from Mayo Clinic?',
          description: 'Enter the number of Mayo Clinic participants',
          helpText: 'Consider Mayo Clinic\'s patient population and recruitment capabilities when setting this number.',
          validation: [
            {
              type: 'min',
              value: 0,
              message: 'Mayo sample size must be 0 or greater'
            }
          ]
        },
        {
          id: 'additional_population_details',
          label: 'Additional Details',
          type: 'text',
          placeholder: 'Any additional population details?',
          description: 'Optional: Provide any additional context about your study population'
        }
      ]
    }
  ]
};

export const privacyModule: NarrativeModule = {
  id: 'privacy',
  name: 'Privacy & Identifiability',
  sections: [
    {
      id: 'data_privacy',
      moduleId: 'privacy',
      moduleName: 'Privacy & Identifiability',
      title: 'Data Privacy & Handling',
      description: 'Define how you will handle data privacy and identifiability.',
      guidance: `In this section, we need you to specify:
- The identifiability level of your data
- How data will be de-identified if applicable
- Any data combination with non-Mayo datasets
- Plans for data disposition`,
      template: 'The study data will be {identifiability_level}. {deidentification_process} {data_combination} Upon study completion, {data_disposition}',
      fields: [
        {
          id: 'identifiability_level',
          label: 'Data Identifiability',
          type: 'select',
          placeholder: 'How identifiable is your data?',
          description: 'Select the level of identifiability for your study data',
          helpText: 'Choose the minimum level of identifiability needed for your research. More identifiable data requires stronger justification and security measures.',
          allowCustom: false,
          options: IDENTIFIABILITY_LEVEL_OPTIONS
        },
        {
          id: 'deidentification_process',
          label: 'De-identification Process',
          type: 'select',
          placeholder: 'How will data be de-identified?',
          description: 'Select the method for de-identifying data',
          helpText: 'Your choice affects accuracy, scalability, and cost. Consider the volume of data and sensitivity of identifiers when selecting a method.',
          allowCustom: true,
          options: [
            { value: 'automated_process', label: 'De-identification will be performed using automated tools and validated by our data management team.', description: 'Using algorithms to remove identifiers' },
            { value: 'manual_review', label: 'Each record will be manually reviewed and de-identified by trained personnel.', description: 'Reviewing and removing identifiers' },
            { value: 'hybrid_approach', label: 'We will use a combination of automated tools and manual review for de-identification.', description: 'Combining automated and manual methods' }
          ]
        },
        {
          id: 'data_combination',
          label: 'Data Combination',
          type: 'select',
          placeholder: 'Will you combine with non-Mayo data?',
          description: 'Specify if and how you will combine data with non-Mayo sources',
          helpText: 'This is the process of combining data from different sources. Choose a method that balances ease of access with security requirements.',
          allowCustom: true,
          options: [
            { value: 'no_combination', label: 'This study will use only Mayo Clinic data.', description: 'Using only Mayo Clinic data' },
            { value: 'public_datasets', label: 'Mayo data will be combined with publicly available datasets.', description: 'Combining Mayo Clinic data with publicly available datasets' },
            { value: 'collaborator_data', label: 'Data will be combined with datasets from research collaborators.', description: 'Combining Mayo Clinic data with datasets from research collaborators' }
          ]
        },
        {
          id: 'data_disposition',
          label: 'Data Disposition',
          type: 'select',
          placeholder: 'What happens to the data after the study?',
          description: 'Select the plan for data disposition after study completion',
          helpText: 'This is the process of handling data after the study is complete. Choose a method that balances ease of access with security requirements.',
          allowCustom: true,
          options: [
            { value: 'destroy_identifiers', label: 'all identifiers will be destroyed according to HIPAA standards', description: 'Destroying all identifiers' },
            { value: 'maintain_deidentified', label: 'de-identified data will be maintained for future research', description: 'Maintaining de-identified data for future research' },
            { value: 'archive_secured', label: 'data will be archived in a secure repository', description: 'Storing data in a secure repository' }
          ]
        }
      ]
    }
  ]
};

export const algorithmicFairnessModule: NarrativeModule = {
  id: 'algorithmic_fairness',
  name: 'Algorithmic Fairness & Limitations',
  sections: [
    {
      id: 'fairness_considerations',
      moduleId: 'algorithmic_fairness',
      moduleName: 'Algorithmic Fairness & Limitations',
      title: 'Fairness & Limitations',
      description: 'Define how you will ensure algorithmic fairness and acknowledge limitations.',
      guidance: `In this section, we need you to specify:
- How you'll ensure algorithmic fairness
- Who will benefit from the technology
- Phase 1 limitations and constraints
- Future use considerations`,
      template: 'To ensure fairness, our algorithm will {fairness_approach}. The primary beneficiaries will be {beneficiaries}, and {benefit_mechanism}. I hereby confirm that this Phase 1 study {phase_limitations}. {future_use}',
      fields: [
        {
          id: 'fairness_approach',
          label: 'Fairness Approach',
          type: 'select',
          placeholder: 'How will you ensure algorithmic fairness?',
          description: 'Select the primary approach to ensuring algorithmic fairness',
          helpText: 'AI systems can inadvertently perpetuate or amplify biases. Your fairness strategy should address data collection, model development, and ongoing monitoring.',
          allowCustom: true,
          options: [
            { value: 'balanced_representation', label: 'be developed using balanced datasets that represent diverse populations', description: 'Using data from all groups' },
            { value: 'bias_testing', label: 'undergo rigorous bias testing across different demographic groups', description: 'Testing for unfair treatment' },
            { value: 'expert_review', label: 'be reviewed by domain experts for potential biases', description: 'Getting expert feedback' },
            { value: 'continuous_monitoring', label: 'include continuous monitoring and adjustment for fairness metrics', description: 'Ongoing fairness checks' }
          ]
        },
        {
          id: 'beneficiaries',
          label: 'Primary Beneficiaries',
          type: 'multiSelect',
          placeholder: 'Who will benefit from this technology?',
          description: 'Select the primary beneficiaries of your research',
          helpText: 'Understanding your beneficiaries helps focus development and measure success. Consider both direct users and those indirectly impacted by the technology.',
          allowCustom: true,
          options: [
            { value: 'patients', label: 'patients receiving care in this clinical domain', description: 'Patients who will directly benefit from the technology' },
            { value: 'healthcare_providers', label: 'healthcare providers making clinical decisions', description: 'Healthcare providers who will directly benefit from the technology' },
            { value: 'researchers', label: 'researchers studying this condition', description: 'Researchers who will study this condition' },
            { value: 'healthcare_system', label: 'the healthcare system through improved efficiency', description: 'The healthcare system through improved efficiency' }
          ]
        },
        {
          id: 'benefit_mechanism',
          label: 'Benefit Mechanism',
          type: 'multiSelect',
          placeholder: 'How will they benefit?',
          description: 'Select how the beneficiaries will benefit',
          helpText: 'Be specific about measurable improvements. These will become key metrics for evaluating your project\'s success.',
          allowCustom: true,
          options: [
            { value: 'improved_accuracy', label: 'will benefit from improved diagnostic accuracy', description: 'Improved diagnostic accuracy' },
            { value: 'faster_decisions', label: 'will receive faster clinical decisions', description: 'Faster clinical decisions' },
            { value: 'better_insights', label: 'will gain better insights into the condition', description: 'Better insights into the condition' },
            { value: 'reduced_costs', label: 'will experience reduced healthcare costs', description: 'Reduced healthcare costs' }
          ]
        },
        {
          id: 'phase_limitations',
          label: 'Phase 1 Limitations',
          type: 'multiSelect',
          placeholder: 'What are the Phase 1 limitations?',
          description: 'Select all applicable Phase 1 limitations',
          helpText: 'Setting clear boundaries helps manage expectations and ensures regulatory compliance. These will appear as formal attestations in your narrative.',
          allowCustom: false,
          options: PHASE_LIMITATION_OPTIONS,
          required: true,
          formatAttestation: (values: string[]) => {
            if (!values || values.length === 0) return '';
            
            const attestations = values.map(value => {
              const option = PHASE_LIMITATION_OPTIONS.find(opt => opt.value === value);
              return option?.attestation?.statement || '';
            }).filter(Boolean);
            
            if (attestations.length === 0) return '';
            if (attestations.length === 1) return attestations[0];
            if (attestations.length === 2) return `${attestations[0]} and ${attestations[1]}`;
            
            const lastAttestation = attestations[attestations.length - 1];
            return `${attestations.slice(0, -1).join(', ')}, and ${lastAttestation}`;
          }
        },
        {
          id: 'future_use',
          label: 'Future Use',
          type: 'text',
          placeholder: 'Any plans for future use?',
          description: 'Optional: Describe any plans for future use of the study results',
          helpText: 'Outline potential next steps that would build on Phase 1 success. This helps reviewers understand the broader impact of your work.',
          optional: true
        }
      ]
    }
  ]
}; 