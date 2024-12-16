import { Sentence } from '../../../types/form';

export const criteriaSubmodule: Sentence = {
  template: "Study participants must meet {inclusion_criteria} and will be excluded if {exclusion_criteria}",
  fields: {
    inclusion_criteria: {
      id: 'inclusion_criteria',
      type: 'select',
      label: 'Inclusion Criteria',
      options: [
        { value: 'diagnosis_based', label: 'diagnosis-based criteria' },
        { value: 'demographic_based', label: 'demographic-based criteria' },
        { value: 'combined_criteria', label: 'combined diagnostic and demographic criteria' }
      ],
      validation: [
        { type: 'required', message: 'Inclusion criteria are required' }
      ],
      expansions: {
        'diagnosis_based': {
          template: "having {diagnosis_criteria} with {diagnosis_confirmation}",
          fields: {
            diagnosis_criteria: {
              id: 'diagnosis_criteria',
              type: 'text',
              label: 'Diagnosis Criteria',
              validation: [
                { type: 'required', message: 'Diagnosis criteria are required' }
              ]
            },
            diagnosis_confirmation: {
              id: 'diagnosis_confirmation',
              type: 'select',
              label: 'Diagnosis Confirmation',
              options: [
                { value: 'medical_record', label: 'confirmation in medical records' },
                { value: 'diagnostic_codes', label: 'specific diagnostic codes' },
                { value: 'clinical_assessment', label: 'clinical assessment documentation' }
              ],
              validation: [
                { type: 'required', message: 'Diagnosis confirmation method is required' }
              ]
            }
          }
        },
        'demographic_based': {
          template: "falling within {demographic_criteria} and {location_criteria}",
          fields: {
            demographic_criteria: {
              id: 'demographic_criteria',
              type: 'text',
              label: 'Demographic Criteria',
              validation: [
                { type: 'required', message: 'Demographic criteria are required' }
              ]
            },
            location_criteria: {
              id: 'location_criteria',
              type: 'select',
              label: 'Location Criteria',
              options: [
                { value: 'single_site', label: 'being treated at a single site' },
                { value: 'multi_site', label: 'being treated across multiple sites' },
                { value: 'specific_region', label: 'residing in specific geographic regions' }
              ],
              validation: [
                { type: 'required', message: 'Location criteria are required' }
              ]
            }
          }
        }
      }
    },
    exclusion_criteria: {
      id: 'exclusion_criteria',
      type: 'select',
      label: 'Exclusion Criteria',
      options: [
        { value: 'medical_conditions', label: 'they have specific medical conditions' },
        { value: 'data_quality', label: 'their data quality is insufficient' },
        { value: 'incomplete_records', label: 'their records are incomplete' }
      ],
      validation: [
        { type: 'required', message: 'Exclusion criteria are required' }
      ],
      expansions: {
        'medical_conditions': {
          template: "they have {specific_conditions} or {contraindications}",
          fields: {
            specific_conditions: {
              id: 'specific_conditions',
              type: 'text',
              label: 'Specific Conditions',
              validation: [
                { type: 'required', message: 'Specific conditions are required' }
              ]
            },
            contraindications: {
              id: 'contraindications',
              type: 'text',
              label: 'Contraindications',
              validation: [
                { type: 'required', message: 'Contraindications are required' }
              ]
            }
          }
        },
        'data_quality': {
          template: "their data {quality_issues} or {missing_elements}",
          fields: {
            quality_issues: {
              id: 'quality_issues',
              type: 'text',
              label: 'Quality Issues',
              validation: [
                { type: 'required', message: 'Quality issues description is required' }
              ]
            },
            missing_elements: {
              id: 'missing_elements',
              type: 'text',
              label: 'Missing Elements',
              validation: [
                { type: 'required', message: 'Missing elements description is required' }
              ]
            }
          }
        }
      }
    }
  }
}; 