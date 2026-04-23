import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { getProductById, getRelatedProducts } from "@/lib/sanity-queries";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/motion/reveal";
import { ProductActions } from "@/components/product/product-actions";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const { item } = await params;
  const product = await getProductById(item);
  if (!product) notFound();

  const related = await getRelatedProducts(product.ProductCategory, item, 4);
  const finalPrice = Math.max(
    0,
    Number(product.ProductPrice) - Number(product.ProductDiscount ?? 0),
  );
  const hasDiscount = Number(product.ProductDiscount ?? 0) > 0;
  const savings = Number(product.ProductDiscount ?? 0);

  return (
    <>
      <div className="container-page pt-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>
      </div>

      <section className="container-page py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card/40">
              <div
                aria-hidden
                className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
              />
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.ProductName}
                  fill
                  priority
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-contain p-8"
                />
              ) : (
                <div className="grid h-full place-items-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
              {hasDiscount && (
                <div className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow-[0_0_24px_-4px_rgba(244,63,94,0.7)]">
                  Save ${savings.toFixed(2)}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              {product.ProductCategory && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {product.ProductCategory}
                </p>
              )}
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {product.ProductName}
              </h1>

              <div className="mt-3 flex items-center gap-3 text-sm">
                <Stars rating={4} />
                <span className="text-muted-foreground">4.0 · 24 reviews</span>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-4xl font-bold neon-text">
                  ${finalPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${Number(product.ProductPrice).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="mt-6 max-w-prose text-muted-foreground">
                {product.ProductDescription ||
                  "A statement piece designed to elevate any modern space. Crafted with quality materials, built to last."}
              </p>

              <ProductActions
                product={{
                  productId: product.ProductID,
                  name: product.ProductName,
                  price: finalPrice,
                  image: product.imageUrl ?? null,
                }}
              />

              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Perk Icon={Truck} title="Free delivery" desc="Orders over $99" />
                <Perk Icon={ShieldCheck} title="2-year warranty" desc="Guaranteed quality" />
                <Perk Icon={RotateCcw} title="30-day returns" desc="No-fuss policy" />
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Description / Specs */}
      <section className="border-t border-border/60 py-16">
        <div className="container-page">
          <Reveal>
            <h2 className="font-display text-2xl font-bold">Details</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Description
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {product.ProductDescription ||
                    "Hand-finished with care, this piece blends form and function to anchor your space with quiet confidence."}
                </p>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  At a glance
                </h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <SpecRow label="Product ID" value={product.ProductID} />
                  {product.ProductCategory && (
                    <SpecRow label="Category" value={product.ProductCategory} />
                  )}
                  <SpecRow label="Price" value={`$${finalPrice.toFixed(2)}`} />
                  {hasDiscount && (
                    <SpecRow label="Savings" value={`$${savings.toFixed(2)}`} />
                  )}
                  <SpecRow
                    label="Featured"
                    value={product.ProductFeatured ? "Yes" : "No"}
                  />
                </dl>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border/60 py-16">
          <div className="container-page">
            <Reveal>
              <h2 className="font-display text-2xl font-bold">
                You may also like
              </h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={
            i <= rating
              ? "h-4 w-4 fill-amber-400 text-amber-400"
              : "h-4 w-4 text-muted-foreground/40"
          }
        />
      ))}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/40 pb-2 text-sm last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function Perk({
  Icon,
  title,
  desc,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <li className="rounded-xl border border-border/60 bg-card/40 p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </li>
  );
}
