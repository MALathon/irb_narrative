import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormPreview } from '../Preview';
import { ModuleConfig } from '../../../types/form';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('FormPreview', () => {
  const mockModule: ModuleConfig = {
    id: 'test_module',
    name: 'Test Module',
    rootSentence: {
      template: 'This is a {test_field}',
      fields: {
        test_field: {
          id: 'test_field',
          type: 'text',
          label: 'Test Field',
          validation: [
            { type: 'required', message: 'This field is required' }
          ]
        }
      }
    }
  };

  it('renders module name and preview content', () => {
    render(
      <FormPreview
        isOpen={true}
        onClose={() => {}}
        module={mockModule}
        values={{ test_field: 'test value' }}
      />
    );

    expect(screen.getByText('Test Module')).toBeInTheDocument();
    expect(screen.getByText(/This is a test value/)).toBeInTheDocument();
  });

  it('shows placeholder for empty fields', () => {
    render(
      <FormPreview
        isOpen={true}
        onClose={() => {}}
        module={mockModule}
        values={{}}
      />
    );

    expect(screen.getByText(/This is a ____/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <FormPreview
        isOpen={true}
        onClose={onClose}
        module={mockModule}
        values={{}}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close preview/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(
      <FormPreview
        isOpen={false}
        onClose={() => {}}
        module={mockModule}
        values={{}}
      />
    );

    expect(screen.queryByText('Test Module')).not.toBeInTheDocument();
  });
}); 