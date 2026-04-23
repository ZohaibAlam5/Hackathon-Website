"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";

export function PageHero({
  title,
  eyebrow,
  description,
  className,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border/60 py-16 sm:py-20",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-grid-pattern bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="absolute -top-24 left-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-neon-gradient opacity-20 blur-3xl"
      />
      <div className="container-page relative">
        {eyebrow && (
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary"
          >
            {eyebrow}
          </m.p>
        )}
        <m.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl"
        >
          <span className="neon-text">{title}</span>
        </m.h1>
        {description && (
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg"
          >
            {description}
          </m.p>
        )}
      </div>
    </section>
  );
}
