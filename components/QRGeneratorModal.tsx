
import React, { useState, useRef } from 'react';
import { X, Download, Link, QrCode, CheckSquare, Square } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Category } from '../types';

interface QRGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

const QRGeneratorModal: React.FC<QRGeneratorModalProps> = ({ isOpen, onClose, categories }) => {
  const [tableNumber, setTableNumber] = useState('');
  const [customUrl, setCustomUrl] = useState(window.location.href.split('?')[0]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const svgRef = useRef<any>(null);

  if (!isOpen) return null;

  // Construct URL parameters
  const params = new URLSearchParams();
  if (tableNumber) params.append('table', tableNumber);
  if (selectedCategories.length > 0) params.append('categories', selectedCategories.join(','));

  const paramString = params.toString();
  const generatedUrl = paramString ? `${customUrl}?${paramString}` : customUrl;

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const downloadQR = () => {
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `stuffitt-qr-${tableNumber ? `table-${tableNumber}` : 'menu'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
                <QrCode size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold">QR Menu Generator</h2>
                <p className="text-xs opacity-90">Customize what customers see</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8 overflow-y-auto">
            {/* Controls */}
            <div className="space-y-6">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Website URL</label>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <Link size={16} className="text-gray-400" />
                        <input 
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none text-gray-700"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Table Number (Optional)</label>
                    <input 
                        type="number"
                        placeholder="e.g. 12"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-orange-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Visible Categories</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                        <p className="text-[10px] text-gray-400 mb-2">Select specific categories to show. If none selected, all visible categories will be shown.</p>
                        {categories.map(cat => (
                            <div 
                                key={cat.id} 
                                onClick={() => toggleCategory(cat.id)}
                                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${selectedCategories.includes(cat.id) ? 'bg-orange-50 border-orange-200' : 'hover:bg-gray-100'}`}
                            >
                                {selectedCategories.includes(cat.id) ? 
                                    <CheckSquare size={16} className="text-orange-500" /> : 
                                    <Square size={16} className="text-gray-400" />
                                }
                                <span className={`text-sm font-medium ${selectedCategories.includes(cat.id) ? 'text-orange-700' : 'text-gray-600'}`}>
                                    {cat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={downloadQR}
                    className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                    <Download size={18} /> Download PNG
                </button>
            </div>

            {/* Preview */}
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-100 p-6">
                <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                    <QRCode
                        ref={svgRef as any}
                        value={generatedUrl}
                        size={180}
                        fgColor="#000000"
                        bgColor="#ffffff"
                    />
                </div>
                <div className="w-full text-center">
                    <p className="text-xs text-gray-500 font-mono break-all bg-gray-100 p-2 rounded border border-gray-200 text-[10px] line-clamp-3">
                        {generatedUrl}
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default QRGeneratorModal;
