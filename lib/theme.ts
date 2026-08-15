import type { CSSProperties } from "react";

export type ThemeName = "light" | "dark";

export type ThemeTokens = {
  background: string;
  foreground: string;
  card: string;
  secondary: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  border: string;
};

export const themes: Record<ThemeName, ThemeTokens> = {
  light: {
    background: "#f5f3ef",
    foreground: "#141210",
    card: "#efecea",
    secondary: "#ebe8e3",
    muted: "#e5e2dc",
    mutedForeground: "#7a7570",
    accent: "#f04400",
    border: "rgba(20, 18, 16, 0.1)",
  },
  dark: {
    background: "#111319",
    foreground: "#f4efe8",
    card: "#181c24",
    secondary: "#202635",
    muted: "#252b3b",
    mutedForeground: "#9ca3af",
    accent: "#ff7a45",
    border: "rgba(244, 239, 232, 0.12)",
  },
};

export function getThemeStyle(themeName: ThemeName): CSSProperties {
  const theme = themes[themeName];

  return {
    ["--background" as never]: theme.background,
    ["--foreground" as never]: theme.foreground,
    ["--card" as never]: theme.card,
    ["--secondary" as never]: theme.secondary,
    ["--muted" as never]: theme.muted,
    ["--muted-foreground" as never]: theme.mutedForeground,
    ["--accent" as never]: theme.accent,
    ["--border" as never]: theme.border,
  };
}

export function applyThemeVariables(style: CSSStyleDeclaration, themeName: ThemeName) {
  const theme = themes[themeName];

  style.setProperty("--background", theme.background);
  style.setProperty("--foreground", theme.foreground);
  style.setProperty("--card", theme.card);
  style.setProperty("--secondary", theme.secondary);
  style.setProperty("--muted", theme.muted);
  style.setProperty("--muted-foreground", theme.mutedForeground);
  style.setProperty("--accent", theme.accent);
  style.setProperty("--border", theme.border);
}

export function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const expanded = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}