import { Sentence } from '../../../types/form';

export const sampleSizeSubmodule: Sentence = {
  template: "The target sample size is {sample_size} patients, with {mayo_sample_size} from Mayo Clinic",
  fields: {
    sample_size: {
      id: 'sample_size',
      type: 'number',
      label: 'Total Sample Size',
      validation: [
        { type: 'required', message: 'Sample size is required' },
        { type: 'min', value: 1, message: 'Sample size must be greater than 0' }
      ]
    },
    mayo_sample_size: {
      id: 'mayo_sample_size',
      type: 'number',
      label: 'Mayo Sample Size',
      validation: [
        { type: 'required', message: 'Mayo sample size is required' },
        { type: 'min', value: 0, message: 'Mayo sample size must be 0 or greater' }
      ],
      conditions: [
        {
          field: 'sample_size',
          value: 0,
          show: ['mayo_sample_size']
        }
      ]
    }
  }
}; 