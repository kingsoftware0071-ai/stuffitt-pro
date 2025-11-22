
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WelcomeSection from './components/WelcomeSection';
import ValuesSection from './components/ValuesSection';
import LocationSection from './components/LocationSection';
import ContactSection from './components/ContactSection';
import CategoryTabs from './components/CategoryTabs';
import MenuCard from './components/MenuCard';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel'; 
import BuilderPanel from './components/BuilderPanel'; 
import BuilderRightPanel from './components/BuilderRightPanel'; 
import FoodGallery from './components/FoodGallery';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import QRGeneratorModal from './components/QRGeneratorModal';
import CloudSettingsModal from './components/CloudSettingsModal';
import { INITIAL_MENU_ITEMS, DEFAULT_CONFIG } from './constants';
import { MenuItem, CartItem, RestaurantConfig, CATEGORIES as INITIAL_CATEGORIES, Category } from './types';
import { ShoppingBag } from 'lucide-react';
import { supabase, isDatabaseConnected } from './supabaseClient';

function App() {
  // --- STATE ---
  const [config, setConfig] = useState<RestaurantConfig>(DEFAULT_CONFIG);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [activeCategory, setActiveCategory] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isMenuManagerOpen, setIsMenuManagerOpen] = useState(false);
  const [isQRManagerOpen, setIsQRManagerOpen] = useState(false);
  const [isCloudSettingsOpen, setIsCloudSettingsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const [history, setHistory] = useState<RestaurantConfig[]>([]);
  const [future, setFuture] = useState<RestaurantConfig[]>([]);
  const [urlCategoryFilter, setUrlCategoryFilter] = useState<string[] | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cats = params.get('categories');
    if (cats) {
      setUrlCategoryFilter(cats.split(','));
    }
    loadData();
  }, []);

  // Data Migration: Check if gallery is in old object format and fix it
  useEffect(() => {
    if (config.images?.gallery && !Array.isArray(config.images.gallery)) {
       console.log("Migrating legacy gallery data format...");
       // @ts-ignore
       const galleryArray = Object.values(config.images.gallery);
       setConfig(prev => ({
           ...prev,
           images: { ...prev.images, gallery: galleryArray as string[] }
       }));
    }
  }, [config.images]);

  // Helper to safely merge loaded config with defaults
  const mergeConfig = (loadedConfig: any): RestaurantConfig => {
    if (!loadedConfig) return DEFAULT_CONFIG;
    return {
        ...DEFAULT_CONFIG,
        ...loadedConfig,
        colors: { ...DEFAULT_CONFIG.colors, ...(loadedConfig.colors || {}) },
        contact: { ...DEFAULT_CONFIG.contact, ...(loadedConfig.contact || {}) },
        text: { ...DEFAULT_CONFIG.text, ...(loadedConfig.text || {}) },
        images: { ...DEFAULT_CONFIG.images, ...(loadedConfig.images || {}) },
        fonts: { ...DEFAULT_CONFIG.fonts, ...(loadedConfig.fonts || {}) },
    };
  };

  const loadData = async () => {
    if (isDatabaseConnected() && supabase) {
      try {
        const { data: configData } = await supabase.from('app_data').select('value').eq('key', 'config').single();
        if (configData?.value) {
            setConfig(mergeConfig(configData.value));
        } else {
            // Fallback if connected but empty data (e.g. just initialized)
            loadFromLocal(); 
        }

        const { data: menuData } = await supabase.from('app_data').select('value').eq('key', 'menu').single();
        if (menuData?.value && Array.isArray(menuData.value) && menuData.value.length > 0) {
            setMenuItems(menuData.value);
        }

        const { data: catData } = await supabase.from('app_data').select('value').eq('key', 'categories').single();
        if (catData?.value && Array.isArray(catData.value) && catData.value.length > 0) {
            setCategories(catData.value);
        }
      } catch (error) {
        console.error("Error loading from Supabase:", error);
        loadFromLocal();
      }
    } else {
      loadFromLocal();
    }
  };

  const loadFromLocal = () => {
    try {
        const savedConfig = localStorage.getItem('restaurantConfig');
        if (savedConfig) {
            setConfig(mergeConfig(JSON.parse(savedConfig)));
        }

        const savedMenu = localStorage.getItem('menuItems');
        if (savedMenu) {
            setMenuItems(JSON.parse(savedMenu));
        }

        const savedCategories = localStorage.getItem('categories');
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        }
    } catch (e) {
        console.error("Error parsing local storage", e);
        setConfig(DEFAULT_CONFIG);
    }
  };

  // Auto-Save Menu Items/Categories to Cloud if connected
  useEffect(() => {
    if (!isMenuManagerOpen) return;
    saveToDatabase('menu', menuItems);
    try {
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
    } catch (e) {
        console.warn("Local storage full, skipping local backup for menu");
    }
  }, [menuItems, isMenuManagerOpen]);

  useEffect(() => {
    if (!isMenuManagerOpen) return;
    saveToDatabase('categories', categories);
    try {
        localStorage.setItem('categories', JSON.stringify(categories));
    } catch (e) {
        console.warn("Local storage full, skipping local backup for categories");
    }
  }, [categories, isMenuManagerOpen]);

  const handleSave = async () => {
    setSaveStatus('saving');
    let localSaveFailed = false;

    // 1. Try Local Backup (Non-blocking)
    try {
      localStorage.setItem('restaurantConfig', JSON.stringify(config));
    } catch (error: any) {
      console.warn("Local storage quota exceeded. Skipping local backup.", error);
      localSaveFailed = true;
    }

    // 2. Try Cloud Save (Primary)
    try {
      await saveToDatabase('config', config);
      await saveToDatabase('menu', menuItems); 
      await saveToDatabase('categories', categories);

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      if (localSaveFailed) {
          alert("⚠️ Storage Warning\n\nYour browser's local storage is full (likely due to many images). \n\n✅ GOOD NEWS: Your changes were successfully saved to the Cloud and are live for customers!\n\nℹ️ NOTE: Offline backup on this specific device failed. This is fine as long as you have internet.");
      }
    } catch (error: any) {
      console.error("Save failed", error);
      setSaveStatus('idle');
      
      if (error?.message?.includes('relation "app_data" does not exist') || error?.code === '42P01' || error?.message?.includes('function upsert_app_data') ) {
          alert("Database Setup Incomplete! \n\nYou connected the database but didn't run the updated SQL command to create the tables and functions.\n\nI will open the settings so you can copy the SQL code.");
          setIsCloudSettingsOpen(true);
      } else {
          alert(`Failed to save to cloud. Error: ${error.message || "Check connection"}`);
      }
    }
  };

  const saveToDatabase = async (key: string, value: any) => {
    if (isDatabaseConnected() && supabase) {
      const { error } = await supabase.rpc('upsert_app_data', { k: key, v: value });
      if (error) throw error;
    }
  };

  useEffect(() => { 
      try {
        localStorage.setItem('cart', JSON.stringify(cart)); 
      } catch (e) { console.warn("Cart save failed"); }
  }, [cart]);

  const visibleCategories = categories.filter(c => {
    if (c.visible === false) return false;
    if (urlCategoryFilter && urlCategoryFilter.length > 0 && !urlCategoryFilter.includes(c.id)) return false;
    return true;
  });
  
  useEffect(() => {
    if (visibleCategories.length > 0 && (!activeCategory || !visibleCategories.find(c => c.id === activeCategory))) {
        setActiveCategory(visibleCategories[0].id);
    }
  }, [visibleCategories, activeCategory]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, quantity: item.quantity + delta };
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const clearCart = () => setCart([]);

  const handleUpdateConfig = (newConfig: RestaurantConfig) => {
      setHistory(prev => [...prev, config]);
      setFuture([]); 
      setConfig(newConfig);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setFuture(prev => [config, ...prev]);
    setHistory(newHistory);
    setConfig(previous);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setHistory(prev => [...prev, config]);
    setFuture(newFuture);
    setConfig(next);
  };

  const handleTextChange = (key: keyof RestaurantConfig['text'], value: string) => {
    handleUpdateConfig({ ...config, text: { ...config.text, [key]: value } });
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginOpen(false);
    setIsBuilderOpen(true);
  };

  const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);
  const displayedItems = menuItems.filter(item => item.category === activeCategory && item.visible !== false);

  // Calculate background styles safely
  const bgStyle = { backgroundColor: config?.colors?.background || '#FFFAF5' };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-100 relative">
      <style>{`
        :root {
          --font-heading: '${config.fonts?.heading || 'Playfair Display'}', serif;
          --font-body: '${config.fonts?.body || 'Poppins'}', sans-serif;
        }
        body { font-family: var(--font-body) !important; }
        h1, h2, h3, h4, .brand-font { font-family: var(--font-heading) !important; }
      `}</style>

      <BuilderPanel 
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        config={config}
        onUpdate={handleUpdateConfig}
        onManageMenu={() => setIsMenuManagerOpen(true)}
        onManageQR={() => setIsQRManagerOpen(true)}
        onManageCloud={() => setIsCloudSettingsOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        onSave={handleSave}
        saveStatus={saveStatus}
      />

      <div className="flex-1 flex flex-col h-full overflow-y-auto relative shadow-2xl z-10" style={bgStyle}>
          <Header 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen} 
            openAdmin={() => isAuthenticated ? setIsBuilderOpen(true) : setIsLoginOpen(true)}
            openCart={() => setIsCartOpen(true)}
            cartCount={totalItemsInCart}
            config={config}
          />

          <WelcomeSection config={config} isEditing={isBuilderOpen} onTextChange={handleTextChange} />

          <div id="menu" className="bg-gradient-to-b from-transparent via-white to-transparent py-10 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] relative z-10">
            <div className="text-center px-4 mb-4">
              <h2 className="text-4xl font-bold text-[#D84315] brand-font mb-4 drop-shadow-sm">Our Menu</h2>
              <div className="max-w-md mx-auto">
                <p className="text-gray-600 text-sm leading-relaxed mb-2">Handcrafted with love, served with passion. Every dish tells a delicious story! 🍔✨</p>
              </div>
            </div>
            <div className="py-3 mb-6">
              <CategoryTabs categories={visibleCategories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            </div>
            <div className="container mx-auto px-4 flex-grow max-w-5xl min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedItems.length > 0 ? (
                  displayedItems.map(item => <MenuCard key={item.id} item={item} onAddToCart={addToCart} />)
                ) : (
                  <div className="col-span-full text-center py-20 text-gray-400 italic">No items available.</div>
                )}
              </div>
            </div>
          </div>

          <FoodGallery config={config} />
          <ContactSection config={config} isEditing={isBuilderOpen} onTextChange={handleTextChange} />
          <LocationSection config={config} />
          <AboutSection config={config} isEditing={isBuilderOpen} onTextChange={handleTextChange} />
          <ValuesSection />
          <Footer onOpenAdmin={() => isAuthenticated ? setIsBuilderOpen(true) : setIsLoginOpen(true)} config={config} />

          {totalItemsInCart > 0 && (
            <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
                <button onClick={() => setIsCartOpen(true)} className="pointer-events-auto bg-brand-dark text-white w-full max-w-md rounded-2xl p-4 shadow-2xl flex items-center justify-center animate-in slide-in-from-bottom-4 hover:scale-[1.02] transition-transform">
                    <div className="flex flex-col text-left flex-1">
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{totalItemsInCart} Items added</span>
                        <span className="font-bold text-lg text-white">View Cart</span>
                    </div>
                    <div className="p-3 rounded-xl shadow-lg ml-4" style={{ background: `linear-gradient(to right, ${config?.colors?.primary}, ${config?.colors?.secondary})` }}><ShoppingBag fill="white" size={20} /></div>
                </button>
            </div>
          )}
      </div>

      <BuilderRightPanel isOpen={isBuilderOpen} config={config} onChange={handleUpdateConfig} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} updateQuantity={updateQuantity} removeItem={removeItem} clearCart={clearCart} />
      <AdminPanel isOpen={isMenuManagerOpen} onClose={() => setIsMenuManagerOpen(false)} menuItems={menuItems} setMenuItems={setMenuItems} categories={categories} setCategories={setCategories} />
      <QRGeneratorModal isOpen={isQRManagerOpen} onClose={() => setIsQRManagerOpen(false)} categories={categories} />
      <CloudSettingsModal isOpen={isCloudSettingsOpen} onClose={() => setIsCloudSettingsOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}

export default App;
