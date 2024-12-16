import { renderHook, act } from '@testing-library/react';
import { useFormState } from '../useFormState';
import { ModuleConfig } from '../../types/form';

describe('useFormState', () => {
  const mockModule: ModuleConfig = {
    id: 'test_module',
    name: 'Test Module',
    rootSentence: {
      template: 'This is a {test_field} with {another_field}',
      fields: {
        test_field: {
          id: 'test_field',
          type: 'text',
          label: 'Test Field',
          validation: [
            { type: 'required', message: 'This field is required' }
          ]
        },
        another_field: {
          id: 'another_field',
          type: 'select',
          label: 'Another Field',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
          ],
          conditions: [
            {
              field: 'test_field',
              value: 'show_field',
              show: ['another_field']
            }
          ]
        }
      }
    }
  };

  it('initializes with empty values', () => {
    const { result } = renderHook(() => useFormState(mockModule));
    expect(result.current.values).toEqual({});
    expect(result.current.validation.errors).toEqual({});
    expect(result.current.validation.isValid).toBe(true);
  });

  it('initializes with provided values', () => {
    const initialValues = { test_field: 'test value' };
    const { result } = renderHook(() => useFormState(mockModule, initialValues));
    expect(result.current.values).toEqual(initialValues);
  });

  it('updates values correctly', () => {
    const { result } = renderHook(() => useFormState(mockModule));

    act(() => {
      result.current.updateValue(['test_field'], 'test value');
    });

    expect(result.current.values.test_field).toBe('test value');
  });

  it('validates fields on update', () => {
    const { result } = renderHook(() => useFormState(mockModule));

    // Initially empty - should have validation error
    expect(result.current.validation.errors['test_field']).toBeDefined();

    // Update with valid value
    act(() => {
      result.current.updateValue(['test_field'], 'test value');
    });

    expect(result.current.validation.errors['test_field']).toBeUndefined();
  });

  it('validates entire form', () => {
    const { result } = renderHook(() => useFormState(mockModule));

    // Initially invalid
    act(() => {
      result.current.validateForm();
    });
    expect(result.current.validation.isValid).toBe(false);

    // Update with valid values
    act(() => {
      result.current.updateValue(['test_field'], 'test value');
    });

    act(() => {
      result.current.validateForm();
    });
    expect(result.current.validation.isValid).toBe(true);
  });

  it('handles field visibility conditions', () => {
    const { result } = renderHook(() => useFormState(mockModule));

    // Initially another_field should be hidden
    expect(result.current.isFieldVisible(['another_field'])).toBe(false);

    // Update test_field to show another_field
    act(() => {
      result.current.updateValue(['test_field'], 'show_field');
    });

    expect(result.current.isFieldVisible(['another_field'])).toBe(true);
  });

  it('tracks expanded paths', () => {
    const { result } = renderHook(() => useFormState(mockModule));

    // Initially no expanded paths
    expect(result.current.expandedPaths).toEqual([]);

    // Update with a value
    act(() => {
      result.current.updateValue(['test_field'], 'test value');
    });

    expect(result.current.expandedPaths).toContain('test_field');

    // Clear the value
    act(() => {
      result.current.updateValue(['test_field'], '');
    });

    expect(result.current.expandedPaths).not.toContain('test_field');
  });

  it('validates nested fields', () => {
    const moduleWithNested: ModuleConfig = {
      id: 'test_module',
      name: 'Test Module',
      rootSentence: {
        template: 'This is a {test_field}',
        fields: {
          test_field: {
            id: 'test_field',
            type: 'select',
            label: 'Test Field',
            options: [{ value: 'option1', label: 'Option 1' }],
            expansions: {
              option1: {
                template: 'with {nested_field}',
                fields: {
                  nested_field: {
                    id: 'nested_field',
                    type: 'text',
                    label: 'Nested Field',
                    validation: [
                      { type: 'required', message: 'Nested field is required' }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    };

    const { result } = renderHook(() => useFormState(moduleWithNested));

    // Select option that shows nested field
    act(() => {
      result.current.updateValue(['test_field'], 'option1');
    });

    // Validate nested field
    const nestedErrors = result.current.validateField(['test_field', 'expansion_option1', 'nested_field']);
    expect(nestedErrors).toHaveLength(1);
    expect(nestedErrors[0].message).toBe('Nested field is required');
  });
}); 