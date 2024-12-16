import { Sentence } from '../../../types/form';
import { POPULATION_TYPE_OPTIONS } from '../options';

export const populationTypeSubmodule: Sentence = {
  template: "The study will include {population_type}",
  fields: {
    population_type: {
      id: 'population_type',
      type: 'select',
      label: 'Population Type',
      options: POPULATION_TYPE_OPTIONS,
      validation: [
        { type: 'required', message: 'Population type is required' }
      ],
      expansions: {
        'specific_condition': {
          template: "with {condition_name} who meet the following criteria: {condition_criteria}",
          fields: {
            condition_name: {
              id: 'condition_name',
              type: 'text',
              label: 'Condition Name',
              validation: [
                { type: 'required', message: 'Condition name is required' }
              ]
            },
            condition_criteria: {
              id: 'condition_criteria',
              type: 'text',
              label: 'Condition Criteria',
              validation: [
                { type: 'required', message: 'Condition criteria are required' },
                { type: 'min', value: 20, message: 'Please provide more detail about the condition criteria' }
              ]
            }
          }
        },
        'age_group': {
          template: "aged {age_range} years old",
          fields: {
            age_range: {
              id: 'age_range',
              type: 'text',
              label: 'Age Range',
              validation: [
                { type: 'required', message: 'Age range is required' },
                { type: 'pattern', value: /^\d+(-\d+)?$/, message: 'Please enter a valid age range (e.g., 18-65)' }
              ]
            }
          }
        }
      }
    }
  }
}; 