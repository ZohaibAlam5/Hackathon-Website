"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { client } from "@/sanity/lib/client";
import type { Product } from "@/lib/sanity-queries";
import { ProductCard, ProductCardSkeleton } from "@/components/product/product-card";
import { PageHero } from "@/components/ui/page-hero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest" as const, label: "Newest", hint: "Just added" },
  { value: "price-asc" as const, label: "Price: low to high" },
  { value: "price-desc" as const, label: "Price: high to low" },
  { value: "name" as const, label: "Name A–Z" },
];

type SortKey = "newest" | "price-asc" | "price-desc" | "name";

const PRICE_RANGES: Array<{ value: string; label: string; min: number; max: number }> = [
  { value: "all", label: "Any price", min: 0, max: Infinity },
  { value: "0-150", label: "Under $150", min: 0, max: 150 },
  { value: "150-350", label: "$150 – $350", min: 150, max: 350 },
  { value: "350-650", label: "$350 – $650", min: 350, max: 650 },
  { value: "650+", label: "Over $650", min: 650, max: Infinity },
];

async function fetchProducts(): Promise<Product[]> {
  const rows: Product[] = await client.fetch(`*[_type == "Shop"]{
    _id,
    ProductID,
    ProductName,
    "imageUrl": ProductImage.asset->url,
    "ProductPrice": coalesce(ProductPrice, "0"),
    ProductDescription,
    "ProductDiscount": coalesce(ProductDiscount, "0"),
    ProductFeatured,
    "ProductCategory": coalesce(Productcategory, ProductCategory)
  } | order(_createdAt desc)`);
  return rows.map((p) => ({
    ...p,
    ProductPrice: Number(p.ProductPrice) || 0,
    ProductDiscount: Number(p.ProductDiscount) || 0,
  }));
}

function ShopInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    params.get("category") ? [params.get("category") as string] : [],
  );
  const [priceKey, setPriceKey] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  // Sync search + category to URL (shareable links)
  useEffect(() => {
    const next = new URLSearchParams();
    if (search) next.set("search", search);
    if (selectedCategories.length === 1) next.set("category", selectedCategories[0]);
    const qs = next.toString();
    router.replace(`/shop${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [search, selectedCategories, router]);

  const categories = useMemo(() => {
    if (!products) return [];
    const set = new Set<string>();
    products.forEach((p) => p.ProductCategory && set.add(p.ProductCategory));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    const range = PRICE_RANGES.find((r) => r.value === priceKey)!;
    let list = products.filter((p) => {
      const price = Math.max(
        0,
        Number(p.ProductPrice) - Number(p.ProductDiscount ?? 0),
      );
      if (price < range.min || price > range.max) return false;
      if (
        selectedCategories.length > 0 &&
        (!p.ProductCategory || !selectedCategories.includes(p.ProductCategory))
      ) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const hay = `${p.ProductName} ${p.ProductDescription ?? ""} ${p.ProductCategory ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = list.slice().sort((a, b) => {
      const ap = Number(a.ProductPrice) - Number(a.ProductDiscount ?? 0);
      const bp = Number(b.ProductPrice) - Number(b.ProductDiscount ?? 0);
      switch (sort) {
        case "price-asc":
          return ap - bp;
        case "price-desc":
          return bp - ap;
        case "name":
          return a.ProductName.localeCompare(b.ProductName);
        default:
          return 0;
      }
    });
    return list;
  }, [products, search, selectedCategories, priceKey, sort]);

  function toggleCategory(c: string) {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  const clearAll = () => {
    setSearch("");
    setSelectedCategories([]);
    setPriceKey("all");
  };

  return (
    <>
      <PageHero
        eyebrow="Catalog"
        title="Shop everything"
        description="Filter, sort and explore the full Hekto collection."
      />

      <div className="container-page py-10">
        <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
          {/* Mobile filter trigger */}
          <div className="flex items-center justify-between lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <SortSelect value={sort} onChange={setSort} />
          </div>

          <FilterPanel
            className="hidden lg:block"
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            search={search}
            setSearch={setSearch}
            priceKey={priceKey}
            setPriceKey={setPriceKey}
            clearAll={clearAll}
          />

          <div>
            <div className="hidden items-center justify-between pb-6 lg:flex">
              <p className="text-sm text-muted-foreground">
                {products ? `${filtered.length} of ${products.length} products` : "Loading…"}
              </p>
              <SortSelect value={sort} onChange={setSort} />
            </div>

            {products === null ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-12 text-center">
                <p className="font-medium">No products match those filters.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try clearing the search or widening the price range.
                </p>
                <Button onClick={clearAll} variant="outline" className="mt-4">
                  Clear filters
                </Button>
              </div>
            ) : (
              <m.div
                layout
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((p) => (
                    <m.div
                      key={p._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={p} />
                    </m.div>
                  ))}
                </AnimatePresence>
              </m.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur lg:hidden"
            onClick={() => setFiltersOpen(false)}
          >
            <m.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong absolute inset-y-0 left-0 w-[88%] max-w-sm overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between pb-4">
                <h2 className="font-display text-xl font-bold">Filters</h2>
                <button
                  aria-label="Close"
                  onClick={() => setFiltersOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary/60"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterPanel
                categories={categories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                search={search}
                setSearch={setSearch}
                priceKey={priceKey}
                setPriceKey={setPriceKey}
                clearAll={clearAll}
              />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterPanel({
  categories,
  selectedCategories,
  toggleCategory,
  search,
  setSearch,
  priceKey,
  setPriceKey,
  clearAll,
  className,
}: {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (c: string) => void;
  search: string;
  setSearch: (s: string) => void;
  priceKey: string;
  setPriceKey: (s: string) => void;
  clearAll: () => void;
  className?: string;
}) {
  return (
    <aside className={cn("space-y-6", className)}>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="pl-9"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Categories
        </label>
        {categories.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            None yet — categories appear after products are loaded.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = selectedCategories.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleCategory(c)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    active
                      ? "border-primary/60 bg-primary/15 text-foreground shadow-[0_0_18px_-6px_hsl(var(--primary)/0.7)]"
                      : "border-border bg-card/40 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price
        </label>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((r) => (
            <label
              key={r.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
                priceKey === r.value
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border bg-card/30 text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name="price"
                value={r.value}
                checked={priceKey === r.value}
                onChange={() => setPriceKey(r.value)}
                className="accent-primary"
              />
              {r.label}
            </label>
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clearAll}>
        <Filter className="h-4 w-4" /> Clear all filters
      </Button>
    </aside>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  return (
    <Select<SortKey>
      label="Sort"
      value={value}
      onChange={onChange}
      options={SORT_OPTIONS}
      align="right"
    />
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60dvh] place-items-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <ShopInner />
    </Suspense>
  );
}
