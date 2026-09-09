export type ProductCategory = 'tshirt' | 'hoodie' | 'print3d';

export interface FilamentOption {
  name: string;
  hex: string;
  finish?: string;
}

export interface PrintSpecs {
  material: string;
  layerHeight: string;
  infill: string;
  dimensions: string;
  printTimeHours: number;
  weightGrams?: number;
  eco?: boolean;
}


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
  /** 3D Lab only */
  filaments?: FilamentOption[];
  printSpecs?: PrintSpecs;
  bundleWith?: string[]; // product ids
  modelType?: 'sculpture' | 'planter' | 'hub' | 'stand' | 'mask' | 'generic';
}

export interface PhotoReview extends Review {
  photoUrl?: string;
}

export interface CompareItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  salePrice?: number;
  category: ProductCategory;
  printSpecs?: PrintSpecs;
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
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'best-selling'
  | 'highest-rated'
  | 'discount'
  | 'featured';
  
export interface ProductFilters {
  category?: ProductCategory | 'all';
  sizes?: string[];
  colours?: string[];
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
  search?: string;
}
