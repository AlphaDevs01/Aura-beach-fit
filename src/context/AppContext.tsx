import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, CartItem, AdminUser } from '../types';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  total_amount: number;
  delivery_fee: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  order_items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  size?: string;
  color?: string;
}

interface AppState {
  cart: CartItem[];
  favorites: Product[];
  user: AdminUser | null;
  isAdminMode: boolean;
  orders: Order[];
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string | { productId: string; size?: string; color?: string } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; size?: string; color?: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_FAVORITES'; payload: Product }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'SET_USER'; payload: AdminUser | null }
  | { type: 'TOGGLE_ADMIN_MODE' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: string } };

const initialState: AppState = {
  cart: [],
  favorites: [],
  user: null,
  isAdminMode: false,
  orders: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(
        item => item.product.id === action.payload.product.id
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };

    case 'REMOVE_FROM_CART':
      if (typeof action.payload === 'string') {
        return {
          ...state,
          cart: state.cart.filter(item => item.product.id !== action.payload),
        };
      } else {
        return {
          ...state,
          cart: state.cart.filter(item => 
            !(item.product.id === action.payload.productId &&
              item.size === action.payload.size &&
              item.color === action.payload.color)
          ),
        };
      }

    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId &&
          item.size === action.payload.size &&
          item.color === action.payload.color
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

    case 'ADD_TO_FAVORITES':
      const existingFavorite = state.favorites.find(item => item.id === action.payload.id);
      if (existingFavorite) {
        return state; // Não adicionar duplicatas
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(item => item.id !== action.payload),
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'TOGGLE_ADMIN_MODE':
      return {
        ...state,
        isAdminMode: !state.isAdminMode,
      };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };

    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload,
      };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status as any }
            : order
        ),
      };

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}