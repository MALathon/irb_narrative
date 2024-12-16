import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('App', () => {
  it('renders app header', () => {
    render(<App />);
    expect(screen.getByText('IRB Protocol Builder')).toBeInTheDocument();
  });

  it('shows preview modal when preview button is clicked', () => {
    render(<App />);
    const previewButton = screen.getByText('Preview Full Document');
    fireEvent.click(previewButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes preview modal when close button is clicked', () => {
    render(<App />);
    
    // Open preview
    const previewButton = screen.getByText('Preview Full Document');
    fireEvent.click(previewButton);
    
    // Close preview
    const closeButton = screen.getByRole('button', { name: /close preview/i });
    fireEvent.click(closeButton);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders form navigator', () => {
    render(<App />);
    expect(screen.getByText('Module Navigator')).toBeInTheDocument();
  });

  it('renders module view', () => {
    render(<App />);
    // Check for module title - this will depend on your first module's name
    expect(screen.getByText(/fields completed/i)).toBeInTheDocument();
  });

  it('updates form state when fields are changed', () => {
    render(<App />);
    
    // Find a text input and change its value
    const inputs = screen.getAllByRole('textbox');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'test value' } });
      // The value should be reflected in the preview
      const previewButton = screen.getByText('Preview Full Document');
      fireEvent.click(previewButton);
      expect(screen.getByText(/test value/i)).toBeInTheDocument();
    }
  });

  it('shows mobile menu button on small screens', () => {
    // Mock useMediaQuery to return true for mobile
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<App />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });

  it('applies theme correctly', () => {
    render(<App />);
    const appBar = screen.getByRole('banner');
    expect(appBar).toHaveStyle({ backgroundColor: '#ffffff' });
  });
}); 