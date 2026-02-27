import { useState, useEffect } from 'react';
import contentApi from '../services/contentApi';

export const useContent = (page) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        const response = await contentApi.getPageContent(page, token);
        
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
    };

    if (page) {
      fetchContent();
    }
  }, [page]);

  const refreshContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await contentApi.getPageContent(page, token);
      
      if (response.success) {
        setContent(response.data || {});
      }
    } catch (err) {
      console.error(`Error refreshing ${page} content:`, err);
    }
  };

  return { content, loading, error, refreshContent };
};

export default useContent;
