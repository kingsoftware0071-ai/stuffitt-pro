
import React from 'react';
import { Heart, Lock, Instagram, Facebook } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface FooterProps {
  onOpenAdmin: () => void;
  config?: RestaurantConfig;
}

const Footer: React.FC<FooterProps> = ({ onOpenAdmin, config }) => {
  const footerLogo = config?.images?.footerLogo;
  const instaLink = config?.contact?.instagram || '#';
  const fbLink = config?.contact?.facebook || '#';
  const footerDesc = config?.text?.footerDescription || "Handcrafted burgers, sliders, and fries made with passion.";

  return (
    <footer className="bg-[#1a1e26] text-white pt-16 pb-8 px-6 mt-10">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            
            {/* Brand Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {footerLogo ? (
                    <img src={footerLogo} alt="Footer Logo" className="w-12 h-12 object-contain" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                      <span className="text-[0.6rem] font-bold text-orange-400 text-center leading-tight">STUFF<br/>ITT</span>
                    </div>
                )}
                <h2 className="text-2xl font-bold brand-font text-white">STUFFITT</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">Stuff It. Snap It. Share It.</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {footerDesc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-orange-400 transition">Home</a></li>
                  <li><a href="#menu" className="hover:text-orange-400 transition">Menu</a></li>
                  <li><a href="#" className="hover:text-orange-400 transition">Gallery</a></li>
                  <li><a href="#contact" className="hover:text-orange-400 transition">Contact</a></li>
                  <li><a href="#about" className="hover:text-orange-400 transition">About</a></li>
                </ul>
              </div>

              {/* Opening Hours */}
              <div>
                <h3 className="font-bold text-lg mb-4">Opening Hours</h3>
                <div className="space-y-3 text-gray-400 text-sm">
                  <p>
                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Monday - Friday</span>
                    11:00 AM - 10:00 PM
                  </p>
                  <p>
                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Saturday - Sunday</span>
                    11:00 AM - 11:00 PM
                  </p>
                </div>
              </div>

              {/* Social Icons & Admin Access - Hidden on Mobile/Tablet (lg:flex) */}
              <div className="col-span-2 pt-4 gap-4 items-center hidden lg:flex">
                  <a href={instaLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all">
                    <Instagram size={18} />
                  </a>
                  <a href={fbLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                    <Facebook size={18} />
                  </a>
                  {/* Website Editor Lock Icon */}
                  <button 
                    onClick={onOpenAdmin}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-all border border-white/10"
                    aria-label="Editor Panel"
                    title="Open Website Builder"
                  >
                    <Lock size={16} />
                  </button>
              </div>

            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
              © 2025 STUFFITT. Made with <Heart size={14} fill="#E53935" className="text-[#E53935]" /> by Saima & Akram
            </p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;