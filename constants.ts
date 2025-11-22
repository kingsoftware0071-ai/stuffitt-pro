
import { MenuItem, RestaurantConfig } from './types';

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
    whatsapp: '919876543210'
  },
  text: {
    welcomeTitle: 'Welcome to STUFFITT',
    welcomeSubtitle: 'Stuff It. Snap It. Share It.',
    welcomeDescription: 'Indulge in our handcrafted burgers, crispy sliders, and golden fries. Every bite is a celebration of flavor, made with passion and served with love! 🎉'
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
    ]
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
  },
  {
    id: '2',
    name: 'Tandoori Paneer Sliders',
    description: 'Spiced paneer chunks in mini buns',
    price: 160,
    category: 'starters',
    imageUrl: 'https://picsum.photos/seed/paneer/400/300',
    isVeg: true,
  },
  {
    id: '3',
    name: 'Classic French Fries',
    description: 'Perfectly salted golden fries',
    price: 79,
    category: 'fries',
    imageUrl: 'https://picsum.photos/seed/fries/400/300',
    isVeg: true,
  },
  {
    id: '4',
    name: 'Peri Peri Loaded Fries',
    description: 'Fries topped with spicy peri peri sauce and cheese',
    price: 149,
    category: 'fries',
    imageUrl: 'https://picsum.photos/seed/perifries/400/300',
    isVeg: true,
  },
  {
    id: '5',
    name: 'Veggie Delight',
    description: 'Fresh veggies with special sauce',
    price: 149,
    category: 'veg-burgers',
    imageUrl: 'https://picsum.photos/seed/vegburger/400/300',
    isVeg: true,
  },
  {
    id: '6',
    name: 'Spicy Aloo Tikki',
    description: 'Indian spiced potato patty with mint mayo',
    price: 129,
    category: 'veg-burgers',
    imageUrl: 'https://picsum.photos/seed/alootikki/400/300',
    isVeg: true,
  },
  {
    id: '7',
    name: 'Classic Chicken Burger',
    description: 'Juicy chicken patty perfection',
    price: 199,
    category: 'non-veg-burgers',
    imageUrl: 'https://picsum.photos/seed/chickenburger/400/300',
    isVeg: false,
  },
  {
    id: '8',
    name: 'Chicken Wings',
    description: 'Crispy wings with tangy sauce',
    price: 199,
    category: 'starters',
    imageUrl: 'https://picsum.photos/seed/wings/400/300',
    isVeg: false,
  }
];
