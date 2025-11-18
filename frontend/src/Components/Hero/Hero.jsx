import React from "react";
import "./Hero.css";

export const Hero = ({ query, onQueryChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="hero container">
      <div className="hero-text">
        <h1>Find and book student services at UIC</h1>
        <form className="search-container" onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="What are you looking for..."
            className="search-input"
          />
          <button type="submit" className="search-icon" aria-label="Search">
            🔍
          </button>
        </form>
      </div>
    </div>
  );
};
export default Hero;
