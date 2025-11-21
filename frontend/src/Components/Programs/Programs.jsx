import React from "react";
import { Link } from "react-router-dom";
import "./Programs.css";
import { resolveMediaUrl } from "../../utils/api";

const DEFAULT_IMAGE =
  "https://via.placeholder.com/600x380.png?text=UIC+Marketplace";

const mapToCard = (service) => {
  const isApiService = !!service?.provider;
  const title =
    service?.displayName ||
    service?.title ||
    service?.provider?.business_name ||
    "Service";

  return {
    id: service?.id,
    title,
    subtitle: isApiService
      ? service?.provider?.business_name || "UIC student"
      : service?.category,
    image:
      resolveMediaUrl(service?.photo) || service?.image || DEFAULT_IMAGE,
    price: service?.price,
    rating: service?.provider?.rating ?? service?.rating,
    reviews: service?.review_count ?? service?.reviews ?? 0,
    nextAvailable: service?.nextAvailable,
    description: service?.description,
    link: isApiService ? `/services/${service?.id}` : `/provider/${service?.id}`,
  };
};

export default function Programs({ services = [], fallback = [], query }) {
  const listToRender = services.length > 0 ? services : fallback;
  const hasResults = listToRender.length > 0;

  if (!hasResults && query) {
    return (
      <section className="programs-section">
        <div className="no-results">
          <h3>No results for “{query}”</h3>
          <p>Try searching another term like “hair” or “tutor”.</p>
        </div>
      </section>
    );
  }

  if (!hasResults) return null;

  const cardData = listToRender.map(mapToCard);

  return (
    <section className="programs-section">
      <div className="cards">
        {cardData.map((card) => (
          <article key={card.id} className="card">
            <Link to={card.link} className="card-link">
              <div className="card-media">
                <img src={card.image} alt={card.title} />
              </div>

              <div className="card-body">
                <h3 className="card-title">
                  {card.title}
                  {card.subtitle && <span className="card-sub"> - {card.subtitle}</span>}
                </h3>

                <div className="card-meta">
                  <span className="star">★ {card.rating || "New"}</span>
                  <span className="sep">•</span>
                  <span>{card.reviews || 0} reviews</span>
                  <span className="sep">|</span>
                  <span>{card.description ? "Popular" : "Top rated"}</span>
                </div>

                <div className="card-cta">
                  <span className="pill time">
                    {card.nextAvailable || "Book this week"}
                  </span>
                  <span className="btn book">View details</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
