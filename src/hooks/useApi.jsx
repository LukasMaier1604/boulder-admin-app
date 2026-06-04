import { createContext, useContext, useState } from 'react';
import * as api from '../services/api';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeApiCall = async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Ein Fehler ist aufgetreten';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <ApiContext.Provider value={{ ...api, executeApiCall, loading, error, clearError }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi muss innerhalb von ApiProvider verwendet werden');
  }
  return context;
};
