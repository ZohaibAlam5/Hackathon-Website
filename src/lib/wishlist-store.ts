"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string | null;
};

type WishlistState = {
  items: WishlistItem[];
  hydrated: boolean;
  toggle: (item: Omit<WishlistItem, "id">) => boolean;
  add: (item: Omit<WishlistItem, "id">) => void;
  remove: (productId: string) => void;
  clear: () => void;
  replace: (items: WishlistItem[]) => void;
  has: (productId: string) => boolean;
  setHydrated: (v: boolean) => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      toggle: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        if (exists) {
          set({
            items: get().items.filter((i) => i.productId !== item.productId),
          });
          return false;
        }
        set({
          items: [...get().items, { id: crypto.randomUUID(), ...item }],
        });
        return true;
      },
      add: (item) => {
        if (get().items.some((i) => i.productId === item.productId)) return;
        set({
          items: [...get().items, { id: crypto.randomUUID(), ...item }],
        });
      },
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      clear: () => set({ items: [] }),
      replace: (items) => set({ items }),
      has: (productId) => get().items.some((i) => i.productId === productId),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "hekto:wishlist",
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
