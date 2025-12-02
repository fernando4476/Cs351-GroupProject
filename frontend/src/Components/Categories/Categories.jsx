import React, { useEffect, useMemo, useState } from 'react';
import './Categories.css';

export const DEFAULT_CATEGORIES = [
  { name: 'Hair' },
  { name: 'Tutoring' },
  { name: 'Photography' },
  { name: 'Tech Help' },
  { name: 'Events' }
];

export const Categories = ({ onSelectCategory, items = DEFAULT_CATEGORIES }) => {
  const [orderedCategories, setOrderedCategories] = useState(items);

  useEffect(() => {
    setOrderedCategories(items);
  }, [items]);

  const onCategorySelect = (category) => {
    if (!category?.name) return;
    onSelectCategory && onSelectCategory(category.name);
    setOrderedCategories((prev) => {
      const list = (prev && prev.length > 0 ? prev : items).filter(
        (item) => item?.name
      );
      const existing =
        list.find((item) => item.name === category.name) || category;
      const filtered = list.filter((item) => item.name !== category.name);
      return [existing, ...filtered];
    });
  };

  return (
    <section className="categories">
      <div className="categories-header">
        <h2>recommended</h2>
        <div className="categories-grid">
          {orderedCategories.map((category, index) => (
            <button
              key={index}
              className="category-item"
              type="button"
              onClick={() => onCategorySelect(category)}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-name">{category.name}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Categories;
