"use client";

import { useEffect, type DependencyList, type RefObject } from "react";
import { animate, createScope, onScroll, stagger } from "animejs";

/** Motion is on only when the <head> boot script set html.motion (JS on, reduced motion off). */
export const motionOn = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("motion");

/**
 * Runs anime.js setup inside a scope bound to `ref`, and reverts everything on unmount.
 * Skipped entirely when motion is off, so the page stays in its full, readable end state.
 */
export function useAnime(ref: RefObject<HTMLElement | null>, setup: (root: HTMLElement) => void, deps: DependencyList = []) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !motionOn()) return;
    const scope = createScope({ root }).add(() => setup(root));
    return () => {
      scope.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Scroll-synced progress for a pinned section: 0 when its top meets the viewport top, 1 when its bottom meets the viewport bottom. */
export const pinnedScroll = (target: HTMLElement, onUpdate?: (p: number) => void) =>
  onScroll({
    target,
    enter: "top top",
    leave: "bottom bottom",
    sync: 0.25,
    onUpdate: onUpdate ? (self) => onUpdate(self.progress) : undefined,
  });

/** Fades and lifts every [data-reveal] child once it scrolls into view. */
export function revealOnEnter(root: HTMLElement) {
  // LP2 (.sv-night) uses scroll-synced reveals instead (lp2/ScrollReveal.tsx).
  if (root.closest(".sv-night")) return;
  root.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!items.length) return;
    animate(items, {
      opacity: [0, 1],
      translateY: [28, 0],
      duration: 1100,
      delay: stagger(90),
      ease: "outExpo",
      autoplay: onScroll({ target: group, enter: { target: "top", container: "bottom-=80" }, repeat: false }),
    });
  });
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
