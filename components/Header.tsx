
import React from 'react';
import { Menu, X } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  openAdmin: () => void;
  config: RestaurantConfig;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen, openAdmin, config }) => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Logo: Either Image or Text based on Config */}
          {config.images && config.images.logo ? (
             <img src={config.images.logo} alt="Logo" className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-brand-orange" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-brand-cream border-2 border-brand-orange flex items-center justify-center overflow-hidden shadow-sm">
                <span className="text-xs font-bold text-brand-red text-center leading-tight">STUFF<br/>ITT</span>
            </div>
          )}
          
          <div>
            <h1 className="text-2xl font-bold text-[#C62828] brand-font tracking-wide">STUFFITT</h1>
            <p className="text-xs text-gray-500 italic -mt-1">Stuff It. Snap It. Share It.</p>
          </div>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col py-4 px-6 gap-4 animate-in slide-in-from-top-5 duration-200">
          <a href="#" className="text-brand-dark font-medium hover:text-brand-red transition">Home</a>
          <a href="#menu" className="text-brand-dark font-medium hover:text-brand-red transition">Menu</a>
          <a href="#about" className="text-brand-dark font-medium hover:text-brand-red transition">About</a>
          <a href="#contact" className="text-brand-dark font-medium hover:text-brand-red transition">Contact</a>
        </div>
      )}
    </header>
  );
};

export default Header;
