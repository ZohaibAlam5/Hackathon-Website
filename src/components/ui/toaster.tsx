"use client";

import { create } from "zustand";
import { AnimatePresence, m } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useEffect } from "react";

type ToastVariant = "success" | "error" | "info";
type Toast = { id: string; message: string; variant: ToastVariant };

type ToastStore = {
  toasts: Toast[];
  push: (message: string, variant?: ToastVariant) => void;
  dismiss: (id: string) => void;
};

const useToasts = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, variant = "info") => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
    setTimeout(
      () => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      3500,
    );
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message: string, variant: ToastVariant = "info") {
  useToasts.getState().push(message, variant);
}

const variantConfig: Record<
  ToastVariant,
  { Icon: typeof CheckCircle2; ring: string; glow: string }
> = {
  success: {
    Icon: CheckCircle2,
    ring: "ring-emerald-400/40",
    glow: "shadow-[0_0_30px_-5px_rgba(52,211,153,0.5)]",
  },
  error: {
    Icon: AlertCircle,
    ring: "ring-rose-400/40",
    glow: "shadow-[0_0_30px_-5px_rgba(251,113,133,0.5)]",
  },
  info: {
    Icon: Info,
    ring: "ring-cyan-400/40",
    glow: "shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)]",
  },
};

export function Toaster() {
  const toasts = useToasts((s) => s.toasts);
  const dismiss = useToasts((s) => s.dismiss);

  // Hydration safety: ensure no SSR mismatch
  useEffect(() => {}, []);

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[100] ml-auto flex max-w-sm flex-col gap-2 sm:inset-x-auto sm:right-4">
      <AnimatePresence>
        {toasts.map((t) => {
          const v = variantConfig[t.variant];
          return (
            <m.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className={`pointer-events-auto glass-strong ring-1 ${v.ring} ${v.glow} flex items-start gap-3 rounded-xl px-4 py-3`}
            >
              <v.Icon className="h-5 w-5 shrink-0 text-foreground/90" />
              <p className="min-w-0 flex-1 break-words text-sm leading-snug">{t.message}</p>
              <button
                aria-label="Dismiss"
                onClick={() => dismiss(t.id)}
                className="text-muted-foreground transition hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </m.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
