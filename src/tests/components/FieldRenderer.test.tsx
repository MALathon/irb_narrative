import React from 'react';
import { render, screen } from '../../test-utils';
import { FieldRenderer } from '../FieldRenderer';
import { mockField, mockSelectField } from '../../test-utils/fixtures';
import { fillField, expectFieldValue, expectFieldError, expectFieldVisible, expectFieldHidden } from '../../test-utils/helpers';

describe('FieldRenderer', () => {
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  it('renders text field correctly', () => {
    render(
      <FieldRenderer
        field={mockField}
        value=""
        path={['test_field']}
        onUpdate={mockOnUpdate}
      />
    );

    expectFieldVisible(mockField);
  });

  it('renders select field with options', () => {
    render(
      <FieldRenderer
        field={mockSelectField}
        value=""
        path={['test_select']}
        onUpdate={mockOnUpdate}
      />
    );

    expectFieldVisible(mockSelectField);
    mockSelectField.options?.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('handles text field updates', () => {
    render(
      <FieldRenderer
        field={mockField}
        value=""
        path={['test_field']}
        onUpdate={mockOnUpdate}
      />
    );

    fillField(mockField, 'test value');
    expect(mockOnUpdate).toHaveBeenCalledWith(['test_field'], 'test value');
  });

  it('handles select field updates', () => {
    render(
      <FieldRenderer
        field={mockSelectField}
        value=""
        path={['test_select']}
        onUpdate={mockOnUpdate}
      />
    );

    fillField(mockSelectField, 'option1');
    expect(mockOnUpdate).toHaveBeenCalledWith(['test_select'], 'option1');
  });

  it('shows validation errors', () => {
    render(
      <FieldRenderer
        field={mockField}
        value=""
        path={['test_field']}
        onUpdate={mockOnUpdate}
        errors={[{ type: 'required', message: 'This field is required' }]}
      />
    );

    expectFieldError(mockField, 'This field is required');
  });

  it('respects visibility prop', () => {
    const { rerender } = render(
      <FieldRenderer
        field={mockField}
        value=""
        path={['test_field']}
        onUpdate={mockOnUpdate}
        isVisible={false}
      />
    );

    expectFieldHidden(mockField);

    rerender(
      <FieldRenderer
        field={mockField}
        value=""
        path={['test_field']}
        onUpdate={mockOnUpdate}
        isVisible={true}
      />
    );

    expectFieldVisible(mockField);
  });
}); 