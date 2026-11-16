"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { galleryKeyboardDirection, shouldRestoreBackFocusAfterGalleryClick } from "./project-gallery-keyboard";
import { GalleryFrameImage } from "./gallery-frame-image";

interface ProjectGalleryProps {
  images: string[];
  title: string;
  variant?: "default" | "focus";
  pinned?: boolean;
  onPointerNavigate?: () => void;
}

interface GalleryProgressProps {
  images: string[];
  activeIndex: number;
  onSelect: (index: number, event: MouseEvent<HTMLButtonElement>) => void;
  overlay?: boolean;
}

function GalleryProgress({ images, activeIndex, onSelect, overlay = false }: GalleryProgressProps) {
  return (
    <div className={`psp-gallery-progress ${overlay ? "psp-gallery-progress--overlay" : ""}`} role="group" aria-label="Choose gallery image">
      {images.map((src, index) => (
        <button
          type="button"
          key={src + index}
          onClick={(event) => onSelect(index, event)}
          aria-label={`Show image ${index + 1} of ${images.length}`}
          aria-current={index === activeIndex ? "step" : undefined}
          aria-pressed={index === activeIndex}
          className={`psp-gallery-progress__step ${index === activeIndex ? "psp-gallery-progress__step--active" : ""}`}
        />
      ))}
      <span className="sr-only" aria-live="polite">Image {activeIndex + 1} of {images.length}</span>
    </div>
  );
}

export function ProjectGallery({ images, title, variant = "default", onPointerNavigate }: ProjectGalleryProps) {
  const focused = variant === "focus";
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const activeImage = images[activeIndex];

  const move = useCallback((direction: number) => {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  }, [images.length]);

  const restoreBackFocusAfterClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (shouldRestoreBackFocusAfterGalleryClick(event.detail)) onPointerNavigate?.();
  };
  const selectImage = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    setActiveIndex(index);
    if (!lightboxOpen) restoreBackFocusAfterClick(event);
  };

  // The focused gallery owns vertical arrows before the portfolio controller
  // sees them, regardless of which project control currently has focus.
  useEffect(() => {
    if (!focused || lightboxOpen || images.length < 2) return;
    const onKeyDown = (event: KeyboardEvent) => {
      // The mobile detail component remains mounted inside a display:none
      // wrapper on desktop. It must not consume keys before the visible gallery.
      if (!galleryRef.current?.getClientRects().length) return;
      const target = event.target instanceof Element ? event.target : null;
      const editableFocused = Boolean(target?.closest(
        'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="slider"], [role="spinbutton"]'
      ));
      const direction = galleryKeyboardDirection(event, editableFocused);
      if (direction === null) return;
      event.preventDefault();
      event.stopPropagation();
      move(direction);
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [focused, lightboxOpen, images.length, move]);

  useEffect(() => {
    if (lightboxOpen || focused || images.length < 2) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || !galleryRef.current?.contains(target)) return;
      const editableFocused = Boolean(target.closest(
        'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="slider"], [role="spinbutton"]'
      ));
      const direction = galleryKeyboardDirection(event, editableFocused);
      if (direction === null) return;

      event.preventDefault();
      event.stopPropagation();
      move(direction);
    };

    // Keep page scrolling available unless a regular gallery control is focused.
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [focused, images.length, lightboxOpen, move]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const galleryElement = galleryRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      // Capture before the XMB's global keyboard listener, so Escape closes
      // only the lightbox rather than also leaving the project focus view.
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setLightboxOpen(false);
      } else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        // No keyboard navigation should leak through to the XMB behind the dialog.
        event.preventDefault();
        event.stopPropagation();
        if (images.length > 1 && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
          move(event.key === "ArrowUp" ? -1 : 1);
        }
      } else if (event.key === "Tab") {
        const buttons = Array.from(lightboxRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled]):not([tabindex=\"-1\"])") ?? []);
        if (!buttons.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (!lightboxRef.current?.contains(document.activeElement)) {
          event.preventDefault();
          closeButtonRef.current?.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      if (focused && galleryElement?.isConnected) {
        galleryElement.focus({ preventScroll: true });
      } else if (previousFocus?.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [focused, lightboxOpen, images.length, move]);

  if (!activeImage) return null;

  return (
    <section
      ref={galleryRef}
      tabIndex={focused ? -1 : undefined}
      className={focused ? "psp-gallery--focus w-full min-w-0" : "mt-10"}
      aria-label={`${title} gallery`}
    >
      <div className={focused
        ? "psp-gallery-stage"
        : "relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 shadow-2xl"
      }>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={"Enlarge image " + (activeIndex + 1) + " of " + images.length}
          title="Enlarge image"
          className={focused
            ? "psp-gallery-image-trigger select-none"
            : "relative block aspect-video w-full cursor-zoom-in bg-white/[0.035] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--psp-accent)]"
          }
        >
          <GalleryFrameImage
            key={activeImage}
            src={activeImage}
            alt={title + " project view " + (activeIndex + 1)}
            className={focused ? "" : "p-2 sm:p-3"}
          />
        </button>

        {images.length > 1 && (
          <GalleryProgress
            images={images}
            activeIndex={activeIndex}
            onSelect={selectImage}
            overlay={!focused}
          />
        )}
      </div>

      {images.length > 1 && !focused && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2" role="list" aria-label="Choose gallery image">
          {images.map((src, index) => (
            <button
              type="button"
              role="listitem"
              key={src}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              className={`relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] sm:w-36 ${index === activeIndex ? "border-[var(--psp-accent)] opacity-100" : "border-white/10 opacity-45 hover:opacity-75"}`}
            >
              <GalleryFrameImage src={src} alt="" loading="lazy" fit="cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && typeof document !== "undefined" && createPortal(
        <div ref={lightboxRef} role="dialog" aria-modal="true" aria-label={`${title} enlarged image`} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 px-5 py-14 text-white">
          <button type="button" tabIndex={-1} onClick={() => setLightboxOpen(false)} aria-label="Close enlarged image" className="absolute inset-0 cursor-zoom-out" />
          <div className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center gap-5">
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => setLightboxOpen(false)}
              aria-label="Close image viewer"
              className="pointer-events-auto absolute right-0 -top-10 px-2 py-1 text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >Close ×</button>
            <div className="pointer-events-auto relative min-h-0 w-full max-w-[min(92vw,90rem)] flex-1">
              <GalleryFrameImage
                key={activeImage}
                src={activeImage}
                alt={title + " project view " + (activeIndex + 1)}
                className="p-1"
              />
            </div>
            {images.length > 1 && (
              <GalleryProgress images={images} activeIndex={activeIndex} onSelect={selectImage} />
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
