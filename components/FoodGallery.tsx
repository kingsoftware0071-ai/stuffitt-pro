
import React from 'react';
import { RestaurantConfig } from '../types';

interface FoodGalleryProps {
  config?: RestaurantConfig;
}

const FoodGallery: React.FC<FoodGalleryProps> = ({ config }) => {
  // Default fallback if config is not fully loaded
  const images = config?.images?.gallery || [];

  if (images.length === 0) return null;

  return (
    <section className="py-16 px-4" style={{ backgroundColor: config?.colors.background }}>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#D84315] brand-font mb-3">Food Gallery</h2>
        <p className="text-gray-500">A visual feast! Check out our mouth-watering creations 📸 🍔</p>
      </div>

      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {images.map((imgUrl, index) => (
                <div key={index} className="bg-white p-2 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <img 
                        src={imgUrl} 
                        alt={`Gallery Item ${index + 1}`} 
                        className="w-full h-auto rounded-xl object-cover"
                    />
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default FoodGallery;
