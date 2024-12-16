import {
  studyOverviewModule,
  studyPopulationModule,
  privacyModule,
  dataAccessModule,
  algorithmicFairnessModule
} from '../modules';
import { ModuleConfig, Sentence } from '../../types/form';

describe('Form Modules', () => {
  const validateModule = (module: ModuleConfig) => {
    expect(module.id).toBeDefined();
    expect(module.name).toBeDefined();
    expect(module.rootSentence).toBeDefined();
  };

  const validateSentence = (sentence: Sentence) => {
    expect(sentence.template).toBeDefined();
    expect(sentence.fields).toBeDefined();
    
    // Validate template matches fields
    const fieldPlaceholders = sentence.template.match(/\{(\w+)\}/g) || [];
    const fieldIds = Object.keys(sentence.fields);
    
    fieldPlaceholders.forEach(placeholder => {
      const fieldId = placeholder.slice(1, -1); // Remove { }
      expect(fieldIds).toContain(fieldId);
    });

    // Validate fields
    Object.entries(sentence.fields).forEach(([fieldId, field]) => {
      expect(field.id).toBe(fieldId);
      expect(field.type).toBeDefined();
      expect(field.label).toBeDefined();

      if (field.options) {
        expect(Array.isArray(field.options)).toBe(true);
        field.options.forEach(option => {
          expect(option.value).toBeDefined();
          expect(option.label).toBeDefined();
        });
      }

      if (field.validation) {
        expect(Array.isArray(field.validation)).toBe(true);
        field.validation.forEach(rule => {
          expect(rule.type).toBeDefined();
          expect(rule.message).toBeDefined();
        });
      }

      if (field.expansions) {
        Object.values(field.expansions).forEach(expansion => {
          validateSentence(expansion);
        });
      }
    });
  };

  describe('Study Overview Module', () => {
    it('has valid structure', () => {
      validateModule(studyOverviewModule);
      validateSentence(studyOverviewModule.rootSentence);
    });

    it('has required fields for algorithm development', () => {
      const { fields } = studyOverviewModule.rootSentence;
      expect(fields.study_type.options).toBeDefined();
      expect(fields.primary_objective.options).toBeDefined();
      
      const algorithmExpansion = fields.primary_objective.expansions?.['develop_algorithm'];
      expect(algorithmExpansion).toBeDefined();
      expect(algorithmExpansion?.fields.algorithm_type.options).toBeDefined();
      expect(algorithmExpansion?.fields.clinical_impact.options).toBeDefined();
    });
  });

  describe('Study Population Module', () => {
    it('has valid structure', () => {
      validateModule(studyPopulationModule);
      validateSentence(studyPopulationModule.rootSentence);
    });

    it('has required fields for population definition', () => {
      const { fields } = studyPopulationModule.rootSentence;
      expect(fields.population_type.options).toBeDefined();
      
      const conditionExpansion = fields.population_type.expansions?.['specific_condition'];
      expect(conditionExpansion).toBeDefined();
      expect(conditionExpansion?.fields.condition_name).toBeDefined();
      expect(conditionExpansion?.fields.condition_criteria).toBeDefined();
    });
  });

  describe('Privacy Module', () => {
    it('has valid structure', () => {
      validateModule(privacyModule);
      validateSentence(privacyModule.rootSentence);
    });

    it('has required fields for privacy settings', () => {
      const { fields } = privacyModule.rootSentence;
      expect(fields.identifiability_level.options).toBeDefined();
      
      const deidentifiedExpansion = fields.identifiability_level.expansions?.['deidentified'];
      expect(deidentifiedExpansion).toBeDefined();
      expect(deidentifiedExpansion?.fields.deidentification_method.options).toBeDefined();
    });
  });

  describe('Data Access Module', () => {
    it('has valid structure', () => {
      validateModule(dataAccessModule);
      validateSentence(dataAccessModule.rootSentence);
    });

    it('has required fields for data access', () => {
      const { fields } = dataAccessModule.rootSentence;
      expect(fields.data_sources.options).toBeDefined();
      
      const ehrExpansion = fields.data_sources.expansions?.['internal_ehr'];
      expect(ehrExpansion).toBeDefined();
      expect(ehrExpansion?.fields.clinical_domain.options).toBeDefined();
      expect(ehrExpansion?.fields.data_format.options).toBeDefined();
    });
  });

  describe('Algorithmic Fairness Module', () => {
    it('has valid structure', () => {
      validateModule(algorithmicFairnessModule);
      validateSentence(algorithmicFairnessModule.rootSentence);
    });

    it('has required fields for fairness assessment', () => {
      const { fields } = algorithmicFairnessModule.rootSentence;
      expect(fields.fairness_approach.options).toBeDefined();
      
      const representationExpansion = fields.fairness_approach.expansions?.['balanced_representation'];
      expect(representationExpansion).toBeDefined();
      expect(representationExpansion?.fields.representation_details).toBeDefined();
    });
  });
}); 