"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const imageAspectRatios = new Map<string, number>();
let lastKnownAspectRatio: number | null = null;

interface GalleryFrameImageProps {
  src: string;
  alt: string;
  loading?: "eager" | "lazy";
  fit?: "contain" | "cover";
  className?: string;
}

/**
 * The parent owns a fixed-size, positioned frame. The image never contributes
 * intrinsic dimensions to layout, and a skeleton occupies the frame until it
 * loads (including when browsing to another image).
 */
export function GalleryFrameImage({
  src,
  alt,
  loading = "eager",
  fit = "contain",
  className = "",
}: GalleryFrameImageProps) {
  const [imageState, setImageState] = useState<{
    src: string;
    phase: "loading" | "loaded" | "error";
    aspectRatio: number | null;
  }>({ src, phase: "loading", aspectRatio: null });
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const frameRef = useRef<HTMLSpanElement>(null);
  const phase = imageState.src === src ? imageState.phase : "loading";
  const aspectRatio = imageState.src === src
    ? imageState.aspectRatio ?? imageAspectRatios.get(src) ?? lastKnownAspectRatio
    : imageAspectRatios.get(src) ?? lastKnownAspectRatio;

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setFrameSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const skeletonSize = aspectRatio && frameSize.width > 0 && frameSize.height > 0
    ? aspectRatio >= frameSize.width / frameSize.height
      ? { width: frameSize.width, height: frameSize.width / aspectRatio }
      : { width: frameSize.height * aspectRatio, height: frameSize.height }
    : undefined;

  const recordLoadedImage = useCallback((image: HTMLImageElement) => {
    const ratio = image.naturalWidth > 0 && image.naturalHeight > 0
      ? image.naturalWidth / image.naturalHeight
      : null;
    if (ratio) {
      imageAspectRatios.set(src, ratio);
      lastKnownAspectRatio = ratio;
    }
    setImageState({ src, phase: "loaded", aspectRatio: ratio });
  }, [src]);

  // Cached images may already be complete before React delivers onLoad.
  const imageRef = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete) {
      if (image.naturalWidth > 0) recordLoadedImage(image);
      else setImageState({ src, phase: "error", aspectRatio: null });
    }
  }, [recordLoadedImage, src]);

  return (
    <>
      <span ref={frameRef} aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {phase === "loading" && (
          <span
            className="animate-pulse rounded-md bg-gradient-to-br from-white/[0.13] via-white/[0.04] to-white/[0.1] motion-reduce:animate-none"
            style={skeletonSize ?? { width: "100%", height: "100%" }}
          />
        )}
      </span>
      {phase === "error" && (
        <span role="status" className="pointer-events-none absolute inset-0 grid place-items-center text-xs text-white/45">
          Image unavailable
        </span>
      )}
      {/* Atlas media URLs may differ by deployment; use a host-agnostic image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={(event) => recordLoadedImage(event.currentTarget)}
        onError={() => setImageState({ src, phase: "error", aspectRatio: null })}
        className={[
          "pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-200 motion-reduce:transition-none",
          fit === "cover" ? "object-cover" : "object-contain",
          phase === "loaded" ? "opacity-100" : "opacity-0",
          className,
        ].join(" ")}
      />
    </>
  );
}
