import React, { useEffect, useState } from "react";
import "./Appointments.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

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

  // Load appointments from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(stored);
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
  const confirmCancel = () => {
    if (selectedIndex === null) return;
    const updated = appointments.filter((_, i) => i !== selectedIndex);
    saveAppointments(updated);
    closeCancelModal();
  };

  // Open reschedule modal
  const openReschedModal = (index) => {
    const appt = appointments[index];
    setSelectedIndex(index);
    setNewDate(appt.date || "");
    setNewTime(appt.time || "");
    setShowReschedModal(true);
  };

  const closeReschedModal = () => {
    setSelectedIndex(null);
    setShowReschedModal(false);
    setNewDate("");
    setNewTime("");
  };

  // Confirm reschedule
  const confirmReschedule = () => {
    if (selectedIndex === null) return;
    const updated = [...appointments];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      date: newDate || updated[selectedIndex].date,
      time: newTime || updated[selectedIndex].time,
    };
    saveAppointments(updated);
    closeReschedModal();
  };

  const handleSignOut = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("profilePic");
    // appointments could stay, but you can clear them too if you want:
    // localStorage.removeItem("appointments");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="appointments-page">
      {/* 🔴 TOP BAR */}
      <div className="appointments-topbar">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          ← Back to Profile
        </button>

        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div className="appointments-layout">
        {/* LEFT PROFILE PANEL */}
        <div className="appointments-profile-panel">
          <img src={profilePic} className="appt-profile-pic" alt="Profile" />
          <h2 className="appt-profile-name">{name}</h2>
          <p className="appt-profile-email">{email}</p>
          <p className="appt-note">
            Review, reschedule, or cancel your upcoming appointments.
          </p>
        </div>

        {/* RIGHT CONTENT PANEL */}
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
                      {appt.serviceName || "Service"}
                    </h3>
                    <p className="appt-provider">
                      Provider:{" "}
                      <strong>{appt.provider || "UIC Service Provider"}</strong>
                    </p>
                    <p className="appt-date">
                      📅 {appt.date || "Date not set"} —{" "}
                      {appt.time || "Time not set"}
                    </p>
                    {appt.location && (
                      <p className="appt-location">📍 {appt.location}</p>
                    )}
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

      {/* ❌ CANCEL MODAL */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={closeCancelModal}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Cancel Appointment?</h2>
            <p>
              Are you sure you want to{" "}
              <strong>cancel this appointment</strong>? This action cannot be
              undone.
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

      {/* 🔁 RESCHEDULE MODAL */}
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
