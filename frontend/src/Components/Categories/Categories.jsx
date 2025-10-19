import React from 'react'
import './Categories.css'

const categories = [
  { name: 'Hair'},
  { name: 'tutoring'},
  { name: 'Photography'},
  { name: 'Tech Help'},
  { name: 'Events'}
];

export const Categories = () => {
  return (
    <section className="categories">
      <div className="categories-header">
        <h2>recommended</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-item">
              <div className="category-icon">{category.icon}</div>
              <div className="category-name">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default Categories