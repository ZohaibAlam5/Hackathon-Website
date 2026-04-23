"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  hint?: string;
};

type SelectProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  label?: string;
  className?: string;
  align?: "left" | "right";
  size?: "sm" | "md";
};

export function Select<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
  align = "right",
  size = "md",
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    setActiveIdx(Math.max(0, options.findIndex((o) => o.value === value)));
    function handleClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % options.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + options.length) % options.length);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        onChange(options[activeIdx].value);
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, options, value, onChange, activeIdx]);

  const heightCls = size === "sm" ? "h-9 text-xs" : "h-10 text-sm";

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center justify-between gap-2 rounded-full border border-border bg-card/50 px-4 font-medium text-foreground backdrop-blur transition hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
          heightCls,
        )}
      >
        {label && (
          <span className="text-muted-foreground">{label}:</span>
        )}
        <span>{selected?.label}</span>
        <m.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="text-muted-foreground"
        >
          <ChevronDown className="h-4 w-4" />
        </m.span>
      </button>

      <AnimatePresence>
        {open && (
          <m.ul
            role="listbox"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "glass-strong absolute z-50 mt-2 min-w-[12rem] overflow-hidden rounded-2xl p-1 shadow-2xl ring-1 ring-border/60",
              align === "right" ? "right-0" : "left-0",
            )}
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === value;
              const isActive = i === activeIdx;
              return (
                <li key={opt.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                      isActive
                        ? "bg-primary/15 text-foreground"
                        : "text-foreground/85",
                    )}
                  >
                    <span className="flex flex-col">
                      <span className="font-medium">{opt.label}</span>
                      {opt.hint && (
                        <span className="text-[11px] text-muted-foreground">
                          {opt.hint}
                        </span>
                      )}
                    </span>
                    <m.span
                      initial={false}
                      animate={{
                        opacity: isSelected ? 1 : 0,
                        scale: isSelected ? 1 : 0.6,
                      }}
                      className="text-primary"
                    >
                      <Check className="h-4 w-4" />
                    </m.span>
                  </button>
                </li>
              );
            })}
          </m.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
