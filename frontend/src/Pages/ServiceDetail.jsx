import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar.jsx";
import BookingModal from "../Components/Booking/BookingModal.jsx";
import "./ServiceDetail.css";
import { buildApiUrl } from "../utils/api";
import { getAccessToken, getAuthHeaders } from "../utils/auth";

const DEFAULT_IMAGE =
  "https://via.placeholder.com/600x600.png?text=UIC+Service";

const DEFAULT_HOURS = {
  Monday: "9:00 AM – 5:00 PM",
  Tuesday: "9:00 AM – 5:00 PM",
  Wednesday: "9:00 AM – 5:00 PM",
  Thursday: "9:00 AM – 5:00 PM",
  Friday: "9:00 AM – 5:00 PM",
  Saturday: "10:00 AM – 2:00 PM",
  Sunday: "Closed",
};

export default function ServiceDetail() {
  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const storedEmail = localStorage.getItem("email")?.toLowerCase() || "";
  const isOwner =
    storedEmail && service?.provider_name?.toLowerCase() === storedEmail;

  useEffect(() => {
    const controller = new AbortController();

    const loadService = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(buildApiUrl(`/services/${id}/`), {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Service not found");
        }
        const data = await response.json();
        setService(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Unable to load service");
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadService();
    }

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const token = getAccessToken();
    if (!service?.id || !token) return;

    fetch(buildApiUrl("/recent/view/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ service_id: service.id }),
    })
      .then(() => {
        window.dispatchEvent(new Event("recentUpdated"));
      })
      .catch(() => {
        /* non-blocking */
      });
  }, [service?.id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) {
      setReviewStatus("Please sign in to leave a review.");
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewStatus("");
      const response = await fetch(buildApiUrl(`/services/${id}/reviews/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.detail || "Unable to save review");
      }

      const saved = await response.json();
      setService((prev) =>
        prev
          ? {
              ...prev,
              reviews: [saved, ...(prev.reviews || [])],
            }
          : prev
      );
      setReviewStatus("Review submitted!");
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      setReviewStatus(err.message || "Review failed");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const providerInfo = service
    ? {
        displayName: service.business_name || service.title,
        price: service.price,
        services: [
          {
            name: service.title,
            description: service.description,
            price: service.price,
          },
        ],
      }
    : null;

  const providerPhone = service?.provider_phone?.trim() || "";
  const providerPhoneLink = providerPhone
    ? `tel:${providerPhone.replace(/[^+\d]/g, "")}`
    : "";

  const mapSrc = useMemo(() => {
    if (!googleMapsKey || !service?.location) return null;
    const encodedLocation = encodeURIComponent(service.location);
    return `https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${encodedLocation}`;
  }, [googleMapsKey, service?.location]);

  return (
    <div>
      <Navbar />
      <main className="service-detail container">
        <button
          className="service-back-link"
          onClick={() => navigate("/")}
          type="button"
        >
          ← Back to Home
        </button>
        {loading && <p className="service-detail__status">Loading service…</p>}
        {error && !loading && (
          <p className="service-detail__status service-detail__status--error">
            {error}
          </p>
        )}

        {!loading && !error && service && (
          <div className="service-grid">
            <section className="service-maincard">
              <div className="service-photo">
                {service.image ? (
                  <img src={service.image} alt={service.title} />
                ) : (
                  <div className="photo-placeholder" aria-hidden="true" />
                )}
              </div>

              <div className="service-info">
                <p className="service-subtitle">Service</p>
                <h1>{service.title}</h1>
                <p className="service-provider">
                  {service.business_name || service.provider_name}
                </p>
                {isOwner && (
                    <button
                      type="button"
                      className="service-delete"
                      onClick={handleDelete}
                    >
                      Delete Listing
                    </button>
                  )}
                <div className="service-metrics">
                  <span className="metric-star">★</span>
                  <span className="metric-new">New</span>
                  <span className="metric-dot">•</span>
                  <span>{service.reviews?.length || 0} reviews</span>
                  {service.rating && (
                    <>
                      <span className="metric-divider">|</span>
                      <span className="metric-score">
                        {Number(service.rating).toFixed(1)}
                      </span>
                    </>
                  )}
                </div>
                <p className="service-category-label">
                  {service.location?.toUpperCase() || "UIC"}
                </p>
              </div>

              <div className="services-section">
                <h2>Services</h2>
                <p className="services-subtitle">Popular Services</p>
                <div className="service-row">
                  <div>
                    <p className="service-label">
                      {service.category || service.location || "Service"}
                    </p>
                    <h3>{service.title}</h3>
                    <p className="service-desc">
                      {service.description || "Student-run service"}
                    </p>
                  </div>
                  <div className="service-meta">
                    <div className="service-price-block">
                      <span className="service-price">
                        ${Number(service.price || 0).toFixed(2)}
                      </span>
                      <span className="service-price-sub">per session</span>
                    </div>
                    <button
                      className="book-chip"
                      onClick={() => setBookingOpen(true)}
                    >
                      book
                    </button>
                  </div>
                </div>
              </div>

              <div className="primary-cta">
                <button onClick={() => setBookingOpen(true)}>
                  Book Appointment
                </button>
              </div>
            </section>

            <aside className="service-sidecard">
              <div className="sidecard-body">
                <div className="map-container">
                  {mapSrc ? (
                    <iframe
                      title={`Map showing ${service.location}`}
                      src={mapSrc}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="map-placeholder" aria-hidden="true" />
                  )}
                  {service.location && (
                    <p className="map-location">
                      <span className="map-location__pin" aria-hidden="true">
                        📍
                      </span>
                      <span>{service.location}</span>
                    </p>
                  )}
                </div>
                <h2>About</h2>
                <p className="sidecard-text">
                  {service.description || "UIC student-run service"}
                </p>

                <div className="sidecard-hours">
                  <p className="hours-label">contact & business hours</p>
                  <p className="sidecard-phone">
                    Phone:{" "}
                    <span>
                      {providerPhone ? (
                        <a href={providerPhoneLink}>{providerPhone}</a>
                      ) : (
                        "Not provided"
                      )}
                    </span>
                  </p>
                  <div className="hours-table">
                    {Object.entries(service.hours || DEFAULT_HOURS).map(
                      ([day, hours]) => (
                        <div className="hours-row" key={day}>
                          <span>{day.toUpperCase()}</span>
                          <span>{hours}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

              </div>
            </aside>
          </div>
        )}
      </main>

      {!loading && !error && service && (
        <section className="reviews-section container">
          <div className="reviews-card">
            <h2>Reviews</h2>
            {(service.reviews || []).length === 0 ? (
              <p className="empty-text">No reviews yet. Be the first!</p>
            ) : (
              <ul className="reviews-list">
                {service.reviews.map((review) => (
                  <li key={review.id} className="review-card">
                    <div className="review-header">
                      <span className="review-user">{review.user}</span>
                      <span className="review-rating">★ {review.rating}</span>
                    </div>
                    <p>{review.comment}</p>
                    <span className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h3>Leave a review</h3>
              <label>
                Rating
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }))
                  }
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Comment
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  rows="4"
                  placeholder="Share your experience..."
                />
              </label>
              {reviewStatus && (
                <p className="review-status">{reviewStatus}</p>
              )}
              <button type="submit" disabled={reviewSubmitting}>
                {reviewSubmitting ? "Submitting..." : "Submit review"}
              </button>
            </form>
          </div>
        </section>
      )}

      <BookingModal
        open={bookingOpen}
        provider={providerInfo}
        service={providerInfo?.services?.[0]}
        onClose={() => setBookingOpen(false)}
        serviceId={service?.id}
        useBackendBooking
      />
    </div>
  );
}

  const handleDelete = async () => {
    if (!service) return;
    const token = getAccessToken();
    if (!token) {
      alert("Please sign in to delete this listing.");
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(buildApiUrl(`/services/${service.id}/`), {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error("Unable to delete service");
      }
      window.dispatchEvent(new Event("servicesUpdated"));
      navigate("/");
    } catch (err) {
      alert(err.message || "Failed to delete listing.");
    }
  };
