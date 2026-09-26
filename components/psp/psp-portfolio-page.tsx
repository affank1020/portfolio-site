"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  PortfolioWork,
  PortfolioHero,
  PortfolioContact,
  PortfolioExperience,
} from "@/lib/contentful";
import { DEFAULT_XMB_CONFIG, buildXmbCategories } from "./psp-config";
import { XmbHeader } from "./xmb-header";
import { XmbHorizontalAxis } from "./xmb-horizontal-axis";
import { XmbVerticalAxis } from "./xmb-vertical-axis";
import { XmbDetailPanel } from "./xmb-detail-panel";
import { PspMobileView } from "./psp-mobile-view";

interface PspPortfolioPageProps {
  workItems: PortfolioWork[];
  hero: PortfolioHero;
  contact: PortfolioContact;
  experienceItems: PortfolioExperience[];
  accentColor?: string;
}

export function PspPortfolioPage({
  workItems,
  hero,
  contact,
  experienceItems,
}: PspPortfolioPageProps) {
  // Build categories modularly from inputs
  const categories = buildXmbCategories({ hero, workItems, experienceItems, contact });

  // Navigation State
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeItemIndices, setActiveItemIndices] = useState<Record<number, number>>(
    Object.fromEntries(categories.map((_, i) => [i, 0]))
  );

  const activeCategory = categories[activeCategoryIndex] ?? categories[0];
  const activeItemIndex = activeItemIndices[activeCategoryIndex] ?? 0;
  const activeItem = activeCategory?.items?.[activeItemIndex];
  const categoryItemsLength = activeCategory?.items?.length ?? 0;

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const navKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"];
      if (!navKeys.includes(e.key)) return;
      e.preventDefault();

      if (e.key === "ArrowLeft") {
        setActiveCategoryIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveCategoryIndex((prev) => Math.min(categories.length - 1, prev + 1));
      } else if (e.key === "ArrowUp") {
        setActiveItemIndices((prev) => ({
          ...prev,
          [activeCategoryIndex]: Math.max(0, (prev[activeCategoryIndex] ?? 0) - 1),
        }));
      } else if (e.key === "ArrowDown") {
        setActiveItemIndices((prev) => ({
          ...prev,
          [activeCategoryIndex]: Math.min(
            categoryItemsLength - 1,
            (prev[activeCategoryIndex] ?? 0) + 1
          ),
        }));
      } else if (e.key === "Enter" && activeItem?.href && activeItem.href !== "#") {
        window.open(activeItem.href, "_blank");
      }
    },
    [activeCategoryIndex, categoryItemsLength, activeItem, categories.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const config = DEFAULT_XMB_CONFIG;

  return (
    <>
      {/* Mobile Fallback View (< md screens) */}
      <div className="block md:hidden">
        <PspMobileView
          categories={categories}
          name={`${hero.firstName} ${hero.lastName}`}
          tagline={hero.tagline}
        />
      </div>

      {/* Desktop PSP XMB Layout (>= md screens) */}
      <div className="hidden md:block fixed inset-0 bg-black overflow-hidden select-none font-sans text-white z-40">
        {/* Branding Name & PSP Status Bar */}
        <XmbHeader name={`${hero.firstName} ${hero.lastName}`} />

        {/* Horizontal Category Middle Axis */}
        <XmbHorizontalAxis
          categories={categories}
          activeCategoryIndex={activeCategoryIndex}
          config={config}
        />

        {/* Vertical Sub-item Axis */}
        <XmbVerticalAxis
          items={activeCategory.items}
          activeCategoryIndex={activeCategoryIndex}
          activeItemIndex={activeItemIndex}
          config={config}
        />

        {/* Detail Panel on the Right */}
        <XmbDetailPanel
          activeItem={activeItem}
          activeCategoryIndex={activeCategoryIndex}
          activeItemIndex={activeItemIndex}
          config={config}
        />

        {/* Bottom Navigation Hint */}
        <div className="absolute bottom-8 right-8 flex items-center gap-6 text-white/30 text-xs tracking-widest uppercase z-20 font-mono">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-0.5">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-sans text-[10px]">↑</kbd>
              <div className="flex gap-0.5">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-sans text-[10px]">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-sans text-[10px]">↓</kbd>
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-sans text-[10px]">→</kbd>
              </div>
            </div>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded font-sans text-[10px]">Enter</kbd>
            <span>Select</span>
          </div>
        </div>
      </div>
    </>
  );
}
