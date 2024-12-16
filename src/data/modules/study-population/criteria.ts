import { Sentence } from '../../../types/form';
import { INCLUSION_CRITERIA_OPTIONS, EXCLUSION_CRITERIA_OPTIONS } from '../options';

export const criteriaSubmodule: Sentence = {
  template: "Inclusion criteria will require {inclusion_criteria}, with specific requirements including {inclusion_details}",
  fields: {
    inclusion_criteria: {
      id: 'inclusion_criteria',
      type: 'multiSelect',
      label: 'Inclusion Criteria',
      options: INCLUSION_CRITERIA_OPTIONS,
      validation: [
        { type: 'required', message: 'At least one inclusion criterion is required' }
      ]
    },
    inclusion_details: {
      id: 'inclusion_details',
      type: 'text',
      label: 'Inclusion Details',
      validation: [
        { type: 'required', message: 'Inclusion details are required' },
        { type: 'min', value: 20, message: 'Please provide more detail about inclusion criteria' }
      ]
    }
  },
  children: [
    {
      template: "Exclusion criteria will include {exclusion_criteria}, specifically {exclusion_details}",
      fields: {
        exclusion_criteria: {
          id: 'exclusion_criteria',
          type: 'multiSelect',
          label: 'Exclusion Criteria',
          options: EXCLUSION_CRITERIA_OPTIONS,
          validation: [
            { type: 'required', message: 'At least one exclusion criterion is required' }
          ]
        },
        exclusion_details: {
          id: 'exclusion_details',
          type: 'text',
          label: 'Exclusion Details',
          validation: [
            { type: 'required', message: 'Exclusion details are required' },
            { type: 'min', value: 20, message: 'Please provide more detail about exclusion criteria' }
          ]
        }
      }
    }
  ]
}; 