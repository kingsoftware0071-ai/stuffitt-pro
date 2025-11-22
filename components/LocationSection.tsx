import React from 'react';
import { Map, MapPin } from 'lucide-react';

const LocationSection: React.FC = () => {
  return (
    <section className="py-12 px-4 text-center">
      <h2 className="text-3xl font-bold text-[#D84315] brand-font mb-8">Find Us Here</h2>
      
      <div className="max-w-md mx-auto bg-white p-2 rounded-2xl shadow-lg border border-gray-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
        <div className="relative rounded-xl overflow-hidden bg-gray-100 h-64 w-full group">
            {/* Simulated Map Image */}
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/OpenStreetMap_Warsaw.png/800px-OpenStreetMap_Warsaw.png" 
                alt="Map Location" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            {/* Map Pin Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                <div className="text-red-600 drop-shadow-lg animate-bounce">
                    <MapPin size={48} fill="currentColor" />
                </div>
            </div>
            {/* Zoom Controls Simulation */}
            <div className="absolute top-4 left-4 bg-white rounded shadow flex flex-col">
                <div className="p-2 border-b text-gray-600 font-bold hover:bg-gray-50 cursor-pointer">+</div>
                <div className="p-2 text-gray-600 font-bold hover:bg-gray-50 cursor-pointer">-</div>
            </div>
            {/* Attribution */}
            <div className="absolute bottom-0 right-0 bg-white/80 text-[10px] px-2 py-1 text-gray-600">
                © OpenStreetMap contributors
            </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-gray-600">Visit us for a delightful dining experience!</p>
        <Map className="text-blue-400" size={24} />
      </div>
    </section>
  );
};

export default LocationSection;