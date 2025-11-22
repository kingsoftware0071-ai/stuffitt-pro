
import React from 'react';
import { Category } from '../types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-3 my-8 px-4 md:px-2">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              w-full md:w-auto px-4 md:px-6 py-2.5 rounded-full font-medium text-xs md:text-base transition-all duration-300 shadow-sm truncate
              ${isActive 
                ? 'bg-gradient-to-r from-[#FFA500] to-[#E53935] text-white shadow-lg scale-105 border-none' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}
            `}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
