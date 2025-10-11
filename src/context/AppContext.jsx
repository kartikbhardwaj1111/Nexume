import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDataSync } from '../hooks/useDataSync';

const initialState = {
  apiKey: '',
  resumeText: '',
  jobDescription: '',
  analysisReport: '',
  jobKeywords: '',
  resumeKeywords: '',
  refinedResume: '',
  refinedAnalysisReport: '',
};

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [state, setState] = useState(initialState);
  
  // Use data sync for persistent storage
  const { 
    data: syncedState, 
    updateData: updateSyncedState,
    save: saveState,
    isLoading: isSyncing 
  } = useDataSync('app_state', initialState, {
    syncAcrossTabs: true,
    autoSave: true,
    debounceMs: 1000
  });

  // Sync local state with persisted state
  useEffect(() => {
    if (syncedState && Object.keys(syncedState).length > 0) {
      setState(syncedState);
    }
  }, [syncedState]);

  // Helper function to update both local and synced state
  const updateState = (updates) => {
    const newState = { ...state, ...updates };
    setState(newState);
    updateSyncedState(newState);
  };

  const setApiKey = (key) => {
    updateState({ apiKey: key });
  };

  const setResumeText = (text) => {
    updateState({ resumeText: text });
  };

  const setJobDescription = (text) => {
    updateState({ jobDescription: text });
  };

  const setAnalysisReport = (report) => {
    updateState({ analysisReport: report });
  };

  const setJobKeywords = (keywords) => {
    updateState({ jobKeywords: keywords });
  };

  const setResumeKeywords = (keywords) => {
    updateState({ resumeKeywords: keywords });
  };

  const setRefinedResume = (resume) => {
    updateState({ refinedResume: resume });
  };

  const setRefinedAnalysisReport = (report) => {
    updateState({ refinedAnalysisReport: report });
  };

  const resetState = () => {
    setState(initialState);
    updateSyncedState(initialState);
  };

  // Manual save function
  const saveAppState = () => {
    return saveState();
  };

  return (
    <AppContext.Provider value={{
      state,
      setApiKey,
      setResumeText,
      setJobDescription,
      setAnalysisReport,
      setJobKeywords,
      setResumeKeywords,
      setRefinedResume,
      setRefinedAnalysisReport,
      resetState,
      saveAppState,
      isSyncing,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}