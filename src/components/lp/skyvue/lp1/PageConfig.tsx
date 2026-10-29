"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { HeroCopy, Version } from "@/data/skyvue-landing";

/** What a SkyVue landing page passes to the shared scenes (opening, forms, drawer). */
export type LpConfig = {
  id: "lp1" | "lp2" | "lp3" | "lp4";
  slug: string;
  defaultVersion: Version;
  hero: Record<Version, HeroCopy>;
  formTitle: string;
  formCta: string;
  /** Label of the hero's main button (default: "Get floor plans & cost sheet"). */
  heroCta?: string;
  /** Per-page pictures, so pages never repeat each other's renders. */
  images?: {
    amenities?: Partial<Record<"care" | "work" | "family" | "gardens", { img: string; caption: string }>>;
    visit?: string;
  };
  /** Lead intent sent with the page's main forms. */
  intent?: "enquiry" | "site_visit" | "payment_schedule";
};

const Ctx = createContext<LpConfig | null>(null);

export function LpProvider({ value, children }: { value: LpConfig; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Like useLp, but returns null outside a provider (for components shared with older pages). */
export function useLpMaybe(): LpConfig | null {
  return useContext(Ctx);
}

export function useLp(): LpConfig {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLp must be used inside <LpProvider>");
  return v;
}
