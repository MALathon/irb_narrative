import { Sentence } from '../../../types/form';

export const overviewSubmodule: Sentence = {
  template: "This {study_type} research project titled '{study_title}' aims to {research_gap}, based on {literature_support}",
  fields: {
    study_title: {
      id: 'study_title',
      type: 'text',
      label: 'Study Title',
      validation: [
        { type: 'required', message: 'Study title is required' }
      ]
    },
    study_type: {
      id: 'study_type',
      type: 'select',
      label: 'Study Type',
      options: [
        { value: 'retrospective', label: 'retrospective' },
        { value: 'prospective', label: 'prospective' },
        { value: 'hybrid', label: 'hybrid' }
      ],
      validation: [
        { type: 'required', message: 'Study type is required' }
      ],
      expansions: {
        'retrospective': {
          template: "analyzing data collected between {date_range_start} and {date_range_end}",
          fields: {
            date_range_start: {
              id: 'date_range_start',
              type: 'text',
              label: 'Start Date',
              validation: [
                { type: 'required', message: 'Start date is required' }
              ]
            },
            date_range_end: {
              id: 'date_range_end',
              type: 'text',
              label: 'End Date',
              validation: [
                { type: 'required', message: 'End date is required' }
              ]
            }
          }
        }
      }
    },
    research_gap: {
      id: 'research_gap',
      type: 'select',
      label: 'Research Gap',
      options: [
        { value: 'improve_diagnosis', label: 'address gaps in current diagnostic methods' },
        { value: 'enhance_prediction', label: 'enhance prediction of clinical outcomes' },
        { value: 'optimize_treatment', label: 'optimize treatment selection' },
        { value: 'identify_patterns', label: 'identify novel patterns in clinical data' }
      ],
      validation: [
        { type: 'required', message: 'Research gap is required' }
      ],
      expansions: {
        'improve_diagnosis': {
          template: "specifically focusing on {diagnosis_area} through {diagnostic_approach}",
          fields: {
            diagnosis_area: {
              id: 'diagnosis_area',
              type: 'text',
              label: 'Diagnosis Area',
              validation: [
                { type: 'required', message: 'Diagnosis area is required' }
              ]
            },
            diagnostic_approach: {
              id: 'diagnostic_approach',
              type: 'select',
              label: 'Diagnostic Approach',
              options: [
                { value: 'image_analysis', label: 'automated image analysis' },
                { value: 'nlp', label: 'natural language processing of clinical notes' },
                { value: 'multimodal', label: 'multimodal data integration' }
              ],
              validation: [
                { type: 'required', message: 'Diagnostic approach is required' }
              ]
            }
          }
        }
      }
    },
    literature_support: {
      id: 'literature_support',
      type: 'text',
      label: 'Literature Support',
      validation: [
        { type: 'required', message: 'Literature support is required' }
      ]
    }
  }
}; 