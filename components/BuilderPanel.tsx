
import React, { useState, useRef } from 'react';
import { X, Save, Sparkles, Type, Undo, Redo, Trash2, Plus, Image, Eye, Loader2, Check, AlertCircle, Upload } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface BuilderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  setConfig: (config: RestaurantConfig) => void;
  onManageMenu: () => void;
}

// AI Simulation Content
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

const BuilderPanel: React.FC<BuilderPanelProps> = ({ isOpen, onClose, config, setConfig, onManageMenu }) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // History State for Undo/Redo
  const [history, setHistory] = useState<RestaurantConfig[]>([]);
  const [future, setFuture] = useState<RestaurantConfig[]>([]);
  
  // AI Loading States
  const [isRewriting, setIsRewriting] = useState(false);
  const [isAutoDescribing, setIsAutoDescribing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Image Upload State
  // Target: 'logo', 'hero', or 'gallery' (with index if replacing, or -1 for new)
  const [uploadTarget, setUploadTarget] = useState<{ type: 'logo' | 'hero' | 'gallery', index: number }>({ type: 'logo', index: 0 });

  // Toast Notification State
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'info'} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to show toast
  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Helper to update config with history tracking
  const updateConfig = (newConfig: RestaurantConfig) => {
    setHistory(prev => [...prev, config]);
    setFuture([]); // Clear future on new change
    setConfig(newConfig);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    
    setFuture(prev => [config, ...prev]);
    setHistory(newHistory);
    setConfig(previous);
    showToast("Undid last change", 'info');
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setHistory(prev => [...prev, config]);
    setFuture(newFuture);
    setConfig(next);
    showToast("Redid change", 'info');
  };

  const handleMagicRewrite = () => {
    setIsRewriting(true);
    setTimeout(() => {
      const randomTitle = AI_TITLES[Math.floor(Math.random() * AI_TITLES.length)];
      updateConfig({
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
      updateConfig({
        ...config,
        text: { ...config.text, welcomeDescription: randomDesc }
      });
      setIsAutoDescribing(false);
      showToast("Description auto-generated!");
    }, 1000);
  };

  const handleGenerateImage = () => {
    setIsGeneratingImage(true);
    setTimeout(() => {
      setIsGeneratingImage(false);
      showToast("New image generated (Simulated)!", 'success');
    }, 1500);
  };

  const handleAddSection = () => {
    showToast("New section added (Simulated)", 'success');
  };

  const handleDeleteSection = () => {
    showToast("Section deleted (Simulated)", 'info');
  };

  // 1. Trigger File Selection
  const triggerUpload = (type: 'logo' | 'hero' | 'gallery', index = -1) => {
    setUploadTarget({ type, index });
    setTimeout(() => {
        fileInputRef.current?.click();
    }, 0);
  };

  // IMAGE COMPRESSION LOGIC
  const compressImage = (file: File, type: 'logo' | 'hero' | 'gallery'): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          
          // Settings based on type
          // Logos: Smaller, PNG to keep transparency
          // Hero/Gallery: Larger, JPEG for compression
          const isLogo = type === 'logo';
          const MAX_WIDTH = isLogo ? 500 : 1024; 
          const QUALITY = isLogo ? 1 : 0.7;
          const MIME = isLogo ? 'image/png' : 'image/jpeg';

          let width = img.width;
          let height = img.height;

          // Resize logic
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            // Don't let height get excessively huge either
            const MAX_HEIGHT = isLogo ? 500 : 1024;
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

  // 2. Handle File Change & Update Config
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // NOTE: Large files (e.g. 500MB) are allowed.
        // The compressImage function handles optimization to prevent browser crashes.
        showToast(file.size > 5 * 1024 * 1024 ? "Processing large file..." : "Optimizing image...", 'info');
        
        try {
            // Compress image before saving
            const result = await compressImage(file, uploadTarget.type);
            
            // Create a deep copy of images to ensure immutability
            const newImages = {
                logo: config.images?.logo || '',
                hero: config.images?.hero || '',
                gallery: [...(config.images?.gallery || [])]
            };

            if (uploadTarget.type === 'logo') {
                newImages.logo = result;
            } else if (uploadTarget.type === 'hero') {
                newImages.hero = result;
            } else if (uploadTarget.type === 'gallery') {
                if (uploadTarget.index === -1) {
                    // Add New
                    newImages.gallery.push(result);
                } else {
                    // Replace Existing
                    if (newImages.gallery[uploadTarget.index] !== undefined) {
                        newImages.gallery[uploadTarget.index] = result;
                    }
                }
            }

            updateConfig({
                ...config,
                images: newImages
            });
            
            showToast("Image updated successfully!", 'success');
        } catch (error) {
            console.error("Image processing failed", error);
            showToast("Failed to process image", 'info');
        }
        
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteGalleryImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Stop click from triggering 'Replace' (the parent div click)
    
    const newGallery = [...(config.images?.gallery || [])];
    newGallery.splice(index, 1);
    
    updateConfig({
        ...config,
        images: { ...config.images, gallery: newGallery }
    });
    
    showToast("Image deleted", 'info');
  };

  const handleTogglePreview = () => {
    onClose();
  };

  const handleColorChange = (key: keyof RestaurantConfig['colors'], value: string) => {
    updateConfig({
      ...config,
      colors: { ...config.colors, [key]: value }
    });
  };

  const handleContactChange = (key: keyof RestaurantConfig['contact'], value: string) => {
    updateConfig({
      ...config,
      contact: { ...config.contact, [key]: value }
    });
  };

  const handleTextChange = (key: keyof RestaurantConfig['text'], value: string) => {
    setConfig({
      ...config,
      text: { ...config.text, [key]: value }
    });
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
        showToast("All changes saved!");
        onClose(); // Auto close on save
      }, 1000);
    }, 800);
  };

  return (
      <div 
        className={`
          h-full bg-[#1e1e1e] text-white shadow-2xl flex flex-col border-r border-gray-800 shrink-0 transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'}
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
            onClick={handleSave}
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
          
          {/* AI Assistant */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">AI Assistant</h3>
            <div className="space-y-2">
              <button 
                onClick={handleMagicRewrite}
                disabled={isRewriting}
                className="w-full bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-600/50 py-2 rounded text-sm flex items-center gap-2 px-3 transition-colors"
              >
                {isRewriting ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14} />} 
                {isRewriting ? 'Rewriting...' : 'Magic Rewrite'}
              </button>
              
              <button 
                onClick={handleAutoDescription}
                disabled={isAutoDescribing}
                className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-600/50 py-2 rounded text-sm flex items-center gap-2 px-3 transition-colors"
              >
                {isAutoDescribing ? <Loader2 className="animate-spin" size={14}/> : <Type size={14} />}
                {isAutoDescribing ? 'Generating...' : 'Auto Description'}
              </button>
              
              <button 
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded text-sm flex items-center gap-2 px-3 shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.02]"
              >
                {isGeneratingImage ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14} />}
                {isGeneratingImage ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          </div>

          {/* History */}
          <div>
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">History</h3>
             <div className="flex gap-2">
                <button 
                    onClick={handleUndo}
                    disabled={history.length === 0}
                    className={`flex-1 py-2 rounded flex items-center justify-center gap-2 text-xs text-gray-300 transition-colors ${history.length === 0 ? 'bg-[#333] opacity-50 cursor-not-allowed' : 'bg-[#333] hover:bg-[#444]'}`}
                >
                    <Undo size={14} /> Undo
                </button>
                <button 
                    onClick={handleRedo}
                    disabled={future.length === 0}
                    className={`flex-1 py-2 rounded flex items-center justify-center gap-2 text-xs text-gray-300 transition-colors ${future.length === 0 ? 'bg-[#333] opacity-50 cursor-not-allowed' : 'bg-[#333] hover:bg-[#444]'}`}
                >
                    <Redo size={14} /> Redo
                </button>
             </div>
          </div>

          {/* Image Assets Manager */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Image Assets</h3>
            
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
            />

            {/* Brand & Hero Section */}
            <div className="mb-4">
                <label className="text-[10px] text-gray-400 uppercase mb-2 block">Brand & Hero</label>
                <div className="grid grid-cols-2 gap-2">
                    {/* LOGO */}
                    <div 
                        onClick={() => triggerUpload('logo')}
                        className="aspect-square bg-[#333] rounded-lg border border-gray-700 hover:border-orange-500 cursor-pointer relative group overflow-hidden"
                        title="Change Logo"
                    >
                        {config.images.logo ? (
                            <img src={config.images.logo} className="w-full h-full object-cover" alt="Logo" />
                        ) : (
                             <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Logo</div>
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload size={16} />
                        </div>
                    </div>

                    {/* HERO */}
                    <div 
                        onClick={() => triggerUpload('hero')}
                        className="aspect-square bg-[#333] rounded-lg border border-gray-700 hover:border-orange-500 cursor-pointer relative group overflow-hidden"
                        title="Change Hero Banner"
                    >
                        <img src={config.images.hero} className="w-full h-full object-cover" alt="Hero" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <div>
                <label className="text-[10px] text-gray-400 uppercase mb-2 block">Food Gallery</label>
                <div className="grid grid-cols-2 gap-2">
                    {/* Existing Images */}
                    {config.images.gallery.map((img, idx) => (
                        <div 
                            key={idx}
                            onClick={() => triggerUpload('gallery', idx)}
                            className="aspect-video bg-[#333] rounded-lg border border-gray-700 hover:border-blue-500 cursor-pointer relative group overflow-hidden"
                            title="Replace Image"
                        >
                            <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                            
                            {/* Action Overlay */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <div className="flex flex-col items-center justify-center text-white">
                                    <Upload size={20} />
                                    <span className="text-[10px] font-medium">Change</span>
                                </div>
                                <div 
                                    onClick={(e) => handleDeleteGalleryImage(e, idx)}
                                    className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                                    title="Delete"
                                >
                                    <Trash2 size={16} className="pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Button */}
                    <button 
                        onClick={() => triggerUpload('gallery', -1)}
                        className="aspect-video bg-[#252526] rounded-lg border-2 border-dashed border-gray-700 hover:border-orange-500 hover:bg-[#2d2d2e] flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-orange-500 transition-all"
                    >
                        <Plus size={20} />
                        <span className="text-[10px]">Add Image</span>
                    </button>
                </div>
            </div>

          </div>

          {/* Content Actions */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Content Actions</h3>
            <div className="space-y-2">
                <button 
                    onClick={onManageMenu}
                    className="w-full bg-[#333] hover:bg-[#444] text-left px-3 py-2 rounded text-sm flex items-center gap-2 text-gray-300 border border-transparent hover:border-gray-600 transition-all"
                >
                    <div className="w-4 h-4 rounded bg-orange-500/20 flex items-center justify-center text-orange-500 text-[10px]">🍔</div> 
                    Manage Menu Items
                </button>
                
                <button 
                    onClick={handleAddSection}
                    className="w-full bg-[#333] hover:bg-[#444] text-left px-3 py-2 rounded text-sm flex items-center gap-2 text-gray-300 border border-transparent hover:border-gray-600 transition-all"
                >
                    <Plus size={14} className="text-orange-500" /> Add New Section
                </button>
                
                <button 
                    onClick={handleDeleteSection}
                    className="w-full bg-red-900/20 hover:bg-red-900/40 text-left px-3 py-2 rounded text-sm flex items-center gap-2 text-red-400 border border-red-900/30 hover:border-red-700 transition-all"
                >
                    <Trash2 size={14} /> Delete Selected
                </button>
            </div>
          </div>

          {/* Global Colors */}
          <div>
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Global Colors</h3>
             <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Primary Color</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#333] p-1 rounded border border-gray-700">
                        <input 
                            type="color" 
                            value={config.colors.primary}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" 
                        />
                        <span className="text-xs text-gray-300 uppercase">{config.colors.primary}</span>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Secondary Color</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#333] p-1 rounded border border-gray-700">
                        <input 
                            type="color" 
                            value={config.colors.secondary}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" 
                        />
                        <span className="text-xs text-gray-300 uppercase">{config.colors.secondary}</span>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Background Color</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#333] p-1 rounded border border-gray-700">
                        <input 
                            type="color" 
                            value={config.colors.background}
                            onChange={(e) => handleColorChange('background', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" 
                        />
                        <span className="text-xs text-gray-300 uppercase">{config.colors.background}</span>
                    </div>
                </div>
             </div>
          </div>

          {/* Content Editor */}
          <div>
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Restaurant Details</h3>
             <div className="space-y-3">
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Phone Number</label>
                    <input 
                        type="text" 
                        value={config.contact.phone}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                        className="w-full bg-[#333] border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Address</label>
                    <textarea 
                        value={config.contact.address}
                        onChange={(e) => handleContactChange('address', e.target.value)}
                        rows={2}
                        className="w-full bg-[#333] border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                    />
                </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">Welcome Title</label>
                    <input 
                        type="text" 
                        value={config.text.welcomeTitle}
                        onChange={(e) => handleTextChange('welcomeTitle', e.target.value)}
                        className="w-full bg-[#333] border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                    />
                </div>
             </div>
          </div>

        </div>
        
        {/* Footer */}
        <div className="p-4 bg-[#252526] border-t border-gray-700 min-w-[20rem]">
             <button 
                onClick={handleTogglePreview}
                className="w-full bg-[#333] hover:bg-[#444] py-2 rounded text-xs flex items-center justify-center gap-2 text-gray-400 transition-colors"
            >
                 <Eye size={14} /> Toggle Preview
             </button>
        </div>

        {/* Toast Notification */}
        {toast && (
            <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] py-3 px-4 rounded-lg shadow-xl text-sm font-medium flex items-center justify-center gap-2 animate-in slide-in-from-bottom-5 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                {toast.msg}
            </div>
        )}

      </div>
  );
};

export default BuilderPanel;
