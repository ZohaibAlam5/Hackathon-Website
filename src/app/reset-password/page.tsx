"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { m } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
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

function ResetInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const score = useMemo(() => passwordScore(password), [password]);
  const meterColor = ["bg-rose-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-400"][score];
  const meterLabel = ["Too short", "Weak", "Fair", "Strong", "Excellent"][score];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast("Missing reset token. Request a new link.", "error");
      return;
    }
    if (password.length < 8) {
      toast("Password must be at least 8 characters", "error");
      return;
    }
    if (password !== confirm) {
      toast("Passwords don't match", "error");
      return;
    }
    setLoading(true);
    const res = await authClient.resetPassword({ newPassword: password, token });
    setLoading(false);
    if (res.error) {
      toast(res.error.message ?? "Reset failed — link may be expired", "error");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/login"), 1500);
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
              <span className="neon-text">
                {done ? "Password updated" : "Set a new password"}
              </span>
            </CardTitle>
            <CardDescription>
              {done
                ? "You can now sign in with your new password."
                : !token
                ? "This page needs a valid reset token from your email."
                : "Pick something strong — you'll only need it for sign-in."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {done ? (
              <div className="flex flex-col items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-background">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <Button asChild className="w-full">
                  <Link href="/login">Continue to sign in</Link>
                </Button>
              </div>
            ) : !token ? (
              <Button asChild className="w-full">
                <Link href="/forgot-password">Request a reset link</Link>
              </Button>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    New password
                  </label>
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
                          <div
                            key={i}
                            className={`flex-1 rounded-full border border-border/60 ${i < score ? meterColor : ""}`}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{meterLabel}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Confirm new password
                  </label>
                  <Input
                    type={show ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="Type it again"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="h-4 w-4" />
                  )}
                  {loading ? "Updating…" : "Update password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60dvh] place-items-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <ResetInner />
    </Suspense>
  );
}
