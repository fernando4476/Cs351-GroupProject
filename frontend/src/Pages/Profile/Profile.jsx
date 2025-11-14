import React from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src="https://via.placeholder.com/80"
          alt="Profile"
          className="profile-img"
        />
        <div>
          <h2>Jared Smith</h2>
          <p>(312) 564-7982</p>
        </div>
      </div>

      <div className="profile-menu">
        <div className="profile-item" onClick={() => navigate("/account-details")}>
          Account Details <span>→</span>
        </div>

        <div className="profile-item" onClick={() => navigate("/feedback")}>
         <span>Feedback & support</span>
         <span>→</span>
        </div>

        <div className="profile-item" onClick={() => navigate("/reviews")}>
          Reviews <span>→</span>
        </div>

        <div className="profile-item" onClick={() => navigate("/settings")}>
          Settings <span>→</span>
        </div>

        <div className="profile-item" onClick={() => navigate("/about-uic")}>
          About UIC <span>→</span>
        </div>

        <div className="profile-item" onClick={() => alert("Signed out!")}>
          Sign out <span>→</span>
        </div>
      </div>
    </div>
  );
}
