/**
 * Secure Input Hook
 * React hook for secure input validation and sanitization
 */

import { useState, useCallback, useMemo } from 'react';
import InputValidator from '../services/security/InputValidator';
import FileSecurityManager from '../services/security/FileSecurityManager';

const useSecureInput = (initialValue = '', validationType = 'safeText', options = {}) => {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  // Initialize validators
  const validator = useMemo(() => new InputValidator(), []);
  const fileSecurityManager = useMemo(() => new FileSecurityManager(), []);

  /**
   * Validate and update text input
   */
  const updateValue = useCallback(async (newValue) => {
    setIsValidating(true);
    
    try {
      const validation = validator.validateText(newValue, validationType, options);
      
      setValue(validation.sanitizedText);
      setErrors(validation.errors);
      setWarnings(validation.warnings);
      setIsValid(validation.isValid);
      
      return validation;
    } catch (error) {
      setErrors(['Validation failed: ' + error.message]);
      setIsValid(false);
      return { isValid: false, errors: ['Validation failed'], warnings: [] };
    } finally {
      setIsValidating(false);
    }
  }, [validator, validationType, options]);

  /**
   * Validate URL input
   */
  const validateUrl = useCallback(async (url, urlType = 'general') => {
    setIsValidating(true);
    
    try {
      const validation = validator.validateUrl(url, urlType);
      
      setErrors(validation.errors);
      setWarnings(validation.warnings);
      setIsValid(validation.isValid);
      
      return validation;
    } catch (error) {
      setErrors(['URL validation failed: ' + error.message]);
      setIsValid(false);
      return { isValid: false, errors: ['URL validation failed'], warnings: [] };
    } finally {
      setIsValidating(false);
    }
  }, [validator]);

  /**
   * Validate file upload
   */
  const validateFile = useCallback(async (file, category = 'general') => {
    setIsValidating(true);
    
    try {
      const validation = await fileSecurityManager.validateFileSecurely(file, category);
      
      setErrors(validation.errors);
      setWarnings(validation.warnings);
      setIsValid(validation.isValid);
      
      return validation;
    } catch (error) {
      setErrors(['File validation failed: ' + error.message]);
      setIsValid(false);
      return { isValid: false, errors: ['File validation failed'], warnings: [] };
    } finally {
      setIsValidating(false);
    }
  }, [fileSecurityManager]);

  /**
   * Validate form data
   */
  const validateForm = useCallback(async (formData, rules) => {
    setIsValidating(true);
    
    try {
      const validation = validator.validateFormData(formData, rules);
      
      // Aggregate all errors and warnings
      const allErrors = Object.values(validation.errors).flat();
      const allWarnings = Object.values(validation.warnings).flat();
      
      setErrors(allErrors);
      setWarnings(allWarnings);
      setIsValid(validation.isValid);
      
      return validation;
    } catch (error) {
      setErrors(['Form validation failed: ' + error.message]);
      setIsValid(false);
      return { isValid: false, errors: ['Form validation failed'], warnings: {} };
    } finally {
      setIsValidating(false);
    }
  }, [validator]);

  /**
   * Clear validation state
   */
  const clearValidation = useCallback(() => {
    setErrors([]);
    setWarnings([]);
    setIsValid(true);
  }, []);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setValue(initialValue);
    clearValidation();
  }, [initialValue, clearValidation]);

  /**
   * Get validation rules for common fields
   */
  const getValidationRules = useCallback(() => {
    return validator.getCommonValidationRules();
  }, [validator]);

  return {
    // State
    value,
    errors,
    warnings,
    isValid,
    isValidating,
    
    // Actions
    updateValue,
    validateUrl,
    validateFile,
    validateForm,
    clearValidation,
    reset,
    getValidationRules,
    
    // Direct access to validators
    validator,
    fileSecurityManager,
  };
};

/**
 * Hook for secure file upload
 */
export const useSecureFileUpload = (category = 'general', options = {}) => {
  const [files, setFiles] = useState([]);
  const [validationResults, setValidationResults] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const fileSecurityManager = useMemo(() => new FileSecurityManager(), []);

  const addFiles = useCallback(async (newFiles) => {
    setIsValidating(true);
    const fileArray = Array.from(newFiles);
    const results = {};

    try {
      // Validate each file
      for (const file of fileArray) {
        const validation = await fileSecurityManager.validateFileSecurely(file, category);
        results[file.name] = validation;
      }

      setValidationResults(prev => ({ ...prev, ...results }));
      
      // Only add valid files
      const validFiles = fileArray.filter(file => results[file.name].isValid);
      setFiles(prev => [...prev, ...validFiles]);
      
      return results;
    } catch (error) {
      console.error('File validation failed:', error);
      return {};
    } finally {
      setIsValidating(false);
    }
  }, [fileSecurityManager, category]);

  const removeFile = useCallback((fileName) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    setValidationResults(prev => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
    setUploadProgress(prev => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setValidationResults({});
    setUploadProgress({});
  }, []);

  const getValidFiles = useCallback(() => {
    return files.filter(file => validationResults[file.name]?.isValid);
  }, [files, validationResults]);

  const getInvalidFiles = useCallback(() => {
    return files.filter(file => !validationResults[file.name]?.isValid);
  }, [files, validationResults]);

  const hasValidFiles = useMemo(() => {
    return getValidFiles().length > 0;
  }, [getValidFiles]);

  const hasInvalidFiles = useMemo(() => {
    return getInvalidFiles().length > 0;
  }, [getInvalidFiles]);

  return {
    // State
    files,
    validationResults,
    isValidating,
    uploadProgress,
    
    // Computed
    hasValidFiles,
    hasInvalidFiles,
    
    // Actions
    addFiles,
    removeFile,
    clearFiles,
    getValidFiles,
    getInvalidFiles,
    
    // Utils
    fileSecurityManager,
  };
};

/**
 * Hook for secure form validation
 */
export const useSecureForm = (initialData = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldWarnings, setFieldWarnings] = useState({});
  const [isValid, setIsValid] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const validator = useMemo(() => new InputValidator(), []);

  const updateField = useCallback(async (fieldName, value) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);

    // Validate single field if rules exist
    if (validationRules[fieldName]) {
      setIsValidating(true);
      
      try {
        const fieldValidation = validator.validateText(
          value,
          validationRules[fieldName].type,
          validationRules[fieldName].options
        );

        setFieldErrors(prev => ({
          ...prev,
          [fieldName]: fieldValidation.errors,
        }));

        setFieldWarnings(prev => ({
          ...prev,
          [fieldName]: fieldValidation.warnings,
        }));

        // Update sanitized value
        if (fieldValidation.sanitizedText !== value) {
          setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValidation.sanitizedText,
          }));
        }

        return fieldValidation;
      } catch (error) {
        setFieldErrors(prev => ({
          ...prev,
          [fieldName]: ['Validation failed'],
        }));
        return { isValid: false, errors: ['Validation failed'], warnings: [] };
      } finally {
        setIsValidating(false);
      }
    }

    return { isValid: true, errors: [], warnings: [] };
  }, [formData, validationRules, validator]);

  const validateAllFields = useCallback(async () => {
    setIsValidating(true);
    
    try {
      const validation = validator.validateFormData(formData, validationRules);
      
      setFieldErrors(validation.errors);
      setFieldWarnings(validation.warnings);
      setIsValid(validation.isValid);
      
      if (validation.isValid) {
        setFormData(validation.sanitizedData);
      }
      
      return validation;
    } catch (error) {
      setIsValid(false);
      return { isValid: false, errors: {}, warnings: {} };
    } finally {
      setIsValidating(false);
    }
  }, [formData, validationRules, validator]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setFieldErrors({});
    setFieldWarnings({});
    setIsValid(true);
  }, [initialData]);

  const hasErrors = useMemo(() => {
    return Object.values(fieldErrors).some(errors => errors && errors.length > 0);
  }, [fieldErrors]);

  const hasWarnings = useMemo(() => {
    return Object.values(fieldWarnings).some(warnings => warnings && warnings.length > 0);
  }, [fieldWarnings]);

  return {
    // State
    formData,
    fieldErrors,
    fieldWarnings,
    isValid,
    isValidating,
    
    // Computed
    hasErrors,
    hasWarnings,
    
    // Actions
    updateField,
    validateAllFields,
    resetForm,
    
    // Utils
    validator,
  };
};

export default useSecureInput;