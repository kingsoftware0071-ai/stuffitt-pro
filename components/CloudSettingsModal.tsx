
import React, { useState } from 'react';
import { Cloud, Check, AlertTriangle, X, Database, Copy } from 'lucide-react';
import { saveKeysToStorage, removeKeysFromStorage, isDatabaseConnected } from '../supabaseClient';

interface CloudSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloudSettingsModal: React.FC<CloudSettingsModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [showSql, setShowSql] = useState(false);
  
  const isConnected = isDatabaseConnected();

  if (!isOpen) return null;

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !key) {
        alert("Please enter both URL and API Key");
        return;
    }
    // Trim whitespace to prevent common copy-paste errors
    saveKeysToStorage(url.trim(), key.trim());
  };

  const handleDisconnect = () => {
      if(window.confirm("Are you sure? This will switch back to Local Mode and you won't see cloud data.")) {
          removeKeysFromStorage();
      }
  };

  const SQL_COMMAND = `
create table if not exists app_data (
  key text primary key,
  value jsonb not null
);
alter table app_data enable row level security;
create policy "Public Access" on app_data for all using (true) with check (true);

-- Function to handle upserts safely
create or replace function upsert_app_data(k text, v jsonb)
returns void as $$
begin
  insert into app_data (key, value) values (k, v)
  on conflict (key) do update set value = v;
end;
$$ language plpgsql;

insert into app_data (key, value) values 
  ('config', '{}'), 
  ('menu', '[]'), 
  ('categories', '[]')
on conflict (key) do nothing;
  `.trim();

  const copySql = () => {
      navigator.clipboard.writeText(SQL_COMMAND);
      alert("SQL Copied! Run this in Supabase SQL Editor.");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-gray-900 p-6 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    <Cloud size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Cloud Sync</h2>
                    <p className="text-xs opacity-70">{isConnected ? 'Connected to Database' : 'Currently in Local Mode'}</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto">
            
            {isConnected ? (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">You are Live!</h3>
                    <p className="text-gray-500 text-sm mb-8">Changes made in the Admin Panel will now appear on all devices instantly.</p>
                    
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-xs text-blue-800 mb-6 text-left">
                        <strong>Note:</strong> To ensure your <b>customers</b> also see these changes, they must access the site via the URL that has these keys embedded, OR you must add these keys to the <code>constants.ts</code> file before deploying.
                    </div>

                    <button onClick={handleDisconnect} className="text-red-500 text-sm hover:underline">
                        Disconnect Database
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
                        <AlertTriangle className="text-orange-500 shrink-0" size={20} />
                        <div className="text-sm text-orange-800">
                            <p className="font-bold mb-1">Why do I need this?</p>
                            To see your changes on mobile, tablet, and other customers' devices, you must connect a free database.
                        </div>
                    </div>

                    <form onSubmit={handleConnect} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Supabase Project URL</label>
                            <input 
                                required
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                placeholder="https://xyz.supabase.co"
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 outline-none font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">API Key (public/anon)</label>
                            <input 
                                required
                                value={key}
                                onChange={e => setKey(e.target.value)}
                                placeholder="eyJhbGciOiJIUzI1Ni..."
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 outline-none font-mono"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95">
                            Connect & Reload
                        </button>
                    </form>

                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between mb-2">
                             <button onClick={() => setShowSql(!showSql)} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800">
                                <Database size={14} /> {showSql ? 'Hide' : 'Show'} Database Setup Command
                            </button>
                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wide">Required Step</span>
                        </div>
                        
                        {showSql && (
                            <div className="relative animate-in slide-in-from-top-2 fade-in">
                                <pre className="bg-gray-900 text-gray-300 p-3 rounded-lg text-[10px] overflow-x-auto custom-scrollbar font-mono border border-gray-700">
                                    {SQL_COMMAND}
                                </pre>
                                <button onClick={copySql} className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white p-1.5 rounded transition-colors">
                                    <Copy size={14} />
                                </button>
                            </div>
                        )}
                        <p className="text-[10px] text-gray-400 mt-2">
                            1. Create free project at <a href="https://supabase.com" target="_blank" className="text-blue-500 underline">supabase.com</a><br/>
                            2. Copy URL & Key from Settings {'>'} API<br/>
                            3. Go to <b>SQL Editor</b> in Supabase, paste the command above, and click RUN.
                        </p>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default CloudSettingsModal;
