"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How long does shipping take?",
    a: "Most orders dispatch within 24 hours and arrive in 3–7 business days, depending on your location. You'll get tracking the moment it ships.",
  },
  {
    q: "What's your return policy?",
    a: "Free returns within 30 days, no questions asked. Items must be in their original condition. Just reply to your order email and we'll send a label.",
  },
  {
    q: "Do you ship internationally?",
    a: "We ship across North America and Europe today, with more regions launching soon. International rates are calculated at checkout.",
  },
  {
    q: "Are my password and payment details safe?",
    a: "Passwords are hashed with scrypt — they're never stored in plain text. All traffic is encrypted in transit over HTTPS, and we never store raw card details on our servers.",
  },
  {
    q: "Can I assemble it myself?",
    a: "Yes — every piece comes flat-packed with clear instructions and the tools you need. Most items take 15–30 minutes to assemble.",
  },
  {
    q: "Do you offer trade or bulk pricing?",
    a: "Absolutely. Email trade@hekto.shop with your project details and we'll set you up with a dedicated rep and pricing.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <PageHero
        eyebrow="Help center"
        title="Frequently asked"
        description="Quick answers to the things people ask most."
      />

      <div className="container-page py-12">
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q}>
                <div
                  className={cn(
                    "glass overflow-hidden rounded-2xl transition",
                    isOpen && "ring-1 ring-primary/40",
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium">{f.q}</span>
                    <m.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className="grid h-8 w-8 place-items-center rounded-full bg-secondary/60"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </m.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                          {f.a}
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mx-auto mt-12 flex max-w-3xl items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 text-primary">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Still curious?</p>
                <p className="text-xs text-muted-foreground">
                  We usually reply in under an hour during business hours.
                </p>
              </div>
            </div>
            <a
              href="/contact"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ask a question →
            </a>
          </div>
        </Reveal>
      </div>
    </>
  );
}
