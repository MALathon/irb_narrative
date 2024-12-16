import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormSentenceRenderer } from '../SentenceRenderer';
import { Sentence } from '../../../types/form';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('FormSentenceRenderer', () => {
  const mockSentence: Sentence = {
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
        ]
      }
    }
  };

  it('renders template with fields', () => {
    render(
      <FormSentenceRenderer
        sentence={mockSentence}
        path={[]}
        values={{}}
        onUpdate={() => {}}
      />
    );

    expect(screen.getByText(/This is a/)).toBeInTheDocument();
    expect(screen.getByText(/with/)).toBeInTheDocument();
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    expect(screen.getByLabelText('Another Field')).toBeInTheDocument();
  });

  it('shows validation errors', () => {
    render(
      <FormSentenceRenderer
        sentence={mockSentence}
        path={[]}
        values={{}}
        onUpdate={() => {}}
        errors={{
          'test_field': [{ type: 'required', message: 'This field is required' }]
        }}
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('handles field updates', () => {
    const onUpdate = jest.fn();
    render(
      <FormSentenceRenderer
        sentence={mockSentence}
        path={[]}
        values={{}}
        onUpdate={onUpdate}
      />
    );

    const input = screen.getByLabelText('Test Field');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(onUpdate).toHaveBeenCalledWith(['test_field'], 'test value');
  });

  it('renders expansions when field value triggers them', () => {
    const sentenceWithExpansion: Sentence = {
      template: 'This is a {test_field}',
      fields: {
        test_field: {
          id: 'test_field',
          type: 'select',
          label: 'Test Field',
          options: [
            { value: 'option1', label: 'Option 1' }
          ],
          expansions: {
            option1: {
              template: 'with {expansion_field}',
              fields: {
                expansion_field: {
                  id: 'expansion_field',
                  type: 'text',
                  label: 'Expansion Field'
                }
              }
            }
          }
        }
      }
    };

    render(
      <FormSentenceRenderer
        sentence={sentenceWithExpansion}
        path={[]}
        values={{ test_field: 'option1' }}
        onUpdate={() => {}}
      />
    );

    expect(screen.getByLabelText('Expansion Field')).toBeInTheDocument();
  });

  it('handles visibility conditions', () => {
    render(
      <FormSentenceRenderer
        sentence={mockSentence}
        path={[]}
        values={{}}
        onUpdate={() => {}}
        isFieldVisible={(path) => path[0] !== 'another_field'}
      />
    );

    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    expect(screen.queryByLabelText('Another Field')).not.toBeInTheDocument();
  });
}); 