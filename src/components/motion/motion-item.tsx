"use client";

import { m, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export function MotionItem({
  children,
  className,
  variants,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <m.div className={className} variants={variants}>
      {children}
    </m.div>
  );
}
