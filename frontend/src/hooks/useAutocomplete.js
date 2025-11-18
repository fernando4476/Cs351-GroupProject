import { useEffect, useState } from "react";
import { buildApiUrl } from "../utils/api";

const AUTOCOMPLETE_URL = buildApiUrl("/autocomplete/");

export const useAutocomplete = (rawQuery) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const trimmed = rawQuery.trim();
    if (!trimmed) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const handle = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${AUTOCOMPLETE_URL}?prefix=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error("Autocomplete unavailable");
        }
        const data = await response.json();
        setSuggestions(data?.results?.slice(0, 10) || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to fetch suggestions");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => {
      controller.abort();
      clearTimeout(handle);
    };
  }, [rawQuery]);

  return { suggestions, loading, error };
};

export default useAutocomplete;
