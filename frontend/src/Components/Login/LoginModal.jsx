import React, { useState, useEffect } from "react";
import "./LoginModal.css";

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const isValidEmail = /^\S+@\S+\.\S+$/.test(email);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="login-title">Get started</h2>
        <p className="login-sub">
          Create an account or login to book and manage your appointments
        </p>

        <label className="login-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="example@uic.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <button className="login-continue" disabled={!isValidEmail}>
          Continue
        </button>

        <div className="login-sep">or</div>

        <button className="login-oauth fb">Continue with Facebook</button>
        <button className="login-oauth apple">Continue with Apple</button>
        <button className="login-oauth google">Continue with Google</button>

        <p className="login-note">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}