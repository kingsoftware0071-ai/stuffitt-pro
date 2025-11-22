
import React, { useState, useRef } from 'react';
import { X, Save, Sparkles, Type, Undo, Redo, Trash2, Plus, Image, Eye, Loader2, Check, AlertCircle, Upload, Zap, QrCode, Cloud, Database } from 'lucide-react';
import { RestaurantConfig } from '../types';
import { isDatabaseConnected } from '../supabaseClient';

interface BuilderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  onUpdate: (config: RestaurantConfig) => void;
  onManageMenu: () => void;
  onManageQR: () => void;
  onManageCloud: () => void; // NEW
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
}

const AI_TITLES = [
  "Flavor That Speaks",
  "Taste the Magic",
  "Burger Paradise",
  "Gourmet Cravings",
  "The Ultimate Feast",
  "Savor Every Bite"
];

const AI_DESCRIPTIONS = [
  "Experience the crunch of fresh ingredients and the burst of premium flavors in every bite. Your table awaits!",
  "From our kitchen to your heart, enjoy meals crafted with love, passion, and the finest ingredients.",
  "Deliciousness redefined. Dive into a world of taste where every burger tells a story of culinary perfection.",
  "Satisfy your cravings with our chef's special selection of handcrafted burgers and crispy sides."
];

const BuilderPanel: React.FC<BuilderPanelProps> = ({ 
  isOpen, 
  onClose, 
  config, 
  onUpdate, 
  onManageMenu, 
  onManageQR,
  onManageCloud,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  saveStatus
}) => {
  
  const [isRewriting, setIsRewriting] = useState(false);
  const [isAutoDescribing, setIsAutoDescribing] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<{ type: 'logo' | 'hero' | 'aboutLogo' | 'footerLogo' | 'gallery', index: number }>({ type: 'logo', index: 0 });
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'info'} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCloudConnected = isDatabaseConnected();

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleMagicRewrite = () => {
    setIsRewriting(true);
    setTimeout(() => {
      const randomTitle = AI_TITLES[Math.floor(Math.random() * AI_TITLES.length)];
      onUpdate({
        ...config,
        text: { ...config.text, welcomeTitle: randomTitle }
      });
      setIsRewriting(false);
      showToast("Title magically rewritten!");
    }, 1000);
  };

  const handleAutoDescription = () => {
    setIsAutoDescribing(true);
    setTimeout(() => {
      const randomDesc = AI_DESCRIPTIONS[Math.floor(Math.random() * AI_DESCRIPTIONS.length)];
      onUpdate({
        ...config,
        text: { ...config.text, welcomeDescription: randomDesc }
      });
      setIsAutoDescribing(false);
      showToast("Description auto-generated!");
    }, 1000);
  };

  const triggerUpload = (type: 'logo' | 'hero' | 'aboutLogo' | 'footerLogo' | 'gallery', index = -1) => {
    setUploadTarget({ type, index });
    setTimeout(() => {
        fileInputRef.current?.click();
    }, 0);
  };

  const compressImage = (file: File, type: 'logo' | 'hero' | 'aboutLogo' | 'footerLogo' | 'gallery'): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const isLogo = type === 'logo' || type === 'aboutLogo' || type === 'footerLogo';
          // Reduced dimensions and quality to prevent localStorage quota exceeded errors
          const MAX_WIDTH = isLogo ? 500 : 800; 
          const QUALITY = isLogo ? 1 : 0.6;
          const MIME = isLogo ? 'image/png' : 'image/jpeg';

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            const MAX_HEIGHT = isLogo ? 500 : 800;
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL(MIME, QUALITY);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        showToast(file.size > 5 * 1024 * 1024 ? "Processing large file..." : "Optimizing image...", 'info');
        
        try {
            const result = await compressImage(file, uploadTarget.type);
            const newImages = {
                logo: config.images?.logo || '',
                hero: config.images?.hero || '',
                aboutLogo: config.images?.aboutLogo || '',
                footerLogo: config.images?.footerLogo || '',
                mapImage: '', // Map image removed, URL used instead
                gallery: [...(config.images?.gallery || [])]
            };

            if (uploadTarget.type === 'logo') newImages.logo = result;
            else if (uploadTarget.type === 'hero') newImages.hero = result;
            else if (uploadTarget.type === 'aboutLogo') newImages.aboutLogo = result;
            else if (uploadTarget.type === 'footerLogo') newImages.footerLogo = result;
            else if (uploadTarget.type === 'gallery') {
                if (uploadTarget.index === -1) newImages.gallery.push(result);
                else if (newImages.gallery[uploadTarget.index] !== undefined) newImages.gallery[uploadTarget.index] = result;
            }

            onUpdate({ ...config, images: newImages });
            showToast("Image updated successfully!", 'success');
        } catch (error) {
            console.error("Image processing failed", error);
            showToast("Failed to process image", 'info');
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteGalleryImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const newGallery = [...(config.images?.gallery || [])];
    newGallery.splice(index, 1);
    onUpdate({
        ...config,
        images: { ...config.images, gallery: newGallery }
    });
    showToast("Image deleted", 'info');
  };

  return (
      <div 
        className={`
          fixed inset-y-0 left-0 z-[90] md:relative md:z-auto h-full bg-[#1e1e1e] text-white shadow-2xl flex flex-col border-r border-gray-800 shrink-0 transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'w-[85vw] md:w-80 opacity-100 translate-x-0' : 'w-0 md:w-0 opacity-0 -translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#252526] min-w-[20rem]">
          <div>
            <h2 className="text-lg font-bold text-orange-500 tracking-wide">STUFFITT</h2>
            <span className="text-xs text-gray-400 uppercase tracking-wider block">Builder</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Save Button Area */}
        <div className="p-4 pb-2 min-w-[20rem]">
          <button 
            onClick={onSave}
            disabled={saveStatus !== 'idle'}
            className={`w-full py-2.5 rounded font-medium flex items-center justify-center gap-2 text-sm shadow-sm transition-all ${
                saveStatus === 'saved' ? 'bg-green-600 text-white' : 
                saveStatus === 'saving' ? 'bg-orange-600 text-white cursor-wait' :
                'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {saveStatus === 'saving' && <Loader2 className="animate-spin" size={16} />}
            {saveStatus === 'saved' && <Check size={16} />}
            {saveStatus === 'idle' && <Save size={16} />}
            {saveStatus === 'idle' ? 'Save Changes' : saveStatus === 'saving' ? 'Saving...' : 'Saved!'}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar relative min-w-[20rem]">
          
          {/* CLOUD SYNC STATUS - NEW */}
          <div 
            onClick={onManageCloud}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${isCloudConnected ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}
          >
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isCloudConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <Cloud size={14} />
                </div>
                <div>
                    <h4 className={`text-xs font-bold ${isCloudConnected ? 'text-green-400' : 'text-red-400'}`}>
                        {isCloudConnected ? 'Cloud Synced' : 'Local Mode'}
                    </h4>
                    <p className="text-[10px] text-gray-400">
                        {isCloudConnected ? 'Changes live everywhere' : 'Changes visible only here'}
                    </p>
                </div>
             </div>
             <div className="text-gray-500">
                 <Database size={14} />
             </div>
          </div>

          {/* History */}
          <div>
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">History</h3>
             <div className="flex gap-2">
                <button onClick={onUndo} disabled={!canUndo} className={`flex-1 py-2 rounded flex items-center justify-center gap-2 text-xs text-gray-300 transition-colors ${!canUndo ? 'bg-[#333] opacity-50 cursor-not-allowed' : 'bg-[#333] hover:bg-[#444]'}`}>
                    <Undo size={14} /> Undo
                </button>
                <button onClick={onRedo} disabled={!canRedo} className={`flex-1 py-2 rounded flex items-center justify-center gap-2 text-xs text-gray-300 transition-colors ${!canRedo ? 'bg-[#333] opacity-50 cursor-not-allowed' : 'bg-[#333] hover:bg-[#444]'}`}>
                    <Redo size={14} /> Redo
                </button>
             </div>
          </div>

          {/* AI Assistant */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-purple-400">
                <Sparkles size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Assistant</h3>
            </div>
            <div className="space-y-2">
              <button onClick={handleMagicRewrite} disabled={isRewriting} className="w-full bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-600/50 py-2 rounded text-sm flex items-center gap-2 px-3 transition-colors text-left">
                {isRewriting ? <Loader2 className="animate-spin" size={14}/> : <Zap size={14} />} 
                {isRewriting ? 'Rewriting...' : 'Magic Rewrite'}
              </button>
              <button onClick={handleAutoDescription} disabled={isAutoDescribing} className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-600/50 py-2 rounded text-sm flex items-center gap-2 px-3 transition-colors text-left">
                {isAutoDescribing ? <Loader2 className="animate-spin" size={14}/> : <Type size={14} />}
                {isAutoDescribing ? 'Generating...' : 'Auto Description'}
              </button>
            </div>
          </div>

           {/* Content Actions */}
           <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Content Actions</h3>
            <div className="space-y-2">
                <button onClick={onManageMenu} className="w-full bg-[#333] hover:bg-[#444] text-left px-3 py-2.5 rounded text-sm flex items-center gap-3 text-gray-300 border border-transparent hover:border-gray-600 transition-all group">
                    <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center text-orange-500 text-[10px] group-hover:bg-orange-500 group-hover:text-white transition-colors">🍔</div> 
                    <span className="font-medium">Manage Menu Items</span>
                </button>
                <button onClick={onManageQR} className="w-full bg-[#333] hover:bg-[#444] text-left px-3 py-2.5 rounded text-sm flex items-center gap-3 text-gray-300 border border-transparent hover:border-gray-600 transition-all group">
                    <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-500 text-[10px] group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <QrCode size={14} />
                    </div> 
                    <span className="font-medium">QR Menu Manager</span>
                </button>
            </div>
          </div>

          {/* Image Assets Manager */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-green-400">
                <Image size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Image Assets</h3>
            </div>
            
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            <div className="mb-4">
                <label className="text-[10px] text-gray-400 uppercase mb-2 block">Logos & Branding</label>
                <div className="grid grid-cols-3 gap-2">
                    <div onClick={() => triggerUpload('logo')} className="aspect-square bg-[#333] rounded-lg border border-gray-700 hover:border-orange-500 cursor-pointer relative group overflow-hidden flex items-center justify-center">
                        {config.images.logo ? <img src={config.images.logo} className="h-full object-contain p-1" /> : <span className="text-[10px] text-gray-500">Header</span>}
                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Upload size={14} /></div>
                    </div>
                    <div onClick={() => triggerUpload('aboutLogo')} className="aspect-square bg-[#333] rounded-lg border border-gray-700 hover:border-orange-500 cursor-pointer relative group overflow-hidden flex items-center justify-center">
                         {config.images.aboutLogo ? <img src={config.images.aboutLogo} className="h-full object-contain p-1" /> : <span className="text-[10px] text-gray-500">About</span>}
                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Upload size={14} /></div>
                    </div>
                    <div onClick={() => triggerUpload('footerLogo')} className="aspect-square bg-[#333] rounded-lg border border-gray-700 hover:border-orange-500 cursor-pointer relative group overflow-hidden flex items-center justify-center">
                         {config.images.footerLogo ? <img src={config.images.footerLogo} className="h-full object-contain p-1" /> : <span className="text-[10px] text-gray-500">Footer</span>}
                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Upload size={14} /></div>
                    </div>
                </div>
            </div>

             <div className="mb-4">
                <label className="text-[10px] text-gray-400 uppercase mb-2 block">Hero Banner</label>
                <div onClick={() => triggerUpload('hero')} className="h-24 bg-[#333] rounded-lg border border-gray-700 hover:border-orange-500 cursor-pointer relative group overflow-hidden">
                    <img src={config.images.hero} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Upload size={16} /></div>
                </div>
            </div>

            {/* Gallery Section */}
            <div>
                <label className="text-[10px] text-gray-400 uppercase mb-2 block">Food Gallery</label>
                <div className="grid grid-cols-2 gap-2">
                    {config.images.gallery.map((img, idx) => (
                        <div key={idx} onClick={() => triggerUpload('gallery', idx)} className="aspect-video bg-[#333] rounded-lg border border-gray-700 hover:border-blue-500 cursor-pointer relative group overflow-hidden">
                            <img src={img} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Trash2 size={16} className="hover:text-red-500" onClick={(e) => handleDeleteGalleryImage(e, idx)} />
                            </div>
                        </div>
                    ))}
                    <button onClick={() => triggerUpload('gallery', -1)} className="aspect-video bg-[#252526] rounded-lg border-2 border-dashed border-gray-700 hover:border-orange-500 hover:bg-[#2d2d2e] flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-orange-500 transition-all">
                        <Plus size={20} /> <span className="text-[10px]">Add Image</span>
                    </button>
                </div>
            </div>

          </div>

        </div>
        
        {/* Footer */}
        <div className="p-4 bg-[#252526] border-t border-gray-700 min-w-[20rem]">
             <button onClick={onClose} className="w-full bg-[#333] hover:bg-[#444] py-2 rounded text-xs flex items-center justify-center gap-2 text-gray-400 transition-colors">
                 <Eye size={14} /> Toggle Preview
             </button>
        </div>

        {toast && (
            <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] py-3 px-4 rounded-lg shadow-xl text-sm font-medium flex items-center justify-center gap-2 animate-in slide-in-from-bottom-5 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                {toast.msg}
            </div>
        )}

      </div>
  );
};

export default BuilderPanel;
