"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";

/**
 * A picture the reader can open larger: the thumbnail is a button with a small "enlarge" badge, and it opens a
 * native modal dialog (Esc, the close button or a click outside closes it; focus returns to the thumbnail).
 * Used only where the original has more to show than the card's size allows (the wall photos, the phone screens);
 * the larger view is at most half the original's pixel width, so it stays sharp on high-density screens.
 */
export function Zoom({
  src,
  alt,
  width,
  height,
  sizes,
  quality = 90,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  quality?: number;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = () => ref.current?.showModal();
  const close = () => ref.current?.close();
  return (
    <>
      <button type="button" className="cf-zoom" onClick={open} aria-haspopup="dialog" style={{ "--ar": `${width} / ${height}` } as CSSProperties}>
        <Image src={src} alt={alt} width={width} height={height} quality={quality} sizes={sizes} />
        <span className="cf-zoom-badge" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" />
          </svg>
        </span>
        <span className="sr-only">Enlarge</span>
      </button>
      <dialog
        ref={ref}
        className="cf-lightbox"
        aria-label={alt}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <figure style={{ "--w": `${Math.round(width / 2)}px`, "--ar": `${width} / ${height}` } as CSSProperties}>
          <Image src={src} alt={alt} width={width} height={height} quality={quality} sizes={`${Math.round(width / 2)}px`} />
        </figure>
        <button type="button" className="cf-lightbox-close" onClick={close}>
          <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </dialog>
    </>
  );
}
