import { Sentence } from '../../../types/form';

export const populationTypeSubmodule: Sentence = {
  template: "The study will analyze {population_type} with {condition_details}",
  fields: {
    population_type: {
      id: 'population_type',
      type: 'select',
      label: 'Population Type',
      options: [
        { value: 'patients_only', label: 'patients with the condition of interest' },
        { value: 'patients_and_controls', label: 'both patients and healthy controls' },
        { value: 'general_population', label: 'general population data' }
      ],
      validation: [
        { type: 'required', message: 'Population type is required' }
      ],
      expansions: {
        'patients_and_controls': {
          template: "including subjects aged {age_range} years, where {control_details}",
          fields: {
            age_range: {
              id: 'age_range',
              type: 'text',
              label: 'Age Range (e.g., "18-65")',
              validation: [
                { type: 'required', message: 'Age range is required' }
              ]
            },
            control_details: {
              id: 'control_details',
              type: 'select',
              label: 'Control Group Details',
              options: [
                { value: 'matched_controls', label: 'healthy controls will be matched by age and demographics' },
                { value: 'random_controls', label: 'healthy controls will be randomly selected' },
                { value: 'specific_controls', label: 'controls will be selected based on specific criteria' }
              ],
              validation: [
                { type: 'required', message: 'Control group details are required' }
              ],
              expansions: {
                'specific_controls': {
                  template: "meeting the following criteria: {control_criteria}",
                  fields: {
                    control_criteria: {
                      id: 'control_criteria',
                      type: 'text',
                      label: 'Control Selection Criteria',
                      validation: [
                        { type: 'required', message: 'Control selection criteria are required' }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    condition_details: {
      id: 'condition_details',
      type: 'select',
      label: 'Condition Details',
      options: [
        { value: 'single_condition', label: 'a single primary condition' },
        { value: 'multiple_conditions', label: 'multiple related conditions' },
        { value: 'condition_spectrum', label: 'a spectrum of related conditions' }
      ],
      validation: [
        { type: 'required', message: 'Condition details are required' }
      ],
      expansions: {
        'single_condition': {
          template: "focusing on {specific_condition}",
          fields: {
            specific_condition: {
              id: 'specific_condition',
              type: 'text',
              label: 'Specific Condition',
              validation: [
                { type: 'required', message: 'Specific condition is required' }
              ]
            }
          }
        },
        'multiple_conditions': {
          template: "including {condition_list}",
          fields: {
            condition_list: {
              id: 'condition_list',
              type: 'text',
              label: 'List of Conditions',
              validation: [
                { type: 'required', message: 'List of conditions is required' }
              ]
            }
          }
        }
      }
    }
  }
}; 