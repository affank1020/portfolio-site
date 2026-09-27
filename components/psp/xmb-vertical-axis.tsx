"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { XmbItem, XmbLayoutConfig } from "./types";

interface XmbVerticalAxisProps {
  items: XmbItem[];
  activeCategoryIndex: number;
  activeItemIndex: number;
  config: XmbLayoutConfig;
  onItemSelect: (index: number) => void;
  onItemActivate: (index: number) => void;
}

function ItemGlyph({ item }: { item: XmbItem }) {
  const common = "h-5 w-5";

  if (item.action === "settings-theme") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
        <path d="M3 6h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    );
  }

  if (item.action === "settings-back") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
        <path d="m10 17-5-5 5-5" /><path d="M5 12h14" />
      </svg>
    );
  }

  if (item.kind === "experience") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
        <path d="M5 21V4h10v17M15 9h4v12M8 8h4M8 12h4M8 16h4M3 21h18" />
      </svg>
    );
  }

  if (item.kind === "post") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
        <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />
      </svg>
    );
  }

  if (item.kind === "contact") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
      </svg>
    );
  }

  if (item.action === "theme") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
        <circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (item.action === "motion") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
        <path d="m7 7 5 5-5 5M13 7l5 5-5 5" />
      </svg>
    );
  }

  if (item.kind === "home") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
        <circle cx="12" cy="8" r="3" /><path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ItemIcon({ active, item }: { active?: boolean; item: XmbItem }) {
  return (
    <div
      className={`flex items-center justify-center rounded transition-all duration-200 ${
        active
          ? item.image
            ? "scale-110"
            : "bg-white text-black shadow-lg shadow-white/30 scale-105"
          : item.image
            ? "opacity-80"
            : "bg-white/10 text-white/60"
      }`}
      style={{ width: 40, height: 30 }}
    >
      {item.image ? (
        <span
          aria-hidden="true"
          className="h-9 w-11 bg-contain bg-center bg-no-repeat drop-shadow-md"
          style={{ backgroundImage: `url(${item.image})` }}
        />
      ) : (
        <ItemGlyph item={item} />
      )}
    </div>
  );
}

export function XmbVerticalAxis({
  items,
  activeCategoryIndex,
  activeItemIndex,
  config,
  onItemSelect,
  onItemActivate,
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
            <motion.button
              type="button"
              key={`${activeCategoryIndex}-${item.id || i}`}
              onClick={() => isActive ? onItemActivate(i) : onItemSelect(i)}
              aria-current={isActive ? "true" : undefined}
              className="absolute flex items-center gap-4 pointer-events-auto rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
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
              <ItemIcon active={isActive} item={item} />
              <span
                className={`whitespace-nowrap ${
                  isActive
                    ? "text-2xl font-bold tracking-wide text-white drop-shadow-lg"
                    : "text-xl font-normal text-white/70"
                }`}
              >
                {item.title}
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
