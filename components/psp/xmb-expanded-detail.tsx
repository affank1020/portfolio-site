"use client";

import { motion } from "framer-motion";
import type { XmbItem } from "./types";
import { MarkdownText } from "./markdown-text";
import { ProjectGallery } from "./project-gallery";

interface XmbExpandedDetailProps {
  item: XmbItem;
  onClose: () => void;
}

export function XmbExpandedDetail({ item, onClose }: XmbExpandedDetailProps) {
  const links = [
    ...(item.links ?? []),
    ...(item.href && item.href !== "#" && !item.links?.some((link) => link.url === item.href)
      ? [{ label: "Open project", url: item.href }]
      : []),
  ];

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
        className="relative mx-auto flex max-h-[calc(100vh-2.5rem)] min-h-[calc(100vh-2.5rem)] max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-[var(--psp-panel)] shadow-2xl sm:max-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-4rem)]"
      >
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="absolute right-5 top-5 z-20 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-sm text-white/70 shadow-lg backdrop-blur-xl transition hover:border-[var(--psp-accent)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] sm:right-7 sm:top-7"
        >
          Esc&nbsp;&nbsp;Close
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-20 sm:px-12 sm:pb-8 lg:px-16 lg:pb-6">
          {item.kind === "post" ? (
            <article className="mx-auto max-w-3xl pb-12">
              <header>
                {item.date && (
                  <time className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/55">
                    {item.date}
                  </time>
                )}
                <h2 id="xmb-expanded-title" className="mt-6 text-4xl font-bold tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="mt-6 text-lg leading-8 text-white/65 sm:text-xl sm:leading-9">{item.description}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2" aria-label="Post topics">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[var(--psp-accent)]/20 bg-[var(--psp-accent)]/[0.08] px-3 py-1.5 text-xs font-medium text-white/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              <div className="my-8 h-px bg-gradient-to-r from-[var(--psp-accent)] via-white/10 to-transparent opacity-70" />

              {item.body && <MarkdownText variant="body">{item.body}</MarkdownText>}
            </article>
          ) : <>
          <div>
            {item.eyebrow && <p className="text-xs uppercase tracking-[0.24em] text-[var(--psp-accent)]">{item.eyebrow}</p>}
            <h2 id="xmb-expanded-title" className="mt-3 text-4xl font-bold tracking-[-0.035em] text-white sm:text-5xl">
              {item.title}
            </h2>
            {item.subtitle && <p className="mt-5 text-base text-white/50 sm:text-lg">{item.subtitle}</p>}
            {item.description && (
              <div className="mt-6">
                <MarkdownText variant="lead">{item.description}</MarkdownText>
              </div>
            )}
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

            {item.body && (
              <div>
                <MarkdownText variant="body">{item.body}</MarkdownText>
              </div>
            )}
          </div>

          {item.gallery && item.gallery.length > 0 && (
            <ProjectGallery images={item.gallery} title={item.title} />
          )}

          {links.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-3" aria-label="Project links">
              {links.map((link, index) => (
                <a
                  key={`${link.url}-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-[var(--psp-accent)] px-5 py-3 text-sm font-bold text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}
          </>}
        </div>
      </motion.article>
    </motion.div>
  );
}
