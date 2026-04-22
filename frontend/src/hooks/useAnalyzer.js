import { useState, useCallback } from 'react';
import { analyzeProfile } from '../services/api';

export function useAnalyzer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');

  const analyze = useCallback(async (name) => {
    if (!name?.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    setUsername(name.trim());

    try {
      const result = await analyzeProfile(name.trim());
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Failed to analyze profile. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setUsername('');
  }, []);

  return { data, loading, error, username, analyze, reset };
}
