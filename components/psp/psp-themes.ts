import type { CSSProperties } from "react";

export type PspThemeName = "midnight" | "aurora" | "ember" | "arctic";

type PspTheme = {
  background: string;
  foreground: string;
  muted: string;
  accent: string;
  waveA: string;
  waveB: string;
  panel: string;
};

export const PSP_THEMES: Record<PspThemeName, PspTheme> = {
  midnight: {
    background: "#020306",
    foreground: "#f7f9ff",
    muted: "#9aa4b7",
    accent: "#8eb7ff",
    waveA: "rgba(54, 104, 196, 0.18)",
    waveB: "rgba(130, 167, 255, 0.08)",
    panel: "rgba(11, 15, 24, 0.78)",
  },
  aurora: {
    background: "#060313",
    foreground: "#fbf8ff",
    muted: "#b6a9c9",
    accent: "#9f8cff",
    waveA: "rgba(103, 70, 255, 0.3)",
    waveB: "rgba(32, 210, 198, 0.18)",
    panel: "rgba(16, 8, 37, 0.78)",
  },
  ember: {
    background: "#0a0603",
    foreground: "#fff8ed",
    muted: "#c5ad95",
    accent: "#ffad55",
    waveA: "rgba(240, 111, 35, 0.26)",
    waveB: "rgba(255, 190, 84, 0.12)",
    panel: "rgba(29, 15, 7, 0.8)",
  },
  arctic: {
    background: "#071019",
    foreground: "#f3fbff",
    muted: "#9fb4c2",
    accent: "#78d8ff",
    waveA: "rgba(55, 175, 225, 0.24)",
    waveB: "rgba(182, 230, 255, 0.12)",
    panel: "rgba(7, 25, 36, 0.8)",
  },
};

export function getPspThemeStyle(name: PspThemeName): CSSProperties {
  const theme = PSP_THEMES[name];
  return {
    ["--psp-bg" as string]: theme.background,
    ["--psp-fg" as string]: theme.foreground,
    ["--psp-muted" as string]: theme.muted,
    ["--psp-accent" as string]: theme.accent,
    ["--psp-wave-a" as string]: theme.waveA,
    ["--psp-wave-b" as string]: theme.waveB,
    ["--psp-panel" as string]: theme.panel,
  };
}

export function isPspThemeName(value: string | null): value is PspThemeName {
  return value === "midnight" || value === "aurora" || value === "ember" || value === "arctic";
}
