
import React from 'react';
import { RestaurantConfig } from '../types';
import { Type, Palette, AlignLeft, Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Map } from 'lucide-react';

interface BuilderRightPanelProps {
  isOpen: boolean;
  config: RestaurantConfig;
  onChange: (newConfig: RestaurantConfig) => void;
}

const FONT_OPTIONS = [
    { label: 'Playfair Display', value: 'Playfair Display' },
    { label: 'Montserrat', value: 'Montserrat' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Oswald', value: 'Oswald' },
];

const BODY_FONT_OPTIONS = [
    { label: 'Poppins', value: 'Poppins' },
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Lato', value: 'Lato' },
    { label: 'Roboto', value: 'Roboto' },
];

const BuilderRightPanel: React.FC<BuilderRightPanelProps> = ({ isOpen, config, onChange }) => {
  
  const handleColorChange = (key: keyof RestaurantConfig['colors'], value: string) => {
    onChange({
      ...config,
      colors: { ...config.colors, [key]: value }
    });
  };

  const handleFontChange = (key: 'heading' | 'body', value: string) => {
      onChange({
          ...config,
          fonts: { ...config.fonts!, [key]: value }
      });
  };

  const handleTextChange = (key: keyof RestaurantConfig['text'], value: string) => {
    onChange({
      ...config,
      text: { ...config.text, [key]: value }
    });
  };

  const handleContactChange = (key: keyof RestaurantConfig['contact'], value: string) => {
    onChange({
        ...config,
        contact: { ...config.contact, [key]: value }
    });
  };

  return (
    <div 
        className={`
          fixed inset-y-0 right-0 z-[90] md:relative md:z-auto h-full bg-[#1e1e1e] text-white shadow-2xl flex flex-col border-l border-gray-800 shrink-0 transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'w-[85vw] md:w-80 opacity-100 translate-x-0' : 'w-0 md:w-0 opacity-0 translate-x-full md:translate-x-0'}
        `}
    >
        <div className="p-4 border-b border-gray-700 bg-[#252526] min-w-[20rem]">
            <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Design & Text</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar min-w-[20rem]">
            
            {/* Typography */}
            <div>
                <div className="flex items-center gap-2 mb-3 text-orange-500">
                    <Type size={16} />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Typography</h3>
                </div>
                <div className="space-y-4 bg-[#2a2a2b] p-4 rounded-xl border border-gray-700">
                    <div>
                        <label className="text-[10px] text-gray-400 block mb-1.5 uppercase">Heading Font</label>
                        <select 
                            value={config.fonts?.heading || 'Playfair Display'}
                            onChange={(e) => handleFontChange('heading', e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-xs text-white outline-none focus:border-orange-500"
                        >
                            {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-400 block mb-1.5 uppercase">Body Font</label>
                         <select 
                            value={config.fonts?.body || 'Poppins'}
                            onChange={(e) => handleFontChange('body', e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-xs text-white outline-none focus:border-orange-500"
                        >
                            {BODY_FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Global Colors */}
            <div>
                <div className="flex items-center gap-2 mb-3 text-orange-500">
                    <Palette size={16} />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Global Colors</h3>
                </div>
                <div className="space-y-3 bg-[#2a2a2b] p-4 rounded-xl border border-gray-700">
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Primary</span></div>
                        <div className="flex items-center gap-2 bg-[#1e1e1e] p-1.5 rounded border border-gray-600">
                            <input type="color" value={config.colors.primary} onChange={(e) => handleColorChange('primary', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent" />
                            <span className="text-xs text-gray-300 uppercase font-mono flex-1 text-right">{config.colors.primary}</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Secondary</span></div>
                        <div className="flex items-center gap-2 bg-[#1e1e1e] p-1.5 rounded border border-gray-600">
                            <input type="color" value={config.colors.secondary} onChange={(e) => handleColorChange('secondary', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent" />
                            <span className="text-xs text-gray-300 uppercase font-mono flex-1 text-right">{config.colors.secondary}</span>
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Background</span></div>
                        <div className="flex items-center gap-2 bg-[#1e1e1e] p-1.5 rounded border border-gray-600">
                            <input type="color" value={config.colors.background} onChange={(e) => handleColorChange('background', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent" />
                            <span className="text-xs text-gray-300 uppercase font-mono flex-1 text-right">{config.colors.background}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <div>
                 <div className="flex items-center gap-2 mb-3 text-orange-500">
                    <AlignLeft size={16} />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Text Content</h3>
                </div>
                <div className="space-y-4 bg-[#2a2a2b] p-4 rounded-xl border border-gray-700">
                    <div>
                        <label className="text-[10px] text-gray-400 block mb-1.5 uppercase">Welcome Title</label>
                        <input 
                            type="text" 
                            value={config.text.welcomeTitle}
                            onChange={(e) => handleTextChange('welcomeTitle', e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-sm text-white focus:border-orange-500 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-400 block mb-1.5 uppercase">Subtitle</label>
                        <input 
                            type="text" 
                            value={config.text.welcomeSubtitle}
                            onChange={(e) => handleTextChange('welcomeSubtitle', e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-sm text-white focus:border-orange-500 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-400 block mb-1.5 uppercase">Description</label>
                        <textarea 
                            rows={4}
                            value={config.text.welcomeDescription}
                            onChange={(e) => handleTextChange('welcomeDescription', e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-sm text-white focus:border-orange-500 outline-none transition-colors resize-none"
                        />
                    </div>
                    <div className="border-t border-gray-600 pt-4 mt-4">
                        <label className="text-[10px] text-gray-400 block mb-1.5 uppercase">About Us Title</label>
                        <input 
                            type="text" 
                            value={config.text.aboutTitle}
                            onChange={(e) => handleTextChange('aboutTitle', e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-sm text-white focus:border-orange-500 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-400 block mb-1.5 uppercase">Contact Title</label>
                        <input 
                            type="text" 
                            value={config.text.contactTitle}
                            onChange={(e) => handleTextChange('contactTitle', e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-sm text-white focus:border-orange-500 outline-none transition-colors"
                        />
                    </div>
                    <div className="border-t border-gray-600 pt-4 mt-4">
                        <label className="text-[10px] text-gray-400 block mb-1.5 uppercase">Footer Description</label>
                        <textarea 
                            rows={3}
                            value={config.text.footerDescription || ''}
                            onChange={(e) => handleTextChange('footerDescription', e.target.value)}
                            placeholder="Description below logo in footer"
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-sm text-white focus:border-orange-500 outline-none transition-colors resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Contact & Socials */}
            <div>
                <div className="flex items-center gap-2 mb-3 text-orange-500">
                    <Phone size={16} />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Contact & Socials</h3>
                </div>
                <div className="space-y-4 bg-[#2a2a2b] p-4 rounded-xl border border-gray-700">
                    <div>
                        <label className="text-[10px] text-gray-400 block mb-1.5 uppercase flex items-center gap-2"><Phone size={10}/> Phone Number</label>
                        <input 
                            type="text" 
                            value={config.contact.phone}
                            onChange={(e) => handleContactChange('phone', e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-400 block mb-1.5 uppercase flex items-center gap-2"><MessageCircle size={10}/> WhatsApp Number</label>
                        <input 
                            type="text" 
                            value={config.contact.whatsapp}
                            onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                            placeholder="e.g. 919876543210"
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                        />
                    </div>
                    <div>
                         <label className="text-[10px] text-gray-400 block mb-1.5 uppercase flex items-center gap-2"><Mail size={10}/> Email Address</label>
                        <input 
                            type="text" 
                            value={config.contact.email}
                            onChange={(e) => handleContactChange('email', e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                        />
                    </div>
                    <div>
                         <label className="text-[10px] text-gray-400 block mb-1.5 uppercase flex items-center gap-2"><MapPin size={10}/> Location</label>
                        <textarea 
                            rows={3}
                            value={config.contact.address}
                            onChange={(e) => handleContactChange('address', e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-sm text-white focus:border-orange-500 outline-none resize-none"
                        />
                    </div>
                    
                    <div className="pt-2 border-t border-gray-600">
                        <label className="text-[10px] text-gray-400 block mb-1.5 uppercase flex items-center gap-2 text-green-400"><Map size={10}/> Google Maps Embed Link (src)</label>
                        <textarea
                            rows={3}
                            value={config.contact.mapEmbedUrl || ''}
                            onChange={(e) => {
                                let val = e.target.value;
                                // Extract src if user pastes full iframe code
                                const srcMatch = val.match(/src="([^"]+)"/);
                                if (srcMatch && srcMatch[1]) {
                                    val = srcMatch[1];
                                }
                                handleContactChange('mapEmbedUrl', val);
                            }}
                            placeholder="Paste Embed Map link here..."
                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-xs text-gray-300 focus:border-green-500 outline-none resize-none font-mono"
                        />
                         <p className="text-[9px] text-gray-500 mt-1">Go to Google Maps {'>'} Share {'>'} Embed a map {'>'} Copy HTML</p>
                    </div>

                    <div className="pt-2 border-t border-gray-600 grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] text-gray-400 block mb-1.5 uppercase flex items-center gap-2"><Instagram size={10}/> Instagram URL</label>
                            <input 
                                type="text" 
                                value={config.contact.instagram || ''}
                                onChange={(e) => handleContactChange('instagram', e.target.value)}
                                placeholder="https://"
                                className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-xs text-white focus:border-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-400 block mb-1.5 uppercase flex items-center gap-2"><Facebook size={10}/> Facebook URL</label>
                            <input 
                                type="text" 
                                value={config.contact.facebook || ''}
                                onChange={(e) => handleContactChange('facebook', e.target.value)}
                                placeholder="https://"
                                className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-xs text-white focus:border-orange-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default BuilderRightPanel;