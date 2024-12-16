import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { NarrativeProvider, useNarrative } from '../NarrativeContext';

describe('NarrativeContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NarrativeProvider>{children}</NarrativeProvider>
  );

  it('provides initial empty state', () => {
    const { result } = renderHook(() => useNarrative(), { wrapper });
    expect(result.current.state).toEqual({});
  });

  it('updates field values', () => {
    const { result } = renderHook(() => useNarrative(), { wrapper });

    act(() => {
      result.current.updateField('test_field', 'test value');
    });

    expect(result.current.state.test_field).toBe('test value');
  });

  it('updates multiple fields independently', () => {
    const { result } = renderHook(() => useNarrative(), { wrapper });

    act(() => {
      result.current.updateField('field1', 'value1');
      result.current.updateField('field2', 'value2');
    });

    expect(result.current.state).toEqual({
      field1: 'value1',
      field2: 'value2'
    });
  });

  it('throws error when used outside provider', () => {
    const { result } = renderHook(() => useNarrative());
    expect(result.error).toEqual(Error('useNarrative must be used within a NarrativeProvider'));
  });

  it('preserves other state when updating a field', () => {
    const { result } = renderHook(() => useNarrative(), { wrapper });

    act(() => {
      result.current.updateField('field1', 'value1');
      result.current.updateField('field2', 'value2');
      result.current.updateField('field1', 'updated value');
    });

    expect(result.current.state).toEqual({
      field1: 'updated value',
      field2: 'value2'
    });
  });

  // Test with a component that uses the context
  it('integrates with components correctly', () => {
    const TestComponent = () => {
      const { state, updateField } = useNarrative();
      return (
        <div>
          <div data-testid="state-value">{state.test_field || 'empty'}</div>
          <button onClick={() => updateField('test_field', 'updated')}>
            Update Field
          </button>
        </div>
      );
    };

    render(
      <NarrativeProvider>
        <TestComponent />
      </NarrativeProvider>
    );

    expect(screen.getByTestId('state-value')).toHaveTextContent('empty');
    
    fireEvent.click(screen.getByText('Update Field'));
    
    expect(screen.getByTestId('state-value')).toHaveTextContent('updated');
  });
}); 