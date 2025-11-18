import React, { useEffect, useMemo, useState } from "react";
import "./BookingModal.css";

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

export default function BookingModal({ open, provider, service, onClose }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [status, setStatus] = useState("");

  const days = useMemo(() => buildUpcomingDays(), [open]);

  const timeSlots =
    provider?.timeSlots?.length > 0 ? provider.timeSlots : defaultTimeSlots;

  useEffect(() => {
    if (open) {
      setSelectedDayIndex(0);
      setSelectedTime(timeSlots[0] || "1:00 PM");
      setStatus("");
    }
  }, [open, provider, timeSlots]);

  if (!open || !provider) {
    return null;
  }

  const activeDay = days[selectedDayIndex];
  const activeService = service || provider.services?.[0];
  const total = activeService?.price ?? provider.price ?? 0;

  const confirmBooking = () => {
    setStatus(
      `Booked ${activeService?.name ?? provider.displayName} on ${
        activeDay?.weekday
      } ${activeDay?.dateNumber} at ${selectedTime}.`
    );
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
            {activeDay.weekday} {activeDay.dateNumber} @ {selectedTime}
          </p>
        )}

        {status && <p className="booking-status">{status}</p>}

        <button className="confirm-btn" onClick={confirmBooking}>
          Confirm &amp; pay in person
        </button>
      </div>
    </div>
  );
}
