
import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, X } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../constants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for realism
    setTimeout(() => {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        onLoginSuccess();
        setEmail('');
        setPassword('');
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1e1e1e] p-8 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Admin Access</h2>
          <p className="text-gray-400 text-sm">Enter your credentials to edit the website</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-right text-xs text-gray-400 mt-2">Default: admin</p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LoginModal;
