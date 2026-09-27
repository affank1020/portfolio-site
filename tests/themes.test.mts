import assert from "node:assert/strict";
import test from "node:test";

import { applyThemeVariables, getThemeStyle, hexToRgba, themes } from "../lib/theme.ts";
import {
  getPspThemeStyle,
  isPspThemeName,
  PSP_THEMES,
  PSP_THEME_NAMES,
} from "../components/psp/psp-themes.ts";

test("recognises every supported PSP theme and rejects unknown values", () => {
  for (const theme of PSP_THEME_NAMES) assert.equal(isPspThemeName(theme), true);
  assert.equal(isPspThemeName("midnight"), false);
  assert.equal(isPspThemeName(null), false);
});

test("creates the complete PSP CSS variable set", () => {
  const style = getPspThemeStyle("classic") as Record<string, string>;

  assert.equal(style["--psp-bg"], PSP_THEMES.classic.background);
  assert.equal(style["--psp-accent"], PSP_THEMES.classic.accent);
  assert.equal(style["--psp-font-ui"], PSP_THEMES.classic.font);
  assert.equal(Object.keys(style).length, 8);
});

test("creates and applies the classic site theme variables", () => {
  const style = getThemeStyle("dark") as Record<string, string>;
  const applied = new Map<string, string>();
  const declaration = {
    setProperty: (name: string, value: string) => applied.set(name, value),
  } as unknown as CSSStyleDeclaration;

  applyThemeVariables(declaration, "dark");

  assert.equal(style["--background"], themes.dark.background);
  assert.equal(applied.get("--background"), themes.dark.background);
  assert.equal(applied.get("--accent"), themes.dark.accent);
  assert.equal(applied.size, 8);
});

test("converts short and long hex colours to rgba", () => {
  assert.equal(hexToRgba("#abc", 0.5), "rgba(170, 187, 204, 0.5)");
  assert.equal(hexToRgba("112233", 1), "rgba(17, 34, 51, 1)");
});
