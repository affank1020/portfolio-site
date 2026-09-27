"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { XmbCategory, XmbLayoutConfig } from "./types";

interface XmbHorizontalAxisProps {
  categories: XmbCategory[];
  activeCategoryIndex: number;
  config: XmbLayoutConfig;
  onCategorySelect: (index: number) => void;
  locked?: boolean;
}

export function XmbHorizontalAxis({
  categories,
  activeCategoryIndex,
  config,
  onCategorySelect,
  locked = false,
}: XmbHorizontalAxisProps) {
  const { crossX, crossY, hGap, iconActiveSize, iconInactiveSize } = config;

  return (
    <>
      {categories.map((c, i) => {
        const active = i === activeCategoryIndex;
        const dx = (i - activeCategoryIndex) * hGap;
        const Icon = c.icon;
        const size = active ? iconActiveSize : iconInactiveSize;

        return (
          <motion.button
            type="button"
            key={c.id}
            onClick={() => onCategorySelect(i)}
            disabled={locked}
            aria-label={`Open ${c.label}`}
            aria-disabled={locked}
            aria-current={active ? "page" : undefined}
            className="absolute flex flex-col items-center pointer-events-auto z-20 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
            initial={false}
            animate={{
              x: dx,
              scale: active ? 1 : 0.85,
              opacity: active ? 1 : 0.35,
            }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{
              left: `${crossX * 100}%`,
              top: `${crossY * 100}%`,
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
            }}
          >
            <Icon className="w-full h-full drop-shadow-xl text-white" />
            <AnimatePresence>
              {active && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute whitespace-nowrap text-base font-semibold tracking-wider drop-shadow-md text-white/90"
                  style={{ top: size + 14 }}
                >
                  {c.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </>
  );
}
