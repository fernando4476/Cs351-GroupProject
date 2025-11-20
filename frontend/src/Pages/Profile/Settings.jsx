import React, { useState } from "react";
import "./Settings.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const storedName = localStorage.getItem("name") || "UIC Student";
  const storedEmail = localStorage.getItem("email") || "student@uic.edu";
  const storedCountry = localStorage.getItem("country") || "United States";
  const profilePic = localStorage.getItem("profilePic") || logo;

  const [name, setName] = useState(storedName);
  const [email, setEmail] = useState(storedEmail);
  const [country, setCountry] = useState(storedCountry);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("country", country);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("country");
    localStorage.removeItem("profilePic");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="settings-page">

      {/* TOP BAR */}
      <div className="settings-topbar">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          ← Back to Profile
        </button>

        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <div className="settings-layout">

        {/* LEFT PROFILE SIDEBAR */}
        <div className="settings-profile-box">
          <img src={profilePic} alt="Profile" className="settings-profile-pic" />
          <h2 className="settings-profile-name">{storedName}</h2>
          <p className="settings-profile-email">{storedEmail}</p>

          <p className="settings-info-text">
            Edit your profile information here.
          </p>
        </div>

        {/* RIGHT SIDE BORDERED CONTAINER */}
        <div className="settings-right-wrapper">
          <h1 className="settings-title">Settings</h1>

          <label>Full Name</label>
          <input
            type="text"
            className="settings-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>UIC Email</label>
          <input
            type="text"
            className="settings-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Language</label>
          <input
            type="text"
            className="settings-input disabled"
            value="English"
            disabled
          />

          <label>Country</label>
          <select
            className="settings-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            <option>Australia</option>
          </select>

          <button className="settings-save-btn" onClick={handleSave}>
            Save Changes
          </button>

          {saved && <p className="settings-saved-text">✓ Changes saved!</p>}
        </div>
      </div>
    </div>
  );
}
