"use client";

import { useEffect } from "react";
import { readyToPrint } from "@/lib/print";

/**
 * Printing a case file (case-print.css). The printout is light whatever the reader's theme: reading surfaces follow
 * the theme on screen, but a page of dark paper is no use printed, so data-theme="light" is set while printing and
 * the reader's own setting put back afterwards. Cmd+P (Ctrl+P) first loads what is still waiting to be scrolled to
 * (lib/print.ts), for a few seconds at most, then opens the print dialog.
 */
export function CasePrint() {
  useEffect(() => {
    const root = document.documentElement;
    let saved: string | null = null;
    let light = false;
    const start = () => {
      if (light) return;
      light = true;
      saved = root.getAttribute("data-theme");
      root.setAttribute("data-theme", "light");
    };
    const end = () => {
      if (!light) return;
      light = false;
      if (saved === null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", saved);
    };
    let preparing = false;
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey || e.key.toLowerCase() !== "p") return;
      e.preventDefault();
      if (preparing) return;
      preparing = true;
      start();
      void readyToPrint(document.querySelector("main") ?? document).then(() => {
        preparing = false;
        window.print();
      });
    };
    window.addEventListener("beforeprint", start);
    window.addEventListener("afterprint", end);
    window.addEventListener("keydown", onKey);
    return () => {
      end();
      window.removeEventListener("beforeprint", start);
      window.removeEventListener("afterprint", end);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  return null;
}
