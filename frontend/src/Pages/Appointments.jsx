import React, { useEffect, useState } from "react";
import "./Appointments.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { fetchMyBookings, updateBooking, deleteBooking } from "../api/client";

export default function Appointments() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "UIC Student";
  const email = localStorage.getItem("email") || "student@uic.edu";
  const profilePic = localStorage.getItem("profilePic") || logo;

  const [appointments, setAppointments] = useState([]);

  // Modal state
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReschedModal, setShowReschedModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // Load appointments from API (fallback to localStorage)
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyBookings();
        if (Array.isArray(data)) {
          setAppointments(data);
          localStorage.setItem("appointments", JSON.stringify(data));
          return;
        }
      } catch (err) {
        // ignore and fallback
      }
      const stored = JSON.parse(localStorage.getItem("appointments")) || [];
      setAppointments(stored);
    };
    load();
  }, []);

  // Helper to persist to localStorage
  const saveAppointments = (updated) => {
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  // Open cancel modal
  const openCancelModal = (index) => {
    setSelectedIndex(index);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setSelectedIndex(null);
    setShowCancelModal(false);
  };

  // Confirm cancel
  const confirmCancel = async () => {
    if (selectedIndex === null) return;
    const booking = appointments[selectedIndex];
    if (!booking?.id) return;
    try {
      await deleteBooking(booking.id);
      const updated = appointments.filter((_, i) => i !== selectedIndex);
      saveAppointments(updated);
    } catch (err) {
      console.error("Cancel booking failed", err);
    } finally {
      closeCancelModal();
    }
  };

  // Open reschedule modal
  const openReschedModal = (index) => {
    const appt = appointments[index];
    setSelectedIndex(index);
    setNewDate(appt?.date || "");
    setNewTime(appt?.time || "");
    setShowReschedModal(true);
  };

  const closeReschedModal = () => {
    setSelectedIndex(null);
    setShowReschedModal(false);
    setNewDate("");
    setNewTime("");
  };

  // Confirm reschedule
  const confirmReschedule = async () => {
    if (selectedIndex === null) return;
    const updated = [...appointments];
    const booking = updated[selectedIndex];
    if (!booking?.id) return;
    const payload = {
      date: newDate || booking.date,
      time: newTime || booking.time,
    };
    try {
      const saved = await updateBooking(booking.id, payload);
      updated[selectedIndex] = { ...booking, ...saved };
      saveAppointments(updated);
    } catch (err) {
      console.error("Reschedule failed", err);
    } finally {
      closeReschedModal();
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("profilePic");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="appointments-page">
      <div className="appointments-topbar">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          ← Back to Profile
        </button>

        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <div className="appointments-layout">
        <div className="appointments-profile-panel">
          <img src={profilePic} className="appt-profile-pic" alt="Profile" />
          <h2 className="appt-profile-name">{name}</h2>
          <p className="appt-profile-email">{email}</p>
          <p className="appt-note">
            Review, reschedule, or cancel your upcoming appointments.
          </p>
        </div>

        <div className="appointments-content">
          <h1 className="appt-title">Upcoming Appointments</h1>

          {appointments.length === 0 ? (
            <div className="no-appts-box">
              <h2>No Appointments Scheduled</h2>
              <p>
                You currently have no upcoming appointments. Browse services on
                the home page to book one.
              </p>
            </div>
          ) : (
            <div className="appt-list">
              {appointments.map((appt, index) => (
                <div className="appt-card" key={index}>
                  <div className="appt-info">
                    <h3 className="appt-service">
                      {appt?.service?.title || appt.serviceName || "Service"}
                    </h3>
                    <p className="appt-provider">
                      Provider:{" "}
                      <strong>
                        {appt?.provider?.business_name ||
                          appt?.service?.provider?.business_name ||
                          appt.provider ||
                          "UIC Service Provider"}
                      </strong>
                    </p>
                    <p className="appt-date">
                      📅 {appt.date || "Date not set"} ·{" "}
                      {appt.time || "Time not set"}
                    </p>
                    {appt?.service?.location || appt.location ? (
                      <p className="appt-location">
                        📍 {appt?.service?.location || appt.location}
                      </p>
                    ) : null}
                  </div>

                  <div className="appt-actions">
                    <button className="appt-btn view-btn">View</button>
                    <button
                      className="appt-btn resched-btn"
                      onClick={() => openReschedModal(index)}
                    >
                      Reschedule
                    </button>
                    <button
                      className="appt-btn cancel-btn"
                      onClick={() => openCancelModal(index)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCancelModal && (
        <div className="modal-overlay" onClick={closeCancelModal}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Cancel Appointment?</h2>
            <p>
              Are you sure you want to <strong>cancel this appointment</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={closeCancelModal}>
                Keep Appointment
              </button>
              <button className="modal-btn danger" onClick={confirmCancel}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showReschedModal && (
        <div className="modal-overlay" onClick={closeReschedModal}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Reschedule Appointment</h2>
            <p className="modal-subtext">
              Update the date and time for this appointment.
            </p>

            <div className="modal-field">
              <label>New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label>New Time</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="modal-btn secondary"
                onClick={closeReschedModal}
              >
                Cancel
              </button>
              <button
                className="modal-btn primary"
                onClick={confirmReschedule}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
