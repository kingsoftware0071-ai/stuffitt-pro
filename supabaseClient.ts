
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './constants';

// Helper to get keys from browser storage (Dynamic Setup)
const getStoredKeys = () => {
  try {
    const stored = localStorage.getItem('stuffitt_supabase_keys');
    if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.url && parsed.key) return parsed;
    }
  } catch (e) {
    console.error("Error parsing stored keys", e);
  }
  return null;
};

const stored = getStoredKeys();

// Priority: 1. Constants (Hardcoded/Deployed keys) -> 2. LocalStorage (Manual override)
const projectUrl = SUPABASE_CONFIG.url || stored?.url;
const projectKey = SUPABASE_CONFIG.key || stored?.key;

// Initialize Supabase client ONLY if valid configuration is present
export const supabase = (projectUrl && projectKey && projectUrl.startsWith('http')) 
  ? createClient(projectUrl, projectKey) 
  : null;

export const isDatabaseConnected = () => {
  return !!supabase;
};

export const saveKeysToStorage = (url: string, key: string) => {
    localStorage.setItem('stuffitt_supabase_keys', JSON.stringify({ url, key }));
    window.location.reload(); // Reload to initialize client with new keys
};

export const removeKeysFromStorage = () => {
    localStorage.removeItem('stuffitt_supabase_keys');
    window.location.reload();
};
