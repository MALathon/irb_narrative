import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormPage } from '../FormPage';
import { dataAccessModule } from '../../data/formModules';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('FormPage', () => {
  it('renders module navigator', () => {
    render(<FormPage />);
    expect(screen.getByText('Module Navigator')).toBeInTheDocument();
  });

  it('renders module view', () => {
    render(<FormPage />);
    expect(screen.getByText(dataAccessModule.name)).toBeInTheDocument();
  });

  it('shows preview when preview button is clicked', () => {
    render(<FormPage />);
    const previewButton = screen.getByText('Preview Module');
    fireEvent.click(previewButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes preview when close button is clicked', () => {
    render(<FormPage />);
    
    // Open preview
    const previewButton = screen.getByText('Preview Module');
    fireEvent.click(previewButton);
    
    // Close preview
    const closeButton = screen.getByRole('button', { name: /close preview/i });
    fireEvent.click(closeButton);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('updates form state when fields are changed', () => {
    render(<FormPage />);
    
    // Find a text input and change its value
    const inputs = screen.getAllByRole('textbox');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'test value' } });
      
      // Open preview to check if value is reflected
      const previewButton = screen.getByText('Preview Module');
      fireEvent.click(previewButton);
      expect(screen.getByText(/test value/i)).toBeInTheDocument();
    }
  });

  it('maintains form state between preview toggles', () => {
    render(<FormPage />);
    
    // Set a field value
    const inputs = screen.getAllByRole('textbox');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'test value' } });
    }
    
    // Open preview
    const previewButton = screen.getByText('Preview Module');
    fireEvent.click(previewButton);
    
    // Close preview
    const closeButton = screen.getByRole('button', { name: /close preview/i });
    fireEvent.click(closeButton);
    
    // Open preview again
    fireEvent.click(previewButton);
    
    // Check if value is still there
    expect(screen.getByText(/test value/i)).toBeInTheDocument();
  });

  it('shows completion status correctly', () => {
    render(<FormPage />);
    
    // Initially all fields are empty
    expect(screen.getByText('0/')).toBeInTheDocument();
    
    // Fill a field
    const inputs = screen.getAllByRole('textbox');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'test value' } });
      
      // Status should update
      expect(screen.getByText(/1\//)).toBeInTheDocument();
    }
  });
}); 