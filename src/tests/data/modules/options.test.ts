import {
  DATA_SOURCE_OPTIONS,
  DATA_FORMAT_OPTIONS,
  CLINICAL_DOMAIN_OPTIONS,
  SECURITY_MEASURES_OPTIONS,
  STUDY_TYPE_OPTIONS,
  ALGORITHM_TYPE_OPTIONS,
  CLINICAL_IMPACT_OPTIONS,
  POPULATION_TYPE_OPTIONS,
  INCLUSION_CRITERIA_OPTIONS,
  EXCLUSION_CRITERIA_OPTIONS,
  IDENTIFIABILITY_LEVEL_OPTIONS,
  DEIDENTIFICATION_METHOD_OPTIONS,
  DATA_DISPOSITION_OPTIONS,
  FAIRNESS_APPROACH_OPTIONS,
  BENEFICIARY_OPTIONS,
  BENEFIT_MECHANISM_OPTIONS,
  PHASE_LIMITATION_OPTIONS
} from '../options';
import { Option } from '../../../types/form';

describe('Form Options', () => {
  const validateOptions = (options: Option[]) => {
    expect(Array.isArray(options)).toBe(true);
    expect(options.length).toBeGreaterThan(0);
    
    options.forEach(option => {
      expect(option.value).toBeDefined();
      expect(typeof option.value).toBe('string');
      expect(option.label).toBeDefined();
      expect(typeof option.label).toBe('string');
    });
  };

  describe('Data Source Options', () => {
    it('has valid structure', () => {
      validateOptions(DATA_SOURCE_OPTIONS);
    });

    it('includes essential data sources', () => {
      const values = DATA_SOURCE_OPTIONS.map(opt => opt.value);
      expect(values).toContain('internal_ehr');
      expect(values).toContain('external_dua');
      expect(values).toContain('public_datasets');
    });
  });

  describe('Data Format Options', () => {
    it('has valid structure', () => {
      validateOptions(DATA_FORMAT_OPTIONS);
    });

    it('includes essential data formats', () => {
      const values = DATA_FORMAT_OPTIONS.map(opt => opt.value);
      expect(values).toContain('structured');
      expect(values).toContain('unstructured');
      expect(values).toContain('imaging');
    });
  });

  describe('Clinical Domain Options', () => {
    it('has valid structure', () => {
      validateOptions(CLINICAL_DOMAIN_OPTIONS);
    });

    it('includes major clinical domains', () => {
      const values = CLINICAL_DOMAIN_OPTIONS.map(opt => opt.value);
      expect(values).toContain('cardiology');
      expect(values).toContain('oncology');
      expect(values).toContain('neurology');
    });
  });

  describe('Security Measures Options', () => {
    it('has valid structure', () => {
      validateOptions(SECURITY_MEASURES_OPTIONS);
    });

    it('includes essential security measures', () => {
      const values = SECURITY_MEASURES_OPTIONS.map(opt => opt.value);
      expect(values).toContain('encryption');
      expect(values).toContain('access_controls');
      expect(values).toContain('audit_logging');
    });
  });

  describe('Study Type Options', () => {
    it('has valid structure', () => {
      validateOptions(STUDY_TYPE_OPTIONS);
    });

    it('includes main study types', () => {
      const values = STUDY_TYPE_OPTIONS.map(opt => opt.value);
      expect(values).toContain('algorithm_development');
      expect(values).toContain('clinical_validation');
    });
  });

  describe('Algorithm Type Options', () => {
    it('has valid structure', () => {
      validateOptions(ALGORITHM_TYPE_OPTIONS);
    });

    it('includes main algorithm types', () => {
      const values = ALGORITHM_TYPE_OPTIONS.map(opt => opt.value);
      expect(values).toContain('prediction');
      expect(values).toContain('classification');
      expect(values).toContain('nlp');
    });
  });

  describe('Clinical Impact Options', () => {
    it('has valid structure', () => {
      validateOptions(CLINICAL_IMPACT_OPTIONS);
    });

    it('includes main impact areas', () => {
      const values = CLINICAL_IMPACT_OPTIONS.map(opt => opt.value);
      expect(values).toContain('diagnosis');
      expect(values).toContain('treatment');
      expect(values).toContain('prognosis');
    });
  });

  describe('Population Type Options', () => {
    it('has valid structure', () => {
      validateOptions(POPULATION_TYPE_OPTIONS);
    });

    it('includes main population types', () => {
      const values = POPULATION_TYPE_OPTIONS.map(opt => opt.value);
      expect(values).toContain('all_patients');
      expect(values).toContain('specific_condition');
      expect(values).toContain('age_group');
    });
  });

  describe('Inclusion Criteria Options', () => {
    it('has valid structure', () => {
      validateOptions(INCLUSION_CRITERIA_OPTIONS);
    });

    it('includes main inclusion criteria', () => {
      const values = INCLUSION_CRITERIA_OPTIONS.map(opt => opt.value);
      expect(values).toContain('age');
      expect(values).toContain('diagnosis');
      expect(values).toContain('procedure');
    });
  });

  describe('Exclusion Criteria Options', () => {
    it('has valid structure', () => {
      validateOptions(EXCLUSION_CRITERIA_OPTIONS);
    });

    it('includes main exclusion criteria', () => {
      const values = EXCLUSION_CRITERIA_OPTIONS.map(opt => opt.value);
      expect(values).toContain('comorbidity');
      expect(values).toContain('contraindication');
      expect(values).toContain('prior_treatment');
    });
  });

  describe('Identifiability Level Options', () => {
    it('has valid structure', () => {
      validateOptions(IDENTIFIABILITY_LEVEL_OPTIONS);
    });

    it('includes main identifiability levels', () => {
      const values = IDENTIFIABILITY_LEVEL_OPTIONS.map(opt => opt.value);
      expect(values).toContain('identified');
      expect(values).toContain('deidentified');
      expect(values).toContain('anonymized');
    });
  });

  describe('Deidentification Method Options', () => {
    it('has valid structure', () => {
      validateOptions(DEIDENTIFICATION_METHOD_OPTIONS);
    });

    it('includes main deidentification methods', () => {
      const values = DEIDENTIFICATION_METHOD_OPTIONS.map(opt => opt.value);
      expect(values).toContain('safe_harbor');
      expect(values).toContain('expert_determination');
    });
  });

  describe('Data Disposition Options', () => {
    it('has valid structure', () => {
      validateOptions(DATA_DISPOSITION_OPTIONS);
    });

    it('includes main disposition options', () => {
      const values = DATA_DISPOSITION_OPTIONS.map(opt => opt.value);
      expect(values).toContain('destroy');
      expect(values).toContain('return');
      expect(values).toContain('archive');
    });
  });

  describe('Fairness Approach Options', () => {
    it('has valid structure', () => {
      validateOptions(FAIRNESS_APPROACH_OPTIONS);
    });

    it('includes main fairness approaches', () => {
      const values = FAIRNESS_APPROACH_OPTIONS.map(opt => opt.value);
      expect(values).toContain('balanced_representation');
      expect(values).toContain('bias_testing');
      expect(values).toContain('expert_review');
    });
  });

  describe('Beneficiary Options', () => {
    it('has valid structure', () => {
      validateOptions(BENEFICIARY_OPTIONS);
    });

    it('includes main beneficiary types', () => {
      const values = BENEFICIARY_OPTIONS.map(opt => opt.value);
      expect(values).toContain('patients');
      expect(values).toContain('providers');
      expect(values).toContain('researchers');
    });
  });

  describe('Benefit Mechanism Options', () => {
    it('has valid structure', () => {
      validateOptions(BENEFIT_MECHANISM_OPTIONS);
    });

    it('includes main benefit mechanisms', () => {
      const values = BENEFIT_MECHANISM_OPTIONS.map(opt => opt.value);
      expect(values).toContain('improved_outcomes');
      expect(values).toContain('reduced_costs');
      expect(values).toContain('workflow_efficiency');
    });
  });

  describe('Phase Limitation Options', () => {
    it('has valid structure', () => {
      validateOptions(PHASE_LIMITATION_OPTIONS);
    });

    it('includes main phase limitations', () => {
      const values = PHASE_LIMITATION_OPTIONS.map(opt => opt.value);
      expect(values).toContain('research_only');
      expect(values).toContain('no_clinical');
      expect(values).toContain('validation_required');
    });
  });
}); 