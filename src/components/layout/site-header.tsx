"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, m, useScroll, useTransform } from "framer-motion";
import {
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useCart, cartSelectors } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { signOut, useSession } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import logo from "@/app/icon.png";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/products", label: "Categories" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 80], [0, 16]);
  const bgAlpha = useTransform(scrollY, [0, 80], [0.0, 0.65]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement | null>(null);

  const cartCount = useCart(cartSelectors.count);
  const cartHydrated = useCart((s) => s.hydrated);
  const wishlistCount = useWishlist((s) => s.items.length);
  const wishlistHydrated = useWishlist((s) => s.hydrated);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!accountRef.current) return;
      if (!accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    }
    if (accountOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [accountOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    setSearchOpen(false);
    router.push(`/shop?search=${encodeURIComponent(q)}`);
  }

  return (
    <m.header
      style={{
        backgroundColor: useTransform(
          bgAlpha,
          (a) => `hsl(var(--background) / ${a})`,
        ),
        backdropFilter: useTransform(blur, (b) => `blur(${b}px) saturate(140%)`),
      }}
      className="sticky top-0 z-50 border-b border-transparent transition-colors data-[scrolled=true]:border-border/60"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-5 sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-border/60 transition group-hover:ring-primary/60 group-hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.6)]">
            <Image
              src={logo}
              alt="Hekto logo"
              fill
              priority
              sizes="40px"
              className="object-cover"
            />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            <span className="neon-text">Hekto</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <m.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-secondary/70 ring-1 ring-border/60"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground sm:h-10 sm:w-10"
          >
            <Search className="h-5 w-5" />
          </button>

          <ThemeToggle compact />

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground sm:h-10 sm:w-10"
          >
            <Heart className="h-5 w-5" />
            {wishlistHydrated && wishlistCount > 0 && (
              <Badge>{wishlistCount}</Badge>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground sm:h-10 sm:w-10"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartHydrated && cartCount > 0 && <Badge>{cartCount}</Badge>}
          </Link>

          <div ref={accountRef} className="relative">
            <button
              aria-label="Account"
              onClick={() => setAccountOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground sm:h-10 sm:w-10"
            >
              <User className="h-5 w-5" />
            </button>
            <AnimatePresence>
              {accountOpen && (
                <m.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="glass-strong absolute right-0 top-12 w-60 rounded-2xl p-2 shadow-2xl"
                >
                  {isPending ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">Loading…</div>
                  ) : session?.user ? (
                    <>
                      <div className="border-b border-border/60 px-3 pb-2 pt-1">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Signed in as
                        </p>
                        <p className="truncate text-sm font-medium">
                          {session.user.name || session.user.email}
                        </p>
                      </div>
                      <MenuLink href="/account">My Orders</MenuLink>
                      <MenuLink href="/wishlist">Wishlist</MenuLink>
                      <MenuLink href="/cart">Cart</MenuLink>
                      <button
                        onClick={async () => {
                          await signOut();
                          router.push("/");
                          router.refresh();
                        }}
                        className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <MenuLink href="/login">Sign in</MenuLink>
                      <MenuLink href="/signup">Create account</MenuLink>
                    </>
                  )}
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground sm:h-10 sm:w-10 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/60"
          >
            <div className="container-page py-3">
              <form onSubmit={submitSearch} className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-input/50 px-4">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products, categories…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 rounded-full bg-gradient-to-r from-primary to-accent px-5 text-sm font-medium text-background"
                >
                  Search
                </button>
              </form>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <m.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/60 lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-2 text-sm text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </m.header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <m.span
      key={String(children)}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 480, damping: 24 }}
      className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-gradient-to-br from-primary to-accent px-1 text-[10px] font-bold text-background shadow-[0_0_12px_-2px_hsl(var(--primary)/0.7)]"
    >
      {children}
    </m.span>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
    >
      {children}
    </Link>
  );
}
