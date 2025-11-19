import React from "react";
import "./AboutUIC.css";
import logo from "../../assets/uiclogo.png";   // adjust path if needed
import skyline from "../../assets/Chicagoskyline.png"; // replace later with a skyline image

import { useNavigate } from "react-router-dom";

export default function AboutUIC() {
  const navigate = useNavigate();
//this is just a test
  return (
    <div className="about-container">
      <div className="about-card">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>

        <div className="about-header">
          <h1>About UIC</h1>
          <img src={logo} alt="UIC Logo" className="uic-logo" />
        </div>

        <section className="about-section">
          <h2>Overview</h2>
          <p>
            The University of Illinois Chicago is Chicago’s largest and only public
            research university. Founded in 1965, UIC is part of the University of
            Illinois System and serves over 33,000 students across 16 colleges.
            Known for its commitment to access, innovation, and diversity, UIC
            provides world-class education in the heart of one of America’s most
            vibrant cities.
          </p>
        </section>

        <section className="about-section">
          <h2>Connection to UIC Marketplace</h2>
          <p>
            UIC Marketplace was built by UIC students, for UIC students, to help
            peers share their talents, skills, and services. Whether you're offering
            tutoring, photography, salsa dancing lessons, or booking a haircut
            before class, UIC Marketplace helps strengthen our campus community.
          </p>
        </section>

        <section className="about-section">
          <h2>Campus & Location</h2>
          <p>
            Located just west of downtown Chicago, UIC’s urban campus connects
            students directly to opportunities in business, healthcare, technology,
            and the arts. The campus features iconic landmarks like the UIC
            Pavilion, Student Center East, and the Jane Addams Hull House Museum.
          </p>
        </section>

        <section className="about-section">
          <h2>Contact Info</h2>
          <p>Location: 1200 W Harrison St, Chicago, IL 60607</p>
          <p>Website: uic.edu</p>
          <p>Email: admissions@uic.edu</p>
        </section>

        <img src={skyline} alt="Chicago Skyline" className="skyline-img" />
      </div>
    </div>
  );
}
