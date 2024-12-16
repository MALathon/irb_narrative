import { Sentence } from '../../../types/form';
import { ALGORITHM_TYPE_OPTIONS, CLINICAL_IMPACT_OPTIONS } from '../options';

export const algorithmTypeSubmodule: Sentence = {
  template: "The study will develop a {algorithm_type} with intended clinical impact on {clinical_impact}",
  fields: {
    algorithm_type: {
      id: 'algorithm_type',
      type: 'select',
      label: 'Algorithm Type',
      options: ALGORITHM_TYPE_OPTIONS,
      validation: [
        { type: 'required', message: 'Algorithm type is required' }
      ]
    },
    clinical_impact: {
      id: 'clinical_impact',
      type: 'multiSelect',
      label: 'Clinical Impact Areas',
      options: CLINICAL_IMPACT_OPTIONS,
      validation: [
        { type: 'required', message: 'At least one clinical impact area is required' }
      ]
    }
  },
  children: [
    {
      template: "The algorithm's design will ensure {fairness_approach} to mitigate potential biases",
      fields: {
        fairness_approach: {
          id: 'fairness_approach',
          type: 'text',
          label: 'Fairness Approach',
          validation: [
            { type: 'required', message: 'Fairness approach is required' },
            { type: 'min', value: 20, message: 'Please provide more detail about the fairness approach' }
          ]
        }
      }
    }
  ]
}; 