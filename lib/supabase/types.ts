export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'admin' | 'manager' | 'cashier'
          store_id: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role: 'admin' | 'manager' | 'cashier'
          store_id?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'admin' | 'manager' | 'cashier'
          store_id?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          sku: string | null
          category_id: string | null
          base_price: number
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          sku?: string | null
          category_id?: string | null
          base_price: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          sku?: string | null
          category_id?: string | null
          base_price?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          store_id: string
          product_id: string
          quantity: number
          min_quantity: number
          max_quantity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          product_id: string
          quantity?: number
          min_quantity?: number
          max_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          product_id?: string
          quantity?: number
          min_quantity?: number
          max_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          store_id: string
          cashier_id: string
          status: 'pending' | 'completed' | 'cancelled' | 'refunded'
          total_amount: number
          payment_method: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          cashier_id: string
          status: 'pending' | 'completed' | 'cancelled' | 'refunded'
          total_amount: number
          payment_method: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          cashier_id?: string
          status?: 'pending' | 'completed' | 'cancelled' | 'refunded'
          total_amount?: number
          payment_method?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      inventory_transactions: {
        Row: {
          id: string
          store_id: string
          product_id: string
          type: 'receive' | 'sale' | 'adjustment' | 'transfer'
          quantity: number
          reference_id: string | null
          notes: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          product_id: string
          type: 'receive' | 'sale' | 'adjustment' | 'transfer'
          quantity: number
          reference_id?: string | null
          notes?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          product_id?: string
          type?: 'receive' | 'sale' | 'adjustment' | 'transfer'
          quantity?: number
          reference_id?: string | null
          notes?: string | null
          created_by?: string
          created_at?: string
        }
      }
    }
  }
}