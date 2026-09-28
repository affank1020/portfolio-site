import type { XmbItem } from "./types";

interface XmbExperienceDetailProps {
  item: XmbItem;
  compact?: boolean;
}

export function XmbExperienceDetail({ item, compact = false }: XmbExperienceDetailProps) {
  return (
    <div className={compact ? "space-y-5" : "space-y-6"}>
      {compact ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[var(--psp-accent)]">Experience</p>
            {item.period && (
              <span className="shrink-0 rounded-full border border-[var(--psp-accent)]/35 bg-[var(--psp-accent)]/10 px-3 py-1.5 text-[0.68rem] font-semibold tracking-wide text-[var(--psp-accent)] shadow-sm">
                {item.period}
              </span>
            )}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">{item.title}</h2>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[var(--psp-accent)]">Experience</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-white drop-shadow-md">{item.title}</h2>
          </div>
          {item.period && (
            <span className="shrink-0 rounded-full border border-[var(--psp-accent)]/35 bg-[var(--psp-accent)]/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-[var(--psp-accent)] shadow-sm">
              {item.period}
            </span>
          )}
        </div>
      )}

      {item.subtitle && (
        <p className={`${compact ? "text-base" : "text-lg"} font-medium text-white/75`}>
          {item.subtitle}
        </p>
      )}

      {item.description && (
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--psp-accent)]" aria-hidden="true">
            <circle cx="12" cy="10" r="3" />
            <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" />
          </svg>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/35">Team &amp; location</p>
            <p className="mt-1 text-sm leading-6 text-white/70">{item.description}</p>
          </div>
        </div>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Technologies and disciplines">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60">
              {tag}
            </span>
          ))}
        </div>
      )}

      {item.highlights && item.highlights.length > 0 && (
        <ul className="grid gap-2 text-sm text-white/60" aria-label="Highlights">
          {item.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="text-[var(--psp-accent)]" aria-hidden="true">◆</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
