import { Sentence } from '../../../types/form';
import { ALGORITHM_TYPE_OPTIONS, CLINICAL_IMPACT_OPTIONS } from '../options';

export const objectiveSubmodule: Sentence = {
  template: "The primary objective is to {primary_objective}",
  fields: {
    primary_objective: {
      id: 'primary_objective',
      type: 'select',
      label: 'Primary Objective',
      options: [
        { value: 'develop_algorithm', label: 'develop an algorithm' },
        { value: 'validate_algorithm', label: 'validate an existing algorithm' },
        { value: 'compare_algorithms', label: 'compare multiple algorithms' }
      ],
      validation: [
        { type: 'required', message: 'Primary objective is required' }
      ],
      expansions: {
        'develop_algorithm': {
          template: "to develop a {algorithm_type} for {clinical_impact}",
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
                { type: 'required', message: 'At least one impact area is required' }
              ]
            }
          }
        },
        'validate_algorithm': {
          template: "to validate {existing_algorithm} for {validation_purpose}",
          fields: {
            existing_algorithm: {
              id: 'existing_algorithm',
              type: 'text',
              label: 'Existing Algorithm',
              validation: [
                { type: 'required', message: 'Existing algorithm name is required' }
              ]
            },
            validation_purpose: {
              id: 'validation_purpose',
              type: 'select',
              label: 'Validation Purpose',
              options: [
                { value: 'clinical_use', label: 'clinical use' },
                { value: 'regulatory', label: 'regulatory submission' },
                { value: 'performance', label: 'performance assessment' }
              ],
              validation: [
                { type: 'required', message: 'Validation purpose is required' }
              ]
            }
          }
        },
        'compare_algorithms': {
          template: "to compare {algorithms_to_compare} in terms of {comparison_metrics}",
          fields: {
            algorithms_to_compare: {
              id: 'algorithms_to_compare',
              type: 'text',
              label: 'Algorithms to Compare',
              validation: [
                { type: 'required', message: 'Please specify the algorithms to compare' }
              ]
            },
            comparison_metrics: {
              id: 'comparison_metrics',
              type: 'text',
              label: 'Comparison Metrics',
              validation: [
                { type: 'required', message: 'Please specify the comparison metrics' }
              ]
            }
          }
        }
      }
    }
  }
}; 