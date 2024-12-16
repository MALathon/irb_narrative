export interface CommonSuggestions {
  [key: string]: string[];
}

export const commonSuggestions: CommonSuggestions = {
  clinical_domain: ['Cardiology', 'Oncology', 'Neurology', 'Pediatrics', 'Internal Medicine'],
  external_provider: ['NIH', 'CDC', 'FDA', 'WHO'],
  dataset_name: ['NHANES', 'SEER', 'Medicare Claims', 'Clinical Trial Data'],
  data_maintainer: ['National Institute of Health', 'Centers for Disease Control'],
  clinical_setting: ['Outpatient Clinic', 'Hospital', 'Emergency Department', 'Primary Care']
}; 