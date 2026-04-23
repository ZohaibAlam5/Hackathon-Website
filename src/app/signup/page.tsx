"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { m } from "framer-motion";
import { Check, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth-client";
import { toast } from "@/components/ui/toaster";

function passwordScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^\w\s]/.test(pw)) s++;
  return Math.min(s, 4);
}

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const score = useMemo(() => passwordScore(password), [password]);
  const meterColor = ["bg-rose-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-400"][score];
  const meterLabel = ["Too short", "Weak", "Fair", "Strong", "Excellent"][score];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast("Password must be at least 8 characters", "error");
      return;
    }
    setLoading(true);
    const res = await signUp.email({ name, email, password });
    setLoading(false);
    if (res.error) {
      toast(res.error.message ?? "Sign-up failed", "error");
      return;
    }
    toast("Account created — welcome to Hekto.", "success");
    router.push(next);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-grid-pattern bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-gradient opacity-20 blur-3xl"
      />
      <m.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
          <Card className="neon-border">
            <CardHeader className="text-center">
              <CardTitle>
                <span className="neon-text">Create your account</span>
              </CardTitle>
              <CardDescription>
                Save your cart, sync your wishlist across devices, track orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <Field label="Name">
                  <Input
                    autoComplete="name"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                <Field label="Email">
                  <Input
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@inbox.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field label="Password">
                  <div className="relative">
                    <Input
                      type={show ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={show ? "Hide password" : "Show password"}
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex h-1.5 gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <m.div
                            key={i}
                            initial={false}
                            animate={{
                              backgroundColor:
                                i < score ? "currentColor" : "transparent",
                            }}
                            className={`flex-1 rounded-full border border-border/60 ${i < score ? meterColor : ""}`}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {meterLabel} · stored as a salted scrypt hash, never as plain text
                      </p>
                    </div>
                  )}
                </Field>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {loading ? "Creating account…" : "Create account"}
                </Button>
              </form>

              <ul className="mt-6 space-y-1.5 text-xs text-muted-foreground">
                <Bullet>Cart and wishlist saved across devices</Bullet>
                <Bullet>Order history under your account</Bullet>
                <Bullet>Passwords hashed with scrypt — never stored in plain text</Bullet>
              </ul>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
      </m.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="mt-0.5 h-3.5 w-3.5 text-primary" />
      <span>{children}</span>
    </li>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60dvh] place-items-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <SignupInner />
    </Suspense>
  );
}
