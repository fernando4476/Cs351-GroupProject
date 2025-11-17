import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Settings() {
  const navigate = useNavigate();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showInSearch, setShowInSearch] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const en = localStorage.getItem("settings:emailNotifications");
    const ss = localStorage.getItem("settings:showInSearch");
    if (en !== null) setEmailNotifications(en === "true");
    if (ss !== null) setShowInSearch(ss === "true");
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("settings:emailNotifications", String(emailNotifications));
    localStorage.setItem("settings:showInSearch", String(showInSearch));
  }, [emailNotifications, showInSearch]);

  return (
    <div className="profile-container">
      <button
        style={{ marginBottom: "20px" }}
        className="btn"
        onClick={() => navigate("/profile")}
      >
        ← Back to Profile
      </button>

      <h2>Settings</h2>

      <div style={{ marginTop: "20px", display: "grid", gap: "16px" }}>
        <label style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Email notifications</span>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          />
        </label>

        <label style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Show my profile in search</span>
          <input
            type="checkbox"
            checked={showInSearch}
            onChange={(e) => setShowInSearch(e.target.checked)}
          />
        </label>
      </div>
    </div>
  );
}
