"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { Facebook, Github, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { useState } from "react";
import logo from "@/app/icon.png";

const COLS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Products" },
      { href: "/products", label: "Categories" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Create account" },
      { href: "/account", label: "Orders" },
    ],
  },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative mt-24 border-t border-border/60">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="group flex items-center gap-2">
              <span className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-border/60 transition group-hover:ring-primary/60">
                <Image
                  src={logo}
                  alt="Hekto logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="font-display text-xl font-bold neon-text">
                Hekto
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Future-forward furniture. Designed for tomorrow, made for today.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  toast("Enter a valid email", "error");
                  return;
                }
                toast("Subscribed — welcome aboard.", "success");
                setEmail("");
              }}
              className="mt-6 flex w-full max-w-sm gap-2"
            >
              <Input
                type="email"
                placeholder="you@inbox.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" size="default">
                Subscribe
              </Button>
            </form>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <m.span whileHover={{ x: 3 }} className="inline-block">
                      <Link
                        href={l.href}
                        className="text-foreground/80 transition hover:text-primary"
                      >
                        {l.label}
                      </Link>
                    </m.span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Hekto. Crafted with motion.
          </p>
          <div className="flex items-center gap-2">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Twitter, label: "Twitter" },
              { Icon: Instagram, label: "Instagram" },
              { Icon: Github, label: "GitHub" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/60 hover:text-foreground hover:shadow-[0_0_18px_-6px_hsl(var(--primary)/0.6)]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
