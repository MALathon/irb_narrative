import { NarrativeSchema } from '../types/narrative';

export const irbNarrativeSchema: NarrativeSchema = {
  sections: [
    {
      id: 'introduction',
      title: 'Study Introduction and Rationale',
      description: 'Explain why this study is necessary and provide supporting literature.',
      template: 'This research project, titled "{projectTitle}", aims to address an important gap in our understanding of {condition}. Based on published literature, including {literatureRefs}, there is a recognized need to explore {researchGap}. By undertaking this investigation, we hope to refine or discover methods in the field of AI/ML that could improve how we identify, predict, or understand this health condition.',
      fields: [
        {
          id: 'projectTitle',
          type: 'text',
          label: 'Project Title',
          placeholder: 'Enter project title',
          validation: [{ type: 'required', message: 'Project title is required' }],
          metadata: {
            category: 'basic',
            importance: 'required',
          },
        },
        {
          id: 'condition',
          type: 'text',
          label: 'Condition of Interest',
          placeholder: 'Enter condition or disease of interest',
          validation: [{ type: 'required', message: 'Condition is required' }],
          metadata: {
            category: 'basic',
            importance: 'required',
          },
        },
        {
          id: 'literatureRefs',
          type: 'textArea',
          label: 'Literature References',
          placeholder: 'Enter key literature references that support your approach',
          validation: [{ type: 'required', message: 'Literature references are required' }],
          helpText: 'Include citations that support your data collection methods and analysis approach',
          metadata: {
            category: 'basic',
            importance: 'required',
          },
        },
        {
          id: 'researchGap',
          type: 'textArea',
          label: 'Research Gap',
          placeholder: 'Describe the gap in current knowledge',
          validation: [{ type: 'required', message: 'Research gap description is required' }],
          metadata: {
            category: 'basic',
            importance: 'required',
          },
        },
      ],
      metadata: {
        category: 'introduction',
        importance: 'required',
      },
    },
    {
      id: 'studyPopulation',
      title: 'Study Population',
      template: 'Our study will focus on {diagnosis} {includeHealthyControls, select: with | without} healthy controls. {healthyControlsText} The study will include participants aged between {minAge} and {maxAge} years.',
      fields: [
        {
          id: 'diagnosis',
          type: 'text',
          label: 'Primary Diagnosis/Disease',
          validation: [{ type: 'required', message: 'Primary diagnosis is required' }],
          metadata: {
            category: 'population',
            importance: 'required',
          },
        },
        {
          id: 'includeHealthyControls',
          type: 'radio',
          label: 'Include Healthy Controls?',
          options: [
            { value: 'yes', label: 'Yes', triggers: { showFields: ['healthyControlsText'] } },
            { value: 'no', label: 'No' },
          ],
          validation: [{ type: 'required', message: 'Please specify if healthy controls will be included' }],
          metadata: {
            category: 'population',
            importance: 'required',
          },
        },
        {
          id: 'healthyControlsText',
          type: 'textArea',
          label: 'Explain Healthy Controls Usage',
          dependsOn: { fieldId: 'includeHealthyControls', value: 'yes' },
          placeholder: 'Explain why healthy controls are necessary and how they will be used',
          metadata: {
            category: 'population',
            importance: 'required',
          },
        },
        {
          id: 'minAge',
          type: 'number',
          label: 'Minimum Age',
          validation: [
            { type: 'required', message: 'Minimum age is required' },
            { type: 'min', value: 0, message: 'Minimum age must be 0 or greater' },
          ],
          metadata: {
            category: 'population',
            importance: 'required',
          },
        },
        {
          id: 'maxAge',
          type: 'number',
          label: 'Maximum Age',
          validation: [
            { type: 'required', message: 'Maximum age is required' },
            { type: 'min', value: 0, message: 'Maximum age must be 0 or greater' },
          ],
          metadata: {
            category: 'population',
            importance: 'required',
          },
        },
      ],
      metadata: {
        category: 'population',
        importance: 'required',
      },
    },
    {
      id: 'resources',
      title: 'Study Resources and Data Access',
      template: 'To accomplish our aims, we will utilize the following resources: {resourceTypes}. {dataAccessDetails}',
      fields: [
        {
          id: 'resourceTypes',
          type: 'multiSelect',
          label: 'Resource Types',
          options: [
            { value: 'data', label: 'Data (e.g., electronic health records)' },
            { value: 'video', label: 'Video/Audio recordings' },
            { value: 'specimens', label: 'Specimens' },
            { value: 'images', label: 'Images' },
            { value: 'medical_records', label: 'Medical Records' },
            { value: 'other_irb', label: 'Data from another IRB' },
          ],
          validation: [{ type: 'required', message: 'At least one resource type is required' }],
        },
        {
          id: 'otherIrbNumber',
          type: 'text',
          label: 'Other IRB Number(s)',
          dependsOn: { fieldId: 'resourceTypes', value: 'other_irb', condition: 'contains' },
          placeholder: 'Enter IRB number(s)',
        },
        {
          id: 'dataAccessDetails',
          type: 'textArea',
          label: 'Data Access Details',
          placeholder: 'Describe who will have access to the study data',
          validation: [{ type: 'required', message: 'Data access details are required' }],
        },
      ],
      dynamicContent: [
        {
          condition: { fieldId: 'resourceTypes', value: 'data', operator: 'contains' },
          content: 'The data will be stored securely in {dataStorage} and accessed by {dataAccess}.',
        },
      ],
    },
    {
      id: 'dataIdentifiability',
      title: 'Data Identifiability and Privacy',
      template: 'The dataset we will use can be characterized as {identifiabilityLevel}. {identifiabilityDetails}',
      fields: [
        {
          id: 'identifiabilityLevel',
          type: 'select',
          label: 'Identifiability Level',
          options: [
            { 
              value: 'synthetic', 
              label: 'Synthetic dataset',
              triggers: { showFields: ['syntheticSource', 'syntheticOwner'] }
            },
            { 
              value: 'deidentified', 
              label: 'Deidentified per HIPAA standards',
              triggers: { showFields: ['deidentificationResponsible', 'deidentificationMethod'] }
            },
            { 
              value: 'limited', 
              label: 'Limited dataset',
              triggers: { showFields: ['limitedDatasetElements'] }
            },
            { 
              value: 'coded', 
              label: 'Coded data',
              triggers: { showFields: ['codeKeyMaintainer'] }
            },
            { value: 'identifiable', label: 'Fully identifiable' },
          ],
          validation: [{ type: 'required', message: 'Identifiability level is required' }],
        },
        {
          id: 'syntheticSource',
          type: 'textArea',
          label: 'Original Dataset Description',
          dependsOn: { fieldId: 'identifiabilityLevel', value: 'synthetic' },
        },
        {
          id: 'syntheticOwner',
          type: 'text',
          label: 'Dataset Owner',
          dependsOn: { fieldId: 'identifiabilityLevel', value: 'synthetic' },
        },
        {
          id: 'deidentificationResponsible',
          type: 'text',
          label: 'Responsible for Deidentification',
          dependsOn: { fieldId: 'identifiabilityLevel', value: 'deidentified' },
        },
        {
          id: 'deidentificationMethod',
          type: 'textArea',
          label: 'Deidentification Method',
          dependsOn: { fieldId: 'identifiabilityLevel', value: 'deidentified' },
        },
        {
          id: 'limitedDatasetElements',
          type: 'multiSelect',
          label: 'Limited Dataset Elements',
          dependsOn: { fieldId: 'identifiabilityLevel', value: 'limited' },
          options: [
            { value: 'dates', label: 'Dates' },
            { value: 'zip', label: 'ZIP Codes' },
            { value: 'age_over_89', label: 'Ages over 89' },
          ],
        },
        {
          id: 'codeKeyMaintainer',
          type: 'text',
          label: 'Code Key Maintainer',
          dependsOn: { fieldId: 'identifiabilityLevel', value: 'coded' },
        },
      ],
    },
    {
      id: 'sensitiveData',
      title: 'Sensitive Data Collection',
      template: '{hasSensitiveData, select: This study will | This study will not} collect sensitive data. {sensitiveDataDetails}',
      fields: [
        {
          id: 'hasSensitiveData',
          type: 'radio',
          label: 'Will you collect sensitive data?',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
          validation: [{ type: 'required', message: 'Please specify if sensitive data will be collected' }],
        },
        {
          id: 'sensitiveDataTypes',
          type: 'multiSelect',
          label: 'Types of Sensitive Data',
          dependsOn: { fieldId: 'hasSensitiveData', value: 'yes' },
          options: [
            { value: 'psychiatric', label: 'Psychiatric Information' },
            { value: 'substance', label: 'Substance Use Disorder' },
            { value: 'hiv', label: 'HIV Status' },
            { value: 'genetic', label: 'Genetic Information' },
            { value: 'abuse', label: 'Abuse History' },
            { value: 'illegal', label: 'Illegal Activities' },
            { value: 'other', label: 'Other Sensitive Data' },
          ],
        },
        {
          id: 'sensitiveDataDetails',
          type: 'textArea',
          label: 'Sensitive Data Details',
          dependsOn: { fieldId: 'hasSensitiveData', value: 'yes' },
          placeholder: 'Describe the sensitive data and additional safeguards',
        },
      ],
    },
    {
      id: 'dataTimeframe',
      title: 'Data Collection Timeframe',
      template: 'The data used in this study was collected between {startDate} and {endDate} for baseline analysis{hasFollowup, select:, with follow-up data through {followupDate} | }.',
      fields: [
        {
          id: 'startDate',
          type: 'date',
          label: 'Start Date',
          validation: [{ type: 'required', message: 'Start date is required' }],
        },
        {
          id: 'endDate',
          type: 'date',
          label: 'End Date',
          validation: [{ type: 'required', message: 'End date is required' }],
        },
        {
          id: 'hasFollowup',
          type: 'radio',
          label: 'Include Follow-up Data?',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 'followupDate',
          type: 'date',
          label: 'Follow-up End Date',
          dependsOn: { fieldId: 'hasFollowup', value: 'yes' },
        },
      ],
    },
    {
      id: 'sampleSize',
      title: 'Sample Size and Statistical Power',
      template: 'To draw meaningful conclusions, we require {totalRecords} total records, with {mayoRecords} sourced from Mayo Clinic. {powerJustification}',
      fields: [
        {
          id: 'totalRecords',
          type: 'number',
          label: 'Total Records Needed',
          validation: [
            { type: 'required', message: 'Total number of records is required' },
            { type: 'min', value: 1, message: 'Must be greater than 0' },
          ],
        },
        {
          id: 'mayoRecords',
          type: 'number',
          label: 'Mayo Clinic Records',
          validation: [
            { type: 'required', message: 'Number of Mayo records is required' },
            { type: 'min', value: 0, message: 'Cannot be negative' },
          ],
        },
        {
          id: 'powerJustification',
          type: 'textArea',
          label: 'Statistical Power Justification',
          placeholder: 'Explain how you determined the required sample size',
          validation: [{ type: 'required', message: 'Power justification is required' }],
        },
      ],
    },
    {
      id: 'algorithmicFairness',
      title: 'Algorithmic Fairness and Harm Prevention',
      template: 'Our algorithm will ensure fairness through {fairnessMethods}. The primary beneficiaries of this technology will be {beneficiaries}, and the findings will benefit the source population by {populationBenefit}.',
      fields: [
        {
          id: 'fairnessMethods',
          type: 'multiSelect',
          label: 'Fairness Methods',
          options: [
            { value: 'balanced_training', label: 'Balanced Training Sets' },
            { value: 'bias_audit', label: 'Regular Bias Audits' },
            { value: 'stratified_sampling', label: 'Stratified Sampling' },
            { value: 'demographic_parity', label: 'Demographic Parity' },
            { value: 'equal_opportunity', label: 'Equal Opportunity' },
            { value: 'other', label: 'Other Methods' },
          ],
          validation: [{ type: 'required', message: 'At least one fairness method is required' }],
        },
        {
          id: 'otherFairnessMethod',
          type: 'textArea',
          label: 'Other Fairness Method Details',
          dependsOn: { fieldId: 'fairnessMethods', value: 'other', condition: 'contains' },
        },
        {
          id: 'beneficiaries',
          type: 'textArea',
          label: 'Technology Beneficiaries',
          placeholder: 'Describe who will benefit from this technology and why',
          validation: [{ type: 'required', message: 'Beneficiaries description is required' }],
        },
        {
          id: 'populationBenefit',
          type: 'textArea',
          label: 'Population Benefit',
          placeholder: 'Explain how the source population will benefit',
          validation: [{ type: 'required', message: 'Population benefit explanation is required' }],
        },
      ],
    },
    {
      id: 'phase1Limitations',
      title: 'Phase 1 Limitations and Compliance',
      template: 'This research is conducted under Phase 1 limitations, which means: {limitations}',
      fields: [
        {
          id: 'limitations',
          type: 'checkbox',
          label: 'Phase 1 Compliance',
          options: [
            { 
              value: 'secondary_only', 
              label: 'Limited to review of medical records/secondary data'
            },
            { 
              value: 'no_epic', 
              label: 'Output will not enter live medical environments (e.g., Epic)'
            },
            { 
              value: 'no_deployment', 
              label: 'Algorithm will not be deployed in healthcare systems'
            },
            { 
              value: 'no_provider_exposure', 
              label: 'Healthcare providers will not see output before patient care'
            },
            { 
              value: 'ideation_only', 
              label: 'Limited to ideation, not individual conclusions'
            },
          ],
          validation: [
            { 
              type: 'custom', 
              message: 'All Phase 1 limitations must be acknowledged',
              customValidator: (value: string[]) => value.length === 5
            }
          ],
        },
      ],
    },
    {
      id: 'hipaaIdentifiers',
      title: 'HIPAA Identifiers',
      template: 'This study will collect the following HIPAA identifiers: {hipaaIdentifiers}. {identifierJustification}',
      fields: [
        {
          id: 'hipaaIdentifiers',
          type: 'multiSelect',
          label: 'HIPAA Identifiers',
          options: [
            { value: 'names', label: 'Names' },
            { value: 'dates', label: 'Dates' },
            { value: 'mrn', label: 'Medical Record Numbers' },
            { value: 'device_ids', label: 'Device Identifiers' },
            { value: 'email', label: 'Email Addresses' },
            { value: 'phone', label: 'Phone Numbers' },
            { value: 'address', label: 'Geographic Data' },
            { value: 'ssn', label: 'Social Security Numbers' },
            { value: 'other', label: 'Other Identifiers' },
            { value: 'none', label: 'No HIPAA Identifiers' },
          ],
          validation: [{ type: 'required', message: 'HIPAA identifier selection is required' }],
        },
        {
          id: 'otherIdentifiers',
          type: 'textArea',
          label: 'Other Identifier Details',
          dependsOn: { fieldId: 'hipaaIdentifiers', value: 'other', condition: 'contains' },
        },
        {
          id: 'identifierJustification',
          type: 'textArea',
          label: 'Identifier Usage Justification',
          dependsOn: { 
            fieldId: 'hipaaIdentifiers', 
            value: 'none', 
            condition: 'not' 
          },
          placeholder: 'Explain why these identifiers are necessary',
        },
      ],
    },
  ],
  metadata: {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    institution: 'Mayo Clinic',
    type: 'AI/ML',
  },
}; 