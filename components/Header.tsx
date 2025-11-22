
import React from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  openAdmin: () => void;
  openCart: () => void;
  cartCount: number;
  config: RestaurantConfig;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen, openAdmin, openCart, cartCount, config }) => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Logo: Pure Image or Minimal Fallback */}
          {config.images && config.images.logo ? (
             <img src={config.images.logo} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 rounded-full">
                <span className="text-[8px] md:text-[10px] font-bold text-brand-red text-center leading-tight">STUFF<br/>ITT</span>
            </div>
          )}
          
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#C62828] brand-font tracking-wide">STUFFITT</h1>
            <p className="text-[10px] md:text-xs text-gray-500 italic -mt-1">Stuff It. Snap It. Share It.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
            {/* Cart Button */}
            <button 
                onClick={openCart} 
                className="relative p-2 text-gray-700 hover:text-[#E53935] transition-colors"
                aria-label="Open Cart"
            >
                <ShoppingBag size={24} className="md:w-7 md:h-7" />
                {cartCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-[#E53935] text-white text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in duration-200">
                        {cartCount}
                    </div>
                )}
            </button>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
              {isMenuOpen ? <X size={24} className="md:w-7 md:h-7" /> : <Menu size={24} className="md:w-7 md:h-7" />}
            </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col py-4 px-6 gap-4 animate-in slide-in-from-top-5 duration-200">
          <a href="#" onClick={() => setIsMenuOpen(false)} className="text-brand-dark font-medium hover:text-brand-red transition">Home</a>
          <a href="#menu" onClick={() => setIsMenuOpen(false)} className="text-brand-dark font-medium hover:text-brand-red transition">Menu</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-brand-dark font-medium hover:text-brand-red transition">About</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-brand-dark font-medium hover:text-brand-red transition">Contact</a>
        </div>
      )}
    </header>
  );
};

export default Header;