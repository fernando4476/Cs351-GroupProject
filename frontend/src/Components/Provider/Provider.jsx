import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingModal from "../Booking/BookingModal.jsx";
import { servicesData } from "../../data/services.js";
import "./ProviderView.css";

export default function Provider() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    // Load provider data from localStorage
    const providerData = localStorage.getItem(`provider::${id}`);
    if (providerData) {
      setProvider(JSON.parse(providerData));
    } else {
      const fallback = servicesData.find((service) => service.id === id);
      if (fallback) {
        setProvider(fallback);
      }
    }
    setLoading(false);
  }, [id]);

  const openBooking = (service) => {
    setSelectedService(service || provider?.services?.[0]);
    setBookingOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!provider) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Provider Not Found</h1>
        <p>No provider with ID: {id}</p>
        <button onClick={() => navigate("/")}>Back to Services</button>
      </div>
    );
  }

  return (
    <div className="provider-page">
      <button className="back-link" onClick={() => navigate("/")}>
        ← Back to Services
      </button>

      <div className="provider-grid">
        <section className="provider-card">
          <div className="provider-photo">
            {provider.image ? (
              <img src={provider.image} alt={provider.displayName} />
            ) : (
              <div className="photo-placeholder" aria-label="Profile placeholder" />
            )}
          </div>

          <div className="provider-info">
            <h1>{provider.displayName}</h1>
            <p className="provider-subtitle">{provider.category || "Custom service"}</p>
            {provider.about && (
              <p className="provider-tagline">{provider.about}</p>
            )}
            <div className="provider-metrics">
              <span className="metric-star">★</span>
              <span className="metric-new">New</span>
              <span className="metric-dot">•</span>
              <span className="metric-text">
                {provider.reviews || 0} reviews
              </span>
              <span className="metric-divider">|</span>
              <span className="metric-score">{provider.rating || 100}</span>
            </div>
            <p className="provider-category-label">CUSTOM</p>
          </div>

          <div className="services-section">
            <h2>Services</h2>
            <p className="services-subtitle">Popular Services</p>

            {provider.services && provider.services[0]?.name ? (
              provider.services.map(
                (service, index) =>
                  service.name && (
                    <div key={index} className="service-row">
                      <div>
                        <p className="service-label">
                          {service.category || provider.category || "Service"}
                        </p>
                        <h3>{service.name}</h3>
                        {service.description && (
                          <p className="service-desc">{service.description}</p>
                        )}
                      </div>
                      <div className="service-meta">
                        <div className="service-price-block">
                          <span className="service-price">
                            ${service.price || provider.price || 0}
                          </span>
                          {service.duration && (
                            <span className="service-price-sub">
                              {service.duration}
                            </span>
                          )}
                        </div>
                        <button
                          className="book-chip"
                          onClick={() => openBooking(service)}
                        >
                          book
                        </button>
                      </div>
                    </div>
                  )
              )
            ) : (
              <p className="empty-text">Services coming soon.</p>
            )}
          </div>

        </section>

        <aside className="provider-sidecard">
          <div className="map-placeholder" aria-hidden="true" />
          <div className="sidecard-body">
            <h2>About</h2>
            <p className="sidecard-text">
              {provider.about || "UIC student-run service"}
            </p>

            <div className="sidecard-hours">
              <p className="hours-label">contact & business hours</p>
              {provider.phone && (
                <p className="sidecard-phone">
                  Phone: <span>{provider.phone}</span>
                </p>
              )}
              <div className="hours-table">
                {provider.hours &&
                  Object.entries(provider.hours).map(([day, hours]) => (
                    <div key={day} className="hours-row">
                      <span>{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <BookingModal
        open={bookingOpen}
        provider={provider}
        service={selectedService}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
