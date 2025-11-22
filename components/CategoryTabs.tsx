
import React from 'react';
import { Category } from '../types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 my-8 px-2">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              px-6 py-2.5 rounded-full font-medium text-sm md:text-base transition-all duration-300 shadow-sm
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
