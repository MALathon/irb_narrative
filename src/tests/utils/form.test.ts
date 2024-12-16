import { getDisplayValue, isFieldComplete, getNestedValue, setNestedValue } from '../form';
import { FormValues, FieldValue, Option } from '../../types/form';

describe('Form Utils', () => {
  describe('getDisplayValue', () => {
    const options: Option[] = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];

    it('handles array values', () => {
      expect(getDisplayValue(['option1', 'option2'], options)).toBe('Option 1, Option 2');
    });

    it('handles boolean values', () => {
      expect(getDisplayValue(true)).toBe('Yes');
      expect(getDisplayValue(false)).toBe('No');
    });

    it('handles single option values', () => {
      expect(getDisplayValue('option1', options)).toBe('Option 1');
    });

    it('handles values without options', () => {
      expect(getDisplayValue('test')).toBe('test');
    });

    it('handles unknown option values', () => {
      expect(getDisplayValue('unknown', options)).toBe('unknown');
    });
  });

  describe('isFieldComplete', () => {
    it('handles array values', () => {
      expect(isFieldComplete([])).toBe(false);
      expect(isFieldComplete(['value'])).toBe(true);
    });

    it('handles string values', () => {
      expect(isFieldComplete('')).toBe(false);
      expect(isFieldComplete('value')).toBe(true);
    });

    it('handles number values', () => {
      expect(isFieldComplete(0)).toBe(true);
      expect(isFieldComplete(1)).toBe(true);
    });

    it('handles boolean values', () => {
      expect(isFieldComplete(true)).toBe(true);
      expect(isFieldComplete(false)).toBe(true);
    });

    it('handles null and undefined', () => {
      expect(isFieldComplete(null)).toBe(false);
      expect(isFieldComplete(undefined)).toBe(false);
    });
  });

  describe('getNestedValue', () => {
    const values: FormValues = {
      field1: 'value1',
      nested: {
        field2: 'value2',
        deepNested: {
          field3: 'value3'
        }
      }
    };

    it('gets top-level values', () => {
      expect(getNestedValue(values, ['field1'])).toBe('value1');
    });

    it('gets nested values', () => {
      expect(getNestedValue(values, ['nested', 'field2'])).toBe('value2');
    });

    it('gets deeply nested values', () => {
      expect(getNestedValue(values, ['nested', 'deepNested', 'field3'])).toBe('value3');
    });

    it('returns undefined for non-existent paths', () => {
      expect(getNestedValue(values, ['nonexistent'])).toBeUndefined();
      expect(getNestedValue(values, ['nested', 'nonexistent'])).toBeUndefined();
    });
  });

  describe('setNestedValue', () => {
    let values: FormValues;

    beforeEach(() => {
      values = {
        field1: 'value1',
        nested: {
          field2: 'value2',
          deepNested: {
            field3: 'value3'
          }
        }
      };
    });

    it('sets top-level values', () => {
      const result = setNestedValue(values, ['field1'], 'new value');
      expect(result.field1).toBe('new value');
      // Original object should not be modified
      expect(values.field1).toBe('value1');
    });

    it('sets nested values', () => {
      const result = setNestedValue(values, ['nested', 'field2'], 'new value');
      expect((result.nested as FormValues).field2).toBe('new value');
      // Original object should not be modified
      expect((values.nested as FormValues).field2).toBe('value2');
    });

    it('sets deeply nested values', () => {
      const result = setNestedValue(values, ['nested', 'deepNested', 'field3'], 'new value');
      expect(((result.nested as FormValues).deepNested as FormValues).field3).toBe('new value');
      // Original object should not be modified
      expect(((values.nested as FormValues).deepNested as FormValues).field3).toBe('value3');
    });

    it('creates intermediate objects if they dont exist', () => {
      const result = setNestedValue(values, ['new', 'path', 'field'], 'new value');
      expect(((result.new as FormValues).path as FormValues).field).toBe('new value');
    });

    it('preserves other values when setting nested values', () => {
      const result = setNestedValue(values, ['nested', 'field2'], 'new value');
      expect((result.nested as FormValues).deepNested).toEqual(values.nested.deepNested);
    });
  });
}); 