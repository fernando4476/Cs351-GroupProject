import React from "react";
import "./SearchSuggestions.css";

export default function SearchSuggestions({
  visible,
  suggestions = [],
  loading,
  error,
  onSelect,
}) {
  if (!visible) {
    return null;
  }

  const showEmptyState = !loading && !error && suggestions.length === 0;

  return (
    <ul className="search-suggestions">
      {loading && (
        <li className="search-suggestion search-suggestion--muted">
          Searching…
        </li>
      )}

      {error && (
        <li className="search-suggestion search-suggestion--error">
          {error}
        </li>
      )}

      {suggestions.map((text) => (
        <li
          key={text}
          className="search-suggestion"
          onMouseDown={(event) => {
            event.preventDefault();
            onSelect?.(text);
          }}
        >
          {text}
        </li>
      ))}

      {showEmptyState && (
        <li className="search-suggestion search-suggestion--muted">
          No matches yet
        </li>
      )}
    </ul>
  );
}
