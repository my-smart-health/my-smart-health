'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type UploadProgressState = {
  isUploading: boolean;
  totalFiles: number;
  completedFiles: number;
  currentFileName: string;
};

type UploadProgressContextType = {
  state: UploadProgressState;
  startUpload: (totalFiles: number) => void;
  updateProgress: (completedFiles: number, currentFileName?: string) => void;
  finishUpload: () => void;
};

const initialState: UploadProgressState = {
  isUploading: false,
  totalFiles: 0,
  completedFiles: 0,
  currentFileName: '',
};

const UploadProgressContext = createContext<UploadProgressContextType | null>(null);

export function UploadProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UploadProgressState>(initialState);

  const startUpload = useCallback((totalFiles: number) => {
    setState({
      isUploading: true,
      totalFiles,
      completedFiles: 0,
      currentFileName: '',
    });
  }, []);

  const updateProgress = useCallback((completedFiles: number, currentFileName?: string) => {
    setState(prev => ({
      ...prev,
      completedFiles,
      currentFileName: currentFileName ?? prev.currentFileName,
    }));
  }, []);

  const finishUpload = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <UploadProgressContext.Provider value={{ state, startUpload, updateProgress, finishUpload }}>
      {children}
    </UploadProgressContext.Provider>
  );
}

export function useUploadProgress() {
  const context = useContext(UploadProgressContext);
  if (!context) {
    throw new Error('useUploadProgress must be used within an UploadProgressProvider');
  }
  return context;
}
