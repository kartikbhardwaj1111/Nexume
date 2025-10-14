import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isSyncing] = useState(false);

  // Helper function to update state
  const updateState = (updates) => {
    setState(prevState => ({ ...prevState, ...updates }));
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
  };

  // Manual save function
  const saveAppState = () => {
    return true;
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