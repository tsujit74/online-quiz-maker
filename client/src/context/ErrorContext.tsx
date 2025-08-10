import React, { createContext, useState, type ReactNode, useContext } from 'react';

// Define the shape of our context value
interface ErrorContextType {
  errors: string[];
  setErrors: (errors: string[]) => void;
  clearErrors: () => void;
}

// Create the context with a default value
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Define the props for the provider component
interface ErrorProviderProps {
  children: ReactNode;
}

// The provider component that will hold the state
export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<string[]>([]);

  // Function to clear all errors
  const clearErrors = () => setErrors([]);

  // The value to be provided to consuming components
  const value = { errors, setErrors, clearErrors };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

// Custom hook for easier access to the error context
export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
