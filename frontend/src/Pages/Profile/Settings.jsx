import React, { useRef, useState, useEffect } from "react";
import "./Settings.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { fetchMe, updateProfile } from "../../api/client";
import { resolveMediaUrl } from "../../utils/api";

export default function Settings() {
  const navigate = useNavigate();

  const storedName = localStorage.getItem("name") || "UIC Student";
  const storedEmail = localStorage.getItem("email") || "student@uic.edu";
  const storedCountry = localStorage.getItem("country") || "United States";
  const storedPic = localStorage.getItem("profilePic") || logo;

  const [name, setName] = useState(storedName);
  const [email, setEmail] = useState(storedEmail);
  const [country, setCountry] = useState(storedCountry);
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState(storedPic);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  // Load profile from backend
  useEffect(() => {
    const load = async () => {
      try {
        const me = await fetchMe();
    const fullName =
      me?.full_name || [me?.first_name, me?.last_name].filter(Boolean).join(" ");
    const photo = resolveMediaUrl(me?.photo) || storedPic;
    if (fullName) {
      setName(fullName);
      localStorage.setItem("name", fullName);
    }
    if (me?.email) {
      setEmail(me.email);
      localStorage.setItem("email", me.email);
    }
    if (me?.country) {
      setCountry(me.country);
      localStorage.setItem("country", me.country);
    }
    if (photo) {
      setAvatar(photo);
      localStorage.setItem("profilePic", photo);
    }
      } catch (err) {
        // ignore; fall back to local storage defaults
      }
    };
    load();
  }, [storedPic]);

  const handleSave = () => {
    const [first_name = "", last_name = ""] = (name || "").split(" ");
    updateProfile({
      first_name,
      last_name,
      email,
      country,
      photo: avatarFile || fileInputRef.current?.files?.[0],
    })
      .then((resp) => {
        if (resp?.email) {
          localStorage.setItem("email", resp.email);
        }
        const newName =
          resp?.full_name ||
          [resp?.first_name, resp?.last_name].filter(Boolean).join(" ").trim();
        if (newName) {
          localStorage.setItem("name", newName);
          setName(newName);
        }
        const newAvatar = resolveMediaUrl(resp?.photo);
        if (newAvatar) {
          setAvatar(newAvatar);
          localStorage.setItem("profilePic", newAvatar);
        }
        if (resp?.country) {
          localStorage.setItem("country", resp.country);
          setCountry(resp.country);
        }
      })
      .catch((err) => console.error("Profile update failed", err))
      .finally(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const preview = ev.target?.result || avatar;
      setAvatar(preview);
    };
    reader.readAsDataURL(file);

    updateProfile({ photo: file })
      .then((resp) => {
        const newAvatar = resolveMediaUrl(resp?.photo);
        if (newAvatar) {
          setAvatar(newAvatar);
          localStorage.setItem("profilePic", newAvatar);
        }
      })
      .catch((err) => console.error("Avatar update failed", err));
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
          <div className="settings-avatar-wrap">
            <img src={avatar} alt="Profile" className="settings-profile-pic" />
            <button
              type="button"
              className="settings-avatar-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Change Photo
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>
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
