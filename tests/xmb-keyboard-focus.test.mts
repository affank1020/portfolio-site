import assert from "node:assert/strict";
import test from "node:test";
import {
  releaseXmbFocusAfterPointerClick,
  shouldHandleXmbKeyboardEvent,
} from "../components/psp/xmb-keyboard-focus.ts";

function key(keyName: string, overrides: Record<string, unknown> = {}) {
  return {
    key: keyName,
    shiftKey: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    defaultPrevented: false,
    isComposing: false,
    ...overrides,
  };
}
const pageFocus = { nativeControlFocused: false, buttonFocused: false };

test("pointer clicks release stale focus from both XMB navigation buttons", () => {
  for (const detail of [1, 2]) {
    let blurs = 0;
    releaseXmbFocusAfterPointerClick({ detail, currentTarget: { blur: () => blurs++ } });
    assert.equal(blurs, 1);
  }
});

test("keyboard and programmatic button activation retain native focus", () => {
  let blurs = 0;
  releaseXmbFocusAfterPointerClick({ detail: 0, currentTarget: { blur: () => blurs++ } });
  assert.equal(blurs, 0);
});

test("unfocused Enter activates XMB selection; focused-button Enter stays native", () => {
  assert.equal(shouldHandleXmbKeyboardEvent(key("Enter"), pageFocus), true);
  assert.equal(shouldHandleXmbKeyboardEvent(key("Enter"), { ...pageFocus, buttonFocused: true }), false);
  assert.equal(shouldHandleXmbKeyboardEvent(key("ArrowRight"), { ...pageFocus, buttonFocused: true }), true);
  assert.equal(shouldHandleXmbKeyboardEvent(key("ArrowDown"), { ...pageFocus, buttonFocused: true }), true);
});

test("links, editable controls and shortcuts keep their native keyboard actions", () => {
  const nativeFocus = { ...pageFocus, nativeControlFocused: true };
  for (const pressedKey of ["Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]) {
    assert.equal(shouldHandleXmbKeyboardEvent(key(pressedKey), nativeFocus), false);
  }
  for (const modifier of ["shiftKey", "ctrlKey", "altKey", "metaKey"]) {
    assert.equal(shouldHandleXmbKeyboardEvent(key("ArrowLeft", { [modifier]: true }), pageFocus), false);
  }
  assert.equal(shouldHandleXmbKeyboardEvent(key("Enter", { defaultPrevented: true }), pageFocus), false);
  assert.equal(shouldHandleXmbKeyboardEvent(key("Enter", { isComposing: true }), pageFocus), false);
  assert.equal(shouldHandleXmbKeyboardEvent(key("Space"), pageFocus), false);
});
