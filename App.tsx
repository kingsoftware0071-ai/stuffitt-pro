
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WelcomeSection from './components/WelcomeSection';
import ValuesSection from './components/ValuesSection';
import LocationSection from './components/LocationSection';
import ContactSection from './components/ContactSection';
import CategoryTabs from './components/CategoryTabs';
import MenuCard from './components/MenuCard';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel'; // The original menu editor
import BuilderPanel from './components/BuilderPanel'; // The new UI builder
import FoodGallery from './components/FoodGallery';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import { INITIAL_MENU_ITEMS, DEFAULT_CONFIG } from './constants';
import { MenuItem, CartItem, RestaurantConfig, CATEGORIES as INITIAL_CATEGORIES, Category } from './types';
import { ShoppingBag } from 'lucide-react';

function App() {
  // Config State (Colors, Text, Contact)
  const [config, setConfig] = useState<RestaurantConfig>(() => {
    const saved = localStorage.getItem('restaurantConfig');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('menuItems');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  // Dynamic Categories State
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCategory, setActiveCategory] = useState('starters');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Two admin modes: The Builder (Sidebar) and The Menu Manager (Modal)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isMenuManagerOpen, setIsMenuManagerOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('restaurantConfig', JSON.stringify(config));
  }, [config]);

  // Ensure active category always exists
  useEffect(() => {
    if (categories.length > 0 && !categories.find(c => c.id === activeCategory)) {
        setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Cart Logic
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  // Filter logic
  const displayedItems = menuItems.filter(item => item.category === activeCategory);
  const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      
      {/* SIDEBAR: The New Builder Panel */}
      <BuilderPanel 
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        config={config}
        setConfig={setConfig}
        onManageMenu={() => setIsMenuManagerOpen(true)}
      />

      {/* MAIN CONTENT: Scrollable Area */}
      <div 
        className="flex-1 flex flex-col h-full overflow-y-auto relative transition-colors duration-500"
        style={{ backgroundColor: config.colors.background }}
      >
          <Header 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen} 
            openAdmin={() => { setIsMenuOpen(false); setIsBuilderOpen(true); }}
            config={config}
          />

          {/* 1. Welcome / Landing Section */}
          <WelcomeSection config={config} />

          {/* 2. Menu Section */}
          <div id="menu" className="bg-gradient-to-b from-transparent via-white to-transparent py-10 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] -mt-10 relative z-10">
            <div className="text-center px-4 mb-4">
              <h2 className="text-4xl font-bold text-[#D84315] brand-font mb-4 drop-shadow-sm">Our Menu</h2>
              <div className="max-w-md mx-auto">
                <p className="text-gray-600 text-sm leading-relaxed mb-2">
                  Handcrafted with love, served with passion. Every dish tells a delicious story! 🍔✨
                </p>
              </div>
            </div>

            {/* Category Tabs - Static Wrapper (Not Sticky) */}
            <div className="py-3 mb-6">
              <CategoryTabs 
                categories={categories}
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
              />
            </div>

            {/* Menu Grid */}
            <div className="container mx-auto px-4 flex-grow max-w-5xl min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedItems.length > 0 ? (
                  displayedItems.map(item => (
                    <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-gray-400 italic">
                    No items in this category yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Food Gallery (Visual Lists) */}
          <FoodGallery config={config} />

          {/* 4. Order & Contact Card */}
          <ContactSection config={config} />

          {/* 5. Find Us Here (Map) */}
          <LocationSection />

          {/* 6. About Us (Saima & Akram Story) */}
          <AboutSection />

          {/* 7. Values / Community Section (Vertical Stack) */}
          <ValuesSection />

          {/* 8. Dark Footer with Admin Lock Trigger */}
          <Footer onOpenAdmin={() => setIsBuilderOpen(true)} />

          {/* Floating Action Button for Cart (Mobile) */}
          {totalItemsInCart > 0 && (
            <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="pointer-events-auto bg-brand-dark text-white w-full max-w-md rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-4 hover:scale-[1.02] transition-transform"
                >
                    <div className="flex flex-col text-left">
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{totalItemsInCart} Items added</span>
                        <span className="font-bold text-lg text-white">View Cart</span>
                    </div>
                    <div 
                        className="p-3 rounded-xl shadow-lg shadow-red-900/20"
                        style={{ background: `linear-gradient(to right, ${config.colors.primary}, ${config.colors.secondary})` }}
                    >
                        <ShoppingBag fill="white" size={20} />
                    </div>
                </button>
            </div>
          )}
      </div>

      {/* Overlays */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        updateQuantity={updateQuantity}
        clearCart={clearCart}
      />
      
      {/* The Original Menu Manager (Triggered from Builder) - STILL A MODAL */}
      <AdminPanel 
        isOpen={isMenuManagerOpen} 
        onClose={() => setIsMenuManagerOpen(false)} 
        menuItems={menuItems}
        setMenuItems={setMenuItems}
        categories={categories}
        setCategories={setCategories}
      />
    </div>
  );
}

export default App;
