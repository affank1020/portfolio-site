"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { XmbItem, XmbLayoutConfig } from "./types";

interface XmbDetailPanelProps {
  activeItem?: XmbItem;
  activeCategoryIndex: number;
  activeItemIndex: number;
  config: XmbLayoutConfig;
}

export function XmbDetailPanel({
  activeItem,
  activeCategoryIndex,
  activeItemIndex,
  config,
}: XmbDetailPanelProps) {
  const { crossY, belowClear } = config;

  return (
    <div
      className="absolute overflow-hidden pointer-events-none z-20"
      style={{
        left: "48%",
        right: "6%",
        top: `calc(${crossY * 100}% + ${belowClear}px)`,
        bottom: "8%",
      }}
    >
      <AnimatePresence mode="wait">
        {activeItem && (
          <motion.div
            key={`detail-${activeCategoryIndex}-${activeItemIndex}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="flex flex-col gap-4 max-w-xl pointer-events-auto"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
                {activeItem.title}
              </h2>
              {activeItem.subtitle && (
                <p className="text-lg text-white/70 font-medium">{activeItem.subtitle}</p>
              )}
            </div>

            <div className="h-px bg-white/20 w-3/4 my-1" />

            {activeItem.description && (
              <p className="text-base text-white/60 leading-relaxed drop-shadow">
                {activeItem.description}
              </p>
            )}

            {activeItem.customContent}

            {activeItem.tags && activeItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activeItem.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-white/10 text-white/80 border border-white/10 shadow-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {activeItem.href && activeItem.href !== "#" && (
              <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
                <kbd className="px-2 py-1 rounded bg-white/20 text-white font-mono shadow-sm">
                  ⏎
                </kbd>
                <span>Press Enter to open link</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
