"use client";

import type { XmbCategory } from "./types";

interface PspMobileSettingsProps {
  category: XmbCategory;
  onActivate: (index: number) => void;
}

export function PspMobileSettings({ category, onActivate }: PspMobileSettingsProps) {
  const backIndex = category.items.findIndex((item) => item.action === "settings-back");
  const choosingTheme = backIndex >= 0;

  if (choosingTheme) {
    return (
      <section aria-labelledby="mobile-theme-settings-title">
        <button
          type="button"
          onClick={() => onActivate(backIndex)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65 transition active:scale-[0.98]"
        >
          <span aria-hidden="true">←</span>
          Settings
        </button>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.22em] text-white/40">Appearance</p>
          <h2 id="mobile-theme-settings-title" className="mt-2 text-3xl font-bold tracking-tight">Theme</h2>
          <p className="mt-2 text-sm leading-6 text-white/50">Choose the colour, typography and ambient motion used by the portfolio.</p>
        </div>

        <div className="mt-6 grid gap-3">
          {category.items.map((theme, index) => {
            if (theme.action === "settings-back") return null;

            return (
              <button
                type="button"
                key={theme.id}
                onClick={() => onActivate(index)}
                disabled={theme.selected}
                aria-pressed={theme.selected}
                style={{ fontFamily: theme.fontFamily }}
                className={`rounded-2xl border p-5 text-left transition active:scale-[0.99] disabled:cursor-default ${
                  theme.selected
                    ? "border-[var(--psp-accent)] bg-white/10"
                    : "border-white/10 bg-black/15"
                }`}
              >
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-lg font-semibold text-white">{theme.title}</span>
                    <span className="mt-2 block text-sm leading-6 text-white/50">{theme.description}</span>
                  </span>
                  <span
                    className={`mt-1 h-3 w-3 shrink-0 rounded-full border ${
                      theme.selected
                        ? "border-[var(--psp-accent)] bg-[var(--psp-accent)] shadow-[0_0_12px_var(--psp-accent)]"
                        : "border-white/25"
                    }`}
                    aria-hidden="true"
                  />
                </span>
                <span className={`mt-4 block text-xs font-semibold uppercase tracking-[0.18em] ${theme.selected ? "text-[var(--psp-accent)]" : "text-white/35"}`}>
                  {theme.selected ? "Active" : "Apply theme"}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="mobile-settings-title">
      <p className="text-xs uppercase tracking-[0.22em] text-white/40">Preferences</p>
      <h2 id="mobile-settings-title" className="mt-2 text-3xl font-bold tracking-tight">Settings</h2>
      <p className="mt-2 text-sm leading-6 text-white/50">Adjust the look and movement of the portfolio on this device.</p>

      <div className="mt-7 overflow-hidden rounded-3xl border border-white/10 bg-[var(--psp-panel)] shadow-2xl backdrop-blur-xl">
        {category.items.map((setting, index) => {
          const isMotion = setting.action === "motion";

          return (
            <button
              type="button"
              key={setting.id}
              onClick={() => onActivate(index)}
              role={isMotion ? "switch" : undefined}
              aria-checked={isMotion ? Boolean(setting.selected) : undefined}
              className="flex w-full items-center justify-between gap-5 border-b border-white/10 px-5 py-5 text-left last:border-b-0 active:bg-white/5"
            >
              <span className="min-w-0">
                <span className="block text-base font-semibold text-white">{setting.title}</span>
                <span className="mt-1 block text-sm leading-5 text-white/45">{setting.description}</span>
              </span>

              {isMotion ? (
                <span
                  className={`relative h-7 w-12 shrink-0 rounded-full border transition ${
                    setting.selected
                      ? "border-[var(--psp-accent)] bg-[var(--psp-accent)]"
                      : "border-white/15 bg-white/10"
                  }`}
                  aria-hidden="true"
                >
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${setting.selected ? "translate-x-6" : "translate-x-1"}`} />
                </span>
              ) : (
                <span className="flex shrink-0 items-center gap-2 text-sm text-white/45">
                  <span>{setting.subtitle}</span>
                  <span className="text-xl text-white/30" aria-hidden="true">›</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
