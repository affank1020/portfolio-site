"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { XmbItem, XmbLayoutConfig } from "./types";

interface XmbVerticalAxisProps {
  items: XmbItem[];
  activeCategoryIndex: number;
  activeItemIndex: number;
  config: XmbLayoutConfig;
}

function ItemIcon({ active }: { active?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center rounded transition-all duration-200 ${
        active
          ? "bg-white text-black shadow-lg shadow-white/30 scale-105"
          : "bg-white/10 text-white/60"
      }`}
      style={{ width: 40, height: 30 }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M4 4h6l2 2h8v12H4z" />
      </svg>
    </div>
  );
}

export function XmbVerticalAxis({
  items,
  activeCategoryIndex,
  activeItemIndex,
  config,
}: XmbVerticalAxisProps) {
  const { crossX, crossY, vGap, aboveClear, belowClear } = config;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-10"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 2%, black 15%, black 85%, transparent 98%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 2%, black 15%, black 85%, transparent 98%)",
      }}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => {
          const dist = i - activeItemIndex;
          const isActive = dist === 0;

          // Pure Y math for split clearance around middle strip
          let yPx: number;
          if (dist < 0) {
            yPx = -aboveClear + (dist + 1) * vGap;
          } else {
            yPx = belowClear + dist * vGap;
          }

          return (
            <motion.div
              key={`${activeCategoryIndex}-${item.id || i}`}
              className="absolute flex items-center gap-4 pointer-events-auto"
              initial={{ opacity: 0, x: -20, y: yPx }}
              animate={{
                opacity: isActive ? 1 : 0.4,
                x: 0,
                y: yPx,
              }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.08 } }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              style={{
                left: `${crossX * 100}%`,
                top: `${crossY * 100}%`,
              }}
            >
              <ItemIcon active={isActive} />
              <span
                className={`whitespace-nowrap ${
                  isActive
                    ? "text-2xl font-bold tracking-wide text-white drop-shadow-lg"
                    : "text-xl font-normal text-white/70"
                }`}
              >
                {item.title}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
