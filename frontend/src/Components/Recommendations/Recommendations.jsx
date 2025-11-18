import React from "react";
import { Link } from "react-router-dom";
import "./Recommendations.css";

const formatPrice = (price) => {
  if (typeof price !== "number") return "Contact for pricing";
  return `$${price.toFixed(2)}`;
};

const formatRating = (rating) => {
  if (typeof rating !== "number" || Number.isNaN(rating)) return "New";
  return rating.toFixed(1);
};

export default function Recommendations({ services = [], loading, error }) {
  const cards = (services || []).slice(0, 6);
  return (
    <section className="recommendations container">
      <div className="recommendations-header">
        <p className="eyebrow">Recommended</p>
        <h2>Trending student-run services</h2>
        <p className="recommendations-subtitle">
          Pulled live from the campus marketplace.
        </p>
      </div>

      {loading ? (
        <p className="recommendations-status">Loading recommendations…</p>
      ) : error ? (
        <p className="recommendations-status recommendations-status--error">
          {error}
        </p>
      ) : cards.length === 0 ? (
        <p className="recommendations-status">
          No recommendations yet. Check back soon!
        </p>
      ) : (
        <div className="recommendations-grid">
          {cards.map((service) => (
            <Link
              to={`/services/${service.id}`}
              key={service.id}
              className="recommendation-card-link"
            >
              <article className="recommendation-card">
                <div className="recommendation-card__body">
                  <div className="recommendation-card__meta">
                    <span className="badge">
                      ★ {formatRating(service.rating)}
                    </span>
                    {service.location && (
                      <span className="location">{service.location}</span>
                    )}
                  </div>
                  <h3>
                    {service.business_name || service.title || "New Service"}
                  </h3>
                  {service.provider_name && (
                    <p className="provider">{service.provider_name}</p>
                  )}
                  {service.description && (
                    <p className="description">{service.description}</p>
                  )}
                </div>
                <div className="recommendation-card__footer">
                  <span className="price-label">
                    {formatPrice(Number(service.price))}
                  </span>
                  <span className="cta">View details</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
