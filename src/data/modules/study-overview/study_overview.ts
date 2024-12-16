import { Sentence } from '../../../types/form';
import { STUDY_TYPE_OPTIONS, CLINICAL_DOMAIN_OPTIONS } from '../options';
import { objectiveSubmodule } from './objective';
import { outcomesSubmodule } from './outcomes';

export const studyOverviewPage: Sentence = {
  template: "This {study_type} study aims to {primary_objective}",
  fields: {
    study_type: {
      id: 'study_type',
      type: 'select',
      label: 'Study Type',
      options: STUDY_TYPE_OPTIONS,
      validation: [
        { type: 'required', message: 'Study type is required' }
      ]
    },
    ...objectiveSubmodule.fields
  },
  children: [
    {
      template: "The study will focus on {clinical_domain} with an emphasis on {specific_focus}",
      fields: {
        clinical_domain: {
          id: 'clinical_domain',
          type: 'multiSelect',
          label: 'Clinical Domains',
          options: CLINICAL_DOMAIN_OPTIONS,
          validation: [
            { type: 'required', message: 'At least one clinical domain is required' }
          ]
        },
        specific_focus: {
          id: 'specific_focus',
          type: 'text',
          label: 'Specific Focus',
          validation: [
            { type: 'required', message: 'Specific focus is required' },
            { type: 'min', value: 10, message: 'Please provide more detail about the specific focus' }
          ]
        }
      }
    },
    outcomesSubmodule
  ]
}; 