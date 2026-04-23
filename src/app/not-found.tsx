import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative grid min-h-[calc(100dvh-4rem)] place-items-center overflow-hidden py-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-grid-pattern bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-gradient opacity-20 blur-3xl"
      />
      <div className="container-page text-center">
        <p className="font-mono text-sm uppercase tracking-[0.4em] text-primary">
          Error 404
        </p>
        <h1 className="mt-3 font-display text-6xl font-bold tracking-tight sm:text-8xl">
          <span className="neon-text">Lost in the void</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-balance text-muted-foreground">
          The page you&apos;re looking for drifted off the grid. Let&apos;s get
          you back to something familiar.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4" /> Back home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/shop">
              <ArrowLeft className="h-4 w-4" /> Go shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
