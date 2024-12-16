import { Sentence } from '../../../types/form';
import { IDENTIFIABILITY_LEVEL_OPTIONS, DEIDENTIFICATION_METHOD_OPTIONS } from '../options';

export const identifiabilitySubmodule: Sentence = {
  template: "The data will be handled at {identifiability_level} identifiability level",
  fields: {
    identifiability_level: {
      id: 'identifiability_level',
      type: 'select',
      label: 'Identifiability Level',
      options: IDENTIFIABILITY_LEVEL_OPTIONS,
      validation: [
        { type: 'required', message: 'Identifiability level is required' }
      ],
      expansions: {
        'deidentified': {
          template: "using {deidentification_method} with {deidentification_details}",
          fields: {
            deidentification_method: {
              id: 'deidentification_method',
              type: 'select',
              label: 'Deidentification Method',
              options: DEIDENTIFICATION_METHOD_OPTIONS,
              validation: [
                { type: 'required', message: 'Deidentification method is required' }
              ]
            },
            deidentification_details: {
              id: 'deidentification_details',
              type: 'text',
              label: 'Deidentification Details',
              validation: [
                { type: 'required', message: 'Deidentification details are required' },
                { type: 'min', value: 20, message: 'Please provide more detail about deidentification process' }
              ]
            }
          }
        }
      }
    }
  }
}; 