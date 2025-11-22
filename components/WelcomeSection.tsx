
import React from 'react';
import { Utensils, Smartphone } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface WelcomeSectionProps {
  config: RestaurantConfig;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ config }) => {
  return (
    <section className="relative pt-10 pb-20 px-4 text-center">
      {/* Badge */}
      <div 
        style={{ background: `linear-gradient(to right, ${config.colors.primary}, ${config.colors.secondary})` }}
        className="inline-flex items-center gap-2 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        <span>🍔</span> Premium Casual Dining
      </div>

      {/* Main Heading */}
      <div className="mb-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
        <h1 
            className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text brand-font leading-tight drop-shadow-sm"
            style={{ backgroundImage: `linear-gradient(to right, #D84315, #E65100)` }}
        >
            {config.text.welcomeTitle.split(' ').slice(0, -1).join(' ')} <br />
            <span style={{ color: '#BF360C' }}>{config.text.welcomeTitle.split(' ').slice(-1)}</span>
        </h1>
      </div>

      {/* Subheading */}
      <h2 className="text-brand-dark font-bold text-lg md:text-xl mb-6 tracking-wide animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        {config.text.welcomeSubtitle}
      </h2>

      {/* Description */}
      <p className="text-gray-600 max-w-lg mx-auto leading-relaxed mb-10 px-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
        {config.text.welcomeDescription}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto mb-12 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
        <a 
            href="#menu"
            style={{ background: `linear-gradient(to right, ${config.colors.primary}, ${config.colors.secondary})` }}
            className="flex-1 text-white py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          Explore Menu <Utensils size={18} />
        </a>
        <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-1 bg-white border-2 border-red-100 text-[#E53935] py-4 rounded-full font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-red-50 active:scale-95 transition-all"
        >
          Order Now <Smartphone size={18} />
        </button>
      </div>

      {/* Featured Image Fade */}
      <div className="relative w-full max-w-2xl mx-auto -mb-32 z-0 animate-in fade-in zoom-in duration-1000 delay-500">
          <div 
            className="absolute inset-0 z-10 h-full"
            style={{ background: `linear-gradient(to top, ${config.colors.background} 10%, transparent)` }}
          ></div>
          <img 
            src={config.images?.hero || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} 
            alt="Delicious Burger" 
            className="w-full rounded-t-[3rem] shadow-2xl object-cover h-[400px]"
          />
      </div>
    </section>
  );
};

export default WelcomeSection;
