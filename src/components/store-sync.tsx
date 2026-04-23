"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";

/**
 * On login: merge any local guest cart/wishlist into the user's DB-backed
 * cart/wishlist, then load the merged list back into the local store.
 */
export function StoreSync() {
  const { data: session, isPending } = useSession();
  const userId = session?.user.id ?? null;
  const cartHydrated = useCart((s) => s.hydrated);
  const wishlistHydrated = useWishlist((s) => s.hydrated);
  const lastSyncedUser = useRef<string | null>(null);

  useEffect(() => {
    if (isPending || !cartHydrated || !wishlistHydrated) return;
    if (!userId) {
      lastSyncedUser.current = null;
      return;
    }
    if (lastSyncedUser.current === userId) return;
    lastSyncedUser.current = userId;

    const localCart = useCart.getState().items;
    const localWishlist = useWishlist.getState().items;

    (async () => {
      try {
        const cartRes = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: localCart, mode: "merge" }),
        });
        if (cartRes.ok) {
          const data = (await cartRes.json()) as {
            items: { id: string; productId: string; name: string; price: number; quantity: number; image: string | null }[];
          };
          useCart.getState().replace(data.items);
        }

        const wlRes = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: localWishlist, mode: "merge" }),
        });
        if (wlRes.ok) {
          const data = (await wlRes.json()) as {
            items: { id: string; productId: string; name: string; price: number; image: string | null }[];
          };
          useWishlist.getState().replace(data.items);
        }
      } catch {
        // network / offline — keep local state
      }
    })();
  }, [userId, isPending, cartHydrated, wishlistHydrated]);

  return null;
}
