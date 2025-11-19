import React from "react";
import "./AccountDetails.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function AccountDetails() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "UIC Student";
  const email = localStorage.getItem("email") || "student@uic.edu";
  const language = localStorage.getItem("language") || "English";
  const country = localStorage.getItem("country") || "United States";
  const profilePic = localStorage.getItem("profilePic") || logo;

  /* SIGN OUT */
  const handleSignOut = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="details-page">

      {/* TOP BAR */}
      <div className="details-topbar">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          ← Back to Profile
        </button>

        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      {/* MAIN 2-COLUMN LAYOUT */}
      <div className="details-content">

        {/* LEFT LARGE PROFILE CARD */}
        <div className="details-left">
          <img src={profilePic} className="details-profile-img" alt="Profile" />
          <h2 className="details-name">{name}</h2>
          <p className="details-email">{email}</p>

          <p className="details-small-text">
            To edit your profile information, visit the Settings page.
          </p>
        </div>

        {/* RIGHT INFORMATION PANEL */}
        <div className="details-right">

          <h2 className="details-section-title">Account Details</h2>

          <div className="details-table">

            <div className="row">
              <span className="label">Full Name</span>
              <span className="value">{name}</span>
            </div>

            <div className="row">
              <span className="label">UIC Email</span>
              <span className="value">{email}</span>
            </div>

            <div className="row">
              <span className="label">Language</span>
              <span className="value">{language}</span>
            </div>

            <div className="row">
              <span className="label">Country</span>
              <span className="value">{country}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
