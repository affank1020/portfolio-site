"use client";

import { useState } from "react";
import type { XmbCategory } from "./types";

interface PspMobileViewProps {
  categories: XmbCategory[];
  name?: string;
  tagline?: string;
}

export function PspMobileView({
  categories,
  name = "Affan Khan",
  tagline = "",
}: PspMobileViewProps) {
  // Track open category accordions
  const [openCategoryId, setOpenCategoryId] = useState<string>("home");

  const toggleCategory = (id: string) => {
    setOpenCategoryId((prev) => (prev === id ? "" : id));
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-sans select-text">
      {/* Top Header */}
      <header className="mb-10 pb-6 border-b border-white/10">
        <h1 className="text-3xl font-extrabold tracking-tight">{name}</h1>
        <p className="text-sm text-white/60 mt-1 uppercase tracking-widest font-mono">
          {tagline}
        </p>
      </header>

      {/* Accordion Categories */}
      <div className="flex flex-col gap-6">
        {categories.map((cat) => {
          const isOpen = openCategoryId === cat.id;
          const Icon = cat.icon;

          return (
            <div
              key={cat.id}
              className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]"
            >
              {/* Category Header Button */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-white" />
                  <span className="text-xl font-bold tracking-wide">{cat.label}</span>
                </div>
                <span className="text-white/40 text-lg font-mono">{isOpen ? "−" : "+"}</span>
              </button>

              {/* Items List */}
              {isOpen && (
                <div className="px-5 pb-5 pt-2 flex flex-col gap-5 border-t border-white/10 bg-black/40">
                  {cat.items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-1.5 pt-2 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        {item.href && item.href !== "#" && (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-mono transition-colors"
                          >
                            Open ↗
                          </a>
                        )}
                      </div>

                      {item.subtitle && (
                        <p className="text-xs text-white/70 font-medium">{item.subtitle}</p>
                      )}

                      {item.description && (
                        <p className="text-sm text-white/50 leading-relaxed mt-1">
                          {item.description}
                        </p>
                      )}

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-[11px] bg-white/10 text-white/70 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <footer className="mt-16 pt-6 border-t border-white/10 text-center text-xs text-white/30 font-mono">
        © {new Date().getFullYear()} {name} · All rights reserved
      </footer>
    </div>
  );
}
