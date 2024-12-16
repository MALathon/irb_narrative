import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormNavigator } from '../Navigator';
import { ModuleConfig } from '../../../types/form';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('FormNavigator', () => {
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

  it('renders module name and completion status', () => {
    render(
      <FormNavigator
        module={mockModule}
        values={{}}
        onPreviewClick={() => {}}
      />
    );

    expect(screen.getByText('Module Navigator')).toBeInTheDocument();
    expect(screen.getByText('Test Module')).toBeInTheDocument();
    expect(screen.getByText('0/1 fields completed')).toBeInTheDocument();
  });

  it('shows completed status when all fields are filled', () => {
    render(
      <FormNavigator
        module={mockModule}
        values={{ test_field: 'test value' }}
        onPreviewClick={() => {}}
      />
    );

    expect(screen.getByText('1/1 fields completed')).toBeInTheDocument();
  });

  it('calls onPreviewClick when preview button is clicked', () => {
    const onPreviewClick = jest.fn();
    render(
      <FormNavigator
        module={mockModule}
        values={{}}
        onPreviewClick={onPreviewClick}
      />
    );

    const previewButton = screen.getByRole('button', { name: /preview module/i });
    fireEvent.click(previewButton);

    expect(onPreviewClick).toHaveBeenCalled();
  });
}); 