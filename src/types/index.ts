import { Database } from '../lib/database.types';

export type Category = Database['public']['Tables']['categories']['Row'] & {
  productCount?: number;
};

export type Product = Database['public']['Tables']['products']['Row'] & {
  category?: Category;
};

export type WhatsAppInteraction = Database['public']['Tables']['whatsapp_interactions']['Row'];

export type AdminUser = Database['public']['Tables']['admin_users']['Row'];


export interface CartItem {
  product: Product;
  size?: string;
  color?: string;
  quantity: number;
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string | { productId: string; size?: string; color?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_FAVORITES'; payload: Product }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'SET_USER'; payload: AdminUser | null }
  | { type: 'TOGGLE_ADMIN_MODE' };