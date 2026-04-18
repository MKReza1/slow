import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveWishlist } from '../firebase/db';

export const useShopStore = create(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      addToCart: (item) => {
        const cart = [...get().cart];
        const existing = cart.find((c) => c.id === item.id);
        if (existing) existing.qty += 1;
        else cart.push({ ...item, qty: 1 });
        set({ cart });
      },
      updateQty: (id, qty) =>
        set({ cart: get().cart.map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item)) }),
      removeFromCart: (id) => set({ cart: get().cart.filter((item) => item.id !== id) }),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: async (productId, userId) => {
        const exists = get().wishlist.includes(productId);
        const wishlist = exists
          ? get().wishlist.filter((id) => id !== productId)
          : [...get().wishlist, productId];
        set({ wishlist });
        if (userId) await saveWishlist(userId, wishlist);
      }
    }),
    { name: 'fan-merch-store' }
  )
);
