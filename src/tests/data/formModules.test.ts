import {
  studyOverviewModule,
  studyPopulationModule,
  privacyModule,
  dataAccessModule,
  algorithmicFairnessModule
} from '../formModules';
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
    it('should have valid structure', () => {
      validateModule(studyOverviewModule);
      validateSentence(studyOverviewModule.rootSentence);
    });
  });

  describe('Study Population Module', () => {
    it('should have valid structure', () => {
      validateModule(studyPopulationModule);
      validateSentence(studyPopulationModule.rootSentence);
    });
  });

  describe('Privacy Module', () => {
    it('should have valid structure', () => {
      validateModule(privacyModule);
      validateSentence(privacyModule.rootSentence);
    });
  });

  describe('Data Access Module', () => {
    it('should have valid structure', () => {
      validateModule(dataAccessModule);
      validateSentence(dataAccessModule.rootSentence);
    });
  });

  describe('Algorithmic Fairness Module', () => {
    it('should have valid structure', () => {
      validateModule(algorithmicFairnessModule);
      validateSentence(algorithmicFairnessModule.rootSentence);
    });
  });
}); 