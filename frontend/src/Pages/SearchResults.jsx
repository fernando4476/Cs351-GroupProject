import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar.jsx";
import Programs from "../Components/Programs/Programs.jsx";
import "./SearchResults.css";

export default function SearchResults({ providers = [] }) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const normalizedQuery = initialQuery.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return providers;

    return providers.filter((service) => {
      const haystack = [
        service.displayName,
        service.category,
        service.description,
        ...(service.tags || []),
        ...(service.services?.map((s) => s.name) || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [providers, normalizedQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div>
      <Navbar />
      <section className="results-hero">
        <div className="results-card">
          <p className="results-label">Search</p>
          <h1>Results for “{initialQuery || "all"}”</h1>
          <form className="results-form" onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try hair, tutoring, tech help..."
            />
            <button type="submit">Search</button>
          </form>
          <p className="results-subtext">
            {filtered.length} match
            {filtered.length === 1 ? "" : "es"} found
          </p>
        </div>
      </section>

      <Programs services={filtered} query={initialQuery} />
    </div>
  );
}
