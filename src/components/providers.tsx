"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { StoreSync } from "@/components/store-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          {children}
          <StoreSync />
          <Toaster />
        </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
