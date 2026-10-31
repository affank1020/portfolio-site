import assert from "node:assert/strict";
import test from "node:test";
import {
  galleryKeyboardDirection,
  shouldRestoreBackFocusAfterGalleryClick,
} from "../components/psp/project-gallery-keyboard.ts";

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

test("left and right move the focused project gallery", () => {
  assert.equal(galleryKeyboardDirection(key("ArrowLeft"), false), -1);
  assert.equal(galleryKeyboardDirection(key("ArrowRight"), false), 1);
  assert.equal(galleryKeyboardDirection(key("ArrowUp"), false), null);
  assert.equal(galleryKeyboardDirection(key("Enter"), false), null);
});

test("other controls retain modified, claimed and editing keys", () => {
  for (const modifier of ["shiftKey", "altKey", "ctrlKey", "metaKey"]) {
    assert.equal(galleryKeyboardDirection(key("ArrowRight", { [modifier]: true }), false), null);
  }
  assert.equal(galleryKeyboardDirection(key("ArrowLeft", { defaultPrevented: true }), false), null);
  assert.equal(galleryKeyboardDirection(key("ArrowLeft", { isComposing: true }), false), null);
  assert.equal(galleryKeyboardDirection(key("ArrowLeft"), true), null);
});

test("pointer navigation restores Back focus, keyboard activation does not", () => {
  assert.equal(shouldRestoreBackFocusAfterGalleryClick(1), true);
  assert.equal(shouldRestoreBackFocusAfterGalleryClick(2), true);
  assert.equal(shouldRestoreBackFocusAfterGalleryClick(0), false);
});
