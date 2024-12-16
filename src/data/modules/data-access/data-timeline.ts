import { Sentence } from '../../../types/form';
import { DATE_PATTERN, VALIDATION_MESSAGES } from '../../../constants/form';

export const timelineSubmodule: Sentence = {
  template: "Data will be collected from {start_date} to {end_date}, with updates occurring {update_frequency}",
  fields: {
    start_date: {
      id: 'start_date',
      type: 'text',
      label: 'Start Date',
      validation: [
        { type: 'required', message: VALIDATION_MESSAGES.required },
        { type: 'pattern', value: DATE_PATTERN, message: VALIDATION_MESSAGES.pattern.date }
      ]
    },
    end_date: {
      id: 'end_date',
      type: 'text',
      label: 'End Date',
      validation: [
        { type: 'required', message: VALIDATION_MESSAGES.required },
        { type: 'pattern', value: DATE_PATTERN, message: VALIDATION_MESSAGES.pattern.date }
      ]
    },
    update_frequency: {
      id: 'update_frequency',
      type: 'select',
      label: 'Update Frequency',
      options: [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'one_time', label: 'One Time Only' }
      ],
      validation: [
        { type: 'required', message: VALIDATION_MESSAGES.required }
      ]
    }
  },
  children: [
    {
      template: "The data will be {storage_location, select, mayo_servers {stored on Mayo Clinic secure servers} cloud {stored in a secure cloud environment with {cloud_vendor}} vendor {stored with our third-party vendor {vendor_name}}}",
      fields: {
        storage_location: {
          id: 'storage_location',
          type: 'select',
          label: 'Storage Location',
          options: [
            { value: 'mayo_servers', label: 'Mayo Clinic secure servers' },
            { value: 'cloud', label: 'Secure cloud environment' },
            { value: 'vendor', label: 'Third-party vendor' }
          ],
          validation: [
            { type: 'required', message: 'Storage location is required' }
          ]
        },
        cloud_vendor: {
          id: 'cloud_vendor',
          type: 'select',
          label: 'Cloud Vendor',
          options: [
            { value: 'aws', label: 'Amazon Web Services (AWS)' },
            { value: 'azure', label: 'Microsoft Azure' },
            { value: 'gcp', label: 'Google Cloud Platform' }
          ],
          validation: [
            { type: 'required', message: 'Cloud vendor must be specified' }
          ],
          conditions: [{ field: 'storage_location', value: 'cloud' }]
        },
        vendor_name: {
          id: 'vendor_name',
          type: 'text',
          label: 'Vendor Name',
          validation: [
            { type: 'required', message: 'Vendor name is required' }
          ],
          conditions: [{ field: 'storage_location', value: 'vendor' }]
        }
      },
      children: [
        {
          template: "Access to the data will be provided to {mayo_access} within Mayo Clinic and {external_access} outside Mayo Clinic",
          fields: {
            mayo_access: {
              id: 'mayo_access',
              type: 'multiSelect',
              label: 'Mayo Clinic Data Access',
              options: [
                { value: 'research_team', label: 'research team members' },
                { value: 'statisticians', label: 'statisticians' },
                { value: 'data_scientists', label: 'data scientists' },
                { value: 'collaborators', label: 'Mayo collaborators' }
              ],
              validation: [
                { type: 'required', message: 'Mayo Clinic data access must be specified' }
              ]
            },
            external_access: {
              id: 'external_access',
              type: 'multiSelect',
              label: 'External Data Access',
              options: [
                { value: 'none', label: 'no external access' },
                { value: 'collaborators', label: 'external collaborators' },
                { value: 'vendors', label: 'third-party vendors' },
                { value: 'sponsors', label: 'study sponsors' }
              ],
              validation: [
                { type: 'required', message: 'External data access must be specified' }
              ]
            }
          },
          children: [
            {
              template: "Data transfers will be conducted using {transfer_method}, with {access_control} access controls",
              fields: {
                transfer_method: {
                  id: 'transfer_method',
                  type: 'select',
                  label: 'Data Transfer Method',
                  options: [
                    { value: 'encrypted_sftp', label: 'encrypted SFTP' },
                    { value: 'secure_api', label: 'secure API endpoints' },
                    { value: 'secure_vpn', label: 'secure VPN tunnel' }
                  ],
                  validation: [
                    { type: 'required', message: 'Transfer method is required' }
                  ]
                },
                access_control: {
                  id: 'access_control',
                  type: 'select',
                  label: 'Access Control Level',
                  options: [
                    { value: 'role_based', label: 'role-based' },
                    { value: 'multi_factor', label: 'multi-factor authentication' },
                    { value: 'ip_restricted', label: 'IP-restricted' }
                  ],
                  validation: [
                    { type: 'required', message: 'Access control level is required' }
                  ]
                }
              },
              children: [
                {
                  template: "Data sharing will be {external_access, select, none {not planned for external parties} * {governed by {data_agreements} for external parties}}. Future use of this data {future_use, select, planned {is planned for {future_purpose}} possible {may be considered for {potential_use}} none {is not anticipated}}",
                  fields: {
                    data_agreements: {
                      id: 'data_agreements',
                      type: 'multiSelect',
                      label: 'Data Sharing Agreements',
                      options: [
                        { value: 'dua', label: 'data use agreements' },
                        { value: 'mta', label: 'material transfer agreements' },
                        { value: 'baa', label: 'business associate agreements' },
                        { value: 'nda', label: 'non-disclosure agreements' }
                      ],
                      validation: [
                        { type: 'required', message: 'Data sharing agreements must be specified' }
                      ],
                      conditions: [{ field: 'external_access', value: ['collaborators', 'vendors', 'sponsors'] }]
                    },
                    future_use: {
                      id: 'future_use',
                      type: 'select',
                      label: 'Future Use Plans',
                      options: [
                        { value: 'planned', label: 'Planned future use' },
                        { value: 'possible', label: 'Possible future use' },
                        { value: 'none', label: 'No future use planned' }
                      ],
                      validation: [
                        { type: 'required', message: 'Future use plans must be specified' }
                      ]
                    },
                    future_purpose: {
                      id: 'future_purpose',
                      type: 'text',
                      label: 'Future Purpose',
                      validation: [
                        { type: 'required', message: 'Future purpose must be specified' }
                      ],
                      conditions: [{ field: 'future_use', value: 'planned' }]
                    },
                    potential_use: {
                      id: 'potential_use',
                      type: 'text',
                      label: 'Potential Future Use',
                      validation: [
                        { type: 'required', message: 'Potential use must be specified' }
                      ],
                      conditions: [{ field: 'future_use', value: 'possible' }]
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}; 