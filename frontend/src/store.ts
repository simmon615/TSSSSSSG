import { create } from 'zustand';
import { User, Product, Order, OrderItem, TopUpRequest, Address } from './types';
import { MOCK_PRODUCTS } from './constants';

interface AppState {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  login: (phoneNumber: string, referrerId: string) => void;
  logout: () => void;
  
  // Product State
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart State
  cart: OrderItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Order & Assets State
  orders: Order[];
  topUpRequests: TopUpRequest[];
  placeOrder: (method: 'MainBalance' | 'ShoppingBalance', address: Address) => Promise<boolean>;
  requestTopUp: (amount: number, proof: string) => void;
  confirmReceipt: (orderId: string) => void;
  
  // Address State
  addresses: Address[];
  addAddress: (address: Address) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial Mock Data
  // TODO: Replace with real GraphQL calls to Backend
  user: null,
  isAuthenticated: false,
  products: MOCK_PRODUCTS,
  searchQuery: '',
  cart: [],
  orders: [],
  topUpRequests: [],
  addresses: [],

  // User Actions
  login: (phoneNumber, referrerId) => {
    set({
      isAuthenticated: true,
      user: {
        id: 'u1',
        phoneNumber,
        referrerId,
        mainBalance: 0.00, // Initial Demo Balance
        shoppingBalance: 0.00,
        pointBalance: 0,
        address: null,
        coordinates: null,
      }
    });
  },

  logout: () => set({ user: null, isAuthenticated: false, cart: [] }),

  // Product Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Cart Actions
  addToCart: (product, quantity) => {
    set((state) => {
      const existing = state.cart.find(i => i.productId === product.id);
      if (existing) {
        return {
          cart: state.cart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i)
        };
      }
      return {
        cart: [...state.cart, { 
          productId: product.id, 
          quantity, 
          productName: product.name, 
          price: product.price, 
          image: product.image 
        }]
      };
    });
  },
  
  removeFromCart: (id) => set(state => ({ cart: state.cart.filter(i => i.productId !== id) })),
  
  updateCartQuantity: (id, q) => set(state => ({
    cart: state.cart.map(i => i.productId === id ? { ...i, quantity: Math.max(1, q) } : i)
  })),

  clearCart: () => set({ cart: [] }),

  // Order & Asset Actions
  placeOrder: async (method, address) => {
    const state = get();
    if (!state.user) return false;

    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Check Balance (Mutually Exclusive Logic)
    if (method === 'MainBalance' && state.user.mainBalance < total) {
      alert("Insufficient Main Balance. Please Top-up.");
      return false;
    }
    if (method === 'ShoppingBalance' && state.user.shoppingBalance < total) {
      alert("Insufficient Shopping Balance. Exchange points or use Main Balance.");
      return false;
    }

    // Deduct Balance
    const updatedUser = { ...state.user };
    if (method === 'MainBalance') updatedUser.mainBalance -= total;
    else updatedUser.shoppingBalance -= total;

    // Create Order
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [...state.cart],
      totalAmount: total,
      status: 'ToShip',
      createdAt: new Date().toISOString(),
      paymentMethod: method,
      shippingAddress: address.details
    };

    set({
      user: updatedUser,
      orders: [newOrder, ...state.orders],
      cart: []
    });

    return true;
  },

  requestTopUp: (amount, proof) => {
    set(state => ({
      topUpRequests: [
        {
          id: `TR-${Date.now()}`,
          amount,
          proofImage: proof,
          status: 'Pending',
          date: new Date().toISOString()
        },
        ...state.topUpRequests
      ]
    }));
  },

  confirmReceipt: (orderId) => {
    set(state => ({
      orders: state.orders.map(o => o.id === orderId ? { ...o, status: 'Completed' } : o)
    }));
  },

  addAddress: (addr) => set(state => ({ addresses: [...state.addresses, addr] }))

}));
