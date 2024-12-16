import { screen, fireEvent } from '@testing-library/react';
import { Field, FieldValue } from '../types/form';

export const fillField = (field: Field, value: FieldValue) => {
  switch (field.type) {
    case 'text':
    case 'number':
      const input = screen.getByLabelText(field.label);
      fireEvent.change(input, { target: { value } });
      break;

    case 'select':
      const select = screen.getByLabelText(field.label);
      fireEvent.mouseDown(select);
      const option = screen.getByText(
        field.options?.find(opt => opt.value === value)?.label || value
      );
      fireEvent.click(option);
      break;

    case 'multiSelect':
      const multiSelect = screen.getByLabelText(field.label);
      fireEvent.mouseDown(multiSelect);
      (Array.isArray(value) ? value : [value]).forEach(val => {
        const multiOption = screen.getByText(
          field.options?.find(opt => opt.value === val)?.label || val
        );
        fireEvent.click(multiOption);
      });
      break;

    case 'boolean':
      const checkbox = screen.getByLabelText(field.label);
      if (value !== checkbox.checked) {
        fireEvent.click(checkbox);
      }
      break;
  }
};

export const expectFieldValue = (field: Field, value: FieldValue) => {
  switch (field.type) {
    case 'text':
    case 'number':
      const input = screen.getByLabelText(field.label) as HTMLInputElement;
      expect(input.value).toBe(String(value));
      break;

    case 'select':
      const select = screen.getByLabelText(field.label);
      const selectedOption = field.options?.find(opt => opt.value === value);
      expect(select).toHaveTextContent(selectedOption?.label || String(value));
      break;

    case 'multiSelect':
      const multiSelect = screen.getByLabelText(field.label);
      const values = Array.isArray(value) ? value : [value];
      values.forEach(val => {
        const selectedOption = field.options?.find(opt => opt.value === val);
        expect(multiSelect).toHaveTextContent(selectedOption?.label || String(val));
      });
      break;

    case 'boolean':
      const checkbox = screen.getByLabelText(field.label) as HTMLInputElement;
      expect(checkbox.checked).toBe(Boolean(value));
      break;
  }
};

export const expectFieldError = (field: Field, errorMessage: string) => {
  expect(screen.getByText(errorMessage)).toBeInTheDocument();
};

export const expectFieldVisible = (field: Field) => {
  expect(screen.getByLabelText(field.label)).toBeVisible();
};

export const expectFieldHidden = (field: Field) => {
  expect(screen.queryByLabelText(field.label)).not.toBeInTheDocument();
}; 