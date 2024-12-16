import { Sentence } from '../../../types/form';

export const outcomesSubmodule: Sentence = {
  template: "The expected outcomes include {primary_outcome}, with {benefit_population}. {future_use}",
  fields: {
    primary_outcome: {
      id: 'primary_outcome',
      type: 'select',
      label: 'Primary Outcome',
      options: [
        { value: 'improved_accuracy', label: 'improved diagnostic accuracy' },
        { value: 'reduced_time', label: 'reduced time to diagnosis' },
        { value: 'better_prediction', label: 'better prediction of patient outcomes' },
        { value: 'novel_insights', label: 'novel insights into disease patterns' }
      ],
      validation: [
        { type: 'required', message: 'Primary outcome is required' }
      ],
      expansions: {
        'improved_accuracy': {
          template: "targeting an improvement of {accuracy_target} through {accuracy_method}",
          fields: {
            accuracy_target: {
              id: 'accuracy_target',
              type: 'text',
              label: 'Accuracy Target',
              validation: [
                { type: 'required', message: 'Accuracy target is required' }
              ]
            },
            accuracy_method: {
              id: 'accuracy_method',
              type: 'select',
              label: 'Accuracy Method',
              options: [
                { value: 'sensitivity', label: 'enhanced sensitivity' },
                { value: 'specificity', label: 'improved specificity' },
                { value: 'balanced', label: 'balanced performance metrics' }
              ],
              validation: [
                { type: 'required', message: 'Accuracy method is required' }
              ]
            }
          }
        },
        'better_prediction': {
          template: "with a focus on {prediction_metric} for {target_population}",
          fields: {
            prediction_metric: {
              id: 'prediction_metric',
              type: 'select',
              label: 'Prediction Metric',
              options: [
                { value: 'risk_stratification', label: 'risk stratification' },
                { value: 'treatment_response', label: 'treatment response' },
                { value: 'disease_progression', label: 'disease progression' }
              ],
              validation: [
                { type: 'required', message: 'Prediction metric is required' }
              ]
            },
            target_population: {
              id: 'target_population',
              type: 'text',
              label: 'Target Population',
              validation: [
                { type: 'required', message: 'Target population is required' }
              ]
            }
          }
        }
      }
    },
    benefit_population: {
      id: 'benefit_population',
      type: 'select',
      label: 'Population Benefit',
      options: [
        { value: 'direct_benefit', label: 'direct benefits to the study population' },
        { value: 'broader_benefit', label: 'broader benefits to similar patient groups' },
        { value: 'general_benefit', label: 'general advancement of medical knowledge' }
      ],
      validation: [
        { type: 'required', message: 'Population benefit is required' }
      ],
      expansions: {
        'direct_benefit': {
          template: "specifically {benefit_type} for {specific_population}",
          fields: {
            benefit_type: {
              id: 'benefit_type',
              type: 'text',
              label: 'Benefit Type',
              validation: [
                { type: 'required', message: 'Benefit type is required' }
              ]
            },
            specific_population: {
              id: 'specific_population',
              type: 'text',
              label: 'Specific Population',
              validation: [
                { type: 'required', message: 'Specific population is required' }
              ]
            }
          }
        }
      }
    },
    future_use: {
      id: 'future_use',
      type: 'select',
      label: 'Future Use Plans',
      options: [
        { value: 'planned_use', label: 'The data will be used in future studies' },
        { value: 'possible_use', label: 'The data may be used in future studies' },
        { value: 'no_use', label: 'No future use of the data is planned' }
      ],
      validation: [
        { type: 'required', message: 'Future use plan is required' }
      ],
      expansions: {
        'planned_use': {
          template: "with plans for {future_purpose} under {oversight_type}",
          fields: {
            future_purpose: {
              id: 'future_purpose',
              type: 'text',
              label: 'Future Purpose',
              validation: [
                { type: 'required', message: 'Future purpose is required' }
              ]
            },
            oversight_type: {
              id: 'oversight_type',
              type: 'select',
              label: 'Oversight Type',
              options: [
                { value: 'irb_oversight', label: 'continued IRB oversight' },
                { value: 'data_committee', label: 'data governance committee review' },
                { value: 'institutional', label: 'institutional review process' }
              ],
              validation: [
                { type: 'required', message: 'Oversight type is required' }
              ]
            }
          }
        }
      }
    }
  }
}; 