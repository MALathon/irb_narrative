import { Sentence } from '../../../types/form';

export const sampleSizeSubmodule: Sentence = {
  template: "To draw statistically meaningful conclusions, the study requires {total_sample_size} records in total, with {mayo_sample_size} from Mayo Clinic",
  fields: {
    total_sample_size: {
      id: 'total_sample_size',
      type: 'text',
      label: 'Total Sample Size',
      validation: [
        { type: 'required', message: 'Total sample size is required' }
      ],
      expansions: {
        'has_value': {
          template: "based on {power_calculation}",
          fields: {
            power_calculation: {
              id: 'power_calculation',
              type: 'select',
              label: 'Power Calculation Basis',
              options: [
                { value: 'prior_studies', label: 'prior similar studies in the field' },
                { value: 'pilot_data', label: 'preliminary pilot data' },
                { value: 'statistical_power', label: 'statistical power analysis' }
              ],
              validation: [
                { type: 'required', message: 'Power calculation basis is required' }
              ]
            }
          }
        }
      }
    },
    mayo_sample_size: {
      id: 'mayo_sample_size',
      type: 'text',
      label: 'Mayo Clinic Sample Size',
      validation: [
        { type: 'required', message: 'Mayo Clinic sample size is required' }
      ],
      expansions: {
        'external_data': {
          template: "and {external_records} from {external_sources}",
          fields: {
            external_records: {
              id: 'external_records',
              type: 'text',
              label: 'External Records Count',
              validation: [
                { type: 'required', message: 'External records count is required' }
              ]
            },
            external_sources: {
              id: 'external_sources',
              type: 'text',
              label: 'External Data Sources',
              validation: [
                { type: 'required', message: 'External data sources are required' }
              ]
            }
          }
        }
      }
    }
  }
}; 