import { NarrativeModule, Option } from '../types/narrative';

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
      allowOther: false,
      options: [
        { value: 'external_dua', label: 'external data requiring a Data Use Agreement', description: 'Data from outside organizations that requires a formal agreement to use' },
        { value: 'public_datasets', label: 'publicly available research datasets', description: 'Data that is freely available to researchers' },
        { value: 'internal_ehr', label: 'Mayo Clinic medical record data', description: 'Clinical data from Mayo Clinic electronic health records' },
        { value: 'prospective_data', label: 'new data collected from Mayo Clinic patients', description: 'Data that will be gathered during this study' }
      ],
      expansionFields: {
        'external_dua': [
          {
            id: 'external_provider',
            type: 'text' as const,
            label: 'External Provider',
            placeholder: 'Enter the name of the external data provider',
            description: 'The organization or institution providing the external data',
            required: true
          },
          {
            id: 'dua_type',
            type: 'autocompleteText' as const,
            label: 'DUA Type',
            placeholder: 'What type of Data Use Agreement is needed?',
            description: 'Select the type of agreement you will need to access this data',
            options: [
              { value: 'standard', label: 'standard institutional DUA', description: 'A typical agreement between research institutions' },
              { value: 'custom', label: 'custom negotiated DUA', description: 'A specially negotiated agreement for unique requirements' },
              { value: 'federal', label: 'federal DUA', description: 'An agreement with a federal agency like NIH or CDC' }
            ],
            required: true
          },
          {
            id: 'data_format',
            type: 'multiSelect' as const,
            label: 'Types of Data',
            placeholder: 'What types of data will you receive?',
            description: 'Select all the types of data included in this dataset',
            allowOther: true,
            options: [
              { value: 'structured_clinical', label: 'structured medical data', description: 'Organized data like lab results, vital signs, or medications' },
              { value: 'imaging', label: 'medical images', description: 'Images like X-rays, MRIs, or CT scans' },
              { value: 'genomic', label: 'genetic or molecular data', description: 'DNA, RNA, or other molecular information' },
              { value: 'textual', label: 'clinical notes and reports', description: 'Written notes from healthcare providers' }
            ],
            required: true
          },
          {
            id: 'data_volume',
            type: 'select' as const,
            label: 'Amount of Data',
            placeholder: 'How much data will you receive?',
            description: 'Select the approximate size of the dataset',
            options: [
              { value: 'small', label: 'small dataset (less than 1GB)', description: 'About the size of 200,000 pages of text' },
              { value: 'moderate', label: 'medium dataset (1GB to 100GB)', description: 'About the size of 20 million pages of text' },
              { value: 'large', label: 'large dataset (more than 100GB)', description: 'Larger than 20 million pages of text' }
            ],
            required: true
          },
          {
            id: 'identifiability_level',
            type: 'select' as const,
            label: 'Patient Privacy Level',
            placeholder: 'How will patient privacy be protected?',
            description: 'Select how the data will be protected to maintain patient privacy',
            options: [
              { value: 'fully_deidentified', label: 'completely de-identified (no identifying information)', description: 'All personal information is removed following HIPAA guidelines' },
              { value: 'limited_dataset', label: 'limited dataset (only dates and locations)', description: 'Contains only approved indirect identifiers like dates and zip codes' },
              { value: 'coded', label: 'coded with protected key', description: 'Uses codes instead of names, with the key stored securely' },
              { value: 'identifiable', label: 'contains identifying information', description: 'Contains information that could identify patients' }
            ],
            required: true
          },
          {
            id: 'security_measures',
            type: 'multiSelect' as const,
            label: 'Security Measures',
            placeholder: 'How will you protect the data?',
            description: 'Select all the security measures that will be used',
            allowOther: true,
            options: [
              { value: 'encryption', label: 'data encryption', description: 'Data is scrambled to prevent unauthorized access' },
              { value: 'access_controls', label: 'controlled access', description: 'Only approved team members can access the data' },
              { value: 'secure_transfer', label: 'secure data transfer', description: 'Data is protected when being moved or shared' },
              { value: 'audit_logging', label: 'activity tracking', description: 'All data access is recorded and monitored' },
              { value: 'phi_monitoring', label: 'privacy monitoring', description: 'Special monitoring for personal health information' }
            ],
            required: true
          },
          {
            id: 'sensitive_categories',
            type: 'multiSelect' as const,
            label: 'Sensitive Information Types',
            placeholder: 'What types of sensitive information are included?',
            description: 'Select all types of sensitive information in the data',
            allowOther: true,
            options: [
              { value: 'genetic', label: 'genetic information', description: 'Information about genes or DNA' },
              { value: 'mental_health', label: 'mental health information', description: 'Information about mental health or psychiatric care' },
              { value: 'substance_abuse', label: 'substance use information', description: 'Information about drug or alcohol use' },
              { value: 'hiv', label: 'HIV/AIDS information', description: 'Information about HIV or AIDS status or treatment' },
              { value: 'reproductive', label: 'reproductive health information', description: 'Information about pregnancy or reproductive care' },
              { value: 'abuse', label: 'abuse-related information', description: 'Information about abuse or violence' }
            ],
            required: true
          }
        ],
        'public_datasets': [
          {
            id: 'dataset_name',
            type: 'text' as const,
            label: 'Dataset Name',
            placeholder: 'Enter the dataset name',
            description: 'The official or common name of the dataset',
            required: true,
            freeSolo: true
          },
          {
            id: 'dataset_access_type',
            type: 'select' as const,
            label: 'Dataset Access Level',
            description: 'The level of access control for this dataset',
            options: [
              { value: 'fully_open', label: 'fully open access', description: 'Data that can be accessed without any registration or approval' },
              { value: 'registered', label: 'available with registration', description: 'Data that requires user registration but no formal approval' },
              { value: 'restricted', label: 'restricted access', description: 'Data that requires formal approval before access is granted' }
            ],
            required: true
          },
          {
            id: 'data_maintainer',
            type: 'text' as const,
            label: 'Data Maintainer',
            placeholder: 'Enter the organization that maintains the data',
            description: 'The organization responsible for maintaining and providing the dataset',
            required: true,
            freeSolo: true
          },
          {
            id: 'data_format',
            type: 'multiSelect' as const,
            label: 'Data Format',
            description: 'The format of the data',
            allowOther: true,
            options: [
              { value: 'structured_clinical', label: 'structured clinical data', description: 'Organized data like lab results, vital signs, and medications' },
              { value: 'imaging', label: 'medical imaging data', description: 'Medical images like X-rays, MRIs, and CT scans' },
              { value: 'genomic', label: 'genomic and molecular data', description: 'Genetic and molecular information from lab tests' },
              { value: 'textual', label: 'unstructured clinical notes', description: 'Free-text notes and reports from healthcare providers' }
            ],
            required: true
          },
          {
            id: 'data_volume',
            type: 'select' as const,
            label: 'Data Volume',
            description: 'The approximate size of the dataset',
            options: [
              { value: 'small', label: 'a small dataset (less than 1GB)', description: 'Equivalent to about 200,000 pages of text' },
              { value: 'moderate', label: 'a moderate dataset (1GB to 100GB)', description: 'Equivalent to about 20 million pages of text' },
              { value: 'large', label: 'a large dataset (more than 100GB)', description: 'Larger than 20 million pages of text' }
            ],
            required: true
          },
          {
            id: 'identifiability_level',
            type: 'select' as const,
            label: 'Identifiability Level',
            description: 'The level of identifiability for this dataset',
            options: [
              { value: 'fully_deidentified', label: 'fully de-identified using HIPAA Safe Harbor method', description: 'All personal identifiers removed following HIPAA guidelines' },
              { value: 'limited_dataset', label: 'a Limited Dataset containing only approved indirect identifiers', description: 'Contains only dates and geographic information as allowed by HIPAA' },
              { value: 'coded', label: 'coded with a secure key management system', description: 'Uses codes instead of identifiers with secure key storage' },
              { value: 'identifiable', label: 'identifiable with strict access controls', description: 'Contains identifiable information with strict protections' }
            ],
            required: true
          }
        ],
        'internal_ehr': [
          {
            id: 'clinical_domain',
            type: 'multiSelect' as const,
            label: 'Clinical Domain',
            description: 'The medical specialties or areas covered by this data',
            placeholder: 'Select clinical domains',
            allowOther: true,
            options: [
              { value: 'pediatrics', label: 'Pediatrics', description: 'Care for children and adolescents' },
              { value: 'cardiology', label: 'Cardiology', description: 'Heart and cardiovascular system care' },
              { value: 'oncology', label: 'Oncology', description: 'Cancer diagnosis and treatment' },
              { value: 'neurology', label: 'Neurology', description: 'Brain and nervous system disorders' },
              { value: 'internal_medicine', label: 'Internal Medicine', description: 'General adult medical care' },
              { value: 'psychiatry', label: 'Psychiatry', description: 'Mental health and behavioral disorders' },
              { value: 'orthopedics', label: 'Orthopedics', description: 'Bone and joint conditions' },
              { value: 'dermatology', label: 'Dermatology', description: 'Skin conditions and disorders' },
              { value: 'endocrinology', label: 'Endocrinology', description: 'Hormone and metabolic disorders' },
              { value: 'gastroenterology', label: 'Gastroenterology', description: 'Digestive system disorders' }
            ],
            required: true
          },
          {
            id: 'data_format',
            type: 'multiSelect' as const,
            label: 'Data Format',
            description: 'The format of the data',
            allowOther: true,
            options: [
              { value: 'structured_clinical', label: 'structured clinical data', description: 'Organized data like lab results, vital signs, and medications' },
              { value: 'imaging', label: 'medical imaging data', description: 'Medical images like X-rays, MRIs, and CT scans' },
              { value: 'genomic', label: 'genomic and molecular data', description: 'Genetic and molecular information from lab tests' },
              { value: 'textual', label: 'unstructured clinical notes', description: 'Free-text notes and reports from healthcare providers' }
            ],
            required: true
          },
          {
            id: 'data_volume',
            type: 'select' as const,
            label: 'Data Volume',
            description: 'The approximate size of the dataset',
            options: [
              { value: 'small', label: 'a small dataset (less than 1GB)', description: 'Equivalent to about 200,000 pages of text' },
              { value: 'moderate', label: 'a moderate dataset (1GB to 100GB)', description: 'Equivalent to about 20 million pages of text' },
              { value: 'large', label: 'a large dataset (more than 100GB)', description: 'Larger than 20 million pages of text' }
            ],
            required: true
          },
          {
            id: 'identifiability_level',
            type: 'select' as const,
            label: 'Identifiability Level',
            description: 'The level of identifiability for this dataset',
            options: [
              { value: 'fully_deidentified', label: 'fully de-identified using HIPAA Safe Harbor method', description: 'All personal identifiers removed following HIPAA guidelines' },
              { value: 'limited_dataset', label: 'a Limited Dataset containing only approved indirect identifiers', description: 'Contains only dates and geographic information as allowed by HIPAA' },
              { value: 'coded', label: 'coded with a secure key management system', description: 'Uses codes instead of identifiers with secure key storage' },
              { value: 'identifiable', label: 'identifiable with strict access controls', description: 'Contains identifiable information with strict protections' }
            ],
            required: true
          },
          {
            id: 'security_measures',
            type: 'multiSelect' as const,
            label: 'Security Measures',
            description: 'The security measures used to protect this data',
            allowOther: true,
            options: [
              { value: 'encryption', label: 'end-to-end encryption', description: 'Data is encrypted during storage and transmission' },
              { value: 'access_controls', label: 'role-based access controls', description: 'Access is restricted based on user roles' },
              { value: 'secure_transfer', label: 'secure data transfer protocols', description: 'Data transfers use secure, encrypted methods' },
              { value: 'audit_logging', label: 'comprehensive audit logging', description: 'All data access is tracked and monitored' },
              { value: 'phi_monitoring', label: 'PHI access monitoring', description: 'Special monitoring for protected health information' }
            ],
            required: true
          },
          {
            id: 'sensitive_categories',
            type: 'multiSelect' as const,
            label: 'Sensitive Data Categories',
            description: 'The types of sensitive information included in this dataset',
            allowOther: true,
            options: [
              { value: 'genetic', label: 'genetic information', description: 'DNA, RNA, and other genetic test results' },
              { value: 'mental_health', label: 'mental health', description: 'Psychiatric and psychological health information' },
              { value: 'substance_abuse', label: 'substance abuse', description: 'Drug and alcohol use disorder information' },
              { value: 'hiv', label: 'HIV/AIDS', description: 'HIV/AIDS status and treatment information' },
              { value: 'reproductive', label: 'reproductive health', description: 'Pregnancy and reproductive care information' },
              { value: 'abuse', label: 'abuse-related information', description: 'Information about abuse or violence' }
            ],
            required: true
          }
        ],
        'prospective_data': [
          {
            id: 'participant_count',
            type: 'text' as const,
            label: 'Participant Count',
            placeholder: 'Enter the expected number of participants',
            description: 'The total number of participants expected for this study',
            required: true,
            freeSolo: true
          },
          {
            id: 'collection_method',
            type: 'select' as const,
            label: 'Collection Method',
            description: 'The method used to collect this data',
            options: [
              { value: 'standard_care', label: 'standard of care visits at Mayo Clinic' },
              { value: 'research_visits', label: 'dedicated research visits at Mayo Clinic' },
              { value: 'remote', label: 'remote data collection' }
            ],
            required: true
          },
          {
            id: 'clinical_setting',
            type: 'text' as const,
            label: 'Clinical Setting',
            placeholder: 'Enter the clinical setting at Mayo Clinic',
            description: 'The clinical setting at Mayo Clinic where this data was collected',
            required: true,
            freeSolo: true
          },
          {
            id: 'data_format',
            type: 'multiSelect' as const,
            label: 'Data Format',
            description: 'The format of the data',
            allowOther: true,
            options: [
              { value: 'structured_clinical', label: 'structured clinical data', description: 'Organized data like lab results, vital signs, and medications' },
              { value: 'imaging', label: 'medical imaging data', description: 'Medical images like X-rays, MRIs, and CT scans' },
              { value: 'genomic', label: 'genomic and molecular data', description: 'Genetic and molecular information from lab tests' },
              { value: 'textual', label: 'unstructured clinical notes', description: 'Free-text notes and reports from healthcare providers' }
            ],
            required: true
          },
          {
            id: 'data_volume',
            type: 'select' as const,
            label: 'Data Volume',
            description: 'The approximate size of the dataset',
            options: [
              { value: 'small', label: 'a small dataset (less than 1GB)', description: 'Equivalent to about 200,000 pages of text' },
              { value: 'moderate', label: 'a moderate dataset (1GB to 100GB)', description: 'Equivalent to about 20 million pages of text' },
              { value: 'large', label: 'a large dataset (more than 100GB)', description: 'Larger than 20 million pages of text' }
            ],
            required: true
          },
          {
            id: 'identifiability_level',
            type: 'select' as const,
            label: 'Identifiability Level',
            description: 'The level of identifiability for this dataset',
            options: [
              { value: 'fully_deidentified', label: 'fully de-identified using HIPAA Safe Harbor method', description: 'All personal identifiers removed following HIPAA guidelines' },
              { value: 'limited_dataset', label: 'a Limited Dataset containing only approved indirect identifiers', description: 'Contains only dates and geographic information as allowed by HIPAA' },
              { value: 'coded', label: 'coded with a secure key management system', description: 'Uses codes instead of identifiers with secure key storage' },
              { value: 'identifiable', label: 'identifiable with strict access controls', description: 'Contains identifiable information with strict protections' }
            ],
            required: true
          },
          {
            id: 'security_measures',
            type: 'multiSelect' as const,
            label: 'Security Measures',
            description: 'The security measures used to protect this data',
            allowOther: true,
            options: [
              { value: 'encryption', label: 'end-to-end encryption', description: 'Data is encrypted during storage and transmission' },
              { value: 'access_controls', label: 'role-based access controls', description: 'Access is restricted based on user roles' },
              { value: 'secure_transfer', label: 'secure data transfer protocols', description: 'Data transfers use secure, encrypted methods' },
              { value: 'audit_logging', label: 'comprehensive audit logging', description: 'All data access is tracked and monitored' },
              { value: 'phi_monitoring', label: 'PHI access monitoring', description: 'Special monitoring for protected health information' }
            ],
            required: true
          },
          {
            id: 'sensitive_categories',
            type: 'multiSelect' as const,
            label: 'Sensitive Data Categories',
            description: 'The types of sensitive information included in this dataset',
            allowOther: true,
            options: [
              { value: 'genetic', label: 'genetic information', description: 'DNA, RNA, and other genetic test results' },
              { value: 'mental_health', label: 'mental health', description: 'Psychiatric and psychological health information' },
              { value: 'substance_abuse', label: 'substance abuse', description: 'Drug and alcohol use disorder information' },
              { value: 'hiv', label: 'HIV/AIDS', description: 'HIV/AIDS status and treatment information' },
              { value: 'reproductive', label: 'reproductive health', description: 'Pregnancy and reproductive care information' },
              { value: 'abuse', label: 'abuse-related information', description: 'Information about abuse or violence' }
            ],
            required: true
          }
        ]
      }
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
          allowOther: true,
          options: [
            { value: 'develop_validate', label: 'develop and initially validate' },
            { value: 'evaluate_compare', label: 'evaluate and compare' },
            { value: 'optimize_improve', label: 'optimize and improve' },
            { value: 'identify_characterize', label: 'identify and characterize' }
          ]
        },
        {
          id: 'clinical_problem',
          type: 'select',
          label: 'Clinical Problem',
          placeholder: 'Select the clinical problem to address',
          description: 'Choose the specific clinical challenge your study addresses',
          allowOther: true,
          options: [
            { value: 'diagnostic_accuracy', label: 'diagnostic accuracy challenges' },
            { value: 'risk_prediction', label: 'risk prediction limitations' },
            { value: 'treatment_selection', label: 'treatment selection barriers' },
            { value: 'resource_utilization', label: 'resource utilization inefficiencies' }
          ]
        },
        {
          id: 'clinical_domain',
          type: 'select',
          label: 'Clinical Domain',
          placeholder: 'Select the clinical area',
          description: 'Choose the medical specialty or domain',
          allowOther: true,
          options: [
            { value: 'radiology', label: 'diagnostic radiology' },
            { value: 'pathology', label: 'pathology' },
            { value: 'cardiology', label: 'cardiology' },
            { value: 'neurology', label: 'neurology' },
            { value: 'oncology', label: 'oncology' }
          ]
        },
        {
          id: 'current_limitation',
          type: 'select',
          label: 'Current Limitation',
          placeholder: 'Select the current limitation',
          description: 'Choose the main limitation in current practice',
          allowOther: true,
          options: [
            { value: 'manual_intensive', label: 'current methods are labor-intensive and time-consuming' },
            { value: 'accuracy_limited', label: 'existing approaches have limited accuracy and reliability' },
            { value: 'scalability_issues', label: 'traditional methods do not scale effectively' },
            { value: 'consistency_varies', label: 'interpretation consistency varies significantly' }
          ]
        },
        {
          id: 'affected_population',
          type: 'select',
          label: 'Affected Population',
          placeholder: 'Select the affected population',
          description: 'Choose who is most impacted by this limitation',
          allowOther: true,
          options: [
            { value: 'patients_treatment', label: 'patients requiring timely treatment decisions' },
            { value: 'healthcare_providers', label: 'healthcare providers managing complex cases' },
            { value: 'at_risk_patients', label: 'patients at risk of adverse outcomes' },
            { value: 'healthcare_systems', label: 'healthcare systems managing resource allocation' }
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
- Any key context that helps frame the importance of this work`,
      template: 'Based on {evidence_basis}, there is a clear need to explore new methods for {specific_objective}. Our project will specifically focus on {proposed_approach}, which has shown promise in {approach_justification}. {additional_context}',
      fields: [
        {
          id: 'evidence_basis',
          label: 'Evidence Basis',
          type: 'multiSelect',
          placeholder: 'What evidence supports the need for this research?',
          description: 'Select the primary evidence that demonstrates the need for your research',
          allowOther: true,
          options: [
            { value: 'multiple_clinical_validation_studies', label: 'multiple clinical validation studies' },
            { value: 'systematic_literature_reviews', label: 'systematic literature reviews' },
            { value: 'preliminary_pilot_data', label: 'preliminary pilot data' },
            { value: 'expert_consensus_statements', label: 'expert consensus statements' }
          ]
        },
        {
          id: 'specific_objective',
          label: 'Specific Objective',
          type: 'text',
          placeholder: 'What specific objective will your project pursue?',
          description: 'Enter the primary objective or goal of your research project'
        },
        {
          id: 'proposed_approach',
          label: 'Proposed Approach',
          type: 'select',
          placeholder: 'What is your proposed approach?',
          description: 'Select the primary approach or methodology you will use',
          allowOther: true,
          options: [
            { value: 'explainable_AI_techniques', label: 'explainable AI techniques' },
            { value: 'federated_learning_methods', label: 'federated learning methods' },
            { value: 'hybrid_machine_learning_approaches', label: 'hybrid machine learning approaches' },
            { value: 'novel_deep_learning_architectures', label: 'novel deep learning architectures' }
          ]
        },
        {
          id: 'approach_justification',
          label: 'Approach Justification',
          type: 'select',
          placeholder: 'Why is this approach promising?',
          description: 'Select the primary justification for your chosen approach',
          allowOther: true,
          options: [
            { value: 'strong_theoretical_foundations_and_simulations', label: 'strong theoretical foundations and simulations' },
            { value: 'successful_preliminary_studies', label: 'successful preliminary studies' },
            { value: 'demonstrated_effectiveness_in_similar_contexts', label: 'demonstrated effectiveness in similar contexts' },
            { value: 'validated_performance_metrics', label: 'validated performance metrics' }
          ]
        },
        {
          id: 'additional_context',
          label: 'Additional Context',
          type: 'text',
          placeholder: 'Add any additional context about your research rationale',
          description: 'Optional: Provide any additional context that helps explain the importance or approach of your research',
          optional: true
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
          allowOther: true,
          options: [
            { value: 'recent_systematic_reviews', label: 'recent systematic reviews from the past 2 years' },
            { value: 'validation_studies', label: 'clinical validation studies' },
            { value: 'technical_papers', label: 'technical methodology papers' },
            { value: 'consensus_guidelines', label: 'consensus guidelines and recommendations' }
          ]
        },
        {
          id: 'evidence_impact',
          type: 'select',
          label: 'Evidence Impact',
          placeholder: 'What does this evidence demonstrate?',
          description: 'Select how this evidence supports your approach',
          allowOther: true,
          options: [
            { value: 'feasibility', label: 'the feasibility of our proposed approach' },
            { value: 'clinical_need', label: 'a clear clinical need for this solution' },
            { value: 'technical_validity', label: 'the technical validity of our methods' },
            { value: 'potential_impact', label: 'the potential impact on patient care' }
          ]
        },
        {
          id: 'research_gap_evidence',
          type: 'select',
          label: 'Gap Evidence',
          placeholder: 'How is the research gap documented?',
          description: 'Select how the literature documents the research gap',
          allowOther: true,
          options: [
            { value: 'systematic_gap', label: 'systematic reviews identifying this specific gap' },
            { value: 'failed_approaches', label: 'documentation of previous approaches that failed' },
            { value: 'expert_calls', label: 'expert calls for solutions in this area' },
            { value: 'unmet_needs', label: 'documented unmet clinical needs' }
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
          options: [
            { value: 'mayo_secure', label: 'in Mayo Clinic secure research storage' },
            { value: 'approved_cloud', label: 'in an approved cloud environment' },
            { value: 'dedicated_server', label: 'on a dedicated secure server' }
          ]
        },
        {
          id: 'security_controls',
          type: 'multiSelect' as const,
          label: 'Security Controls',
          placeholder: 'What security controls will be in place?',
          description: 'Select all security controls that will be implemented',
          allowOther: true,
          options: [
            { value: 'encryption', label: 'encryption at rest and in transit' },
            { value: 'access_logging', label: 'comprehensive access logging' },
            { value: 'backup_recovery', label: 'automated backup and recovery' },
            { value: 'monitoring', label: '24/7 security monitoring' }
          ]
        },
        {
          id: 'retention_plan',
          type: 'select' as const,
          label: 'Retention Plan',
          placeholder: 'What is the data retention plan?',
          description: 'Select the data retention approach',
          options: [
            { value: 'standard_retention', label: 'standard Mayo Clinic retention policies' },
            { value: 'extended_retention', label: 'extended retention for long-term research' },
            { value: 'custom_retention', label: 'custom retention based on study requirements' }
          ]
        },
        {
          id: 'access_controls',
          type: 'multiSelect' as const,
          label: 'Access Controls',
          placeholder: 'How will access be controlled?',
          description: 'Select all access control measures',
          allowOther: true,
          options: [
            { value: 'role_based', label: 'role-based access control (RBAC)' },
            { value: 'mfa', label: 'multi-factor authentication (MFA)' },
            { value: 'audit_trails', label: 'detailed audit trails' },
            { value: 'time_limited', label: 'time-limited access grants' }
          ]
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
          allowOther: true,
          options: [
            { value: 'internal', label: 'internal Mayo Clinic researchers' },
            { value: 'academic', label: 'academic research partners' },
            { value: 'industry', label: 'industry collaborators' },
            { value: 'consortium', label: 'research consortium members' }
          ]
        },
        {
          id: 'sharing_method',
          type: 'select' as const,
          label: 'Sharing Method',
          placeholder: 'How will data be shared?',
          description: 'Select the primary method for data sharing',
          options: [
            { value: 'secure_transfer', label: 'secure file transfer protocol' },
            { value: 'api_access', label: 'secure API access' },
            { value: 'shared_environment', label: 'shared secure environment' }
          ]
        },
        {
          id: 'sharing_protections',
          type: 'multiSelect' as const,
          label: 'Sharing Protections',
          placeholder: 'What protections will be in place?',
          description: 'Select all protections for shared data',
          allowOther: true,
          options: [
            { value: 'dua', label: 'data use agreements' },
            { value: 'encryption', label: 'end-to-end encryption' },
            { value: 'access_controls', label: 'strict access controls' },
            { value: 'audit_trails', label: 'comprehensive audit trails' }
          ]
        },
        {
          id: 'usage_restrictions',
          type: 'multiSelect' as const,
          label: 'Usage Restrictions',
          placeholder: 'What restrictions will apply?',
          description: 'Select all applicable usage restrictions',
          allowOther: true,
          options: [
            { value: 'purpose_limited', label: 'purpose-limited use' },
            { value: 'no_redistribution', label: 'no redistribution' },
            { value: 'time_limited', label: 'time-limited access' },
            { value: 'publication_review', label: 'publication review requirements' }
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
          allowOther: true,
          options: [
            { value: 'cardiovascular_disease', label: 'cardiovascular disease' },
            { value: 'cancer', label: 'cancer' },
            { value: 'neurological_disorders', label: 'neurological disorders' },
            { value: 'chronic_conditions', label: 'chronic conditions' }
          ]
        },
        {
          id: 'healthy_controls',
          label: 'Healthy Controls',
          type: 'select',
          placeholder: 'Will you include healthy controls?',
          description: 'Specify if and how you will include healthy controls',
          allowOther: true,
          options: [
            { value: 'with_matched_controls', label: 'and matched healthy controls for comparison' },
            { value: 'no_controls', label: 'without a control group' },
            { value: 'with_historical_controls', label: 'with historical healthy controls' }
          ]
        },
        {
          id: 'age_range',
          label: 'Age Range',
          type: 'select',
          placeholder: 'What is the age range for subjects?',
          description: 'Select the age range for your study population',
          allowOther: true,
          options: [
            { value: 'adults_18_plus', label: '18 years and older' },
            { value: 'adults_65_plus', label: '65 years and older' },
            { value: 'all_ages', label: 'all ages' },
            { value: 'pediatric', label: 'under 18 years' }
          ]
        },
        {
          id: 'sample_size',
          label: 'Total Sample Size',
          type: 'number',
          placeholder: 'How many total participants do you need?',
          description: 'Enter the total number of participants needed for statistical validity',
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
          allowOther: true,
          options: [
            { value: 'fully_deidentified', label: 'fully de-identified according to HIPAA standards' },
            { value: 'limited_dataset', label: 'a limited dataset containing only dates and zip codes' },
            { value: 'coded', label: 'coded with a secure key maintained by the research team' },
            { value: 'identifiable', label: 'identifiable as required for the research objectives' }
          ]
        },
        {
          id: 'deidentification_process',
          label: 'De-identification Process',
          type: 'select',
          placeholder: 'How will data be de-identified?',
          description: 'Select the method for de-identifying data',
          allowOther: true,
          options: [
            { value: 'automated_process', label: 'De-identification will be performed using automated tools and validated by our data management team.' },
            { value: 'manual_review', label: 'Each record will be manually reviewed and de-identified by trained personnel.' },
            { value: 'hybrid_approach', label: 'We will use a combination of automated tools and manual review for de-identification.' }
          ]
        },
        {
          id: 'data_combination',
          label: 'Data Combination',
          type: 'select',
          placeholder: 'Will you combine with non-Mayo data?',
          description: 'Specify if and how you will combine data with non-Mayo sources',
          allowOther: true,
          options: [
            { value: 'no_combination', label: 'This study will use only Mayo Clinic data.' },
            { value: 'public_datasets', label: 'Mayo data will be combined with publicly available datasets.' },
            { value: 'collaborator_data', label: 'Data will be combined with datasets from research collaborators.' }
          ]
        },
        {
          id: 'data_disposition',
          label: 'Data Disposition',
          type: 'select',
          placeholder: 'What happens to the data after the study?',
          description: 'Select the plan for data disposition after study completion',
          allowOther: true,
          options: [
            { value: 'destroy_identifiers', label: 'all identifiers will be destroyed according to HIPAA standards' },
            { value: 'maintain_deidentified', label: 'de-identified data will be maintained for future research' },
            { value: 'archive_secured', label: 'data will be archived in a secure repository' }
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
      template: 'To ensure fairness, our algorithm will {fairness_approach}. The primary beneficiaries will be {beneficiaries}, and {benefit_mechanism}. This Phase 1 study {phase_limitations}. {future_use}',
      fields: [
        {
          id: 'fairness_approach',
          label: 'Fairness Approach',
          type: 'select',
          placeholder: 'How will you ensure algorithmic fairness?',
          description: 'Select the primary approach to ensuring algorithmic fairness',
          allowOther: true,
          options: [
            { value: 'balanced_representation', label: 'be developed using balanced datasets that represent diverse populations' },
            { value: 'bias_testing', label: 'undergo rigorous bias testing across different demographic groups' },
            { value: 'expert_review', label: 'be reviewed by domain experts for potential biases' },
            { value: 'continuous_monitoring', label: 'include continuous monitoring and adjustment for fairness metrics' }
          ]
        },
        {
          id: 'beneficiaries',
          label: 'Primary Beneficiaries',
          type: 'select',
          placeholder: 'Who will benefit from this technology?',
          description: 'Select the primary beneficiaries of your research',
          allowOther: true,
          options: [
            { value: 'patients', label: 'patients receiving care in this clinical domain' },
            { value: 'healthcare_providers', label: 'healthcare providers making clinical decisions' },
            { value: 'researchers', label: 'researchers studying this condition' },
            { value: 'healthcare_system', label: 'the healthcare system through improved efficiency' }
          ]
        },
        {
          id: 'benefit_mechanism',
          label: 'Benefit Mechanism',
          type: 'select',
          placeholder: 'How will they benefit?',
          description: 'Select how the beneficiaries will benefit',
          allowOther: true,
          options: [
            { value: 'improved_accuracy', label: 'will benefit from improved diagnostic accuracy' },
            { value: 'faster_decisions', label: 'will receive faster clinical decisions' },
            { value: 'better_insights', label: 'will gain better insights into the condition' },
            { value: 'reduced_costs', label: 'will experience reduced healthcare costs' }
          ]
        },
        {
          id: 'phase_limitations',
          label: 'Phase 1 Limitations',
          type: 'multiSelect',
          placeholder: 'What are the Phase 1 limitations?',
          description: 'Select all applicable Phase 1 limitations',
          allowOther: true,
          options: [
            { value: 'no_clinical_deployment', label: 'will not be deployed in clinical settings' },
            { value: 'no_medical_decisions', label: 'will not be used for medical decision-making' },
            { value: 'discovery_only', label: 'is limited to discovery and validation' },
            { value: 'no_patient_contact', label: 'involves no direct patient contact' }
          ]
        },
        {
          id: 'future_use',
          label: 'Future Use',
          type: 'text',
          placeholder: 'Any plans for future use?',
          description: 'Optional: Describe any plans for future use of the study results',
          optional: true
        }
      ]
    }
  ]
}; 