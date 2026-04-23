"use client";

import Link from "next/link";
import { useState } from "react";
import { m } from "framer-motion";
import { ArrowLeft, KeyRound, Loader2, MailCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toaster";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await authClient.forgetPassword({
      email,
      redirectTo: "/reset-password",
    });
    setLoading(false);
    if (res.error) {
      toast(res.error.message ?? "Couldn't send reset link", "error");
      return;
    }
    setSent(true);
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
                {sent ? "Check your inbox" : "Reset your password"}
              </span>
            </CardTitle>
            <CardDescription>
              {sent
                ? "If an account exists for that email, we've sent a link to reset your password."
                : "Enter your email and we'll send you a secure link to choose a new password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-background">
                  <MailCheck className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Didn&apos;t get it? Check spam, or{" "}
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="font-medium text-primary hover:underline"
                  >
                    try again
                  </button>
                  .
                </p>
                <Button asChild variant="outline" className="mt-2">
                  <Link href="/login">
                    <ArrowLeft className="h-4 w-4" /> Back to sign in
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@inbox.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="h-4 w-4" />
                  )}
                  {loading ? "Sending…" : "Send reset link"}
                </Button>

                <p className="pt-2 text-center text-sm text-muted-foreground">
                  Remember it?{" "}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    Sign in instead
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}
