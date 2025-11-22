
import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cartItems, updateQuantity, removeItem, clearCart }) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const t = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(t);
  }, [cartItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-brand-cream h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="bg-white p-4 shadow-sm flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-bold brand-font text-brand-dark flex items-center gap-2">
            <ShoppingBag className="text-brand-red" size={22} /> Your Order
          </h2>
          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
                <button 
                    onClick={() => {
                        if(window.confirm('Are you sure you want to clear your cart?')) {
                            clearCart();
                        }
                    }} 
                    className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full uppercase tracking-wide transition-colors"
                >
                    Clear Cart
                </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-brand-red transition-colors">
                <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-20 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <ShoppingBag size={32} />
              </div>
              <p className="text-lg font-medium text-gray-600">Your cart is empty.</p>
              <p className="text-sm text-gray-400 mt-1">Start adding some delicious burgers!</p>
              <button onClick={onClose} className="mt-6 text-brand-red font-bold hover:underline">
                  Browse Menu
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center relative group transition-all hover:shadow-md">
                
                {/* Remove Button (Top Right) */}
                <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 p-1.5 rounded-full shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Remove item"
                >
                    <X size={14} />
                </button>

                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 line-clamp-1 mb-1">{item.name}</h4>
                  <p className="text-brand-orange font-bold text-sm">₹{item.price * item.quantity}</p>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className={`p-1.5 rounded-md transition-colors ${item.quantity === 1 ? 'text-red-500 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                        </button>
                        <span className="font-bold w-6 text-center text-sm text-gray-800">{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="p-1.5 hover:bg-gray-200 rounded-md text-green-600 transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-brand-red brand-font">₹{total}</span>
            </div>
            <button 
              className="w-full bg-gradient-to-r from-[#FFA500] to-[#E53935] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              onClick={() => {
                  alert("Order placed successfully! Kitchen notified.");
                  clearCart();
                  onClose();
              }}
            >
              Place Order via WhatsApp
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-3">
                This is a demo. Orders are simulated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
