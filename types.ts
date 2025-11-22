
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isVeg: boolean;
  visible?: boolean; // New: Control visibility
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Category {
  id: string;
  label: string;
  visible?: boolean; // New: Control visibility
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
    instagram?: string;
    facebook?: string;
    mapEmbedUrl?: string; // New: Google Maps Embed URL
  };
  text: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    welcomeDescription: string;
    aboutTitle: string;
    aboutSubtitle: string;
    aboutDescription: string; // Combined paragraphs
    contactTitle: string;
    contactSubtitle: string;
    footerDescription?: string; // New: Footer text
  };
  images: {
    logo: string; // URL or base64
    hero: string;
    gallery: string[]; // Array of image URLs
    aboutLogo: string; // Logo in About Section
    footerLogo?: string; // Logo in Footer Section
    mapImage?: string; // DEPRECATED: Kept for types but unused in UI
  };
  fonts?: {
    heading: string;
    body: string;
  };
}

export const CATEGORIES: Category[] = [
  { id: 'starters', label: 'Starters & Bites', visible: true },
  { id: 'fries', label: 'Fries', visible: true },
  { id: 'veg-burgers', label: 'Veg Burgers', visible: true },
  { id: 'non-veg-burgers', label: 'Non-Veg Burgers', visible: true },
];