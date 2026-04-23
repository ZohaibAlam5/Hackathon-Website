"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, cartSelectors } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { toast } from "@/components/ui/toaster";

const SHIPPING_FLAT = 9.99;
const FREE_SHIPPING_OVER = 99;

export default function CartPage() {
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart(cartSelectors.subtotal);
  const shipping = subtotal === 0
    ? 0
    : subtotal >= FREE_SHIPPING_OVER
    ? 0
    : SHIPPING_FLAT;
  const total = subtotal + shipping;
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_OVER - subtotal);

  return (
    <>
      <PageHero
        eyebrow="Your bag"
        title="Cart"
        description="Review and tweak before you check out."
      />
      <div className="container-page py-10">
        {!hydrated ? (
          <div className="grid min-h-[40dvh] place-items-center text-muted-foreground">
            Loading…
          </div>
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
            <div className="glass rounded-2xl p-2 sm:p-4">
              <ul>
                <AnimatePresence>
                  {items.map((item) => (
                    <m.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40, height: 0, padding: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-4 border-b border-border/40 p-3 last:border-0 sm:p-4"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary/30 sm:h-24 sm:w-24">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/shop/${item.productId}`}
                          className="line-clamp-2 text-sm font-semibold transition hover:text-primary sm:text-base"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </p>
                        <div className="mt-3 inline-flex h-9 items-center rounded-full border border-border bg-card/40 px-1.5">
                          <button
                            aria-label="Decrease"
                            onClick={() =>
                              setQuantity(item.productId, item.quantity - 1)
                            }
                            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            aria-label="Increase"
                            onClick={() =>
                              setQuantity(item.productId, item.quantity + 1)
                            }
                            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-semibold tabular-nums">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          aria-label="Remove item"
                          onClick={() => {
                            remove(item.productId);
                            toast(`Removed ${item.name}`, "info");
                          }}
                          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </m.li>
                  ))}
                </AnimatePresence>
              </ul>
              <div className="flex justify-between border-t border-border/40 p-4">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/shop">Continue shopping</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clear();
                    toast("Cart cleared", "info");
                  }}
                >
                  <Trash2 className="h-4 w-4" /> Clear cart
                </Button>
              </div>
            </div>

            <aside className="glass rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold">Order summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                <Row
                  label="Shipping"
                  value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                />
                {remainingForFreeShip > 0 && (
                  <p className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-foreground/80">
                    Add ${remainingForFreeShip.toFixed(2)} more for free shipping.
                  </p>
                )}
                <div className="my-3 h-px bg-border/60" />
                <Row
                  label="Total"
                  value={`$${total.toFixed(2)}`}
                  emphasis
                />
              </dl>

              <Button asChild size="lg" className="mt-6 w-full">
                <Link href="/checkout">
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Sign in at checkout to sync your cart across devices.
              </p>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={
        emphasis
          ? "flex items-baseline justify-between text-base font-bold"
          : "flex items-baseline justify-between text-muted-foreground"
      }
    >
      <dt>{label}</dt>
      <dd
        className={
          emphasis ? "tabular-nums text-foreground" : "tabular-nums text-foreground"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-border/60 bg-card/30 p-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30">
        <ShoppingBag className="h-7 w-7 text-foreground" />
      </div>
      <h2 className="mt-5 font-display text-2xl font-bold">Your cart is empty</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Looks like you haven&apos;t added anything yet. Explore the collection and
        find pieces that speak to your space.
      </p>
      <Button asChild className="mt-6">
        <Link href="/shop">
          Browse the shop <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
