import { Sentence } from '../../../types/form';
import { DATA_SOURCE_OPTIONS, DATA_FORMAT_OPTIONS } from '../options';

export const dataSourcesSubmodule: Sentence = {
  template: "Data will be sourced from {data_sources} in {data_formats} format, requiring {resource_types} resources",
  fields: {
    data_sources: {
      id: 'data_sources',
      type: 'multiSelect',
      label: 'Data Sources',
      options: DATA_SOURCE_OPTIONS,
      validation: [
        { type: 'required', message: 'At least one data source is required' }
      ]
    },
    data_formats: {
      id: 'data_formats',
      type: 'multiSelect',
      label: 'Data Formats',
      options: DATA_FORMAT_OPTIONS,
      validation: [
        { type: 'required', message: 'At least one data format is required' }
      ]
    },
    resource_types: {
      id: 'resource_types',
      type: 'multiSelect',
      label: 'Required Resources',
      options: [
        { value: 'data', label: 'data access' },
        { value: 'video_audio', label: 'video/audio recordings' },
        { value: 'specimens', label: 'specimens' },
        { value: 'images', label: 'images' },
        { value: 'medical_records', label: 'medical records' }
      ],
      validation: [
        { type: 'required', message: 'At least one resource type is required' }
      ]
    }
  },
  children: [
    {
      template: "The data is characterized as {data_identifiability}, with {sensitive_data_types} sensitive information",
      fields: {
        data_identifiability: {
          id: 'data_identifiability',
          type: 'select',
          label: 'Data Identifiability',
          options: [
            { value: 'synthetic', label: 'synthetic dataset' },
            { value: 'deidentified', label: 'deidentified per HIPAA standards' },
            { value: 'limited', label: 'limited dataset' },
            { value: 'coded', label: 'coded with existing key' },
            { value: 'identifiable', label: 'fully identifiable' }
          ],
          validation: [
            { type: 'required', message: 'Data identifiability level is required' }
          ]
        },
        sensitive_data_types: {
          id: 'sensitive_data_types',
          type: 'multiSelect',
          label: 'Sensitive Data Types',
          options: [
            { value: 'psychiatric', label: 'psychiatric information' },
            { value: 'substance', label: 'substance use disorder data' },
            { value: 'hiv', label: 'HIV status' },
            { value: 'genetic', label: 'genetic information' },
            { value: 'illegal', label: 'illegal activities' },
            { value: 'none', label: 'no sensitive information' }
          ],
          validation: [
            { type: 'required', message: 'Please specify sensitive data types or select none' }
          ]
        }
      },
      children: [
        {
          template: "{data_identifiability, select, synthetic {This synthetic dataset was created from {synthetic_source} and is owned by {synthetic_owner}} deidentified {The data was deidentified by {deidentification_party} using {deidentification_method}} limited {The limited dataset includes {limited_data_elements}} coded {The key is maintained by {key_maintainer}} identifiable {Identifiable data will be handled according to {privacy_protocol}}}",
          fields: {
            synthetic_source: {
              id: 'synthetic_source',
              type: 'text',
              label: 'Original Dataset for Synthetic Data',
              validation: [
                { type: 'required', message: 'Source dataset is required for synthetic data' }
              ],
              conditions: [{ field: 'data_identifiability', value: 'synthetic' }]
            },
            synthetic_owner: {
              id: 'synthetic_owner',
              type: 'text',
              label: 'Owner of Original Dataset',
              validation: [
                { type: 'required', message: 'Dataset owner is required for synthetic data' }
              ],
              conditions: [{ field: 'data_identifiability', value: 'synthetic' }]
            },
            deidentification_party: {
              id: 'deidentification_party',
              type: 'text',
              label: 'Responsible for Deidentification',
              validation: [
                { type: 'required', message: 'Party responsible for deidentification is required' }
              ],
              conditions: [{ field: 'data_identifiability', value: 'deidentified' }]
            },
            deidentification_method: {
              id: 'deidentification_method',
              type: 'select',
              label: 'Deidentification Method',
              options: [
                { value: 'hipaa_safe_harbor', label: 'HIPAA Safe Harbor method' },
                { value: 'hipaa_expert', label: 'HIPAA Expert Determination method' },
                { value: 'custom', label: 'Custom deidentification process' }
              ],
              validation: [
                { type: 'required', message: 'Deidentification method is required' }
              ],
              conditions: [{ field: 'data_identifiability', value: 'deidentified' }]
            },
            limited_data_elements: {
              id: 'limited_data_elements',
              type: 'multiSelect',
              label: 'Limited Dataset Elements',
              options: [
                { value: 'dates', label: 'dates of service' },
                { value: 'age', label: 'ages over 89' },
                { value: 'zip', label: 'geographic information' }
              ],
              validation: [
                { type: 'required', message: 'Elements included in limited dataset must be specified' }
              ],
              conditions: [{ field: 'data_identifiability', value: 'limited' }]
            },
            key_maintainer: {
              id: 'key_maintainer',
              type: 'text',
              label: 'Key Maintainer',
              validation: [
                { type: 'required', message: 'Key maintainer is required for coded data' }
              ],
              conditions: [{ field: 'data_identifiability', value: 'coded' }]
            },
            privacy_protocol: {
              id: 'privacy_protocol',
              type: 'select',
              label: 'Privacy Protocol',
              options: [
                { value: 'hipaa', label: 'standard HIPAA protocols' },
                { value: 'enhanced', label: 'enhanced privacy measures' },
                { value: 'custom', label: 'custom privacy protocol' }
              ],
              validation: [
                { type: 'required', message: 'Privacy protocol is required for identifiable data' }
              ],
              conditions: [{ field: 'data_identifiability', value: 'identifiable' }]
            }
          },
          children: [
            {
              template: "The required health information includes {health_info}, with the following identifiers: {hipaa_identifiers}",
              fields: {
                health_info: {
                  id: 'health_info',
                  type: 'multiSelect',
                  label: 'Required Health Information',
                  options: [
                    { value: 'demographics', label: 'demographics' },
                    { value: 'diagnoses', label: 'diagnoses' },
                    { value: 'procedures', label: 'procedures' },
                    { value: 'medications', label: 'medications' },
                    { value: 'lab_results', label: 'laboratory results' },
                    { value: 'vitals', label: 'vital signs' }
                  ],
                  validation: [
                    { type: 'required', message: 'Required health information must be specified' }
                  ]
                },
                hipaa_identifiers: {
                  id: 'hipaa_identifiers',
                  type: 'multiSelect',
                  label: 'HIPAA Identifiers',
                  options: [
                    { value: 'dates', label: 'dates' },
                    { value: 'mrn', label: 'medical record numbers' },
                    { value: 'device_id', label: 'device identifiers' },
                    { value: 'none', label: 'no HIPAA identifiers' }
                  ],
                  validation: [
                    { type: 'required', message: 'Please specify HIPAA identifiers or select none' }
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  ]
}; 