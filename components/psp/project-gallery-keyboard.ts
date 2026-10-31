type GalleryKeyEvent = Pick<
  KeyboardEvent,
  "key" | "shiftKey" | "altKey" | "ctrlKey" | "metaKey" | "defaultPrevented" | "isComposing"
>;

/** Return a gallery movement only for an unmodified, unclaimed horizontal arrow. */
export function galleryKeyboardDirection(
  event: GalleryKeyEvent,
  editableFocused: boolean,
): -1 | 1 | null {
  if (editableFocused || event.defaultPrevented || event.isComposing) return null;
  if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return null;
  if (event.key === "ArrowLeft") return -1;
  if (event.key === "ArrowRight") return 1;
  return null;
}

/** Pointer clicks must not leave focus on a gallery button and hijack the next Enter. */
export function shouldRestoreBackFocusAfterGalleryClick(clickDetail: number): boolean {
  return clickDetail > 0;
}
