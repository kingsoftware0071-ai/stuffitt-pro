import React from 'react';
import { Heart } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 px-6 bg-white rounded-[3rem] mx-2 mb-8 shadow-sm border border-orange-50">
         <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-4xl font-bold brand-font text-[#D84315] mb-4">About Us</h3>
            <p className="text-gray-500 font-medium mb-8">Our story, our passion, our commitment to great food! ❤️</p>
            
            {/* Floating Heart */}
            <div className="w-20 h-20 bg-gradient-to-br from-[#FFA500] to-[#E53935] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-200">
                <Heart fill="white" size={32} className="text-white" />
            </div>

            <h4 className="text-3xl font-bold brand-font text-brand-dark mb-6">By Saima & Akram</h4>
            <p className="text-gray-600 leading-loose mb-6 text-lg">
                We're passionate about handcrafted food that brings people together. At STUFFITT, every burger, slider, and fry is made with love, using the finest ingredients and time-tested recipes.
            </p>
            <p className="text-gray-600 leading-loose text-lg">
                Our journey started with a simple dream: to create a place where great food meets great memories. Today, we're proud to serve our community with dishes that make every meal special. 🍔✨
            </p>
         </div>
    </section>
  );
};

export default AboutSection;