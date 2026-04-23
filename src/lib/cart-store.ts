"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

type CartState = {
  items: CartItem[];
  hydrated: boolean;
  add: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  replace: (items: CartItem[]) => void;
  setHydrated: (v: boolean) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      add: ({ productId, name, price, image, quantity = 1 }) => {
        const items = get().items.slice();
        const existing = items.find((i) => i.productId === productId);
        if (existing) {
          existing.quantity += quantity;
        } else {
          items.push({
            id: crypto.randomUUID(),
            productId,
            name,
            price,
            image,
            quantity,
          });
        }
        set({ items });
      },
      setQuantity: (productId, quantity) =>
        set({
          items: get()
            .items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.max(0, quantity) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        }),
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      clear: () => set({ items: [] }),
      replace: (items) => set({ items }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "hekto:cart",
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

export const cartSelectors = {
  count: (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0),
  subtotal: (s: CartState) =>
    s.items.reduce((n, i) => n + i.price * i.quantity, 0),
};
