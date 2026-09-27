import type { CSSProperties } from "react";

export const PSP_THEME_NAMES = ["classic", "slate", "aurora", "ember", "pop", "deep-space"] as const;
export type PspThemeName = (typeof PSP_THEME_NAMES)[number];

type PspTheme = { label: string; description: string; background: string; foreground: string; muted: string; accent: string; waveA: string; waveB: string; panel: string; font: string; };

export const PSP_THEMES: Record<PspThemeName, PspTheme> = {
  slate: { label: "Slate", description: "Flat charcoal crossed by slow glassy planes and scattered glints.", background: "#0c0d10", foreground: "#f4f5f7", muted: "#9a9da5", accent: "#aeb7c6", waveA: "rgba(255,255,255,.025)", waveB: "rgba(255,255,255,.012)", panel: "rgba(18,19,23,.92)", font: "var(--font-dm-sans)" },
  classic: { label: "Classic", description: "The familiar blue system field with flowing translucent ribbons.", background: "#062766", foreground: "#f7fbff", muted: "#adc1df", accent: "#80caff", waveA: "rgba(72,153,255,.13)", waveB: "rgba(218,240,255,.06)", panel: "rgba(7,39,94,.88)", font: "var(--font-space-grotesk)" },
  aurora: { label: "Aurora", description: "Soft luminous curtains moving independently through deep violet.", background: "#08051a", foreground: "#fbf8ff", muted: "#b8adca", accent: "#a995ff", waveA: "rgba(111,76,255,.1)", waveB: "rgba(44,225,205,.07)", panel: "rgba(17,11,39,.88)", font: "var(--font-bricolage)" },
  ember: { label: "Ember", description: "A breathing heat source with a controlled field of rising sparks.", background: "#0d0703", foreground: "#fff7ea", muted: "#c5ad94", accent: "#ffad55", waveA: "rgba(240,111,35,.11)", waveB: "rgba(255,190,84,.05)", panel: "rgba(31,16,7,.9)", font: "var(--font-bricolage)" },
  pop: { label: "Pop", description: "A vibrant composition of floating colour fields with soft collisions.", background: "#14082e", foreground: "#fffaff", muted: "#d2bbdc", accent: "#fff06a", waveA: "rgba(255,61,154,.11)", waveB: "rgba(55,226,255,.07)", panel: "rgba(31,12,52,.88)", font: "var(--font-syne)" },
  "deep-space": { label: "Deep Space", description: "A near-black star field with distant nebulae and patient orbital drift.", background: "#02040d", foreground: "#f2f5ff", muted: "#929bb8", accent: "#8aa8ff", waveA: "rgba(71,91,190,.08)", waveB: "rgba(132,69,180,.05)", panel: "rgba(5,8,22,.92)", font: "var(--font-space-grotesk)" },
};

export function getPspThemeStyle(name: PspThemeName): CSSProperties {
  const theme = PSP_THEMES[name];
  return { ["--psp-bg" as string]: theme.background, ["--psp-fg" as string]: theme.foreground, ["--psp-muted" as string]: theme.muted, ["--psp-accent" as string]: theme.accent, ["--psp-wave-a" as string]: theme.waveA, ["--psp-wave-b" as string]: theme.waveB, ["--psp-panel" as string]: theme.panel, ["--psp-font-ui" as string]: theme.font };
}

export function isPspThemeName(value: string | null): value is PspThemeName { return PSP_THEME_NAMES.includes(value as PspThemeName); }
