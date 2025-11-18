// src/Components/Provider/ProviderDetail.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import "./ProviderDetail.css";
import defaultAvatar from "../../assets/defaultAvatar.svg";
import { useProviderData } from "../../context/ProviderDataContext.jsx";

const formatDay = (day) => day.charAt(0).toUpperCase() + day.slice(1);

const formatTime = (value) => {
  if (!value || value === "Closed") return value || "";
  const [hours, minutes] = value.split(":");
  let h = parseInt(hours, 10);
  if (Number.isNaN(h)) return value;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
};

const buildDateOptions = () => {
  const base = new Date();
  return Array.from({ length: 5 }, (_, idx) => {
    const date = new Date(base);
    date.setDate(base.getDate() + idx);
    return {
      iso: date.toISOString(),
      dayShort: date.toLocaleDateString(undefined, { weekday: "short" }),
      dayNum: date.getDate(),
      monthLabel: date.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      }),
    };
  });
};

const TIME_SLOTS = ["1:00 PM", "1:40 PM", "2:20 PM", "3:00 PM", "3:40 PM"];

export default function ProviderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { providers } = useProviderData();
  const dateOptions = useMemo(() => buildDateOptions(), []);

  const provider = useMemo(
    () => providers.find((p) => p.id === id),
    [id, providers]
  );

  const [booking, setBooking] = useState({
    open: false,
    service: null,
    dateIndex: 0,
    timeIndex: 0,
  });

  if (!provider) {
    return (
      <>
        <Navbar />
        <main className="provider-detail-page">
          <div className="provider-detail-card">
            <p className="provider-detail-muted">
              We couldn&apos;t find that provider. It may have been removed or
              not created yet.
            </p>
            <div className="provider-detail-actions">
              <button onClick={() => navigate(-1)}>← Back</button>
              <button onClick={() => navigate("/become-provider")}>
                Become a provider
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  const {
    title,
    sub,
    img,
    rating,
    reviews,
    category,
    about,
    phone,
    priceRange,
    time,
    hours,
    services = [],
  } = provider;

  const openBooking = (service) => {
    setBooking({
      open: true,
      service,
      dateIndex: 0,
      timeIndex: 0,
    });
  };

  const closeBooking = () => {
    setBooking((prev) => ({ ...prev, open: false, service: null }));
  };

  const selectedDate = dateOptions[booking.dateIndex];
  const selectedTime = TIME_SLOTS[booking.timeIndex];
  const servicePriceRaw = booking.service?.price || "";
  const numericPrice =
    parseFloat(servicePriceRaw.replace(/[^\d.]/g, "")) || null;
  const formattedTotal =
    numericPrice !== null
      ? `$${numericPrice.toFixed(2)}`
      : servicePriceRaw || "$0";

  return (
    <>
      <Navbar />
      <main className="provider-detail-page">
        <div className="provider-detail-shell">
          <button className="provider-detail-back" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className="provider-detail-columns">
            <section className="provider-detail-left">
              <div className="provider-photo-large">
                <img src={img || defaultAvatar} alt={title} />
              </div>
              <div className="provider-summary">
                <h1>{title}</h1>
                {sub && <p className="provider-sub">{sub}</p>}
                <div className="provider-rating-row">
                  <span className="star">★ {rating || "New"}</span>
                  <span className="sep">•</span>
                  <span>{reviews ?? 0} reviews</span>
                  {priceRange && (
                    <>
                      <span className="sep">|</span>
                      <span>{priceRange}</span>
                    </>
                  )}
                </div>
                <p className="provider-category">{category || "Provider"}</p>
              </div>

              <div className="provider-services-section">
                <h2>Services</h2>
                <p className="provider-services-label">Popular Services</p>
                <div className="provider-services-listing">
                  {services.length > 0 ? (
                    services.map((svc, idx) => (
                      <div key={idx} className="provider-service-row">
                        <div className="provider-service-info">
                          <h3>{svc.name}</h3>
                          <p>{svc.description}</p>
                        </div>
                        <div className="provider-service-meta">
                          <div className="provider-service-price">
                            <strong>{svc.price || "$0"}</strong>
                            <span>{svc.duration || ""}</span>
                          </div>
                          <button
                            className="provider-service-book"
                            onClick={() => openBooking(svc)}
                          >
                            book
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="provider-detail-muted">
                      This provider hasn&apos;t added services yet.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <aside className="provider-detail-right">
              <div className="provider-map-placeholder" aria-hidden="true" />
              <div className="provider-right-body">
                <h2>About</h2>
                <p>
                  {about ||
                    "This provider hasn’t written an about section yet."}
                </p>

                <h3>Contact & business hours</h3>
                {phone && <p className="provider-phone">{phone}</p>}

                <div className="provider-hours">
                  {(hours && Object.keys(hours).length > 0
                    ? Object.entries(hours)
                    : [
                        [
                          "schedule",
                          {
                            closed: false,
                            open: time || "Contact for hours",
                            close: "",
                          },
                        ],
                      ]
                  ).map(([day, info]) => (
                    <div key={day} className="provider-hours-row">
                      <span>{formatDay(day)}</span>
                      <span>
                        {info.closed
                          ? "Closed"
                          : `${formatTime(info.open)}${
                              info.close ? ` - ${formatTime(info.close)}` : ""
                            }`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {booking.open && booking.service && (
        <div className="booking-overlay" role="dialog" aria-modal="true">
          <div className="booking-modal">
            <button className="booking-close" onClick={closeBooking}>
              ×
            </button>
            <div className="booking-month">
              {selectedDate?.monthLabel || "Upcoming"}
            </div>
            <div className="booking-date-row">
              {dateOptions.map((date, idx) => (
                <button
                  key={date.iso}
                  className={`booking-date ${idx === booking.dateIndex ? "active" : ""}`}
                  onClick={() =>
                    setBooking((prev) => ({ ...prev, dateIndex: idx }))
                  }
                >
                  <span>{date.dayShort}</span>
                  <strong>{date.dayNum}</strong>
                </button>
              ))}
            </div>

            <div className="booking-time-row">
              {TIME_SLOTS.map((slot, idx) => (
                <button
                  key={slot}
                  className={`booking-time ${idx === booking.timeIndex ? "active" : ""}`}
                  onClick={() =>
                    setBooking((prev) => ({ ...prev, timeIndex: idx }))
                  }
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="booking-summary">
              <div>
                <h3>{booking.service.name}</h3>
                <p>{booking.service.description}</p>
              </div>
              <div className="booking-price">{booking.service.price || "$0"}</div>
            </div>

            <div className="booking-total-row">
              <div>
                {selectedDate?.dayShort} {selectedDate?.dayNum} @ {selectedTime}
              </div>
              <div className="booking-total">
                Total: <strong>{formattedTotal}</strong>
              </div>
            </div>

            <button className="booking-confirm" onClick={closeBooking}>
              Confirm & pay in person
            </button>
          </div>
        </div>
      )}
    </>
  );
}
