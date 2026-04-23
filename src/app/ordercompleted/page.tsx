"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { m } from "framer-motion";
import { ArrowRight, CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

function OrderCompletedInner() {
  const params = useSearchParams();
  const id = params.get("id");
  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-hidden py-20">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-grid-pattern bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-neon-gradient opacity-20 blur-3xl"
      />
      <div className="container-page grid place-items-center text-center">
        <m.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-[0_0_60px_-10px_rgba(52,211,153,0.6)]"
        >
          <CheckCircle2 className="h-12 w-12 text-background" />
        </m.div>

        <m.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 font-display text-4xl font-bold tracking-tight"
        >
          <span className="neon-text">Order placed!</span>
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 max-w-md text-balance text-muted-foreground"
        >
          Thanks for shopping with Hekto. We&apos;ll send a confirmation email
          shortly and update you when it ships.
        </m.p>

        {id && (
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 font-mono text-xs text-muted-foreground"
          >
            <Package className="h-3.5 w-3.5" />
            Order #{id.slice(0, 8).toUpperCase()}
          </m.div>
        )}

        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Button asChild>
            <Link href="/account">
              View my orders <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </m.div>
      </div>
    </div>
  );
}

export default function OrderCompletedPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60dvh] place-items-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <OrderCompletedInner />
    </Suspense>
  );
}
