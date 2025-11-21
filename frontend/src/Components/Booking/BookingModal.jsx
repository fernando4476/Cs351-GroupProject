import React, { useEffect, useMemo, useState } from "react";
import "./BookingModal.css";
import { getAccessToken } from "../../utils/auth";
import { bookService } from "../../api/client";

const defaultTimeSlots = ["1:00 PM", "1:40 PM", "2:20 PM", "3:00 PM", "3:40 PM"];

const to24Hour = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) {
    return trimmed;
  }
  let [_, hours, minutes, period] = match;
  let hourNum = parseInt(hours, 10);
  if (period.toUpperCase() === "PM" && hourNum !== 12) {
    hourNum += 12;
  }
  if (period.toUpperCase() === "AM" && hourNum === 12) {
    hourNum = 0;
  }
  return `${String(hourNum).padStart(2, "0")}:${minutes}`;
};

const buildUpcomingDays = (count = 5) => {
  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const day = new Date(now);
    day.setDate(now.getDate() + index);

    const weekday = day.toLocaleDateString("en-US", { weekday: "short" });
    const monthLabel = day.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return {
      weekday,
      dateNumber: day.getDate(),
      monthLabel,
      iso: day.toISOString().split("T")[0],
    };
  });
};

export default function BookingModal({
  open,
  provider,
  service,
  onClose,
  serviceId,
  useBackendBooking = false,
  onBookingComplete,
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const days = useMemo(() => buildUpcomingDays(), [open]);

  const providerProfile = provider || service?.provider || null;
  const serviceRecord =
    service && service.title
      ? {
          id: service.id,
          name: service.title,
          description: service.description,
          price: service.price,
        }
      : service;
  const displayName =
    providerProfile?.displayName ||
    providerProfile?.business_name ||
    serviceRecord?.name ||
    "Service";
  const servicePrice =
    serviceRecord?.price ??
    providerProfile?.price ??
    providerProfile?.services?.[0]?.price ??
    0;
  const providerId = providerProfile?.id || service?.provider?.id || null;
  const backendServiceId = serviceRecord?.id ?? serviceId ?? service?.id ?? null;
  const timeSlots =
    provider?.timeSlots?.length > 0
      ? provider.timeSlots
      : providerProfile?.timeSlots?.length > 0
      ? providerProfile.timeSlots
      : defaultTimeSlots;

  useEffect(() => {
    if (open) {
      setSelectedDayIndex(0);
      setSelectedTime(timeSlots[0] || "1:00 PM");
      setStatus("");
      setStatusType("success");
      setNotes("");
      setSubmitting(false);
    }
  }, [open, provider, service, timeSlots]);

  if (!open || (!providerProfile && !serviceRecord)) {
    return null;
  }

  const activeDay = days[selectedDayIndex];
  const activeService = serviceRecord || providerProfile?.services?.[0];
  const total = Number(servicePrice || 0);

  const confirmBooking = async () => {
    if (!useBackendBooking) {
      setStatus(
        `Booked ${activeService?.name ?? displayName} on ${
          activeDay?.weekday
        } ${activeDay?.dateNumber} at ${selectedTime}.`
      );
      setStatusType("success");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setStatus("Please sign in to book this service.");
      setStatusType("error");
      return;
    }

    if (!providerId || !backendServiceId) {
      setStatus("Missing service information.");
      setStatusType("error");
      return;
    }

    try {
      setSubmitting(true);
      setStatus("");
      const booking = await bookService({
        providerId,
        serviceId: backendServiceId,
        date: activeDay?.iso,
        time: to24Hour(selectedTime),
        note: notes,
      });
      setStatus(
        `Booking confirmed for ${activeDay.weekday}, ${activeDay.dateNumber} at ${selectedTime}.`
      );
      setStatusType("success");
      onBookingComplete?.(booking);
    } catch (err) {
      setStatus(err.message || "Booking failed");
      setStatusType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="booking-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2>{activeDay?.monthLabel}</h2>

        <div className="day-selector">
          {days.map((day, index) => (
            <button
              key={day.iso}
              className={`day-pill ${
                index === selectedDayIndex ? "active" : ""
              }`}
              onClick={() => setSelectedDayIndex(index)}
            >
              <span className="weekday">{day.weekday}</span>
              <span className="date-number">{day.dateNumber}</span>
            </button>
          ))}
        </div>

        <div className="time-grid">
          {timeSlots.map((time) => (
            <button
              key={time}
              className={`time-pill ${
                selectedTime === time ? "active" : ""
              }`.trim()}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>

        <div className="booking-summary">
          <div>
            <p className="provider-name">{displayName}</p>
            <p className="service-name">
              {activeService?.name ||
                activeService?.title ||
                providerProfile?.services?.[0]?.name ||
                displayName}
            </p>
          </div>
          <p className="total">${total.toFixed(2)}</p>
        </div>

        {selectedTime && activeDay && (
          <p className="booking-detail">
            {activeDay.weekday} {activeDay.dateNumber} at {selectedTime}
          </p>
        )}

        <textarea
          className="booking-notes"
          placeholder="Add any notes for your provider (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {status && (
          <p className={`booking-status booking-status--${statusType}`}>
            {status}
          </p>
        )}

        <button
          className="confirm-btn"
          onClick={confirmBooking}
          disabled={submitting}
        >
          {submitting ? "Booking..." : "Confirm & pay in person"}
        </button>
      </div>
    </div>
  );
}
