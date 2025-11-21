import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar.jsx";
import Programs from "../Components/Programs/Programs.jsx";
import SearchSuggestions from "../Components/SearchSuggestions/SearchSuggestions.jsx";
import { useAutocomplete } from "../hooks/useAutocomplete.js";
import { recordSearchTerm } from "../utils/searchHistory";
import "./SearchResults.css";

export default function SearchResults({
  services = [],
  loading = false,
  error = null,
}) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [inputFocused, setInputFocused] = useState(false);
  const navigate = useNavigate();
  const { suggestions, loading: autoLoading, error: autoError } =
    useAutocomplete(query);

  const normalizedQuery = initialQuery.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return services;

    return services.filter((service) => {
      const haystack = [
        service.title,
        service.business_name,
        service.provider?.business_name,
        service.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [services, normalizedQuery]);

  const runSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    recordSearchTerm(trimmed);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleSuggestionSelect = (value) => {
    setQuery(value);
    runSearch(value);
    setInputFocused(false);
  };

  return (
    <div>
      <Navbar />
      <section className="results-hero">
        <div className="results-card">
          <p className="results-label">Search</p>
          <h1>Results for “{initialQuery || "all"}”</h1>
          <form className="results-form" onSubmit={handleSearch}>
            <div className="results-input-wrapper">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try hair, tutoring, tech help..."
                onFocus={() => setInputFocused(true)}
                onBlur={() => setTimeout(() => setInputFocused(false), 120)}
              />
              <SearchSuggestions
                visible={inputFocused && query.trim().length > 0}
                suggestions={suggestions}
                loading={autoLoading}
                error={autoError}
                onSelect={handleSuggestionSelect}
              />
            </div>
            <button type="submit">Search</button>
          </form>
          <p className="results-subtext">
            {filtered.length} match
            {filtered.length === 1 ? "" : "es"} found
          </p>
          {loading && <p className="results-status">Loading live services…</p>}
          {error && !loading && (
            <p className="results-status results-status--error">{error}</p>
          )}
        </div>
      </section>

      <Programs services={filtered} query={initialQuery} />
    </div>
  );
}
