import React from 'react';
import { Users, Award, Heart } from 'lucide-react';

const ValuesSection: React.FC = () => {
  return (
    <section className="py-12 px-6 container mx-auto max-w-md">
      <div className="flex flex-col gap-6">
        
        {/* Card 1: Made with Love */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-orange-50 text-center flex flex-col items-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFA500] to-[#E53935] rounded-full flex items-center justify-center mb-4 text-white shadow-lg shadow-orange-200">
            <Heart size={30} fill="currentColor" />
          </div>
          <h3 className="text-xl font-bold text-brand-dark mb-2 brand-font">Made with Love</h3>
          <p className="text-gray-500">Every dish crafted with passion and care</p>
        </div>

        {/* Card 2: Community First */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-orange-50 text-center flex flex-col items-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFA500] to-[#E65100] rounded-full flex items-center justify-center mb-4 text-white shadow-lg shadow-orange-200">
            <Users size={30} />
          </div>
          <h3 className="text-xl font-bold text-brand-dark mb-2 brand-font">Community First</h3>
          <p className="text-gray-500">Serving our neighbors with pride</p>
        </div>

        {/* Card 3: Quality Promise */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-orange-50 text-center flex flex-col items-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FF7043] to-[#D84315] rounded-full flex items-center justify-center mb-4 text-white shadow-lg shadow-red-200">
            <Award size={30} />
          </div>
          <h3 className="text-xl font-bold text-brand-dark mb-2 brand-font">Quality Promise</h3>
          <p className="text-gray-500">Only the finest ingredients used</p>
        </div>

      </div>
    </section>
  );
};

export default ValuesSection;