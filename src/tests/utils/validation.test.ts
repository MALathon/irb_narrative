import { validateField, validateSentence } from '../../utils/validation';
import { Field, Sentence } from '../../types/form';

describe('Validation Utils', () => {
  describe('validateField', () => {
    it('validates required fields', () => {
      const field: Field = {
        id: 'test',
        type: 'text',
        label: 'Test',
        validation: [
          { type: 'required', message: 'Required' }
        ]
      };

      expect(validateField(field, '')).toEqual([{ type: 'required', message: 'Required' }]);
      expect(validateField(field, 'value')).toEqual([]);
    });

    it('validates minimum length', () => {
      const field: Field = {
        id: 'test',
        type: 'text',
        label: 'Test',
        validation: [
          { type: 'min', value: 3, message: 'Too short' }
        ]
      };

      expect(validateField(field, 'ab')).toEqual([{ type: 'min', value: 3, message: 'Too short' }]);
      expect(validateField(field, 'abc')).toEqual([]);
    });

    it('validates maximum length', () => {
      const field: Field = {
        id: 'test',
        type: 'text',
        label: 'Test',
        validation: [
          { type: 'max', value: 3, message: 'Too long' }
        ]
      };

      expect(validateField(field, 'abcd')).toEqual([{ type: 'max', value: 3, message: 'Too long' }]);
      expect(validateField(field, 'abc')).toEqual([]);
    });

    it('validates patterns', () => {
      const field: Field = {
        id: 'test',
        type: 'text',
        label: 'Test',
        validation: [
          { type: 'pattern', value: '^[A-Z]+$', message: 'Must be uppercase' }
        ]
      };

      expect(validateField(field, 'abc')).toEqual([{ type: 'pattern', value: '^[A-Z]+$', message: 'Must be uppercase' }]);
      expect(validateField(field, 'ABC')).toEqual([]);
    });

    it('validates multiple rules', () => {
      const field: Field = {
        id: 'test',
        type: 'text',
        label: 'Test',
        validation: [
          { type: 'required', message: 'Required' },
          { type: 'min', value: 3, message: 'Too short' }
        ]
      };

      expect(validateField(field, '')).toEqual([
        { type: 'required', message: 'Required' },
        { type: 'min', value: 3, message: 'Too short' }
      ]);
      expect(validateField(field, 'ab')).toEqual([
        { type: 'min', value: 3, message: 'Too short' }
      ]);
      expect(validateField(field, 'abc')).toEqual([]);
    });
  });

  describe('validateSentence', () => {
    const sentence: Sentence = {
      template: 'Test {field1} and {field2}',
      fields: {
        field1: {
          id: 'field1',
          type: 'text',
          label: 'Field 1',
          validation: [
            { type: 'required', message: 'Field 1 required' }
          ]
        },
        field2: {
          id: 'field2',
          type: 'text',
          label: 'Field 2',
          validation: [
            { type: 'required', message: 'Field 2 required' }
          ]
        }
      }
    };

    it('validates all fields in sentence', () => {
      const errors = validateSentence(sentence, {});
      expect(errors).toEqual({
        field1: [{ type: 'required', message: 'Field 1 required' }],
        field2: [{ type: 'required', message: 'Field 2 required' }]
      });
    });

    it('validates only invalid fields', () => {
      const errors = validateSentence(sentence, { field1: 'value' });
      expect(errors).toEqual({
        field2: [{ type: 'required', message: 'Field 2 required' }]
      });
    });

    it('returns empty object when all fields are valid', () => {
      const errors = validateSentence(sentence, {
        field1: 'value1',
        field2: 'value2'
      });
      expect(errors).toEqual({});
    });

    it('validates nested fields through expansions', () => {
      const sentenceWithExpansion: Sentence = {
        template: 'Test {field1}',
        fields: {
          field1: {
            id: 'field1',
            type: 'select',
            label: 'Field 1',
            options: [{ value: 'option1', label: 'Option 1' }],
            expansions: {
              option1: {
                template: 'with {nested}',
                fields: {
                  nested: {
                    id: 'nested',
                    type: 'text',
                    label: 'Nested',
                    validation: [
                      { type: 'required', message: 'Nested required' }
                    ]
                  }
                }
              }
            }
          }
        }
      };

      const errors = validateSentence(sentenceWithExpansion, {
        field1: 'option1'
      });

      expect(errors).toEqual({
        nested: [{ type: 'required', message: 'Nested required' }]
      });
    });

    it('validates conditional fields only when visible', () => {
      const sentenceWithCondition: Sentence = {
        template: 'Test {field1} and {field2}',
        fields: {
          field1: {
            id: 'field1',
            type: 'text',
            label: 'Field 1'
          },
          field2: {
            id: 'field2',
            type: 'text',
            label: 'Field 2',
            validation: [
              { type: 'required', message: 'Field 2 required' }
            ],
            conditions: [
              {
                field: 'field1',
                value: 'show',
                show: ['field2']
              }
            ]
          }
        }
      };

      // When condition is not met
      const errorsHidden = validateSentence(sentenceWithCondition, {
        field1: 'hide'
      });
      expect(errorsHidden).toEqual({});

      // When condition is met
      const errorsVisible = validateSentence(sentenceWithCondition, {
        field1: 'show'
      });
      expect(errorsVisible).toEqual({
        field2: [{ type: 'required', message: 'Field 2 required' }]
      });
    });
  });
}); 