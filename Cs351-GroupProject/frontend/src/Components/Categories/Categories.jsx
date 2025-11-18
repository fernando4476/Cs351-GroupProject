import React from 'react'
import './Categories.css'

const categories = [
  { name: 'Hair'},
  { name: 'tutoring'},
  { name: 'Photography'},
  { name: 'Tech Help'},
  { name: 'Events'}
];

export const Categories = ({ onSelectCategory }) => {
  return (
    <section className="categories">
      <div className="categories-header">
        <h2>recommended</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <button
              key={index}
              className="category-item"
              type="button"
              onClick={() =>
                onSelectCategory && onSelectCategory(category.name)
              }
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-name">{category.name}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
export default Categories
