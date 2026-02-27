import { useState, useEffect, useCallback } from 'react';
import contentApi from '../services/contentApi';

export const useContent = (page) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await contentApi.getPageContent(page);
      
      if (response.success) {
        setContent(response.data || {});
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${page} content:`, err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Fetch on mount and when refreshKey changes
  useEffect(() => {
    if (page) {
      fetchContent();
    }
  }, [page, refreshKey]);

  // Refresh on window focus (for real-time updates)
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused - refreshing content');
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Also poll every 30 seconds for updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const refreshContent = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return { content, loading, error, refreshContent };
};

export default useContent;
