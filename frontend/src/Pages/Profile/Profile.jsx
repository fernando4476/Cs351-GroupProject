import React from "react";
import "./Profile.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { fetchProviderProfile, fetchMe } from "../../api/client";

export default function Profile() {
  const navigate = useNavigate();

  const [name, setName] = React.useState(
    localStorage.getItem("name") || "UIC Student"
  );
  const [email, setEmail] = React.useState(
    localStorage.getItem("email") || "student@uic.edu"
  );
  const [avatar, setAvatar] = React.useState(
    localStorage.getItem("profilePic") || logo
  );
  const [providerProfile, setProviderProfile] = React.useState(null);

  React.useEffect(() => {
    fetchMe()
      .then((me) => {
        const photo = me?.photo;
        const fullName =
          me?.full_name || [me?.first_name, me?.last_name].filter(Boolean).join(" ");
        if (fullName) {
          setName(fullName);
          localStorage.setItem("name", fullName);
        }
        if (me?.email) {
          setEmail(me.email);
          localStorage.setItem("email", me.email);
        }
        if (photo) {
          setAvatar(photo);
          localStorage.setItem("profilePic", photo);
        }
      })
      .catch(() => {});

    fetchProviderProfile()
      .then((profile) => {
        if (profile && profile.id) {
          setProviderProfile(profile);
          localStorage.setItem("providerServiceId", profile.id);
        }
      })
      .catch(() => {
        // ignore errors; treat as no provider profile
      });
  }, []);

  const handleProviderNavigate = () => {
    if (providerProfile?.id) {
      navigate("/provider-settings");
      return;
    }
    navigate("/become-provider");
  };

  /* SIGN OUT */
  const handleSignOut = () => {
    const savedPic = localStorage.getItem("profilePic"); // keep avatar across sign-outs
    localStorage.clear();
    if (savedPic) {
      localStorage.setItem("profilePic", savedPic);
    }
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
          <div className="profile-img-wrapper">
            <img src={avatar} className="profile-img-large" />
          </div>

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

          <button className="profile-btn-big provider" onClick={handleProviderNavigate}>
            Provider Account
          </button>

          <button className="profile-btn-big" onClick={() => navigate("/feedback")}>
            Feedback & Support
          </button>

          <button className="profile-btn-big" onClick={() => navigate("/my-feedback")}>
            Reviews History
          </button>

        </div>
      </div>
    </div>
  );
}
