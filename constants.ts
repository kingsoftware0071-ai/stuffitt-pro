
import { MenuItem, RestaurantConfig } from './types';

export const ADMIN_CREDENTIALS = {
  email: 'Sahilraza223311@gmail.com',
  password: 'Sahilraza223311@gmail.com'
};

// --- DATABASE CONFIGURATION ---
// Connected to: gzqeosfojykmmcjavknd.supabase.co
export const SUPABASE_CONFIG = {
  url: 'https://gzqeosfojykmmcjavknd.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6cWVvc2ZvanlrbW1jamF2a25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MzY5MDksImV4cCI6MjA3OTQxMjkwOX0.qcVBT0AgzCIiYRzhS_udOgvzg6dr_w9cHedYhuKZqBk'
};

export const DEFAULT_CONFIG: RestaurantConfig = {
  colors: {
    primary: '#FFA500',
    secondary: '#E53935',
    background: '#FFFAF5',
  },
  contact: {
    phone: '+91 98765 43210',
    email: 'hello@stuffitt.com',
    address: '123 Food Street, Gourmet Plaza, City 400001',
    whatsapp: '919876543210',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.792539393723!2d72.8773928!3d19.0728174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c88e722c4a03%3A0x95e938324396122d!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1708600000000!5m2!1sen!2sin'
  },
  text: {
    welcomeTitle: 'Welcome to STUFFITT',
    welcomeSubtitle: 'Stuff It. Snap It. Share It.',
    welcomeDescription: 'Indulge in our handcrafted burgers, crispy sliders, and golden fries. Every bite is a celebration of flavor, made with passion and served with love! 🎉',
    aboutTitle: 'About Us',
    aboutSubtitle: 'Our story, our passion, our commitment to great food! ❤️',
    aboutDescription: "We're passionate about handcrafted food that brings people together. At STUFFITT, every burger, slider, and fry is made with love, using the finest ingredients and time-tested recipes.\n\nOur journey started with a simple dream: to create a place where great food meets great memories. Today, we're proud to serve our community with dishes that make every meal special. 🍔✨",
    contactTitle: 'Order & Contact',
    contactSubtitle: "Ready to satisfy your cravings? Let's connect! 🎉",
    footerDescription: 'Handcrafted burgers, sliders, and fries made with passion.'
  },
  images: {
    logo: '', // Empty means use default text logo
    hero: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    gallery: [
        'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1630384060421-a4323ceca0df?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1614597182159-8d897b112276?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80'
    ],
    aboutLogo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Default placeholder icon
    footerLogo: '',
    mapImage: '' 
  },
  fonts: {
    heading: 'Playfair Display',
    body: 'Poppins'
  }
};

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Crispy Chicken Sliders',
    description: 'Set of 3 mini burgers with crispy chicken patty',
    price: 180,
    category: 'starters',
    imageUrl: 'https://picsum.photos/seed/sliders/400/300',
    isVeg: false,
    visible: true
  },
  {
    id: '2',
    name: 'Tandoori Paneer Sliders',
    description: 'Spiced paneer chunks in mini buns',
    price: 160,
    category: 'starters',
    imageUrl: 'https://picsum.photos/seed/paneer/400/300',
    isVeg: true,
    visible: true
  },
  {
    id: '3',
    name: 'Classic French Fries',
    description: 'Perfectly salted golden fries',
    price: 79,
    category: 'fries',
    imageUrl: 'https://picsum.photos/seed/fries/400/300',
    isVeg: true,
    visible: true
  },
  {
    id: '4',
    name: 'Peri Peri Loaded Fries',
    description: 'Fries topped with spicy peri peri sauce and cheese',
    price: 149,
    category: 'fries',
    imageUrl: 'https://picsum.photos/seed/perifries/400/300',
    isVeg: true,
    visible: true
  },
  {
    id: '5',
    name: 'Veggie Delight',
    description: 'Fresh veggies with special sauce',
    price: 149,
    category: 'veg-burgers',
    imageUrl: 'https://picsum.photos/seed/vegburger/400/300',
    isVeg: true,
    visible: true
  },
  {
    id: '6',
    name: 'Spicy Aloo Tikki',
    description: 'Indian spiced potato patty with mint mayo',
    price: 129,
    category: 'veg-burgers',
    imageUrl: 'https://picsum.photos/seed/alootikki/400/300',
    isVeg: true,
    visible: true
  },
  {
    id: '7',
    name: 'Classic Chicken Burger',
    description: 'Juicy chicken patty perfection',
    price: 199,
    category: 'non-veg-burgers',
    imageUrl: 'https://picsum.photos/seed/chickenburger/400/300',
    isVeg: false,
    visible: true
  },
  {
    id: '8',
    name: 'Chicken Wings',
    description: 'Crispy wings with tangy sauce',
    price: 199,
    category: 'starters',
    imageUrl: 'https://picsum.photos/seed/wings/400/300',
    isVeg: false,
    visible: true
  }
];
