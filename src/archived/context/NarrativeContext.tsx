import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { NarrativeState } from '../narrative';

interface NarrativeContextType {
  state: NarrativeState;
  updateField: (fieldId: string, value: any) => void;
}

const NarrativeContext = createContext<NarrativeContextType | undefined>(undefined);

type NarrativeAction =
  | { type: 'UPDATE_FIELD'; fieldId: string; value: any }
  | { type: 'RESET_STATE' };

const narrativeReducer = (state: NarrativeState, action: NarrativeAction): NarrativeState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.fieldId]: action.value,
      };
    case 'RESET_STATE':
      return {};
    default:
      return state;
  }
};

interface NarrativeProviderProps {
  children: ReactNode;
}

export const NarrativeProvider: React.FC<NarrativeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(narrativeReducer, {});

  const updateField = (fieldId: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', fieldId, value });
  };

  return (
    <NarrativeContext.Provider value={{ state, updateField }}>
      {children}
    </NarrativeContext.Provider>
  );
};

export const useNarrative = (): NarrativeContextType => {
  const context = useContext(NarrativeContext);
  if (context === undefined) {
    throw new Error('useNarrative must be used within a NarrativeProvider');
  }
  return context;
};

export type { NarrativeContextType };
export default NarrativeContext; 