import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, ShippingAddress } from '../types';
import { products as initialProducts } from '../data/products';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  email: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: ShippingAddress;
  createdAt: string;
  estimatedDelivery: string;
}

interface AdminState {
  products: Product[];
  orders: AdminOrder[];
  lowStockThreshold: number;
  setLowStockThreshold: (n: number) => void;
  updateProductPrice: (id: string, price: number, salePrice?: number | null) => void;
  updateProductStock: (id: string, stock: number) => void;
  toggleProductFlag: (
    id: string,
    flag: 'featured' | 'bestseller' | 'newArrival'
  ) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updatePaymentStatus: (
    id: string,
    paymentStatus: AdminOrder['paymentStatus']
  ) => void;
  getStats: () => {
    totalProducts: number;
    totalOrders: number;
    revenue: number;
    pendingOrders: number;
    lowStock: number;
  };
}

const seedOrders: AdminOrder[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-8K2M9X',
    email: 'alex@example.com',
    items: [
      {
        productId: 'hd-001',
        name: 'Premium Black Hoodie',
        slug: 'premium-black-hoodie',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200',
        price: 98,
        colour: 'Black',
        size: 'L',
        quantity: 1,
        maxStock: 94,
      },
    ],
    subtotal: 98,
    shipping: 0,
    tax: 7.84,
    total: 105.84,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      firstName: 'Alex',
      lastName: 'Rivera',
      address1: '123 Main St',
      city: 'Brooklyn',
      state: 'NY',
      postalCode: '11201',
      country: 'United States',
    },
    createdAt: '2026-09-06T14:22:00Z',
    estimatedDelivery: '2026-09-12',
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-4P7Q1A',
    email: 'jordan@example.com',
    items: [
      {
        productId: 'ts-002',
        name: 'Classic White Tee',
        slug: 'classic-white-tee',
        image: 'https://images.unsplash.com/photo-1523381210783-3a18c4f1d2a3?w=200',
        price: 36,
        salePrice: 28,
        colour: 'White',
        size: 'M',
        quantity: 2,
        maxStock: 85,
      },
    ],
    subtotal: 56,
    shipping: 8,
    tax: 5.12,
    total: 69.12,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: {
      firstName: 'Jordan',
      lastName: 'Lee',
      address1: '456 Oak Ave',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'United States',
    },
    createdAt: '2026-09-05T09:10:00Z',
    estimatedDelivery: '2026-09-10',
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-9R3T2B',
    email: 'sam@example.com',
    items: [
      {
        productId: 'hd-002',
        name: 'Oversized Essential Hoodie',
        slug: 'oversized-essential-hoodie',
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200',
        price: 88,
        salePrice: 72,
        colour: 'Heather Grey',
        size: 'XL',
        quantity: 1,
        maxStock: 78,
      },
      {
        productId: 'ts-001',
        name: 'Essential Black Tee',
        slug: 'essential-black-tee',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
        price: 38,
        colour: 'Black',
        size: 'L',
        quantity: 1,
        maxStock: 120,
      },
    ],
    subtotal: 110,
    shipping: 0,
    tax: 8.8,
    total: 118.8,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: {
      firstName: 'Sam',
      lastName: 'Chen',
      address1: '789 Pine Rd',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'United States',
    },
    createdAt: '2026-09-08T11:45:00Z',
    estimatedDelivery: '2026-09-15',
  },
  {
    id: 'ord-004',
    orderNumber: 'ORD-2M8K5C',
    email: 'taylor@example.com',
    items: [
      {
        productId: 'hd-005',
        name: 'Heavyweight Logo Hoodie',
        slug: 'heavyweight-logo-hoodie',
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200',
        price: 105,
        colour: 'Black',
        size: 'M',
        quantity: 1,
        maxStock: 61,
      },
    ],
    subtotal: 105,
    shipping: 0,
    tax: 8.4,
    total: 113.4,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      firstName: 'Taylor',
      lastName: 'Brooks',
      address1: '321 Elm St',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'United States',
    },
    createdAt: '2026-08-28T16:30:00Z',
    estimatedDelivery: '2026-09-03',
  },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: structuredClone(initialProducts),
      orders: seedOrders,
      lowStockThreshold: 40,
      setLowStockThreshold: (n) => set({ lowStockThreshold: Math.max(1, n) }),

      updateProductPrice: (id, price, salePrice) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const next = { ...p, price };
            if (salePrice === null) {
              delete next.salePrice;
            } else if (salePrice !== undefined) {
              next.salePrice = salePrice;
            }
            return next;
          }),
        }));
      },

      updateProductStock: (id, stock) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, stock) } : p
          ),
        }));
      },

      toggleProductFlag: (id, flag) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, [flag]: !p[flag] } : p
          ),
        }));
      },

      addProduct: (product) => {
        set((state) => ({
          products: [product, ...state.products.filter((p) => p.id !== product.id)],
        }));
      },

      removeProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        }));
      },

      updatePaymentStatus: (id, paymentStatus) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, paymentStatus } : o
          ),
        }));
      },

      getStats: () => {
        const { products, orders } = get();
        const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
        return {
          totalProducts: products.length,
          totalOrders: orders.length,
          revenue: paidOrders.reduce((sum, o) => sum + o.total, 0),
          pendingOrders: orders.filter(
            (o) => o.status === 'pending' || o.status === 'processing'
          ).length,
          lowStock: products.filter((p) => p.stock < get().lowStockThreshold)
            .length,
        };
      },
    }),
    {
      name: 'noir-admin-v4',
      partialize: (state) => ({
        products: state.products,
        orders: state.orders,
        lowStockThreshold: state.lowStockThreshold,
      }),
    }
  )
);
