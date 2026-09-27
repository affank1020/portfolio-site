"use client";

import { motion } from "framer-motion";
import type { XmbItem } from "./types";

interface XmbExpandedDetailProps {
  item: XmbItem;
  onClose: () => void;
}

export function XmbExpandedDetail({ item, onClose }: XmbExpandedDetailProps) {
  const paragraphs = item.body?.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean) ?? [];
  const label = item.kind === "post" ? "Journal entry" : "Project file";
  const context = item.kind === "post" ? "AK / Journal" : "AK / Projects";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="xmb-expanded-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] overflow-hidden bg-black/55 px-5 py-5 backdrop-blur-xl sm:px-8 sm:py-8"
    >
      <motion.article
        initial={{ opacity: 0, y: 28, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.99 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="mx-auto flex max-h-[calc(100vh-2.5rem)] min-h-[calc(100vh-2.5rem)] max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-[var(--psp-panel)] shadow-2xl sm:max-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-4rem)]"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[var(--psp-panel)] px-6 py-5 backdrop-blur-xl sm:px-9">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--psp-accent)]">{label}</p>
            <p className="mt-1 text-sm text-white/45">{context}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-[var(--psp-accent)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
          >
            Esc&nbsp;&nbsp;Close
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-10 sm:px-12 sm:py-8 lg:px-16 lg:py-6">
          <div className="max-w-3xl">
            {item.eyebrow && <p className="text-xs uppercase tracking-[0.24em] text-[var(--psp-accent)]">{item.eyebrow}</p>}
            <h2 id="xmb-expanded-title" className="mt-3 text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl">
              {item.title}
            </h2>
            {item.subtitle && <p className="mt-5 text-base text-white/50 sm:text-lg">{item.subtitle}</p>}
            {item.description && <p className="mt-6 whitespace-pre-line text-xl leading-8 text-white/75 sm:text-2xl sm:leading-10">{item.description}</p>}
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/55">{tag}</span>
              ))}
            </div>
          )}

          <div className="my-6 h-px bg-gradient-to-r from-[var(--psp-accent)] via-white/10 to-transparent opacity-70" />

          <div className={`grid items-start gap-8 ${item.highlights && item.highlights.length > 0 ? "lg:grid-cols-[0.9fr_1.35fr]" : ""}`}>
            {item.highlights && item.highlights.length > 0 && (
              <section className="grid gap-3 rounded-3xl border border-white/10 bg-black/15 p-6 sm:grid-cols-3 sm:p-8 lg:grid-cols-1" aria-label="Highlights">
                {item.highlights.map((highlight) => (
                  <div key={highlight} className="flex gap-3 text-sm leading-6 text-white/65">
                    <span className="mt-1 text-[var(--psp-accent)]" aria-hidden="true">◆</span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </section>
            )}

            <div className="max-w-2xl space-y-7 text-lg leading-8 text-white/70">
              {(paragraphs.length > 0 ? paragraphs : [item.description]).filter(Boolean).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          {item.href && item.href !== "#" && (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 inline-flex rounded-full bg-[var(--psp-accent)] px-5 py-3 text-sm font-bold text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Open project ↗
            </a>
          )}
        </div>
      </motion.article>
    </motion.div>
  );
}
