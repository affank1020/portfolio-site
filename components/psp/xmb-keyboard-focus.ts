/**
 * The XMB's controller selection is independent of DOM focus. A pointer click
 * leaves focus on a menu button unless we release it, causing the next Enter to
 * activate that old button instead of the item selected with the arrow keys.
 *
 * Keyboard-created clicks have detail = 0: preserve focus for Tab/Enter users.
 */
export function releaseXmbFocusAfterPointerClick(event: {
  detail: number;
  currentTarget: { blur: () => void };
}): void {
  if (event.detail > 0) event.currentTarget.blur();
}

type XmbKeyInput = Pick<
  KeyboardEvent,
  "key" | "shiftKey" | "altKey" | "ctrlKey" | "metaKey" | "defaultPrevented" | "isComposing"
>;

interface XmbFocusContext {
  nativeControlFocused: boolean;
  buttonFocused: boolean;
}

const XMB_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"]);

/** Route only unclaimed controller keys; never swallow native input or link keys. */
export function shouldHandleXmbKeyboardEvent(
  event: XmbKeyInput,
  focus: XmbFocusContext
): boolean {
  if (event.defaultPrevented || event.isComposing) return false;
  if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return false;
  if (!XMB_KEYS.has(event.key) || focus.nativeControlFocused) return false;
  // An explicitly keyboard-focused button should still respond to Enter.
  // On Arrow, the caller blurs it after claiming the XMB navigation key.
  if (event.key === "Enter" && focus.buttonFocused) return false;
  return true;
}
