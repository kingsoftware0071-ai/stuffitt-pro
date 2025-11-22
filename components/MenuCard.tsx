import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative transform transition duration-300 hover:scale-[1.02] flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden shrink-0">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay at bottom of image for smooth blend */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FFA500] to-[#E53935] text-white px-4 py-1 rounded-full font-bold shadow-md">
          ₹{item.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-brand-dark brand-font leading-tight">{item.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded border ${item.isVeg ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'} shrink-0 ml-2`}>
                {item.isVeg ? 'VEG' : 'NON-VEG'}
            </span>
        </div>
        
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">{item.description}</p>

        {/* Add Button */}
        <button 
          onClick={() => onAddToCart(item)}
          className="w-full bg-gradient-to-r from-[#FFA500] to-[#E53935] text-white py-3 rounded-full font-semibold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform mt-auto"
        >
          <ShoppingCart size={18} />
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default MenuCard;