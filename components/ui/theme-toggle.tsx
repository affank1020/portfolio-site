"use client";

import { useState, useEffect } from "react";
import type { ThemeName } from "@/lib/theme";

export function ThemeToggle({ themeName, onToggle }: { themeName: ThemeName; onToggle: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const isDark = themeName === "dark";

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-sm shadow-black/5"
      >
        <span className="relative flex h-6 w-10 items-center rounded-full border border-border bg-background p-0.5" />
        <span className="uppercase tracking-[0.25em] text-muted-foreground opacity-0" style={{ fontFamily: "'Geist Mono', monospace" }}>
          Light
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-sm shadow-black/5 transition-colors hover:bg-secondary"
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="relative flex h-6 w-10 items-center rounded-full border border-border bg-background p-0.5" aria-hidden="true">
        <span
          className="h-4 w-4 rounded-full transition-transform duration-300"
          style={{
            transform: isDark ? "translateX(16px)" : "translateX(0)",
            background: "var(--accent)",
          }}
        />
      </span>
      <span className="uppercase tracking-[0.25em] text-muted-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
