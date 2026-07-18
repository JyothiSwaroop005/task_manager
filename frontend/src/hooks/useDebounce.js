import { useEffect, useState } from 'react';

// Debounces a fast-changing value (e.g. search input) to avoid excessive re-renders
export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
