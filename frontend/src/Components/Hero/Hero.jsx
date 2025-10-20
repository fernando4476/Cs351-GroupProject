import React from 'react'
import './Hero.css'

export const Hero = () => {
  return (
    <div className='hero container'>
        <div className='hero-text'>
            <h1>Find and book student services at UIC</h1>
            {/* SEARCH BAR SHOULD BE HERE */}
            <div className="search-container">
              <input 
                type="text" 
                placeholder="What are you looking for..." 
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
        </div>
    </div>
  )
}
export default Hero