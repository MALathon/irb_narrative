import { Sentence } from '../../../types/form';

export const securitySubmodule: Sentence = {
  template: "The data will be {storage_location} with {retention_plan}",
  fields: {
    storage_location: {
      id: 'storage_location',
      type: 'select',
      label: 'Storage Location',
      options: [
        { value: 'mayo_servers', label: 'stored on Mayo Clinic secure servers' },
        { value: 'approved_cloud', label: 'stored in an approved cloud environment' },
        { value: 'distributed', label: 'stored across secure institutional systems' }
      ],
      validation: [
        { type: 'required', message: 'Storage location is required' }
      ],
      expansions: {
        'approved_cloud': {
          template: "managed by {cloud_provider} with {security_measures}",
          fields: {
            cloud_provider: {
              id: 'cloud_provider',
              type: 'text',
              label: 'Cloud Provider',
              validation: [
                { type: 'required', message: 'Cloud provider is required' }
              ]
            },
            security_measures: {
              id: 'security_measures',
              type: 'select',
              label: 'Security Measures',
              options: [
                { value: 'encryption', label: 'encryption at rest and in transit' },
                { value: 'hipaa_compliant', label: 'HIPAA-compliant infrastructure' },
                { value: 'custom_security', label: 'custom security protocols' }
              ],
              validation: [
                { type: 'required', message: 'Security measures are required' }
              ]
            }
          }
        },
        'distributed': {
          template: "with {access_controls} and {audit_measures}",
          fields: {
            access_controls: {
              id: 'access_controls',
              type: 'select',
              label: 'Access Controls',
              options: [
                { value: 'role_based', label: 'role-based access control' },
                { value: 'multi_factor', label: 'multi-factor authentication' },
                { value: 'ip_restricted', label: 'IP-restricted access' }
              ],
              validation: [
                { type: 'required', message: 'Access controls are required' }
              ]
            },
            audit_measures: {
              id: 'audit_measures',
              type: 'select',
              label: 'Audit Measures',
              options: [
                { value: 'comprehensive', label: 'comprehensive audit logging' },
                { value: 'access_tracking', label: 'access tracking' },
                { value: 'automated_alerts', label: 'automated alerts' }
              ],
              validation: [
                { type: 'required', message: 'Audit measures are required' }
              ]
            }
          }
        }
      }
    },
    retention_plan: {
      id: 'retention_plan',
      type: 'select',
      label: 'Retention Plan',
      options: [
        { value: 'destroy_identifiers', label: 'all identifiers will be destroyed upon collection' },
        { value: 'retain_coded', label: 'retained in coded form' },
        { value: 'maintain_identifiable', label: 'maintained with identifiers' }
      ],
      validation: [
        { type: 'required', message: 'Retention plan is required' }
      ],
      expansions: {
        'retain_coded': {
          template: "using {coding_method} with {retention_period}",
          fields: {
            coding_method: {
              id: 'coding_method',
              type: 'select',
              label: 'Coding Method',
              options: [
                { value: 'key_file', label: 'separate key file' },
                { value: 'hash_function', label: 'one-way hash function' },
                { value: 'token_system', label: 'token-based system' }
              ],
              validation: [
                { type: 'required', message: 'Coding method is required' }
              ]
            },
            retention_period: {
              id: 'retention_period',
              type: 'text',
              label: 'Retention Period',
              validation: [
                { type: 'required', message: 'Retention period is required' }
              ]
            }
          }
        },
        'maintain_identifiable': {
          template: "with {justification} under {security_protocol}",
          fields: {
            justification: {
              id: 'justification',
              type: 'text',
              label: 'Retention Justification',
              validation: [
                { type: 'required', message: 'Justification for maintaining identifiers is required' }
              ]
            },
            security_protocol: {
              id: 'security_protocol',
              type: 'select',
              label: 'Security Protocol',
              options: [
                { value: 'enhanced_security', label: 'enhanced security measures' },
                { value: 'dual_auth', label: 'dual authentication' },
                { value: 'monitored_access', label: 'monitored access system' }
              ],
              validation: [
                { type: 'required', message: 'Security protocol is required' }
              ]
            }
          }
        }
      }
    }
  }
}; 