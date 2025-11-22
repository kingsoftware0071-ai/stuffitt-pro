import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cartItems, updateQuantity, clearCart }) => {
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
        
        <div className="bg-white p-4 shadow-sm flex justify-between items-center">
          <h2 className="text-xl font-bold brand-font text-brand-dark flex items-center gap-2">
            <ShoppingBag className="text-brand-red" /> Your Order
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p>Your cart is empty.</p>
              <p className="text-sm">Start adding some delicious burgers!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="font-semibold text-brand-dark line-clamp-1">{item.name}</h4>
                  <p className="text-brand-red font-bold text-sm">₹{item.price * item.quantity}</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-200 rounded text-brand-red">
                    <Minus size={16} />
                  </button>
                  <span className="font-medium w-4 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-200 rounded text-green-600">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-4 text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-brand-red">₹{total}</span>
            </div>
            <button 
              className="w-full bg-gradient-to-r from-[#FFA500] to-[#E53935] text-white py-3.5 rounded-full font-bold shadow-lg active:scale-95 transition-transform mb-3"
              onClick={() => {
                  alert("Order placed successfully! Kitchen notified.");
                  clearCart();
                  onClose();
              }}
            >
              Place Order via WhatsApp
            </button>
            <p className="text-xs text-center text-gray-400">
                This is a demo. Orders are simulated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;