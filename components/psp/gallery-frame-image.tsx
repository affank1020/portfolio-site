"use client";

import { useCallback, useState } from "react";

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
  }>({ src, phase: "loading" });
  const phase = imageState.src === src ? imageState.phase : "loading";

  // Cached images may already be complete before React delivers onLoad.
  const imageRef = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete) {
      setImageState({ src, phase: image.naturalWidth > 0 ? "loaded" : "error" });
    }
  }, [src]);

  return (
    <>
      {phase === "loading" && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 animate-pulse bg-white/[0.055] motion-reduce:animate-none">
          <span className="absolute inset-[12%] rounded-md bg-white/[0.035]" />
        </span>
      )}
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
        onLoad={() => setImageState({ src, phase: "loaded" })}
        onError={() => setImageState({ src, phase: "error" })}
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
