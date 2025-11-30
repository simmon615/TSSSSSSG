// User & Assets
export interface User {
  id: string;
  phoneNumber: string;
  referrerId: string | null;
  mainBalance: number; // Top-up Balance (Cash)
  shoppingBalance: number; // Exchanged from Points
  pointBalance: number; // Reward Points
  address: string | null;
  coordinates: { lat: number; lng: number } | null;
}

// Product System
export interface Product {
  id: string;
  name: string;
  nameKm: string; // Khmer Name
  price: number;
  image: string;
  basisPoints: number; // Admin set basis points
  description: string;
  category: string;
}

// Order System
export type OrderStatus = 'Pending' | 'ToShip' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled';

export interface OrderItem {
  productId: string;
  quantity: number;
  productName: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: 'MainBalance' | 'ShoppingBalance';
  shippingAddress: string;
}

// Asset Requests
export type TopUpStatus = 'Pending' | 'Approved' | 'Rejected';

export interface TopUpRequest {
  id: string;
  amount: number;
  proofImage: string | null; // Base64 or URL
  status: TopUpStatus;
  date: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  details: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}