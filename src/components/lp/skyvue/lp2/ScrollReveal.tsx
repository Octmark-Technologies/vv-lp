"use client";

import { useEffect } from "react";
import { animate, createScope, onScroll, stagger } from "animejs";
import { motionOn } from "../lp1/anim";

/**
 * LP2 · scroll-to-reveal, tied to the scrollbar (motion skill: scroll-linked, transform/opacity/
 * clip-path only, reversible). Every section below the 3D story builds itself as it enters and
 * un-builds when you scroll back:
 *  · headings unmask upwards line by line (clip-path)
 *  · text and cards rise out of a soft blur, staggered
 *  · pictures open from a framed window to full bleed while the render settles (scale 1.18 → 1)
 *  · stat numbers and the value lines track the same scroll
 * Replaces LP1's one-shot fade-ins on this page only (anim.revealOnEnter skips .sv-night).
 * Reduced motion / no JS: nothing is hidden, nothing moves.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (!motionOn()) return;
    const root = document.querySelector<HTMLElement>(".sv-night main");
    if (!root) return;
    const scope = createScope({ root }).add(() => {
      const skip = (el: Element) => !!el.closest(".sv-story, .sv-amen");

      // 1 · groups: headings unmask, the rest rises out of blur, staggered, synced to scroll
      root.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
        if (group.closest(".sv-story")) return;
        const items = [...group.querySelectorAll<HTMLElement>("[data-reveal]")];
        if (!items.length) return;
        const heads = items.filter((el) => /^H[1-3]$/.test(el.tagName));
        const rest = items.filter((el) => !heads.includes(el));
        const sync = () => onScroll({ target: group, enter: "bottom-=40 top", leave: "center+=10% top", sync: 0.35 });
        if (heads.length)
          animate(heads, {
            clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
            translateY: [48, 0],
            opacity: [0.2, 1],
            ease: "outCubic",
            duration: 1000,
            autoplay: sync(),
          });
        if (rest.length)
          animate(rest, {
            opacity: [0, 1],
            translateY: [64, 0],
            filter: ["blur(10px)", "blur(0px)"],
            delay: stagger(110),
            ease: "outCubic",
            duration: 900,
            autoplay: sync(),
          });
      });

      // 2 · pictures: framed window → full bleed, render settles inside
      root.querySelectorAll<HTMLImageElement>("section img, section video").forEach((media) => {
        if (skip(media)) return;
        const frame = media.closest<HTMLElement>("span, figure, a") ?? media.parentElement;
        if (!frame || frame.dataset.svFramed) return;
        frame.dataset.svFramed = "1";
        const box = frame.getBoundingClientRect();
        if (box.width < 160 || box.height < 120) return; // logos and icons stay put
        const obs = () => onScroll({ target: frame, enter: "bottom top", leave: "center center", sync: 0.4 });
        animate(frame, {
          clipPath: ["inset(14% 10% 14% 10% round 28px)", "inset(0% 0% 0% 0% round 24px)"],
          ease: "outQuad",
          duration: 1000,
          autoplay: obs(),
        });
        animate(media, { scale: [1.18, 1], ease: "outQuad", duration: 1000, autoplay: obs() });
      });

      // 3 · list rows (FAQ, delivered projects, location lists): slide in from the left, staggered
      root.querySelectorAll<HTMLElement>("#builder ul, #location ul").forEach((list) => {
        if (skip(list)) return;
        animate(list.children, {
          opacity: [0, 1],
          translateX: [-28, 0],
          delay: stagger(60),
          ease: "outCubic",
          duration: 800,
          autoplay: onScroll({ target: list, enter: "bottom top", leave: "center center", sync: 0.35 }),
        });
      });
    });
    return () => scope.revert();
  }, []);
  return null;
}
