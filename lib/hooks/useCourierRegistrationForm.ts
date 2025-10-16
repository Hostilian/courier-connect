/**
 * Type-safe form state management
 * No Redux bloat, just clean state handling
 */

import { useState, useCallback } from 'react';

export interface CourierRegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  city: string;
  vehicleType: 'bike' | 'scooter' | 'motorcycle' | 'car' | 'van';
  idNumber: string;
  agreeTerms: boolean;
}

export interface FormField {
  value: string | boolean;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

export type FormState = {
  [K in keyof CourierRegistrationData]: FormField;
};

export interface UseFormReturn {
  fields: FormState;
  isValid: boolean;
  isDirty: boolean;
  setField: (name: keyof CourierRegistrationData, value: string | boolean) => void;
  setError: (name: keyof CourierRegistrationData, error: string) => void;
  touchField: (name: keyof CourierRegistrationData) => void;
  validateField: (name: keyof CourierRegistrationData) => boolean;
  validateAll: () => boolean;
  reset: () => void;
  getData: () => CourierRegistrationData;
}

const initialState: FormState = {
  name: { value: '', error: null, touched: false, dirty: false },
  email: { value: '', error: null, touched: false, dirty: false },
  phone: { value: '', error: null, touched: false, dirty: false },
  password: { value: '', error: null, touched: false, dirty: false },
  confirmPassword: { value: '', error: null, touched: false, dirty: false },
  city: { value: '', error: null, touched: false, dirty: false },
  vehicleType: { value: 'bike', error: null, touched: false, dirty: false },
  idNumber: { value: '', error: null, touched: false, dirty: false },
  agreeTerms: { value: false, error: null, touched: false, dirty: false },
};

export function useCourierRegistrationForm(
  validators?: Partial<Record<keyof CourierRegistrationData, (value: any) => string | null>>
): UseFormReturn {
  const [fields, setFields] = useState<FormState>(initialState);

  const setField = useCallback((name: keyof CourierRegistrationData, value: string | boolean) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        dirty: true,
        error: validators?.[name]?.(value) || null,
      },
    }));
  }, [validators]);

  const setError = useCallback((name: keyof CourierRegistrationData, error: string) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        error,
      },
    }));
  }, []);

  const touchField = useCallback((name: keyof CourierRegistrationData) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched: true,
      },
    }));
  }, []);

  const validateField = useCallback((name: keyof CourierRegistrationData): boolean => {
    const validator = validators?.[name];
    if (!validator) return true;

    const error = validator(fields[name].value);
    setError(name, error || '');
    return !error;
  }, [fields, validators, setError]);

  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const newFields = { ...fields };

    Object.keys(fields).forEach((key) => {
      const fieldName = key as keyof CourierRegistrationData;
      const validator = validators?.[fieldName];
      
      if (validator) {
        const error = validator(newFields[fieldName].value);
        if (error) {
          isValid = false;
          newFields[fieldName] = {
            ...newFields[fieldName],
            error,
            touched: true,
          };
        }
      }
    });

    setFields(newFields);
    return isValid;
  }, [fields, validators]);

  const reset = useCallback(() => {
    setFields(initialState);
  }, []);

  const getData = useCallback((): CourierRegistrationData => {
    const data: any = {};
    Object.keys(fields).forEach((key) => {
      const fieldName = key as keyof CourierRegistrationData;
      data[fieldName] = fields[fieldName].value;
    });
    return data as CourierRegistrationData;
  }, [fields]);

  const isValid = Object.values(fields).every(field => !field.error);
  const isDirty = Object.values(fields).some(field => field.dirty);

  return {
    fields,
    isValid,
    isDirty,
    setField,
    setError,
    touchField,
    validateField,
    validateAll,
    reset,
    getData,
  };
}
