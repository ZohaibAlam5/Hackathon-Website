"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-store";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { toast } from "@/components/ui/toaster";

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);
  const hydrated = useWishlist((s) => s.hydrated);
  const remove = useWishlist((s) => s.remove);
  const clear = useWishlist((s) => s.clear);
  const addToCart = useCart((s) => s.add);

  return (
    <>
      <PageHero
        eyebrow="Saved for later"
        title="Wishlist"
        description="The pieces that caught your eye — keep them ready for when the time is right."
      />
      <div className="container-page py-10">
        {!hydrated ? (
          <div className="grid min-h-[40dvh] place-items-center text-muted-foreground">
            Loading…
          </div>
        ) : items.length === 0 ? (
          <Empty />
        ) : (
          <>
            <div className="flex justify-end pb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clear();
                  toast("Wishlist cleared", "info");
                }}
              >
                <Trash2 className="h-4 w-4" /> Clear all
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {items.map((item) => (
                  <m.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="glass flex gap-4 rounded-2xl p-4"
                  >
                    <Link
                      href={`/shop/${item.productId}`}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary/30"
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      )}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        href={`/shop/${item.productId}`}
                        className="line-clamp-2 text-sm font-semibold transition hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-base font-bold tabular-nums">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="mt-auto flex flex-wrap gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            addToCart({
                              productId: item.productId,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                            });
                            toast(`Added ${item.name} to cart`, "success");
                          }}
                        >
                          <ShoppingBag className="h-4 w-4" /> Move to cart
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            remove(item.productId);
                            toast("Removed from wishlist", "info");
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </m.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Empty() {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-border/60 bg-card/30 p-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose-400/30 to-pink-500/30">
        <Heart className="h-7 w-7 text-rose-300" />
      </div>
      <h2 className="mt-5 font-display text-2xl font-bold">No saved pieces yet</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Tap the heart on any product to save it here for later.
      </p>
      <Button asChild className="mt-6">
        <Link href="/shop">
          Browse the shop <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
