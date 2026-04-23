"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/sanity-queries";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  const addToCart = useCart((s) => s.add);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const isWished = useWishlist((s) =>
    s.items.some((i) => i.productId === product.ProductID),
  );

  const finalPrice = Math.max(
    0,
    Number(product.ProductPrice) - Number(product.ProductDiscount ?? 0),
  );
  const hasDiscount = Number(product.ProductDiscount ?? 0) > 0;
  const image = product.imageUrl;

  return (
    <m.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/50 backdrop-blur transition-shadow hover:shadow-[0_18px_60px_-20px_hsl(var(--primary)/0.4)]"
    >
      <Link
        href={`/shop/${product.ProductID}`}
        className="relative block aspect-square overflow-hidden bg-secondary/30"
      >
        {image ? (
          <Image
            src={image}
            alt={product.ProductName}
            fill
            sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        {product.ProductFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-background shadow-[0_0_18px_-4px_hsl(var(--primary)/0.7)]">
            Featured
          </span>
        )}
        {hasDiscount && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-[0_0_18px_-4px_rgba(244,63,94,0.7)]">
            -${Number(product.ProductDiscount).toFixed(0)}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.ProductCategory && (
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            {product.ProductCategory}
          </p>
        )}
        <Link
          href={`/shop/${product.ProductID}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors hover:text-primary"
        >
          {product.ProductName}
        </Link>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-lg font-bold text-foreground">
              ${finalPrice.toFixed(2)}
            </p>
            {hasDiscount && (
              <p className="text-xs text-muted-foreground line-through">
                ${Number(product.ProductPrice).toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex gap-1.5">
            <button
              aria-label="Add to wishlist"
              onClick={() => {
                const added = toggleWishlist({
                  productId: product.ProductID,
                  name: product.ProductName,
                  price: finalPrice,
                  image: image ?? null,
                });
                toast(
                  added ? "Added to wishlist" : "Removed from wishlist",
                  added ? "success" : "info",
                );
              }}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/60 hover:text-foreground",
                isWished &&
                  "border-rose-400/60 text-rose-300 shadow-[0_0_18px_-4px_rgba(244,63,94,0.5)]",
              )}
            >
              <Heart className={cn("h-4 w-4", isWished && "fill-current")} />
            </button>
            <button
              aria-label="Add to cart"
              onClick={() => {
                addToCart({
                  productId: product.ProductID,
                  name: product.ProductName,
                  price: finalPrice,
                  image: image ?? null,
                });
                toast(`Added ${product.ProductName} to cart`, "success");
              }}
              className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-background shadow-[0_0_18px_-4px_hsl(var(--primary)/0.6)] transition hover:scale-105"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </m.article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/40">
      <div className="aspect-square animate-pulse rounded-t-2xl bg-secondary/40" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-secondary/50" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-secondary/50" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-secondary/50" />
      </div>
    </div>
  );
}
