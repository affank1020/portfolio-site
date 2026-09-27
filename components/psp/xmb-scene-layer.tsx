"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { XmbCategory, XmbItem } from "./types";

interface XmbSceneLayerProps {
  category: XmbCategory;
  item?: XmbItem;
}

export function XmbSceneLayer({ category, item }: XmbSceneLayerProps) {
  const image = item?.image ?? item?.gallery?.[0];
  const isProjectArtwork = item?.kind === "project";

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${category.id}-${item?.id ?? "empty"}`}
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {image && (
            <div
              className={`absolute bg-contain bg-no-repeat opacity-[0.21] grayscale-[20%] saturate-90 contrast-105 ${
                isProjectArtwork
                  ? "bottom-[7%] right-[2%] h-[58%] max-h-[620px] w-[54%] max-w-[860px] bg-center"
                  : "bottom-[3%] right-[3%] h-[44%] max-h-[420px] w-[38%] max-w-[620px] bg-bottom"
              }`}
              style={{
                backgroundImage: `url(${image})`,
                maskImage: "radial-gradient(ellipse at 70% 72%, black 0%, rgba(0,0,0,.78) 32%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(ellipse at 70% 72%, black 0%, rgba(0,0,0,.78) 32%, transparent 70%)",
              }}
            />
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
