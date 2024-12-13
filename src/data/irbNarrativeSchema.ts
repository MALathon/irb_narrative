import { NarrativeModule } from '../types/narrative';

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
- What types of data and resources you'll need
- Who will have access to the data
- How data will be stored and transferred
- Any sensitive data considerations`,
      template: 'To accomplish our research objectives, we will utilize {resource_types}. The study data will be accessible to {data_access_list} and will be securely stored in {storage_location}. {data_transfer_method}{sensitive_data_details}',
      fields: [
        {
          id: 'resource_types',
          label: 'Resource Types',
          type: 'multiSelect',
          placeholder: 'What resources do you need?',
          description: 'Select all the types of data and resources required for your study',
          allowOther: true,
          options: [
            { value: 'electronic_health_records', label: 'electronic health records' },
            { value: 'imaging_data', label: 'medical imaging data' },
            { value: 'laboratory_results', label: 'laboratory test results' },
            { value: 'genetic_data', label: 'genetic/genomic data' },
            { value: 'demographic_data', label: 'demographic information' },
            { value: 'survey_responses', label: 'survey/questionnaire responses' },
            { value: 'device_data', label: 'medical device data' },
            { value: 'biospecimens', label: 'biospecimens' }
          ]
        },
        {
          id: 'data_access_list',
          label: 'Data Access',
          type: 'multiSelect',
          placeholder: 'Who needs access to the data?',
          description: 'Select all individuals or groups who will need access',
          allowOther: true,
          options: [
            { value: 'research_team', label: 'the primary research team' },
            { value: 'mayo_collaborators', label: 'Mayo Clinic collaborators' },
            { value: 'external_collaborators', label: 'external research collaborators' },
            { value: 'data_analysts', label: 'data analysis specialists' },
            { value: 'statisticians', label: 'statistical consultants' }
          ]
        },
        {
          id: 'storage_location',
          label: 'Storage Location',
          type: 'select',
          placeholder: 'Where will the data be stored?',
          description: 'Select the primary storage location for study data',
          allowOther: true,
          options: [
            { value: 'mayo_secure_servers', label: 'Mayo Clinic secure servers' },
            { value: 'approved_cloud_platform', label: 'an approved cloud platform' },
            { value: 'dedicated_research_database', label: 'a dedicated research database' },
            { value: 'institutional_repository', label: 'an institutional data repository' }
          ]
        },
        {
          id: 'data_transfer_method',
          label: 'Data Transfer Method',
          type: 'select',
          placeholder: 'How will data be transferred?',
          description: 'Select the primary method for secure data transfer',
          allowOther: true,
          options: [
            { value: 'secure_file_transfer', label: 'Data will be transferred using secure file transfer protocols.' },
            { value: 'encrypted_transmission', label: 'Data will be transmitted using end-to-end encryption.' },
            { value: 'secure_api', label: 'Data will be accessed through a secure API.' },
            { value: 'direct_database_access', label: 'Data will be accessed directly through secure database connections.' }
          ]
        },
        {
          id: 'sensitive_data_details',
          label: 'Sensitive Data Details',
          type: 'text',
          placeholder: 'Any sensitive data considerations?',
          description: 'Optional: Describe any sensitive data considerations or special handling requirements',
          validation: []
        }
      ]
    },
    {
      id: 'data_security',
      moduleId: 'data_access',
      moduleName: 'Data Access & Resources',
      title: 'Data Security & Protection',
      description: 'Define how you will protect and secure study data.',
      guidance: `In this section, we need you to specify:
- Security measures for data protection
- Access control mechanisms
- Encryption standards
- Monitoring and auditing procedures`,
      template: 'Data security will be maintained through {security_measures}. Access will be controlled via {access_control}, with {encryption_standards} for data protection. {monitoring_procedures}',
      fields: [
        {
          id: 'security_measures',
          label: 'Security Measures',
          type: 'multiSelect',
          placeholder: 'What security measures will you implement?',
          description: 'Select all security measures that will be implemented',
          allowOther: true,
          options: [
            { value: 'firewall_protection', label: 'enterprise-grade firewalls' },
            { value: 'intrusion_detection', label: 'intrusion detection systems' },
            { value: 'access_logging', label: 'comprehensive access logging' },
            { value: 'physical_security', label: 'physical security controls' }
          ]
        },
        {
          id: 'access_control',
          label: 'Access Control',
          type: 'select',
          placeholder: 'How will you control access?',
          description: 'Select the primary access control mechanism',
          allowOther: true,
          options: [
            { value: 'role_based', label: 'role-based access control (RBAC)' },
            { value: 'multi_factor', label: 'multi-factor authentication' },
            { value: 'identity_management', label: 'federated identity management' },
            { value: 'zero_trust', label: 'zero trust architecture' }
          ]
        },
        {
          id: 'encryption_standards',
          label: 'Encryption Standards',
          type: 'select',
          placeholder: 'What encryption standards will you use?',
          description: 'Select the encryption standards to be implemented',
          allowOther: true,
          options: [
            { value: 'aes_256', label: 'AES-256 encryption at rest and in transit' },
            { value: 'tls_1_3', label: 'TLS 1.3 for all data transfers' },
            { value: 'end_to_end', label: 'end-to-end encryption' },
            { value: 'fips_140_2', label: 'FIPS 140-2 compliant encryption' }
          ]
        },
        {
          id: 'monitoring_procedures',
          label: 'Monitoring Procedures',
          type: 'select',
          placeholder: 'How will you monitor data access?',
          description: 'Select the monitoring and auditing procedures',
          allowOther: true,
          options: [
            { value: 'automated_monitoring', label: 'Automated monitoring systems will track all data access and usage.' },
            { value: 'regular_audits', label: 'Regular security audits will be conducted.' },
            { value: 'incident_response', label: 'An incident response plan will be maintained.' },
            { value: 'compliance_checks', label: 'Regular compliance checks will be performed.' }
          ]
        }
      ]
    },
    {
      id: 'data_sharing',
      moduleId: 'data_access',
      moduleName: 'Data Access & Resources',
      title: 'Data Sharing & Collaboration',
      description: 'Define how data will be shared and managed across collaborators.',
      guidance: `In this section, we need you to specify:
- Data sharing agreements
- Collaboration protocols
- Access levels for different teams
- Data transfer procedures`,
      template: 'Data sharing will be governed by {sharing_agreements}. Collaboration will follow {collaboration_protocols}, with {access_levels} for different teams. {transfer_procedures}',
      fields: [
        {
          id: 'sharing_agreements',
          label: 'Sharing Agreements',
          type: 'select',
          placeholder: 'What type of sharing agreements will be used?',
          description: 'Select the type of data sharing agreements',
          allowOther: true,
          options: [
            { value: 'dua', label: 'formal data use agreements (DUAs)' },
            { value: 'mta', label: 'material transfer agreements (MTAs)' },
            { value: 'institutional_agreements', label: 'institutional collaboration agreements' },
            { value: 'confidentiality_agreements', label: 'confidentiality agreements' }
          ]
        },
        {
          id: 'collaboration_protocols',
          label: 'Collaboration Protocols',
          type: 'select',
          placeholder: 'How will collaboration be managed?',
          description: 'Select the primary collaboration protocol',
          allowOther: true,
          options: [
            { value: 'secure_platform', label: 'a secure collaboration platform' },
            { value: 'federated_access', label: 'federated access controls' },
            { value: 'controlled_sharing', label: 'controlled data sharing environments' },
            { value: 'staged_access', label: 'staged access protocols' }
          ]
        },
        {
          id: 'access_levels',
          label: 'Access Levels',
          type: 'multiSelect',
          placeholder: 'What access levels will be implemented?',
          description: 'Select all applicable access levels',
          allowOther: true,
          options: [
            { value: 'full_access', label: 'full access for core team members' },
            { value: 'limited_access', label: 'limited access for collaborators' },
            { value: 'view_only', label: 'view-only access for reviewers' },
            { value: 'no_access', label: 'no access for external parties' }
          ]
        },
        {
          id: 'transfer_procedures',
          label: 'Transfer Procedures',
          type: 'select',
          placeholder: 'How will data be transferred?',
          description: 'Select the primary data transfer procedure',
          allowOther: true,
          options: [
            { value: 'secure_transfer', label: 'Data will be transferred through secure, encrypted channels.' },
            { value: 'api_access', label: 'Access will be provided through secure APIs.' },
            { value: 'controlled_export', label: 'Data exports will be controlled and logged.' },
            { value: 'direct_access', label: 'Direct access will be provided within secure environments.' }
          ]
        }
      ]
    },
    {
      id: 'resource_requirements',
      moduleId: 'data_access',
      moduleName: 'Data Access & Resources',
      title: 'Resource Requirements',
      description: 'Define the computational and storage resources needed.',
      guidance: `In this section, we need you to specify:
- Computational requirements
- Storage needs
- Software dependencies
- Infrastructure requirements`,
      template: 'The study requires {computational_resources} for processing, with {storage_requirements} for data storage. We will utilize {software_requirements} and require {infrastructure_needs}.',
      fields: [
        {
          id: 'computational_resources',
          label: 'Computational Resources',
          type: 'multiSelect',
          placeholder: 'What computational resources are needed?',
          description: 'Select all required computational resources',
          allowOther: true,
          options: [
            { value: 'high_performance', label: 'high-performance computing clusters' },
            { value: 'gpu_resources', label: 'GPU computing resources' },
            { value: 'distributed_computing', label: 'distributed computing systems' },
            { value: 'standard_computing', label: 'standard computing resources' }
          ]
        },
        {
          id: 'storage_requirements',
          label: 'Storage Requirements',
          type: 'select',
          placeholder: 'What are your storage needs?',
          description: 'Select the primary storage requirements',
          allowOther: true,
          options: [
            { value: 'petabyte_scale', label: 'petabyte-scale storage' },
            { value: 'terabyte_scale', label: 'terabyte-scale storage' },
            { value: 'gigabyte_scale', label: 'gigabyte-scale storage' },
            { value: 'elastic_storage', label: 'elastic storage solutions' }
          ]
        },
        {
          id: 'software_requirements',
          label: 'Software Requirements',
          type: 'multiSelect',
          placeholder: 'What software is required?',
          description: 'Select all required software resources',
          allowOther: true,
          options: [
            { value: 'ml_frameworks', label: 'machine learning frameworks' },
            { value: 'data_analysis', label: 'data analysis tools' },
            { value: 'visualization', label: 'visualization software' },
            { value: 'database_systems', label: 'database management systems' }
          ]
        },
        {
          id: 'infrastructure_needs',
          label: 'Infrastructure Needs',
          type: 'select',
          placeholder: 'What infrastructure is needed?',
          description: 'Select the primary infrastructure requirements',
          allowOther: true,
          options: [
            { value: 'cloud_infrastructure', label: 'cloud computing infrastructure' },
            { value: 'on_premise', label: 'on-premise computing resources' },
            { value: 'hybrid_setup', label: 'hybrid cloud-local setup' },
            { value: 'specialized_hardware', label: 'specialized hardware resources' }
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
          description: 'Optional: Provide any additional context about your study population',
          optional: true
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