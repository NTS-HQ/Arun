import { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useContent = (page) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const url = `${BASE_URL}/content/${page}?_=${Date.now()}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.success) {
          setContent(data.data || {});
        } else {
          setError(data.message);
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
  }, [page, refreshCount]);

  // Force refresh function
  const refreshContent = () => {
    setRefreshCount(prev => prev + 1);
  };

  return { content, loading, error, refreshContent };
};

export default useContent;
