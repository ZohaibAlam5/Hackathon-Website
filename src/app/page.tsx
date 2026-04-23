import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Sparkles, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, staggerItem } from "@/components/motion/reveal";
import { ProductCard } from "@/components/product/product-card";
import {
  getCategories,
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/sanity-queries";
import Image from "next/image";
import { CategoryTile } from "@/components/sections/category-tile";
import { HeroParallax } from "@/components/sections/hero-parallax";
import { MotionItem } from "@/components/motion/motion-item";

export const revalidate = 60;

const FEATURES = [
  { Icon: Truck, title: "Free Delivery", desc: "On every order over $99" },
  { Icon: ShieldCheck, title: "Secure Checkout", desc: "Hashed passwords, encrypted in transit" },
  { Icon: Sparkles, title: "Curated Quality", desc: "Hand-picked from leading designers" },
  { Icon: Headphones, title: "24/7 Support", desc: "Real humans, anytime" },
];

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedProducts(4),
    getLatestProducts(6),
    getCategories(),
  ]);

  const heroProduct = featured[0] ?? latest[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-grid-pattern bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div
          aria-hidden
          className="absolute -left-40 top-10 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                New collection · 2026
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Furniture for the{" "}
                <span className="neon-text">future you live in.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
                Bold silhouettes, sustainable materials, and pieces engineered
                to outlast trends. Discover the collection redefining modern
                living.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/shop">
                    Shop the collection
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/products">Browse categories</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.35}>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
                {[
                  { k: "120+", v: "Designers" },
                  { k: "98%", v: "Happy customers" },
                  { k: "24h", v: "Avg. dispatch" },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="font-display text-2xl font-bold neon-text">
                      {s.k}
                    </dt>
                    <dd className="text-xs uppercase tracking-wider text-muted-foreground">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="relative">
            <HeroParallax
              imageUrl={heroProduct?.imageUrl ?? null}
              alt={heroProduct?.ProductName ?? "Featured product"}
              productId={heroProduct?.ProductID}
              price={
                heroProduct
                  ? Math.max(
                      0,
                      Number(heroProduct.ProductPrice) -
                        Number(heroProduct.ProductDiscount ?? 0),
                    )
                  : null
              }
            />
          </Reveal>
        </div>
      </section>

      {/* Featured products */}
      <section className="border-t border-border/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Hand-picked"
            title="Featured products"
            description="Pieces our curators are obsessed with this season."
            href="/shop"
          />
          {featured.length === 0 ? (
            <EmptyState
              title="Sanity is connected, but no featured products yet."
              hint="Mark a product as 'ProductFeatured' in your Sanity Studio to see it here."
            />
          ) : (
            <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p, i) => (
                <MotionItem key={p._id} variants={staggerItem}>
                  <ProductCard product={p} priority={i < 2} />
                </MotionItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-border/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Browse by"
            title="Top categories"
            description="Find your aesthetic across every room."
            href="/products"
          />
          {categories.length === 0 ? (
            <EmptyState
              title="No categories yet."
              hint="Add Products documents (categories) in Sanity Studio."
            />
          ) : (
            <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {categories.slice(0, 8).map((c) => (
                <MotionItem key={c._id} variants={staggerItem}>
                  <CategoryTile category={c} />
                </MotionItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* Promo banner */}
      <section className="border-t border-border/60 py-16 sm:py-20">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card/60 to-accent/15 p-8 sm:p-12">
              <div
                aria-hidden
                className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
              />
              <div className="relative grid items-center gap-8 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Limited time
                  </p>
                  <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    20% off the entire collection
                  </h2>
                  <p className="mt-3 max-w-lg text-muted-foreground">
                    Refresh your space with this season&apos;s standouts. No code
                    needed — discount applied automatically at checkout.
                  </p>
                  <div className="mt-6">
                    <Button asChild size="lg">
                      <Link href="/shop">
                        Claim discount
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                {(featured[1]?.imageUrl || latest[0]?.imageUrl) && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60">
                    <Image
                      src={(featured[1]?.imageUrl || latest[0]?.imageUrl) as string}
                      alt="Promo"
                      fill
                      sizes="(min-width:768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Latest products */}
      <section className="border-t border-border/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Just dropped"
            title="Latest arrivals"
            description="Fresh designs added this week."
            href="/shop"
          />
          {latest.length === 0 ? (
            <EmptyState
              title="No products in your Sanity dataset yet."
              hint="Add some Shop documents to get started."
            />
          ) : (
            <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((p) => (
                <MotionItem key={p._id} variants={staggerItem}>
                  <ProductCard product={p} />
                </MotionItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* Why Hekto */}
      <section className="border-t border-border/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Why Hekto"
            title="Built for the long haul"
            description="The little things that make every order feel premium."
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ Icon, title, desc }) => (
              <MotionItem
                key={title}
                variants={staggerItem}
                className="glass rounded-2xl p-6"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </MotionItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  href,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
}) {
  return (
    <Reveal>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </Reveal>
  );
}

function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-border/60 bg-card/30 p-10 text-center">
      <p className="font-medium">{title}</p>
      {hint && (
        <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
