import { useState, useCallback } from 'react';

export function useFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFn) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, execute };
}
