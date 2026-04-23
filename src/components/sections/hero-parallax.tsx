"use client";

import Image from "next/image";
import Link from "next/link";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function HeroParallax({
  imageUrl,
  alt,
  productId,
  price,
}: {
  imageUrl: string | null;
  alt: string;
  productId?: string;
  price?: number | null;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 18 });
  const sy = useSpring(y, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(sy, [-50, 50], [8, -8]);
  const rotateY = useTransform(sx, [-50, 50], [-8, 8]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
    const py = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
    x.set(px);
    y.set(py);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="relative aspect-[4/5] w-full select-none [perspective:1200px]"
    >
      <m.div
        style={{ rotateX, rotateY }}
        className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-card/40 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] [transform-style:preserve-3d]"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            priority
            sizes="(min-width:1024px) 40vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-primary/20 to-accent/20 text-sm text-muted-foreground">
            Add a product in Sanity to fill this space
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
        />
        {productId && (
          <Link
            href={`/shop/${productId}`}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-background"
          >
            View
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
        {price != null && (
          <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-bold text-background shadow-[0_0_24px_-4px_hsl(var(--primary)/0.7)]">
            ${price.toFixed(2)}
          </div>
        )}
      </m.div>

      <m.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-2xl border border-border bg-card/70 backdrop-blur-md sm:grid place-items-center"
      >
        <div className="text-center">
          <p className="font-display text-2xl font-bold neon-text">A+</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Quality
          </p>
        </div>
      </m.div>
    </div>
  );
}
