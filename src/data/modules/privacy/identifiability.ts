import { Sentence } from '../../../types/form';

export const identifiabilitySubmodule: Sentence = {
  template: "The data will be {identifiability_level} and {sensitive_data_handling}",
  fields: {
    identifiability_level: {
      id: 'identifiability_level',
      type: 'select',
      label: 'Identifiability Level',
      options: [
        { value: 'synthetic', label: 'synthetic data' },
        { value: 'deidentified', label: 'deidentified per HIPAA standards' },
        { value: 'limited', label: 'a limited dataset' },
        { value: 'coded', label: 'coded with identifiers' },
        { value: 'identifiable', label: 'fully identifiable' }
      ],
      validation: [
        { type: 'required', message: 'Identifiability level is required' }
      ],
      expansions: {
        'synthetic': {
          template: "generated from {original_dataset} by {synthetic_method}, owned by {dataset_owner}",
          fields: {
            original_dataset: {
              id: 'original_dataset',
              type: 'text',
              label: 'Original Dataset',
              validation: [
                { type: 'required', message: 'Original dataset information is required' }
              ]
            },
            synthetic_method: {
              id: 'synthetic_method',
              type: 'select',
              label: 'Synthetic Method',
              options: [
                { value: 'gan', label: 'generative adversarial networks' },
                { value: 'statistical', label: 'statistical modeling' },
                { value: 'simulation', label: 'simulation methods' }
              ],
              validation: [
                { type: 'required', message: 'Synthetic method is required' }
              ]
            },
            dataset_owner: {
              id: 'dataset_owner',
              type: 'text',
              label: 'Dataset Owner',
              validation: [
                { type: 'required', message: 'Dataset owner is required' }
              ]
            }
          }
        },
        'deidentified': {
          template: "with deidentification performed by {deidentification_entity} using {deidentification_method}",
          fields: {
            deidentification_entity: {
              id: 'deidentification_entity',
              type: 'text',
              label: 'Deidentification Entity',
              validation: [
                { type: 'required', message: 'Deidentification entity is required' }
              ]
            },
            deidentification_method: {
              id: 'deidentification_method',
              type: 'select',
              label: 'Deidentification Method',
              options: [
                { value: 'safe_harbor', label: 'HIPAA Safe Harbor method' },
                { value: 'expert', label: 'expert determination method' },
                { value: 'automated', label: 'automated deidentification tools' }
              ],
              validation: [
                { type: 'required', message: 'Deidentification method is required' }
              ]
            }
          }
        },
        'coded': {
          template: "where the key is maintained by {key_maintainer} with {key_security}",
          fields: {
            key_maintainer: {
              id: 'key_maintainer',
              type: 'text',
              label: 'Key Maintainer',
              validation: [
                { type: 'required', message: 'Key maintainer is required' }
              ]
            },
            key_security: {
              id: 'key_security',
              type: 'select',
              label: 'Key Security',
              options: [
                { value: 'separate_storage', label: 'separate secure storage' },
                { value: 'restricted_access', label: 'restricted access controls' },
                { value: 'encrypted', label: 'encryption protocols' }
              ],
              validation: [
                { type: 'required', message: 'Key security method is required' }
              ]
            }
          }
        }
      }
    },
    sensitive_data_handling: {
      id: 'sensitive_data_handling',
      type: 'select',
      label: 'Sensitive Data Handling',
      options: [
        { value: 'no_sensitive', label: 'contains no sensitive information' },
        { value: 'contains_sensitive', label: 'includes sensitive information' }
      ],
      validation: [
        { type: 'required', message: 'Sensitive data handling is required' }
      ],
      expansions: {
        'contains_sensitive': {
          template: "includes {sensitive_types} requiring {protection_measures}",
          fields: {
            sensitive_types: {
              id: 'sensitive_types',
              type: 'multiSelect',
              label: 'Sensitive Data Types',
              options: [
                { value: 'psychiatric', label: 'psychiatric information' },
                { value: 'substance', label: 'substance use disorder data' },
                { value: 'hiv', label: 'HIV status' },
                { value: 'genetic', label: 'genetic information' },
                { value: 'illegal', label: 'illegal activities' }
              ],
              validation: [
                { type: 'required', message: 'Sensitive data types must be specified' }
              ]
            },
            protection_measures: {
              id: 'protection_measures',
              type: 'select',
              label: 'Protection Measures',
              options: [
                { value: 'enhanced_security', label: 'enhanced security protocols' },
                { value: 'restricted_access', label: 'strictly restricted access' },
                { value: 'special_handling', label: 'special handling procedures' }
              ],
              validation: [
                { type: 'required', message: 'Protection measures are required' }
              ]
            }
          }
        }
      }
    }
  }
}; 