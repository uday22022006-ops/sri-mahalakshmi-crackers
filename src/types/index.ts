export interface Product {
  id: number;
  name: string;
  category: string;
  image: string | null;
  description: string;

  price: number;
  original_price: number;
  stock: number;

  // Optional UI Fields
  badge?: string;
  badgeColor?: string;

  discount?: number;

  rating?: number;
  reviews?: number;

  discountPrice?: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
  itemCount: number;
  gradient: string;
  image: string;
}

export interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  verified: boolean;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  href: string;
}
