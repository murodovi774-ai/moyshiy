import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/components/shared/ProductCard';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 999) }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { ...product, quantity: Math.min(quantity, product.stock || 999) }],
          };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              return { ...item, quantity: Math.max(1, Math.min(quantity, item.stock || 999)) };
            }
            return item;
          }),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getCartTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'moyshiy-cart-storage',
    }
  )
);
