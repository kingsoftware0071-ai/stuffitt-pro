
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isVeg: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Category {
  id: string;
  label: string;
}

export interface RestaurantConfig {
  colors: {
    primary: string; // Orange
    secondary: string; // Red
    background: string; // Cream
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
  };
  text: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    welcomeDescription: string;
  };
  images: {
    logo: string; // URL or base64
    hero: string;
    gallery: string[]; // Array of image URLs
  }
}

export const CATEGORIES: Category[] = [
  { id: 'starters', label: 'Starters & Bites' },
  { id: 'fries', label: 'Fries' },
  { id: 'veg-burgers', label: 'Veg Burgers' },
  { id: 'non-veg-burgers', label: 'Non-Veg Burgers' },
];
