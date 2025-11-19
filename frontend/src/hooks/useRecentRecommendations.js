import { useCallback, useEffect, useState } from "react";
import { buildApiUrl } from "../utils/api";
import { getAccessToken, getAuthHeaders } from "../utils/auth";

const RECENT_URL = buildApiUrl("/recent/");

export const useRecentRecommendations = () => {
  const [token, setToken] = useState(getAccessToken());
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncToken = useCallback(() => {
    setToken(getAccessToken());
  }, []);

  const fetchRecent = useCallback(async () => {
    const activeToken = getAccessToken();
    if (!activeToken) {
      setServices([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(RECENT_URL, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error("Unable to load personalized recommendations");
      }
      const data = await response.json();
      setServices(data?.results || []);
    } catch (err) {
      setError(err.message || "Failed to load personalized recommendations");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncToken);
    window.addEventListener("recentUpdated", fetchRecent);
    return () => {
      window.removeEventListener("storage", syncToken);
      window.removeEventListener("recentUpdated", fetchRecent);
    };
  }, [syncToken, fetchRecent]);

  useEffect(() => {
    if (token) {
      fetchRecent();
    }
  }, [token, fetchRecent]);

  return { services, loading, error, refresh: fetchRecent, hasToken: !!token };
};

export default useRecentRecommendations;
