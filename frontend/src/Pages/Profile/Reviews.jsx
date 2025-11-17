import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Reviews() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "You";

  return (
    <div className="profile-container">
      <button
        style={{ marginBottom: "20px" }}
        className="btn"
        onClick={() => navigate("/profile")}
      >
        ← Back to Profile
      </button>

      <h2>Reviews</h2>
      <p style={{ marginTop: "16px" }}>
        Reviews written by {name} will appear here once the backend endpoint is added.
      </p>
    </div>
  );
}
