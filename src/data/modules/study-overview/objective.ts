import { Sentence } from '../../../types/form';
import { ALGORITHM_TYPE_OPTIONS, CLINICAL_IMPACT_OPTIONS } from '../options';

export const objectiveSubmodule: Sentence = {
  template: "The primary objective is to {primary_objective}, ensuring {data_privacy} and {algorithmic_fairness}",
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
              ],
              expansions: {
                'ml_model': {
                  template: "using {model_type} with {feature_engineering}",
                  fields: {
                    model_type: {
                      id: 'model_type',
                      type: 'select',
                      label: 'Model Type',
                      options: [
                        { value: 'supervised', label: 'supervised learning' },
                        { value: 'unsupervised', label: 'unsupervised learning' }
                      ],
                      validation: [
                        { type: 'required', message: 'Model type is required' }
                      ],
                      expansions: {
                        'supervised': {
                          template: "trained on {training_data} to predict {target_variable}",
                          fields: {
                            training_data: {
                              id: 'training_data',
                              type: 'select',
                              label: 'Training Data',
                              options: [
                                { value: 'labeled_data', label: 'labeled historical data' },
                                { value: 'synthetic_data', label: 'synthetic data' }
                              ],
                              validation: [
                                { type: 'required', message: 'Training data type is required' }
                              ]
                            },
                            target_variable: {
                              id: 'target_variable',
                              type: 'text',
                              label: 'Target Variable',
                              validation: [
                                { type: 'required', message: 'Target variable is required' }
                              ]
                            }
                          }
                        },
                        'unsupervised': {
                          template: "to discover {pattern_type} in {data_domain}",
                          fields: {
                            pattern_type: {
                              id: 'pattern_type',
                              type: 'select',
                              label: 'Pattern Type',
                              options: [
                                { value: 'clusters', label: 'natural clusters' },
                                { value: 'anomalies', label: 'anomalies' }
                              ],
                              validation: [
                                { type: 'required', message: 'Pattern type is required' }
                              ]
                            },
                            data_domain: {
                              id: 'data_domain',
                              type: 'text',
                              label: 'Data Domain',
                              validation: [
                                { type: 'required', message: 'Data domain is required' }
                              ]
                            }
                          }
                        }
                      }
                    },
                    feature_engineering: {
                      id: 'feature_engineering',
                      type: 'text',
                      label: 'Feature Engineering',
                      validation: [
                        { type: 'required', message: 'Feature engineering approach is required' }
                      ]
                    }
                  }
                },
                'deep_learning': {
                  template: "with {architecture_type} for {application_domain}",
                  fields: {
                    architecture_type: {
                      id: 'architecture_type',
                      type: 'select',
                      label: 'Architecture Type',
                      options: [
                        { value: 'cnn', label: 'convolutional neural networks' },
                        { value: 'transformer', label: 'transformer models' }
                      ],
                      validation: [
                        { type: 'required', message: 'Architecture type is required' }
                      ]
                    },
                    application_domain: {
                      id: 'application_domain',
                      type: 'text',
                      label: 'Application Domain',
                      validation: [
                        { type: 'required', message: 'Application domain is required' }
                      ]
                    }
                  }
                }
              }
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
    },
    data_privacy: {
      id: 'data_privacy',
      type: 'select',
      label: 'Data Privacy',
      options: [
        { value: 'synthetic', label: 'using synthetic data' },
        { value: 'deidentified', label: 'using deidentified data per HIPAA standards' },
        { value: 'limited', label: 'using a limited dataset' },
        { value: 'coded', label: 'using coded data' },
        { value: 'identifiable', label: 'using identifiable data' }
      ],
      validation: [
        { type: 'required', message: 'Data privacy approach is required' }
      ],
      expansions: {
        'synthetic': {
          template: "generated from {original_dataset} by {synthetic_method}",
          fields: {
            original_dataset: {
              id: 'original_dataset',
              type: 'text',
              label: 'Original Dataset',
              validation: [
                { type: 'required', message: 'Original dataset information is required' }
              ]
            },
            synthetic_method: {
              id: 'synthetic_method',
              type: 'select',
              label: 'Synthetic Method',
              options: [
                { value: 'gan', label: 'generative adversarial networks' },
                { value: 'statistical', label: 'statistical modeling' },
                { value: 'simulation', label: 'simulation methods' }
              ],
              validation: [
                { type: 'required', message: 'Synthetic method is required' }
              ]
            }
          }
        },
        'deidentified': {
          template: "with deidentification performed by {deidentification_entity} using {deidentification_method}",
          fields: {
            deidentification_entity: {
              id: 'deidentification_entity',
              type: 'text',
              label: 'Deidentification Entity',
              validation: [
                { type: 'required', message: 'Deidentification entity is required' }
              ]
            },
            deidentification_method: {
              id: 'deidentification_method',
              type: 'select',
              label: 'Deidentification Method',
              options: [
                { value: 'safe_harbor', label: 'HIPAA Safe Harbor method' },
                { value: 'expert', label: 'expert determination method' },
                { value: 'automated', label: 'automated deidentification tools' }
              ],
              validation: [
                { type: 'required', message: 'Deidentification method is required' }
              ]
            }
          }
        }
      }
    },
    algorithmic_fairness: {
      id: 'algorithmic_fairness',
      type: 'select',
      label: 'Algorithmic Fairness',
      options: [
        { value: 'balanced_representation', label: 'balanced population representation' },
        { value: 'bias_mitigation', label: 'explicit bias mitigation' },
        { value: 'fairness_metrics', label: 'fairness metrics monitoring' }
      ],
      validation: [
        { type: 'required', message: 'Algorithmic fairness approach is required' }
      ],
      expansions: {
        'balanced_representation': {
          template: "through {sampling_strategy} and {validation_approach}",
          fields: {
            sampling_strategy: {
              id: 'sampling_strategy',
              type: 'select',
              label: 'Sampling Strategy',
              options: [
                { value: 'stratified', label: 'stratified sampling' },
                { value: 'weighted', label: 'weighted sampling' },
                { value: 'oversampling', label: 'minority oversampling' }
              ],
              validation: [
                { type: 'required', message: 'Sampling strategy is required' }
              ]
            },
            validation_approach: {
              id: 'validation_approach',
              type: 'select',
              label: 'Validation Approach',
              options: [
                { value: 'cross_validation', label: 'cross-demographic validation' },
                { value: 'subgroup', label: 'subgroup performance analysis' },
                { value: 'external', label: 'external validation cohorts' }
              ],
              validation: [
                { type: 'required', message: 'Validation approach is required' }
              ]
            }
          }
        },
        'bias_mitigation': {
          template: "using {bias_detection} and {mitigation_strategy}",
          fields: {
            bias_detection: {
              id: 'bias_detection',
              type: 'select',
              label: 'Bias Detection',
              options: [
                { value: 'statistical', label: 'statistical bias testing' },
                { value: 'algorithmic', label: 'algorithmic fairness metrics' },
                { value: 'expert', label: 'expert review panels' }
              ],
              validation: [
                { type: 'required', message: 'Bias detection method is required' }
              ]
            },
            mitigation_strategy: {
              id: 'mitigation_strategy',
              type: 'select',
              label: 'Mitigation Strategy',
              options: [
                { value: 'preprocessing', label: 'preprocessing techniques' },
                { value: 'inprocessing', label: 'in-processing constraints' },
                { value: 'postprocessing', label: 'postprocessing adjustments' }
              ],
              validation: [
                { type: 'required', message: 'Mitigation strategy is required' }
              ]
            }
          }
        }
      }
    }
  }
}; 