import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHero } from "@/components/ui/page-hero";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Package, ShoppingBag } from "lucide-react";

type DbOrderRow = {
  id: string;
  items_json: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  created_at: number;
};

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string | null;
};

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/login?next=/account");
  }

  const rows = db
    .prepare(
      `SELECT id, items_json, subtotal, shipping, total, status, created_at
       FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    )
    .all(session.user.id) as DbOrderRow[];

  const orders = rows.map((r) => ({
    id: r.id,
    items: JSON.parse(r.items_json) as OrderItem[],
    subtotal: r.subtotal,
    shipping: r.shipping,
    total: r.total,
    status: r.status,
    createdAt: r.created_at,
  }));

  return (
    <>
      <PageHero
        eyebrow="Account"
        title={session.user.name ? `Hi, ${session.user.name}` : "Welcome back"}
        description={`Signed in as ${session.user.email}`}
      />
      <div className="container-page py-10">
        <Reveal>
          <h2 className="font-display text-2xl font-bold">Order history</h2>
        </Reveal>

        {orders.length === 0 ? (
          <div className="mt-8 grid place-items-center rounded-3xl border border-dashed border-border/60 bg-card/30 p-12 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <p className="mt-4 font-medium">No orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Once you place an order it&apos;ll show up here.
            </p>
            <Button asChild className="mt-5">
              <Link href="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((o) => (
              <Reveal key={o.id}>
                <article className="glass rounded-2xl p-6">
                  <header className="flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
                      <Package className="h-3.5 w-3.5" />
                      Order #{o.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <time dateTime={new Date(o.createdAt).toISOString()} className="text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                        {o.status}
                      </span>
                    </div>
                  </header>
                  <ul className="mt-4 divide-y divide-border/40 text-sm">
                    {o.items.map((it, idx) => (
                      <li key={idx} className="flex items-center justify-between py-2">
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium">{it.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty {it.quantity} · ${Number(it.price).toFixed(2)}
                          </p>
                        </div>
                        <p className="tabular-nums">
                          ${(Number(it.price) * Number(it.quantity)).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <footer className="mt-4 flex justify-end border-t border-border/40 pt-4 text-sm">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-display text-lg font-bold">
                        ${o.total.toFixed(2)}
                      </p>
                    </div>
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
