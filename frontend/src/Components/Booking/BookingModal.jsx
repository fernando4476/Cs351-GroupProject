import React, { useEffect, useMemo, useState } from "react";
import "./BookingModal.css";
import { buildApiUrl } from "../../utils/api";
import { getAccessToken, getAuthHeaders } from "../../utils/auth";

const defaultTimeSlots = ["1:00 PM", "1:40 PM", "2:20 PM", "3:00 PM", "3:40 PM"];

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

  const timeSlots =
    provider?.timeSlots?.length > 0 ? provider.timeSlots : defaultTimeSlots;

  useEffect(() => {
    if (open) {
      setSelectedDayIndex(0);
      setSelectedTime(timeSlots[0] || "1:00 PM");
      setStatus("");
      setStatusType("success");
      setNotes("");
      setSubmitting(false);
    }
  }, [open, provider, timeSlots]);

  if (!open || !provider) {
    return null;
  }

  const activeDay = days[selectedDayIndex];
  const activeService = service || provider.services?.[0];
  const total = activeService?.price ?? provider.price ?? 0;

  const confirmBooking = async () => {
    if (!useBackendBooking) {
      setStatus(
        `Booked ${activeService?.name ?? provider.displayName} on ${
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

    if (!serviceId) {
      setStatus("Missing service information.");
      setStatusType("error");
      return;
    }

    try {
      setSubmitting(true);
      setStatus("");
      const response = await fetch(
        buildApiUrl(`/services/${serviceId}/book/`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            slot_date: activeDay?.iso,
            slot_time: selectedTime,
            notes,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.detail || data?.error || "Unable to confirm booking"
        );
      }

      const data = await response.json();
      setStatus(
        `Booking confirmed for ${activeDay.weekday}, ${activeDay.dateNumber} at ${selectedTime}.`
      );
      setStatusType("success");
      onBookingComplete?.(data);
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
            <p className="provider-name">{provider.displayName}</p>
            <p className="service-name">{activeService?.name}</p>
          </div>
          <p className="total">${Number(total || 0).toFixed(2)}</p>
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
