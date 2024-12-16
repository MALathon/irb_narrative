import { Sentence } from '../../../types/form';

export const outcomesSubmodule: Sentence = {
  template: "The anticipated outcomes include {anticipated_outcomes}, which will be measured through {outcome_measures}",
  fields: {
    anticipated_outcomes: {
      id: 'anticipated_outcomes',
      type: 'text',
      label: 'Anticipated Outcomes',
      validation: [
        { type: 'required', message: 'Anticipated outcomes are required' },
        { type: 'min', value: 20, message: 'Please provide more detail about anticipated outcomes' }
      ]
    },
    outcome_measures: {
      id: 'outcome_measures',
      type: 'text',
      label: 'Outcome Measures',
      validation: [
        { type: 'required', message: 'Outcome measures are required' },
        { type: 'min', value: 20, message: 'Please provide more detail about outcome measures' }
      ]
    }
  }
}; 