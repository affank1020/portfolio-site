import type { XmbItem } from "./types";

interface XmbBlogDetailProps {
  item: XmbItem;
  compact?: boolean;
  onRead?: () => void;
}

export function XmbBlogDetail({ item, compact = false, onRead }: XmbBlogDetailProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[var(--psp-accent)]">Blog post</p>
        {item.date && (
          <time className="shrink-0 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold tracking-wide text-white/65">
            {item.date}
          </time>
        )}
      </div>

      <div>
        <h2 className={`${compact ? "text-3xl" : "text-4xl"} font-bold tracking-tight text-white drop-shadow-md`}>
          {item.title}
        </h2>
        {item.description && (
          <p className={`${compact ? "mt-4 text-base leading-7" : "mt-4 text-lg leading-8"} text-white/70`}>
            {item.description}
          </p>
        )}
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Post topics">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[var(--psp-accent)]/20 bg-[var(--psp-accent)]/[0.08] px-3 py-1.5 text-xs font-medium text-white/65">
              {tag}
            </span>
          ))}
        </div>
      )}

      {item.activationLabel && onRead && (
        <button
          type="button"
          onClick={onRead}
          className={`${compact ? "w-full justify-center" : "w-fit"} flex items-center gap-2 rounded-full bg-[var(--psp-accent)] px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}
        >
          <span>{item.activationLabel}</span>
          <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}
