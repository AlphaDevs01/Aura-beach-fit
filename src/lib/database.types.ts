export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          image: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          image: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          image?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          original_price: number | null
          category_id: string
          sizes: string[]
          colors: string[]
          images: string[]
          is_new: boolean
          is_best_seller: boolean
          in_stock: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          original_price?: number | null
          category_id: string
          sizes?: string[]
          colors?: string[]
          images?: string[]
          is_new?: boolean
          is_best_seller?: boolean
          in_stock?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          original_price?: number | null
          category_id?: string
          sizes?: string[]
          colors?: string[]
          images?: string[]
          is_new?: boolean
          is_best_seller?: boolean
          in_stock?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      whatsapp_interactions: {
        Row: {
          id: string
          product_id: string
          product_name: string
          user_agent: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          product_name: string
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          product_name?: string
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          created_at?: string
        }
      }
    }
  }
}