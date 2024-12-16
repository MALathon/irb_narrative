import { Sentence } from '../../../types/form';
import { SECURITY_MEASURES_OPTIONS, ACCESS_CONTROL_OPTIONS } from '../options';

export const securitySubmodule: Sentence = {
  template: "Security measures will include {security_measures} with the following specific protocols: {security_protocols}",
  fields: {
    security_measures: {
      id: 'security_measures',
      type: 'multiSelect',
      label: 'Security Measures',
      options: SECURITY_MEASURES_OPTIONS,
      validation: [
        { type: 'required', message: 'At least one security measure is required' }
      ]
    },
    security_protocols: {
      id: 'security_protocols',
      type: 'text',
      label: 'Security Protocols',
      validation: [
        { type: 'required', message: 'Security protocols are required' },
        { type: 'min', value: 20, message: 'Please provide more detail about security protocols' }
      ]
    }
  },
  children: [
    {
      template: "Access controls will be implemented using {access_control_methods} to ensure {access_control_purpose}",
      fields: {
        access_control_methods: {
          id: 'access_control_methods',
          type: 'multiSelect',
          label: 'Access Control Methods',
          options: ACCESS_CONTROL_OPTIONS,
          validation: [
            { type: 'required', message: 'At least one access control method is required' }
          ]
        },
        access_control_purpose: {
          id: 'access_control_purpose',
          type: 'text',
          label: 'Access Control Purpose',
          validation: [
            { type: 'required', message: 'Access control purpose is required' },
            { type: 'min', value: 20, message: 'Please provide more detail about access control purpose' }
          ]
        }
      }
    }
  ]
}; 