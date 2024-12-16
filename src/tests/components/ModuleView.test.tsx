import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { ModuleView } from '../ModuleView';
import { mockModule } from '../../test-utils/fixtures';

describe('ModuleView', () => {
  it('renders module title and description', () => {
    render(
      <ModuleView
        module={mockModule}
        initialValues={{}}
        onValuesChange={() => {}}
      />
    );

    expect(screen.getByText(mockModule.name)).toBeInTheDocument();
    expect(screen.getByText(mockModule.description!)).toBeInTheDocument();
    expect(screen.getByText(mockModule.guidance!)).toBeInTheDocument();
  });

  it('shows validation errors when form is invalid', () => {
    render(
      <ModuleView
        module={mockModule}
        initialValues={{}}
        onValuesChange={() => {}}
      />
    );

    expect(screen.getByText(/1 error/i)).toBeInTheDocument();
  });

  it('calls onValuesChange when field value changes', () => {
    const onValuesChange = jest.fn();
    render(
      <ModuleView
        module={mockModule}
        initialValues={{}}
        onValuesChange={onValuesChange}
      />
    );

    const input = screen.getByLabelText(mockModule.rootSentence.fields.test_field.label);
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(onValuesChange).toHaveBeenCalledWith(
      expect.objectContaining({
        test_field: 'test value'
      })
    );
  });

  it('shows instructions panel that can be collapsed', () => {
    render(
      <ModuleView
        module={mockModule}
        initialValues={{}}
        onValuesChange={() => {}}
      />
    );

    expect(screen.getByText('Instructions & Guidance')).toBeInTheDocument();
    expect(screen.getByText(mockModule.guidance!)).toBeInTheDocument();

    const collapseButton = screen.getByRole('button', { name: /expand/i });
    fireEvent.click(collapseButton);

    expect(screen.queryByText(mockModule.guidance!)).not.toBeVisible();
  });
}); 