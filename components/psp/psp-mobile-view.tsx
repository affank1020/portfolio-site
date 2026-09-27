"use client";

import type { XmbCategory } from "./types";

interface PspMobileViewProps {
  categories: XmbCategory[];
  name?: string;
  tagline?: string;
  activeCategoryIndex: number;
  activeItemIndex: number;
  onCategorySelect: (index: number) => void;
  onItemSelect: (index: number) => void;
  onItemActivate: (index: number) => void;
  navigationLocked?: boolean;
}

export function PspMobileView({
  categories,
  name = "Affan Khan",
  tagline = "Software Engineer",
  activeCategoryIndex,
  activeItemIndex,
  onCategorySelect,
  onItemSelect,
  onItemActivate,
  navigationLocked = false,
}: PspMobileViewProps) {
  const category = categories[activeCategoryIndex] ?? categories[0];
  const item = category?.items[activeItemIndex] ?? category?.items[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--psp-bg)] px-5 pb-12 pt-6 text-[var(--psp-fg)]">
      <div className="psp-ambient" aria-hidden="true">
        <div className="psp-wave psp-wave-a" />
        <div className="psp-wave psp-wave-b" />
      </div>

      <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--psp-accent)]">AK / Portfolio</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{name}</h1>
          <p className="mt-1 text-sm text-white/55">{tagline}</p>
        </div>
        <div className="h-2 w-8 rounded-sm border border-white/40 p-px" aria-label="Decorative battery indicator">
          <div className="h-full w-3/4 rounded-sm bg-[var(--psp-accent)]" />
        </div>
      </header>

      <nav className={`relative z-10 -mx-5 mt-6 flex snap-x gap-3 px-5 pb-3 ${navigationLocked ? "overflow-x-hidden" : "overflow-x-auto"}`} aria-label="Portfolio sections">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          const active = index === activeCategoryIndex;
          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => onCategorySelect(index)}
              disabled={navigationLocked}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-[92px] snap-start flex-col items-center gap-2 rounded-2xl border px-3 py-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${
                active
                  ? "border-[var(--psp-accent)] bg-white/10 text-white"
                  : "border-white/10 bg-black/15 text-white/40"
              }`}
            >
              <Icon className="h-7 w-7" />
              <span className="text-xs font-semibold tracking-wide">{cat.label}</span>
            </button>
          );
        })}
      </nav>

      <main className="relative z-10 mt-7">
        <p className="text-xs uppercase tracking-[0.22em] text-white/40">{category.label}</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-3" role="list" aria-label={`${category.label} items`}>
          {category.items.map((categoryItem, index) => {
            const active = index === activeItemIndex;
            return (
              <button
                type="button"
                role="listitem"
                key={categoryItem.id}
                onClick={() => active ? onItemActivate(index) : onItemSelect(index)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${
                  active
                    ? "border-white/50 bg-white text-black"
                    : "border-white/10 bg-white/5 text-white/55"
                }`}
              >
                {categoryItem.image && (
                  <span
                    aria-hidden="true"
                    className="h-6 w-7 bg-contain bg-center bg-no-repeat drop-shadow-sm"
                    style={{ backgroundImage: `url(${categoryItem.image})` }}
                  />
                )}
                {categoryItem.title}
              </button>
            );
          })}
        </div>

        {item && (
          <section className="mt-5 rounded-3xl border border-white/12 bg-[var(--psp-panel)] p-6 shadow-2xl backdrop-blur-xl" aria-live="polite">
            {item.eyebrow && (
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--psp-accent)]">{item.eyebrow}</p>
            )}
            <h2 className="mt-1 text-3xl font-bold tracking-tight">{item.title}</h2>
            {item.subtitle && <p className="mt-2 text-sm text-white/60">{item.subtitle}</p>}
            <div className="my-5 h-px bg-white/12" />
            {item.description && <p className="whitespace-pre-line text-base leading-7 text-white/65">{item.description}</p>}

            {item.highlights && item.highlights.length > 0 && (
              <ul className="mt-5 space-y-2 text-sm text-white/60">
                {item.highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span className="text-[var(--psp-accent)]" aria-hidden="true">◆</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">{tag}</span>
                ))}
              </div>
            )}

            {item.activationLabel && (
              <button
                type="button"
                onClick={() => onItemActivate(activeItemIndex)}
                disabled={item.activationLabel === "Active"}
                className="mt-6 w-full rounded-2xl bg-[var(--psp-accent)] px-4 py-3 text-sm font-bold text-black transition active:scale-[0.99] disabled:opacity-50"
              >
                {item.activationLabel}
              </button>
            )}
          </section>
        )}
      </main>

      <footer className="relative z-10 mt-12 border-t border-white/10 pt-5 text-center text-[11px] uppercase tracking-[0.2em] text-white/30">
        Tap a section, then choose an item
      </footer>
    </div>
  );
}
