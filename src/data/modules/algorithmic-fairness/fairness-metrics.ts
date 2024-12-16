import { Sentence } from '../../../types/form';
import { FAIRNESS_METRICS_OPTIONS, PROTECTED_ATTRIBUTES_OPTIONS } from '../options';

export const fairnessMetricsSubmodule: Sentence = {
  template: "Algorithm fairness will be evaluated using {fairness_metrics} with specific attention to {protected_attributes}",
  fields: {
    fairness_metrics: {
      id: 'fairness_metrics',
      type: 'multiSelect',
      label: 'Fairness Metrics',
      options: FAIRNESS_METRICS_OPTIONS,
      validation: [
        { type: 'required', message: 'At least one fairness metric is required' }
      ]
    },
    protected_attributes: {
      id: 'protected_attributes',
      type: 'multiSelect',
      label: 'Protected Attributes',
      options: PROTECTED_ATTRIBUTES_OPTIONS,
      validation: [
        { type: 'required', message: 'At least one protected attribute is required' }
      ]
    }
  },
  children: [
    {
      template: "The evaluation process will include {evaluation_frequency} assessments with {mitigation_strategy} for addressing identified biases",
      fields: {
        evaluation_frequency: {
          id: 'evaluation_frequency',
          type: 'select',
          label: 'Evaluation Frequency',
          options: [
            { value: 'continuous', label: 'continuous' },
            { value: 'periodic', label: 'periodic' },
            { value: 'milestone', label: 'at key milestones' }
          ],
          validation: [
            { type: 'required', message: 'Evaluation frequency is required' }
          ]
        },
        mitigation_strategy: {
          id: 'mitigation_strategy',
          type: 'text',
          label: 'Mitigation Strategy',
          validation: [
            { type: 'required', message: 'Mitigation strategy is required' },
            { type: 'min', value: 20, message: 'Please provide more detail about the mitigation strategy' }
          ]
        }
      }
    }
  ]
}; 