import React from "react";
import { Link } from "react-router-dom";
import "./Programs.css";

const DEFAULT_IMAGE =
  "https://via.placeholder.com/600x380.png?text=UIC+Marketplace";

export default function Programs({
  services = [],
  fallback = [],
  query,
}) {
  const listToRender = services.length > 0 ? services : fallback;
  const hasResults = listToRender.length > 0;

  return (
    <section className="programs-section">
      {hasResults ? (
        <div className="cards">
          {listToRender.map((service) => (
            <article key={service.id} className="card">
              <Link to={`/provider/${service.id}`} className="card-link">
                <div className="card-media">
                  <img
                    src={service.image || DEFAULT_IMAGE}
                    alt={service.displayName}
                  />
                </div>

                <div className="card-body">
                  <h3 className="card-title">
                    {service.displayName}
                    {service.category && (
                      <span className="card-sub"> - {service.category}</span>
                    )}
                  </h3>

                  <div className="card-meta">
                    <span className="star">★ {service.rating || "New"}</span>
                    <span className="sep">•</span>
                    <span>{service.reviews || 0} reviews</span>
                    <span className="sep">|</span>
                    <span>Top Rated</span>
                  </div>

                  <div className="card-cta">
                    <span className="pill time">
                      {service.nextAvailable || "Today at 4:00 pm"}
                    </span>
                    <span className="btn book">View profile</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : query ? (
        <div className="no-results">
          <h3>No results for “{query}”</h3>
          <p>Try searching another term like “hair” or “tutor”.</p>
        </div>
      ) : null}
    </section>
  );
}
