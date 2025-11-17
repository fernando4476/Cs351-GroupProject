import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function AccountDetails() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "UIC Student";
  const email = localStorage.getItem("email") || "student@uic.edu";

  return (
    <div className="profile-container">
      <button
        style={{ marginBottom: "20px" }}
        className="btn"
        onClick={() => navigate("/profile")}
      >
        ← Back to Profile
      </button>

      <h2>Account Details</h2>

      <div style={{ marginTop: "20px", display: "grid", gap: "12px" }}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            readOnly
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        <div>
          <label>UIC Email</label>
          <input
            type="email"
            value={email}
            readOnly
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        <p style={{ fontSize: "13px", color: "#666", marginTop: "8px" }}>
          To change your name or email, you’ll need backend support (not yet implemented).
        </p>
      </div>
    </div>
  );
}
