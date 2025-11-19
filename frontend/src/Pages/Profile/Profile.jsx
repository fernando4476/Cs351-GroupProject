import React from "react";
import "./Profile.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "UIC Student";
  const email = localStorage.getItem("email") || "student@uic.edu";
  const profilePic = localStorage.getItem("profilePic") || logo;

  /* PROFILE UPLOAD */
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("profilePic", reader.result);
      window.location.reload();
    };
    reader.readAsDataURL(file);
  };

  /* SIGN OUT */
  const handleSignOut = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="profile-page">

      {/* TOP BAR */}
      <div className="profile-topbar">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Home
        </button>

        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div className="profile-content">

        {/* LEFT PANEL */}
        <div className="profile-left">
          <label htmlFor="profileUpload" className="profile-img-wrapper">
            <img src={profilePic} className="profile-img-large" />
            <div className="profile-img-change">Change</div>
          </label>

          <input
            id="profileUpload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfileUpload}
          />

          <h2 className="profile-name-large">{name}</h2>
          <p className="profile-email-large">{email}</p>
        </div>

        {/* RIGHT BUTTON PANEL */}
        <div className="profile-right">

          <button className="profile-btn-big" onClick={() => navigate("/account-details")}>
            Account Details
          </button>

          <button className="profile-btn-big" onClick={() => navigate("/settings")}>
            Settings
          </button>

          <button className="profile-btn-big" onClick={() => navigate("/appointments")}>
            Appointments
          </button>

          <button className="profile-btn-big" onClick={() => navigate("/about-uic")}>
            About UIC
          </button>

          <button className="profile-btn-big provider" onClick={() => navigate("/become-provider")}>
            Provider Account
          </button>

          <button className="profile-btn-big" onClick={() => navigate("/feedback")}>
            Feedback & Support
          </button>

        </div>
      </div>
    </div>
  );
}
