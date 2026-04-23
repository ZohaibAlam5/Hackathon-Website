"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

type Item = {
  productId: string;
  name: string;
  price: number;
  image: string | null;
};

export function ProductActions({ product }: { product: Item }) {
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const addToCart = useCart((s) => s.add);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const isWished = useWishlist((s) =>
    s.items.some((i) => i.productId === product.productId),
  );

  const inc = () => setQty((q) => Math.min(99, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="inline-flex h-12 items-center rounded-full border border-border bg-card/40 px-2">
        <button
          aria-label="Decrease quantity"
          onClick={dec}
          className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
        >
          <Minus className="h-4 w-4" />
        </button>
        <m.span
          key={qty}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          className="w-10 text-center text-sm font-semibold tabular-nums"
        >
          {qty}
        </m.span>
        <button
          aria-label="Increase quantity"
          onClick={inc}
          className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Button
        size="lg"
        onClick={() => {
          addToCart({ ...product, quantity: qty });
          toast(`Added ${qty} × ${product.name} to cart`, "success");
        }}
      >
        <ShoppingBag className="h-4 w-4" />
        Add to cart
      </Button>

      <Button
        size="lg"
        variant="outline"
        onClick={() => {
          addToCart({ ...product, quantity: qty });
          router.push("/checkout");
        }}
      >
        <Sparkles className="h-4 w-4" />
        Buy now
      </Button>

      <button
        aria-label="Toggle wishlist"
        onClick={() => {
          const added = toggleWishlist({
            productId: product.productId,
            name: product.name,
            price: product.price,
            image: product.image,
          });
          toast(
            added ? "Added to wishlist" : "Removed from wishlist",
            added ? "success" : "info",
          );
        }}
        className={cn(
          "grid h-12 w-12 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/60 hover:text-foreground",
          isWished &&
            "border-rose-400/60 text-rose-300 shadow-[0_0_22px_-4px_rgba(244,63,94,0.5)]",
        )}
      >
        <Heart className={cn("h-5 w-5", isWished && "fill-current")} />
      </button>
    </div>
  );
}
