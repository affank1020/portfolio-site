"use client";

import { useCallback, useEffect, useRef, useState, type AriaRole, type ReactNode } from "react";

interface HorizontalScrollFadeProps {
  children: ReactNode;
  className?: string;
  viewportClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  resetKey?: string | number;
  role?: AriaRole;
  ariaLabel?: string;
}

export function HorizontalScrollFade({
  children,
  className,
  viewportClassName,
  contentClassName,
  disabled = false,
  resetKey,
  role,
  ariaLabel,
}: HorizontalScrollFadeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateEdges = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const remaining = viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft;
    setCanScrollLeft(viewport.scrollLeft > 2);
    setCanScrollRight(remaining > 2);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const frame = window.requestAnimationFrame(updateEdges);
    const observer = new ResizeObserver(updateEdges);
    observer.observe(viewport);
    observer.observe(content);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [children, updateEdges]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || resetKey === undefined) return;
    viewport.scrollLeft = 0;
    updateEdges();
  }, [resetKey, updateEdges]);

  const maskImage = canScrollLeft && canScrollRight
    ? "linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)"
    : canScrollLeft
      ? "linear-gradient(to right, transparent, black 28px, black 100%)"
      : canScrollRight
        ? "linear-gradient(to right, black 0, black calc(100% - 28px), transparent)"
        : "none";

  return (
    <div className={`relative min-w-0 ${className ?? ""}`}>
      <div
        ref={viewportRef}
        role={role}
        aria-label={ariaLabel}
        data-scroll-fade-left={canScrollLeft ? "true" : "false"}
        data-scroll-fade-right={canScrollRight ? "true" : "false"}
        onScroll={updateEdges}
        className={`${disabled ? "overflow-x-hidden" : "overflow-x-auto"} snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${viewportClassName ?? ""}`}
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <div ref={contentRef} className={`w-max min-w-full ${contentClassName ?? ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
