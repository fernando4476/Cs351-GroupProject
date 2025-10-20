import React from 'react'
import './Search.css'

export const Search = () => {
  return (
    <section className="search-section">
      <div className="search-container">
        <input 
          type="text" 
          placeholder="What are you looking for..." 
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
    </section>
  )
}
export default Search