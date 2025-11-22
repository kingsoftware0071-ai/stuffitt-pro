
import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { RestaurantConfig } from '../types';
import EditableText from './EditableText';

interface ContactSectionProps {
    config: RestaurantConfig;
    isEditing: boolean;
    onTextChange: (key: keyof RestaurantConfig['text'], value: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ config, isEditing, onTextChange }) => {
  const title = config?.text?.contactTitle || "Order & Contact";
  const subtitle = config?.text?.contactSubtitle || "Ready to satisfy your cravings? Let's connect! 🎉";
  const backgroundColor = config?.colors?.background || '#FFFAF5';
  const primaryColor = config?.colors?.primary || '#FFA500';
  const secondaryColor = config?.colors?.secondary || '#E53935';

  const openSocial = (url?: string) => {
      if (url && url.trim() !== '') {
          window.open(url, '_blank');
      } else {
          alert("Link not configured yet.");
      }
  };

  return (
    <section id="contact" className="py-16 px-4 bg-gradient-to-b from-brand-cream to-white" style={{ '--brand-cream': backgroundColor } as React.CSSProperties}>
        <div className="text-center mb-10">
          <EditableText
            tag="h2"
            text={title}
            isEditing={isEditing}
            onSave={(val) => onTextChange('contactTitle', val)}
            className="text-4xl font-bold text-[#D84315] brand-font mb-4 inline-block"
          />
          <EditableText
            tag="p"
            text={subtitle}
            isEditing={isEditing}
            onSave={(val) => onTextChange('contactSubtitle', val)}
            className="text-gray-500 block"
          />
        </div>

        <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-50">
          <h3 className="text-2xl font-bold text-brand-dark brand-font mb-8">Get in Touch</h3>

          <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-start gap-4">
                  <div 
                    style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}
                    className="p-3 rounded-full text-white shadow-lg shadow-orange-200 shrink-0"
                  >
                      <Phone size={20} />
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-800">Phone</h4>
                      <p className="text-gray-500 font-medium">{config?.contact?.phone}</p>
                  </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                  <div 
                    style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}
                    className="p-3 rounded-full text-white shadow-lg shadow-orange-200 shrink-0"
                  >
                      <Mail size={20} />
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-800">Email</h4>
                      <p className="text-gray-500 font-medium">{config?.contact?.email}</p>
                  </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                  <div 
                    style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}
                    className="p-3 rounded-full text-white shadow-lg shadow-orange-200 shrink-0"
                  >
                      <MapPin size={20} />
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-800">Location</h4>
                      <p className="text-gray-500 font-medium leading-relaxed whitespace-pre-line">
                          {config?.contact?.address}
                      </p>
                  </div>
              </div>
          </div>

          {/* WhatsApp Button */}
          <button 
            onClick={() => window.open(`https://wa.me/${config?.contact?.whatsapp}`, '_blank')}
            className="w-full mt-10 bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-3 transition-colors active:scale-95"
          >
              <MessageCircle size={24} />
              Order via WhatsApp
          </button>

          {/* Social Links */}
          <div className="mt-8 pt-8 border-t border-gray-100">
              <h5 className="text-sm font-bold text-gray-800 mb-4">Follow Us</h5>
              <div className="flex gap-4">
                  <button 
                    onClick={() => openSocial(config?.contact?.instagram)}
                    className="flex-1 border border-pink-200 text-pink-500 py-3 rounded-xl hover:bg-pink-50 transition flex justify-center items-center active:scale-95"
                  >
                      <Instagram size={22} />
                  </button>
                  <button 
                    onClick={() => openSocial(config?.contact?.facebook)}
                    className="flex-1 border border-blue-200 text-blue-600 py-3 rounded-xl hover:bg-blue-50 transition flex justify-center items-center active:scale-95"
                  >
                      <Facebook size={22} />
                  </button>
              </div>
          </div>
        </div>
    </section>
  );
};

export default ContactSection;
