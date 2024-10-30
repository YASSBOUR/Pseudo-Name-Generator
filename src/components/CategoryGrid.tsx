import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category } from '../types';

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  const handleCategoryClick = (category: Category) => {
    navigate(`/category/${category.id}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category)}
          className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
        >
          <div className="absolute inset-0">
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-100 dark:bg-gray-800" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
              <h3 className="text-lg font-bold text-white mb-1">
                {category.name}
              </h3>
              <div className="text-sm text-gray-300 space-y-1">
                {category.subcategories.map(sub => (
                  <div key={sub.id}>{sub.name}</div>
                ))}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}