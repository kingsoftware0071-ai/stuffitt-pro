
import React from 'react';
import { RestaurantConfig } from '../types';
import EditableText from './EditableText';

interface AboutSectionProps {
  config: RestaurantConfig;
  isEditing: boolean;
  onTextChange: (key: keyof RestaurantConfig['text'], value: string) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ config, isEditing, onTextChange }) => {
  const logoUrl = config?.images?.aboutLogo;

  // Safety check for older configs
  const title = config.text?.aboutTitle || "About Us";
  const subtitle = config.text?.aboutSubtitle || "Our story, our passion, our commitment to great food! ❤️";
  const description = config.text?.aboutDescription || "We're passionate about handcrafted food...";

  return (
    <section id="about" className="py-16 px-6 bg-white rounded-[3rem] mx-2 mb-8 shadow-sm border border-orange-50">
         <div className="max-w-2xl mx-auto text-center">
            
            <EditableText
                tag="h3"
                text={title}
                isEditing={isEditing}
                onSave={(val) => onTextChange('aboutTitle', val)}
                className="text-4xl font-bold brand-font text-[#D84315] mb-4 inline-block"
            />

            <EditableText
                tag="p"
                text={subtitle}
                isEditing={isEditing}
                onSave={(val) => onTextChange('aboutSubtitle', val)}
                className="text-gray-500 font-medium mb-8 block"
            />
            
            {/* Dynamic About Logo */}
            {logoUrl && (
                <div className="flex justify-center mb-6">
                    <img 
                        src={logoUrl} 
                        alt="About Logo" 
                        className="w-24 h-24 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300" 
                    />
                </div>
            )}

            <h4 className="text-3xl font-bold brand-font text-brand-dark mb-6">By Saima & Akram</h4>
            
            <EditableText
                tag="p"
                text={description}
                isEditing={isEditing}
                onSave={(val) => onTextChange('aboutDescription', val)}
                className="text-gray-600 leading-loose mb-6 text-lg whitespace-pre-wrap block"
                multiline={true}
            />
         </div>
    </section>
  );
};

export default AboutSection;
