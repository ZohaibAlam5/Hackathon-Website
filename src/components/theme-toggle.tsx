"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, m } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

type Mode = (typeof OPTIONS)[number]["value"];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (compact) {
    // Single-button toggle (header). Cycles through: system → light → dark → system
    const next: Record<Mode, Mode> = {
      system: "light",
      light: "dark",
      dark: "system",
    };
    const current = (theme as Mode) || "system";
    const Icon = mounted
      ? current === "system"
        ? Monitor
        : resolvedTheme === "dark"
        ? Moon
        : Sun
      : Monitor;
    const label = mounted
      ? current === "system"
        ? "System theme"
        : current === "dark"
        ? "Dark theme"
        : "Light theme"
      : "Theme";
    return (
      <button
        aria-label={`Switch theme (currently ${label})`}
        title={label}
        onClick={() => setTheme(next[current])}
        className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
        suppressHydrationWarning
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={mounted ? `${current}-${resolvedTheme}` : "stub"}
            initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            className="grid place-items-center"
          >
            <Icon className="h-5 w-5" />
          </m.span>
        </AnimatePresence>
      </button>
    );
  }

  // Three-segment switch
  const active = (mounted ? theme : "system") as Mode;
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card/40 p-1"
      suppressHydrationWarning
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(value)}
            className={cn(
              "relative inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {isActive && mounted && (
              <m.span
                layoutId="theme-pill"
                className="absolute inset-0 -z-10 rounded-full bg-secondary/80 ring-1 ring-border"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
