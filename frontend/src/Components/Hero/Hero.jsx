import React, { useState } from "react";
import "./Hero.css";
import SearchSuggestions from "../SearchSuggestions/SearchSuggestions.jsx";
import { useAutocomplete } from "../../hooks/useAutocomplete";

export const Hero = ({ query, onQueryChange, onSearch }) => {
  const [inputFocused, setInputFocused] = useState(false);
  const { suggestions, loading, error } = useAutocomplete(query);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch?.(trimmed);
  };

  const handleSuggestionSelect = (value) => {
    if (!value) return;
    onQueryChange?.(value);
    onSearch?.(value);
    setInputFocused(false);
  };

  return (
    <div className="hero container">
      <div className="hero-text">
        <h1>Find and book student services at UIC</h1>
        <form className="search-container" onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="What are you looking for..."
            className="search-input"
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 120)}
          />
          <button type="submit" className="search-icon" aria-label="Search">
            🔍
          </button>
          <SearchSuggestions
            visible={inputFocused && query.trim().length > 0}
            suggestions={suggestions}
            loading={loading}
            error={error}
            onSelect={handleSuggestionSelect}
          />
        </form>
      </div>
    </div>
  );
};
export default Hero;
