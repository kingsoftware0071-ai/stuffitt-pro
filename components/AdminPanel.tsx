
import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, Category } from '../types';
import { X, Trash2, Plus, Image, Search, Tag, Edit3, Check, Save, Grid, List, Layers } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, menuItems, setMenuItems, categories, setCategories }) => {
  // View Mode: 'items' or 'categories'
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    price: string | number;
    description: string;
    category: string;
    isVeg: boolean;
    imageUrl: string;
  }>({
    name: '', price: '', description: '', category: '', isVeg: true, imageUrl: ''
  });

  // Category Management State
  const [isAddingCategory, setIsAddingCategory] = useState(false); // Inline in form
  const [newCategoryName, setNewCategoryName] = useState(''); // Inline in form
  
  // Category Tab State (Editing/Deleting)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryLabel, setEditCategoryLabel] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  // Initialize category when categories load
  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: categories[0].id }));
    }
  }, [categories]);

  if (!isOpen) return null;

  // --- Handlers ---

  const handleDeleteItem = (id: string) => {
    // Direct delete without confirmation dialog to ensure it works
    setMenuItems(prev => prev.filter(i => i.id !== id));
    if (editingId === id) resetForm();
  };

  const handleEditItem = (item: MenuItem) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      isVeg: item.isVeg,
      imageUrl: item.imageUrl
    });
    // Scroll to form on mobile
    if (window.innerWidth < 768) {
        formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ 
        name: '', 
        price: '', 
        description: '', 
        category: categories[0]?.id || '', 
        isVeg: true, 
        imageUrl: '' 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && editingId) {
      // UPDATE Existing Item
      setMenuItems(prev => prev.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            name: formData.name,
            price: Number(formData.price),
            description: formData.description,
            category: formData.category,
            imageUrl: formData.imageUrl || item.imageUrl,
            isVeg: formData.isVeg
          };
        }
        return item;
      }));
    } else {
      // CREATE New Item
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: formData.name || 'New Item',
        price: Number(formData.price) || 0,
        description: formData.description || '',
        category: formData.category || categories[0]?.id || 'starters',
        imageUrl: formData.imageUrl || `https://picsum.photos/seed/${Date.now()}/400/300`,
        isVeg: formData.isVeg
      };
      setMenuItems(prev => [newItem, ...prev]);
    }
    
    resetForm();
  };

  // Inline Add Category (Inside Form)
  const handleAddCategoryInline = () => {
    if (!newCategoryName.trim()) return;
    
    const id = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    if (categories.some(c => c.id === id)) {
      alert("Category already exists!");
      return;
    }
    
    const newCat = { id, label: newCategoryName };
    setCategories(prev => [...prev, newCat]);
    setFormData({ ...formData, category: id }); // Auto-select new category
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  // Category Tab Handlers
  const handleStartEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setEditCategoryLabel(cat.label);
  };

  const handleSaveCategory = (id: string) => {
    if (!editCategoryLabel.trim()) return;
    setCategories(prev => prev.map(c => c.id === id ? { ...c, label: editCategoryLabel } : c));
    setEditingCategoryId(null);
    setEditCategoryLabel('');
  };

  const handleDeleteCategory = (id: string) => {
    // Direct delete without confirmation
    setCategories(prev => prev.filter(c => c.id !== id));
    
    // If current form has this category selected, reset it
    if (formData.category === id) {
      setFormData(prev => {
        const nextCat = categories.find(c => c.id !== id);
        return { ...prev, category: nextCat ? nextCat.id : '' };
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm">
      
      {/* Main Container */}
      <div className="bg-gray-50 w-full md:max-w-7xl h-full md:h-[90vh] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* 1. Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                    <Grid size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Menu Dashboard</h2>
                    <p className="text-xs text-gray-500">Manage your food items & categories</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* 2. Content Grid */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* LEFT COLUMN: Editor Form */}
            <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-r border-gray-200 flex flex-col overflow-y-auto custom-scrollbar">
                <div ref={formTopRef} className="p-6 space-y-6">
                    
                    {/* Form Header */}
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            {isEditing ? <Edit3 className="text-blue-500" size={18}/> : <Plus className="text-orange-500" size={18}/>}
                            {isEditing ? 'Edit Menu Item' : 'Add New Item'}
                        </h3>
                        {isEditing && (
                            <button type="button" onClick={resetForm} className="text-xs text-red-500 hover:bg-red-50 px-3 py-1 rounded-full font-medium transition-colors">
                                Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Item Image</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="relative h-48 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group overflow-hidden"
                            >
                                {formData.imageUrl ? (
                                    <>
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-medium text-sm">Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Image className="text-gray-300 mb-2 group-hover:text-orange-400" size={32} />
                                        <span className="text-xs text-gray-400 group-hover:text-orange-500">Click to upload</span>
                                    </>
                                )}
                                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Name</label>
                                <input 
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-black focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    placeholder="e.g. Cheese Burger"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Price (₹)</label>
                                    <input 
                                        required
                                        type="number"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-black focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                        placeholder="199"
                                        value={formData.price}
                                        onChange={e => setFormData({...formData, price: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 flex justify-between items-center">
                                        Category
                                        <button 
                                            type="button"
                                            onClick={() => setIsAddingCategory(!isAddingCategory)}
                                            className="text-[10px] text-blue-600 hover:underline font-bold"
                                        >
                                            {isAddingCategory ? 'Cancel' : '+ Add New'}
                                        </button>
                                    </label>
                                    
                                    {isAddingCategory ? (
                                        <div className="flex gap-2">
                                            <input 
                                                autoFocus
                                                className="w-full bg-white border border-blue-300 rounded-lg px-2 py-2.5 text-sm text-black focus:ring-2 focus:ring-blue-100 outline-none"
                                                placeholder="New Category"
                                                value={newCategoryName}
                                                onChange={e => setNewCategoryName(e.target.value)}
                                                style={{ color: 'black' }}
                                            />
                                            <button 
                                                type="button"
                                                onClick={handleAddCategoryInline}
                                                className="bg-blue-600 text-white px-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                                            >
                                                <Check size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                            <select 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-gray-900 text-black focus:bg-white focus:border-orange-500 outline-none appearance-none font-medium"
                                                value={formData.category}
                                                onChange={e => setFormData({...formData, category: e.target.value})}
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Description</label>
                                <textarea 
                                    rows={3}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-black focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm"
                                    placeholder="Ingredients, taste description..."
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            
                            {/* Veg/Non-Veg Toggle */}
                            <div 
                                onClick={() => setFormData({...formData, isVeg: !formData.isVeg})}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.isVeg ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${formData.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                    <div className={`w-3 h-3 rounded-full ${formData.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                </div>
                                <span className={`text-sm font-bold ${formData.isVeg ? 'text-green-700' : 'text-red-700'}`}>
                                    {formData.isVeg ? 'Vegetarian Item' : 'Non-Vegetarian Item'}
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-500 hover:bg-orange-600'}`}
                        >
                            {isEditing ? <Save size={18} /> : <Plus size={18} />}
                            {isEditing ? 'Update Item' : 'Add Item to Menu'}
                        </button>

                    </form>
                </div>
            </div>

            {/* RIGHT COLUMN: Data View */}
            <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
                
                {/* Tab Switcher */}
                <div className="p-4 bg-white border-b border-gray-200 flex gap-4">
                    <button 
                        onClick={() => setActiveTab('items')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'items' ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        <List size={16} /> Menu Items ({menuItems.length})
                    </button>
                    <button 
                         onClick={() => setActiveTab('categories')}
                         className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'categories' ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        <Layers size={16} /> Categories ({categories.length})
                    </button>
                </div>

                {/* Search Toolbar (Only for Items) */}
                {activeTab === 'items' && (
                    <div className="px-6 py-3 bg-white/50 backdrop-blur-sm border-b border-gray-200">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-black focus:border-orange-400 outline-none shadow-sm"
                                placeholder="Search by name or category..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    
                    {/* VIEW: MENU ITEMS */}
                    {activeTab === 'items' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredItems.map(item => (
                                <div 
                                    key={item.id}
                                    className={`bg-white rounded-xl p-3 shadow-sm border flex gap-3 transition-all hover:shadow-md ${editingId === item.id ? 'border-blue-500 ring-1 ring-blue-100' : 'border-gray-100'}`}
                                >
                                    {/* Thumbnail */}
                                    <div className="w-20 h-20 rounded-lg bg-gray-100 shrink-0 overflow-hidden relative">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        <div className={`absolute top-1 left-1 w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'} border border-white`}></div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h4 className="font-bold text-gray-800 truncate">{item.name}</h4>
                                        <p className="text-xs text-gray-500 mb-1">{categories.find(c => c.id === item.category)?.label}</p>
                                        <p className="font-bold text-orange-600 text-sm">₹{item.price}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 justify-center border-l border-gray-100 pl-3 relative">
                                        <button 
                                            type="button"
                                            onClick={() => handleEditItem(item)}
                                            className="cursor-pointer p-2 bg-white hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg border border-gray-100 hover:border-blue-200 shadow-sm transition-all relative z-20"
                                            title="Edit Item"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // STOP PROPAGATION
                                                handleDeleteItem(item.id);
                                            }}
                                            className="cursor-pointer p-2 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg border border-gray-100 hover:border-red-200 shadow-sm transition-all relative z-[100]"
                                            title="Delete Item"
                                        >
                                            <Trash2 size={18} className="pointer-events-none" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {filteredItems.length === 0 && (
                                <div className="col-span-full py-12 text-center">
                                    <p className="text-gray-400">No items found matching your search.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW: CATEGORIES */}
                    {activeTab === 'categories' && (
                        <div className="space-y-3">
                            {categories.map(cat => (
                                <div key={cat.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                                    
                                    {editingCategoryId === cat.id ? (
                                        <div className="flex-1 flex gap-2 mr-4">
                                            <input 
                                                autoFocus
                                                className="flex-1 border border-blue-300 rounded px-3 py-2 text-black"
                                                value={editCategoryLabel}
                                                onChange={e => setEditCategoryLabel(e.target.value)}
                                            />
                                            <button onClick={() => handleSaveCategory(cat.id)} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                                                <Save size={18} />
                                            </button>
                                            <button onClick={() => setEditingCategoryId(null)} className="bg-gray-200 text-gray-600 p-2 rounded hover:bg-gray-300">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                                <Tag size={18} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-base">{cat.label}</h4>
                                                <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {cat.id}</p>
                                            </div>
                                        </div>
                                    )}

                                    {editingCategoryId !== cat.id && (
                                        <div className="flex gap-2 relative">
                                            <button 
                                                type="button"
                                                onClick={() => handleStartEditCategory(cat)}
                                                className="cursor-pointer p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors relative z-10 border border-transparent hover:border-blue-200"
                                                title="Edit Category"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCategory(cat.id);
                                                }}
                                                className="cursor-pointer p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors relative z-[100] border border-transparent hover:border-red-200"
                                                title="Delete Category"
                                            >
                                                <Trash2 size={18} className="pointer-events-none" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                             <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-center text-sm text-blue-800">
                                <p>💡 To add a new category, use the <b>"+ Add New"</b> button in the item form (left panel).</p>
                            </div>
                        </div>
                    )}

                </div>

            </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
