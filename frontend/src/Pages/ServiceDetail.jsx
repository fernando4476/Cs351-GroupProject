import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar.jsx";
import BookingModal from "../Components/Booking/BookingModal.jsx";
import "./ServiceDetail.css";
import { getAccessToken } from "../utils/auth";
import { resolveMediaUrl } from "../utils/api";
import {
  fetchServiceDetail,
  fetchProviderReviews,
  createProviderReview,
  recordRecentView,
  fetchProviderRating,
} from "../api/client";

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
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const data = await fetchServiceDetail(id, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setService(data);
        }
      } catch (err) {
        if (err.name === "AbortError" || controller.signal.aborted) {
          return;
        }
        setError(err.message || "Unable to load service");
        setService(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const providerId = service?.provider?.id;
    if (!providerId) {
      setReviews([]);
      setRating(null);
      return;
    }

    const controller = new AbortController();
    setReviewsLoading(true);
    setReviewsError(null);

    fetchProviderReviews(providerId, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setReviews(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setReviews([]);
          setReviewsError(err.message || "Unable to load reviews");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setReviewsLoading(false);
        }
      });

    fetchProviderRating(providerId, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setRating(
            typeof data?.average_rating === "number"
              ? data.average_rating
              : null
          );
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setRating(null);
        }
      });

    return () => controller.abort();
  }, [service?.provider?.id]);

  useEffect(() => {
    if (!service?.id || !getAccessToken()) return;
    recordRecentView(service.id)
      .then(() => window.dispatchEvent(new Event("recentUpdated")))
      .catch(() => {});
  }, [service?.id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) {
      setReviewStatus("Please sign in to leave a review.");
      return;
    }
    const providerId = service?.provider?.id;
    if (!providerId) {
      setReviewStatus("Missing provider information.");
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewStatus("");
      const saved = await createProviderReview({
        providerId,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setReviews((prev) => [saved, ...prev]);
      setReviewStatus("Review submitted!");
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      setReviewStatus(err.message || "Review failed");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const providerProfile = service?.provider || null;
  const providerDisplayName =
    providerProfile?.business_name ||
    providerProfile?.displayName ||
    service?.title ||
    "Service";
  const servicePhoto =
    resolveMediaUrl(service?.photo) || service?.image || DEFAULT_IMAGE;
  const providerPhone = providerProfile?.phone?.trim() || "";
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
                {servicePhoto ? (
                  <img src={servicePhoto} alt={service.title} />
                ) : (
                  <div className="photo-placeholder" aria-hidden="true" />
                )}
              </div>

              <div className="service-info">
                <p className="service-subtitle">Service</p>
                <h1>{service.title}</h1>
                <p className="service-provider">{providerDisplayName}</p>
                <div className="service-metrics">
                  <span className="metric-star">★</span>
                  <span className="metric-new">New</span>
                  <span className="metric-dot">•</span>
                  <span>{reviews.length} reviews</span>
                  {rating !== null && (
                    <>
                      <span className="metric-divider">|</span>
                      <span className="metric-score">
                        {Number(rating).toFixed(1)}
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
            {reviewsLoading && (
              <p className="reviews-status">Loading reviews…</p>
            )}
            {reviewsError && !reviewsLoading && (
              <p className="reviews-status reviews-status--error">
                {reviewsError}
              </p>
            )}
            {!reviewsLoading && reviews.length === 0 && (
              <p className="empty-text">No reviews yet. Be the first!</p>
            )}
            {!reviewsLoading && reviews.length > 0 && (
              <ul className="reviews-list">
                {reviews.map((review) => (
                  <li key={review.id} className="review-card">
                    <div className="review-header">
                      <span className="review-user">
                        {review.customer?.full_name || "UIC student"}
                      </span>
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
        service={service}
        onClose={() => setBookingOpen(false)}
        useBackendBooking
      />
    </div>
  );
}
