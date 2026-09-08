export type ProductCategory = 'tshirt' | 'hoodie';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  colours: string[];
  sizes: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  tags?: string[];
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  salePrice?: number;
  colour: string;
  size: string;
  quantity: number;
  maxStock: number;
}

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  salePrice?: number;
  category: ProductCategory;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery: string;
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'best-selling'
  | 'highest-rated';

export interface ProductFilters {
  category?: ProductCategory | 'all';
  sizes?: string[];
  colours?: string[];
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
  search?: string;
}
