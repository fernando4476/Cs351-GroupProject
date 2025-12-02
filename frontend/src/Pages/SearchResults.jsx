import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar.jsx";
import Programs from "../Components/Programs/Programs.jsx";
import SearchSuggestions from "../Components/SearchSuggestions/SearchSuggestions.jsx";
import { useAutocomplete } from "../hooks/useAutocomplete.js";
import { recordSearchTerm } from "../utils/searchHistory";
import { fetchServiceRecommendations } from "../api/client";
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

  const { primaryMatches, descriptionMatches } = useMemo(() => {
    if (!normalizedQuery) {
      return {
        primaryMatches: services,
        descriptionMatches: [],
      };
    }

    const primary = [];
    const secondary = [];

    services.forEach((service) => {
      const searchableName = [
        service.title,
        service.business_name,
        service.provider?.business_name,
        service.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const descriptionText = (service.description || "")
        .replace(/\s+/g, " ")
        .toLowerCase();

      if (searchableName.includes(normalizedQuery)) {
        primary.push(service);
      } else if (descriptionText.includes(normalizedQuery)) {
        secondary.push(service);
      }
    });

    return {
      primaryMatches: primary,
      descriptionMatches: secondary,
    };
  }, [services, normalizedQuery]);

  const [recommendedServices, setRecommendedServices] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [recommendedError, setRecommendedError] = useState(null);

  const isBraidService = (svc) => {
    const haystack = [svc?.title, svc?.category, svc?.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes("braid");
  };

  const braidMatches = useMemo(() => {
    if (!normalizedQuery.includes("hair")) return [];
    const fromRecommendations = recommendedServices.filter(isBraidService);
    if (fromRecommendations.length > 0) return fromRecommendations;
    return primaryMatches.filter(isBraidService);
  }, [recommendedServices, primaryMatches, normalizedQuery]);

  const visiblePrimary = useMemo(() => {
    if (!normalizedQuery.includes("hair")) return primaryMatches;
    const braidIds = new Set(
      braidMatches
        .map((svc) => (svc?.id !== undefined ? String(svc.id) : null))
        .filter(Boolean)
    );
    if (braidIds.size === 0) {
      return primaryMatches.filter((svc) => !isBraidService(svc));
    }
    return primaryMatches.filter((svc) => {
      const id = svc?.id !== undefined ? String(svc.id) : null;
      if (id && braidIds.has(id)) return false;
      return !isBraidService(svc);
    });
  }, [normalizedQuery, primaryMatches, braidMatches]);

  const baseServiceId = useMemo(() => {
    const candidate = visiblePrimary[0] ?? primaryMatches[0];
    return candidate?.id;
  }, [visiblePrimary, primaryMatches]);

  const filteredCount = normalizedQuery
    ? visiblePrimary.length + descriptionMatches.length + braidMatches.length
    : visiblePrimary.length;

  useEffect(() => {
    if (!normalizedQuery || !baseServiceId) {
      setRecommendedServices([]);
      setRecommendedLoading(false);
      setRecommendedError(null);
      return;
    }

    const controller = new AbortController();
    setRecommendedLoading(true);
    setRecommendedError(null);

    fetchServiceRecommendations(baseServiceId, { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        const tiers = [data?.depth_1 || [], data?.depth_2 || [], data?.depth_3 || []];
        const seen = new Set(
          primaryMatches
            .map((svc) => (svc?.id !== undefined ? String(svc.id) : null))
            .filter(Boolean)
        );
        const collected = [];
        tiers.forEach((group) => {
          (Array.isArray(group) ? group : []).forEach((svc) => {
            const relatedId = svc?.id ?? svc?.service_id;
            if (!relatedId) return;
            const key = String(relatedId);
            if (seen.has(key)) return;
            seen.add(key);
            collected.push(svc);
          });
        });
        setRecommendedServices(collected);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setRecommendedServices([]);
          setRecommendedError(err.message || "Unable to load related services");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setRecommendedLoading(false);
        }
      });

    return () => controller.abort();
  }, [normalizedQuery, baseServiceId, primaryMatches]);

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
      <Navbar showBackButton backLabel="Home" backTo="/" />
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
            {filteredCount} match
            {filteredCount === 1 ? "" : "es"} found
          </p>
          {loading && <p className="results-status">Loading live services…</p>}
          {error && !loading && (
            <p className="results-status results-status--error">{error}</p>
          )}
        </div>
      </section>

      {!normalizedQuery && <Programs services={visiblePrimary} />}

      {normalizedQuery && (
        <>
          <section className="results-section container">
            <div className="results-section-header">
              <h2>Matches for “{initialQuery}”</h2>
              <p>Services with names, categories, or providers matching your search.</p>
            </div>
            <Programs services={visiblePrimary} query={initialQuery} />
          </section>

          {normalizedQuery.includes("hair") && (
            <section className="results-section container">
              <div className="results-section-header">
                <h2>
                  <strong>Braids</strong>
                </h2>
              </div>
              {recommendedLoading ? (
                <p className="results-status">Loading braids via IDDFS…</p>
              ) : recommendedError ? (
                <p className="results-status results-status--error">
                  {recommendedError}
                </p>
              ) : braidMatches.length > 0 ? (
                <Programs services={braidMatches} query={initialQuery} />
              ) : (
                <p className="results-status">No related braids found yet.</p>
              )}
            </section>
          )}

          {descriptionMatches.length > 0 && (
            <section className="results-section container">
              <div className="results-section-header">
                <h2>Related descriptions</h2>
                <p>
                  These don’t mention {initialQuery} in the title but include it in the service description.
                </p>
              </div>
              <Programs services={descriptionMatches} query={initialQuery} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
