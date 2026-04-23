"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import type { Category } from "@/lib/sanity-queries";

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/shop?category=${encodeURIComponent(category.ProductCategory)}`}
      className="group relative block overflow-hidden rounded-2xl border border-border/70 bg-card/40"
    >
      <div className="relative aspect-square">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.ProductCategory}
            fill
            sizes="(min-width:1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent"
        />
      </div>
      <m.div
        whileHover={{ y: -4 }}
        className="absolute inset-x-0 bottom-0 p-4"
      >
        <h3 className="text-sm font-semibold tracking-wide">
          {category.ProductCategory}
        </h3>
        <span className="mt-1 inline-flex items-center text-[11px] font-medium uppercase tracking-wider text-primary">
          Shop now →
        </span>
      </m.div>
    </Link>
  );
}
