import { Sentence } from '../../../types/form';

export const dataSourcesSubmodule: Sentence = {
  template: "The study will utilize {data_types} with access provided to {access_groups}",
  fields: {
    data_types: {
      id: 'data_types',
      type: 'multiSelect',
      label: 'Data Types',
      options: [
        { value: 'medical_records', label: 'medical records' },
        { value: 'imaging', label: 'imaging data' },
        { value: 'lab_results', label: 'laboratory results' },
        { value: 'biospecimens', label: 'biospecimens' },
        { value: 'device_data', label: 'medical device data' },
        { value: 'external_irb', label: 'data from another IRB protocol' }
      ],
      validation: [
        { type: 'required', message: 'At least one data type is required' }
      ],
      expansions: {
        'external_irb': {
          template: "(IRB #{irb_number})",
          fields: {
            irb_number: {
              id: 'irb_number',
              type: 'text',
              label: 'IRB Number',
              validation: [
                { type: 'required', message: 'IRB number is required' }
              ]
            }
          }
        }
      }
    },
    access_groups: {
      id: 'access_groups',
      type: 'select',
      label: 'Access Groups',
      options: [
        { value: 'mayo_only', label: 'Mayo personnel only' },
        { value: 'mayo_and_partners', label: 'Mayo personnel and research partners' },
        { value: 'multi_institution', label: 'multiple institutions' }
      ],
      validation: [
        { type: 'required', message: 'Access group specification is required' }
      ],
      expansions: {
        'mayo_and_partners': {
          template: "including {mayo_personnel} and {external_partners} under {data_agreements}",
          fields: {
            mayo_personnel: {
              id: 'mayo_personnel',
              type: 'text',
              label: 'Mayo Personnel',
              validation: [
                { type: 'required', message: 'Mayo personnel list is required' }
              ]
            },
            external_partners: {
              id: 'external_partners',
              type: 'text',
              label: 'External Partners',
              validation: [
                { type: 'required', message: 'External partners list is required' }
              ]
            },
            data_agreements: {
              id: 'data_agreements',
              type: 'select',
              label: 'Data Agreements',
              options: [
                { value: 'dua', label: 'appropriate data use agreements' },
                { value: 'mta', label: 'material transfer agreements' },
                { value: 'collaboration', label: 'research collaboration agreements' }
              ],
              validation: [
                { type: 'required', message: 'Data agreement type is required' }
              ]
            }
          }
        },
        'multi_institution': {
          template: "with {data_sharing_method} and {security_controls}",
          fields: {
            data_sharing_method: {
              id: 'data_sharing_method',
              type: 'select',
              label: 'Data Sharing Method',
              options: [
                { value: 'secure_transfer', label: 'secure file transfer protocols' },
                { value: 'api_access', label: 'secure API access' },
                { value: 'shared_environment', label: 'shared secure environment' }
              ],
              validation: [
                { type: 'required', message: 'Data sharing method is required' }
              ]
            },
            security_controls: {
              id: 'security_controls',
              type: 'select',
              label: 'Security Controls',
              options: [
                { value: 'encryption', label: 'end-to-end encryption' },
                { value: 'access_control', label: 'role-based access control' },
                { value: 'audit_logging', label: 'comprehensive audit logging' }
              ],
              validation: [
                { type: 'required', message: 'Security controls are required' }
              ]
            }
          }
        }
      }
    }
  }
}; 