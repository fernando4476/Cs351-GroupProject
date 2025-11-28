import React, { useState } from "react";
import "./Feedback.css";
import { useNavigate } from "react-router-dom";
import { submitFeedback } from "../api/client";

export default function Feedback() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await submitFeedback({
        full_name: fullName.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
      setFullName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 2000);
    } catch (err) {
      setError(err.message || "Failed to submit feedback");
    }
  };

  return (
    <div className="feedback-page">

      {/* Red header bar */}
      <div className="topbar-red">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          ← Back to Profile
        </button>
        <button
          className="signout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/");
            window.location.reload();
          }}
        >
          Sign out
        </button>
      </div>

      {/* Centered card */}
      <div className="feedback-container">
        <h1 className="feedback-title">Feedback & Support</h1>

        <div className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>

          <p><strong>How do I become a service provider?</strong><br />
            Go to the “Become a Provider” page and fill out your application.
          </p>

          <p><strong>How do I contact support?</strong><br />
            Email us at <a href="mailto:uicmarketplaceverify@gmail.com">uicmarketplaceverify@gmail.com</a>.
          </p>

          <p><strong>How do I pay for a service?</strong><br />
            Pay your provider directly using Venmo, Cash App, or Zelle/QuickPay. Your provider will share their handle after your service.
          </p>

          <p><strong>Why do I need a @uic.edu email?</strong><br />
            UIC Connect is for UIC students and staff only.
          </p>
        </div>

        <div className="feedback-form-section">
          <h2 className="section-title">Send Feedback</h2>

          <form onSubmit={handleSubmit} className="feedback-form">
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              type="email"
              placeholder="UIC Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <textarea
              placeholder="Your message..."
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button type="submit" className="submit-btn">
              Submit Feedback
            </button>
            {submitted && (
              <p className="feedback-success">Feedback submitted!</p>
            )}
            {error && <p className="feedback-error">{error}</p>}
          </form>
        </div>

      </div>
    </div>
  );
}

