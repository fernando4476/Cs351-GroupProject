import React from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "UIC Student";
  const email = localStorage.getItem("email") || "student@uic.edu";

  // Placeholder phone (backend doesn’t store it yet)
  const phone = "(add phone in future)";

  return (
    <div className="profile-container">
      <div className="profile-header">
        {/* Placeholder silhouette image */}
        <img
          src="https://via.placeholder.com/80?text=👤"
          alt="Profile"
          className="profile-img"
        />
        <div>
          <h2>{name}</h2>
          <p>{email}</p>
          <p style={{ fontSize: "14px", color: "#555" }}>{phone}</p>
        </div>
      </div>

      <div className="profile-menu">
        <div
          className="profile-item"
          onClick={() => navigate("/account-details")}
        >
          <span>Account Details</span>
          <span>→</span>
        </div>

        <div className="profile-item" onClick={() => navigate("/feedback")}>
          <span>Feedback & support</span>
          <span>→</span>
        </div>

        <div className="profile-item" onClick={() => navigate("/reviews")}>
          <span>Reviews</span>
          <span>→</span>
        </div>

        <div className="profile-item" onClick={() => navigate("/settings")}>
          <span>Settings</span>
          <span>→</span>
        </div>

        <div className="profile-item" onClick={() => navigate("/about-uic")}>
          <span>About UIC</span>
          <span>→</span>
        </div>

        <div
          className="profile-item"
          onClick={() => {
            // simple frontend logout to match Navbar
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("name");
            localStorage.removeItem("email");
            navigate("/");
            window.location.reload();
          }}
        >
          <span>Sign out</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}
