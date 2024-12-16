import { ModuleConfig, Field, Sentence } from '../types/form';

export const mockField: Field = {
  id: 'test_field',
  type: 'text',
  label: 'Test Field',
  validation: [
    { type: 'required', message: 'This field is required' }
  ]
};

export const mockSelectField: Field = {
  id: 'test_select',
  type: 'select',
  label: 'Test Select',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]
};

export const mockSentence: Sentence = {
  template: 'This is a {test_field}',
  fields: {
    test_field: mockField
  }
};

export const mockModule: ModuleConfig = {
  id: 'test_module',
  name: 'Test Module',
  description: 'Test module description',
  guidance: 'Test module guidance',
  rootSentence: mockSentence
};

export const mockComplexModule: ModuleConfig = {
  id: 'complex_module',
  name: 'Complex Module',
  description: 'Complex module description',
  guidance: 'Complex module guidance',
  rootSentence: {
    template: 'This is a {select_field} with {text_field}',
    fields: {
      select_field: {
        ...mockSelectField,
        expansions: {
          'option1': {
            template: 'that includes {nested_field}',
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
      },
      text_field: mockField
    }
  }
}; 