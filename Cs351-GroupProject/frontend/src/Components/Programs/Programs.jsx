import React from "react";
import "./Programs.css";

import barber from "../../assets/barber.jpeg";
import tutoring from "../../assets/tutoring.jpeg";
import salsa from "../../assets/salsa.jpeg";

const items = [
  {
    img: barber,
    title: "cutz by Jay",
    sub: "student barber",
    rating: "4.0",
    reviews: 87,
    time: "Today at 4:00 pm",
  },
  {
    img: tutoring,
    title: "Tutoring with Sarah",
    sub: "",
    rating: "4.0",
    reviews: 87,
    time: "Today at 4:00 pm",
  },
  {
    img: salsa,
    title: "Uic salsa dance",
    sub: "",
    rating: "4.0",
    reviews: 87,
    time: "Today at 7:00 pm",
  },
];

export default function Programs() {
  return (
    <section className="programs-section">
      <div className="cards">
        {items.map((it) => (
          <article key={it.title} className="card">
            <div className="card-media">
              <img src={it.img} alt={it.title} />
            </div>

            <div className="card-body">
              <h3 className="card-title">
                {it.title} {it.sub && <span className="card-sub">- {it.sub}</span>}
              </h3>

              <div className="card-meta">
                <span className="star">★ {it.rating}</span>
                <span className="sep">•</span>
                <span>{it.reviews} reviews</span>
                <span className="sep">|</span>
                <span>Top Rated</span>
              </div>

              <div className="card-cta">
                <span className="pill time">{it.time}</span>
                <button className="btn book">Book</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}