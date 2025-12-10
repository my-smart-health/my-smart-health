'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type DeletionProgressState = {
  isDeleting: boolean;
  userName: string;
  message: string;
};

type DeletionProgressContextType = {
  state: DeletionProgressState;
  startDeletion: (userName: string) => void;
  updateMessage: (message: string) => void;
  finishDeletion: () => void;
};

const initialState: DeletionProgressState = {
  isDeleting: false,
  userName: '',
  message: '',
};

const DeletionProgressContext = createContext<DeletionProgressContextType | null>(null);

export function DeletionProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DeletionProgressState>(initialState);

  const startDeletion = useCallback((userName: string) => {
    setState({
      isDeleting: true,
      userName,
      message: 'Löschvorgang wird gestartet...',
    });
  }, []);

  const updateMessage = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      message,
    }));
  }, []);

  const finishDeletion = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <DeletionProgressContext.Provider value={{ state, startDeletion, updateMessage, finishDeletion }}>
      {children}
    </DeletionProgressContext.Provider>
  );
}

export function useDeletionProgress() {
  const context = useContext(DeletionProgressContext);
  if (!context) {
    throw new Error('useDeletionProgress must be used within a DeletionProgressProvider');
  }
  return context;
}
