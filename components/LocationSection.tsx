
import React from 'react';
import { Map, MapPin } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface LocationSectionProps {
  config?: RestaurantConfig;
}

const LocationSection: React.FC<LocationSectionProps> = ({ config }) => {
  // Use the configured Embed URL or fallback to a default one
  const mapUrl = config?.contact?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.792539393723!2d72.8773928!3d19.0728174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c88e722c4a03%3A0x95e938324396122d!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1708600000000!5m2!1sen!2sin";

  return (
    <section className="py-12 px-4 text-center">
      <h2 className="text-3xl font-bold text-[#D84315] brand-font mb-8">Find Us Here</h2>
      
      <div className="max-w-md mx-auto bg-white p-2 rounded-2xl shadow-lg border border-gray-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
        <div className="relative rounded-xl overflow-hidden bg-gray-100 h-64 w-full group">
            
            {/* Interactive Google Maps Embed */}
            <iframe 
                src={mapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Google Maps Location"
            ></iframe>
            
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-gray-600">Visit us for a delightful dining experience!</p>
        <a 
            href={mapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
            <Map size={20} />
            <span>Open in Maps</span>
        </a>
      </div>
    </section>
  );
};

export default LocationSection;