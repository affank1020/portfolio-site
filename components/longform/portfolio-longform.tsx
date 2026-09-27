import Link from "next/link";
import { getPspThemeStyle } from "@/components/psp/psp-themes";

interface PortfolioLongformProps {
  label: string;
  title: string;
  meta?: string;
  excerpt?: string;
  body?: string;
  tags?: string[];
  highlights?: string[];
  links?: Array<{ label: string; href: string }>;
  images?: string[];
}

export function PortfolioLongform({
  label,
  title,
  meta,
  excerpt,
  body,
  tags = [],
  highlights = [],
  links = [],
  images = [],
}: PortfolioLongformProps) {
  const paragraphs = body?.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean) ?? [];

  return (
    <main
      style={getPspThemeStyle("slate")}
      className="psp-shell relative min-h-screen overflow-hidden bg-[var(--psp-bg)] text-[var(--psp-fg)]"
    >
      <div className="psp-ambient fixed inset-0" aria-hidden="true">
        <div className="psp-wave psp-wave-a" />
        <div className="psp-wave psp-wave-b" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-8 sm:px-10 sm:pt-12">
        <nav className="flex items-center justify-between border-b border-white/10 pb-6" aria-label="Article navigation">
          <Link
            href="/"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-[var(--psp-accent)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
          >
            ← Back to XMB
          </Link>
          <span className="text-xs uppercase tracking-[0.24em] text-white/35">AK / {label}</span>
        </nav>

        <article className="pt-16 sm:pt-24">
          <header className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--psp-accent)]">{label}</p>
            <h1 className="mt-5 text-5xl font-bold tracking-[-0.04em] sm:text-7xl">{title}</h1>
            {meta && <p className="mt-5 text-base text-white/50 sm:text-lg">{meta}</p>}
            {excerpt && <p className="mt-8 text-xl leading-8 text-white/70 sm:text-2xl sm:leading-10">{excerpt}</p>}
          </header>

          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/55">{tag}</span>
              ))}
            </div>
          )}

          <div className="my-12 h-px bg-gradient-to-r from-[var(--psp-accent)]/70 via-white/10 to-transparent" />

          {highlights.length > 0 && (
            <section className="mb-14 grid gap-3 rounded-3xl border border-white/10 bg-[var(--psp-panel)] p-6 backdrop-blur-xl sm:grid-cols-3 sm:p-8" aria-labelledby="highlights-title">
              <h2 id="highlights-title" className="sr-only">Highlights</h2>
              {highlights.map((highlight) => (
                <div key={highlight} className="flex gap-3 text-sm leading-6 text-white/65">
                  <span className="mt-1 text-[var(--psp-accent)]" aria-hidden="true">◆</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </section>
          )}

          <div className="max-w-2xl space-y-7 text-lg leading-8 text-white/70">
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          {images.length > 0 && (
            <div className="mt-16 grid gap-6 sm:grid-cols-2">
              {images.map((src, index) => (
                // Contentful assets may use different domains, so the native element keeps this renderer provider-agnostic.
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt={`${title} project view ${index + 1}`} className="w-full rounded-3xl border border-white/10 bg-white/5 object-cover" />
              ))}
            </div>
          )}

          {links.length > 0 && (
            <footer className="mt-16 flex flex-wrap gap-3 border-t border-white/10 pt-8">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[var(--psp-accent)] px-5 py-3 text-sm font-bold text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {link.label} ↗
                </a>
              ))}
            </footer>
          )}
        </article>
      </div>
    </main>
  );
}
