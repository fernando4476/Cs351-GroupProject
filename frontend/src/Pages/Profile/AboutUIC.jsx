import React from "react";
import "./AboutUIC.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";  // Same style as AccountDetails

export default function AboutUIC() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "UIC Student";
  const email = localStorage.getItem("email") || "student@uic.edu";
  const profilePic = localStorage.getItem("profilePic") || logo;

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

      {/* IDENTICAL GRID LAYOUT */}
      <div className="details-content">

        {/* LEFT COLUMN (copied exactly) */}
        <div className="details-left">
          <img src={profilePic} className="details-profile-img" alt="Profile" />
          <h2 className="details-name">{name}</h2>
          <p className="details-email">{email}</p>

          <p className="details-small-text">
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="details-right">

          {/* Title Row with Logo */}
          <div className="about-title-row">
            <img src={logo} className="about-uic-logo" alt="UIC Logo" />
            <h2 className="details-section-title">About UIC</h2>
          </div>

          <div className="about-section">
            <h3 className="about-header">Overview</h3>
            <p className="about-text">
              The University of Illinois Chicago is Chicago’s largest public research university,
              offering 33,000+ students a world-class education rooted in innovation, diversity,
              inclusion, and academic excellence.
            </p>

            <h3 className="about-header">Connection to UIC Marketplace</h3>
            <p className="about-text">
              UIC Marketplace lets students share talents such as tutoring, graphic design,
              music, photography, and more — enabling student-to-student collaboration that
              strengthens the UIC community.
            </p>

            <h3 className="about-header">Campus & Location</h3>
            <p className="about-text">
              Located just west of downtown Chicago, UIC provides access to opportunities in
              business, healthcare, tech, and the arts. Nearby landmarks include Student Center
              East, the UIC Pavilion, and the Jane Addams Hull-House Museum.
            </p>

            <h3 className="about-header">Contact Info</h3>
            <p className="about-text"><strong>Location:</strong> 1200 W Harrison St, Chicago, IL 60607</p>
            <p className="about-text"><strong>Website:</strong> uic.edu</p>
            <p className="about-text"><strong>Email:</strong> admissions@uic.edu</p>
          </div>

        </div>
      </div>
    </div>
  );
}
