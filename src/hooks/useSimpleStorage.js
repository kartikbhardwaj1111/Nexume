/**
 * Simple Storage Hook
 * A lightweight alternative to useDataSync that doesn't cause hook violations
 */

import { useState, useEffect, useCallback } from 'react';

export const useSimpleStorage = (key, initialValue = null) => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(`nexume_${key}`);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error('Failed to load from storage:', error);
      return initialValue;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save data to localStorage
  const saveData = useCallback(async (newData) => {
    try {
      setIsLoading(true);
      setError(null);
      localStorage.setItem(`nexume_${key}`, JSON.stringify(newData));
      setData(newData);
    } catch (err) {
      setError(err.message);
      console.error('Save error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Update data
  const updateData = useCallback((newData) => {
    setData(newData);
    try {
      localStorage.setItem(`nexume_${key}`, JSON.stringify(newData));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }, [key]);

  // Delete data
  const deleteData = useCallback(() => {
    try {
      localStorage.removeItem(`nexume_${key}`);
      setData(initialValue);
    } catch (error) {
      console.error('Failed to delete from storage:', error);
    }
  }, [key, initialValue]);

  return {
    data,
    updateData,
    save: saveData,
    deleteData,
    isLoading,
    error
  };
};

export default useSimpleStorage;