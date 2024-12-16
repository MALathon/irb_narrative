import { Sentence } from '../../../types/form';

export const dataTimelineSubmodule: Sentence = {
  template: "Data collection will occur {collection_period} with {access_pattern}",
  fields: {
    collection_period: {
      id: 'collection_period',
      type: 'select',
      label: 'Collection Period',
      options: [
        { value: 'one_time', label: 'as a one-time extraction' },
        { value: 'ongoing', label: 'on an ongoing basis' },
        { value: 'periodic', label: 'at periodic intervals' }
      ],
      validation: [
        { type: 'required', message: 'Collection period is required' }
      ],
      expansions: {
        'periodic': {
          template: "every {frequency} from {start_date} to {end_date}",
          fields: {
            frequency: {
              id: 'frequency',
              type: 'select',
              label: 'Update Frequency',
              options: [
                { value: 'daily', label: 'day' },
                { value: 'weekly', label: 'week' },
                { value: 'monthly', label: 'month' },
                { value: 'quarterly', label: 'quarter' }
              ],
              validation: [
                { type: 'required', message: 'Update frequency is required' }
              ]
            },
            start_date: {
              id: 'start_date',
              type: 'text',
              label: 'Start Date',
              validation: [
                { type: 'required', message: 'Start date is required' }
              ]
            },
            end_date: {
              id: 'end_date',
              type: 'text',
              label: 'End Date',
              validation: [
                { type: 'required', message: 'End date is required' }
              ]
            }
          }
        },
        'one_time': {
          template: "on {extraction_date}",
          fields: {
            extraction_date: {
              id: 'extraction_date',
              type: 'text',
              label: 'Extraction Date',
              validation: [
                { type: 'required', message: 'Extraction date is required' }
              ]
            }
          }
        }
      }
    },
    access_pattern: {
      id: 'access_pattern',
      type: 'select',
      label: 'Access Pattern',
      options: [
        { value: 'immediate', label: 'immediate access upon collection' },
        { value: 'staged', label: 'staged access based on project phases' },
        { value: 'conditional', label: 'conditional access based on requirements' }
      ],
      validation: [
        { type: 'required', message: 'Access pattern is required' }
      ],
      expansions: {
        'staged': {
          template: "where {access_phases}",
          fields: {
            access_phases: {
              id: 'access_phases',
              type: 'text',
              label: 'Access Phases',
              validation: [
                { type: 'required', message: 'Access phases are required' }
              ]
            }
          }
        },
        'conditional': {
          template: "requiring {access_requirements}",
          fields: {
            access_requirements: {
              id: 'access_requirements',
              type: 'text',
              label: 'Access Requirements',
              validation: [
                { type: 'required', message: 'Access requirements are required' }
              ]
            }
          }
        }
      }
    }
  }
}; 