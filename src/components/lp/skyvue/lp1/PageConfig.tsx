"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { HeroCopy, Version } from "@/data/skyvue-landing";

/** What a SkyVue landing page passes to the shared scenes (opening, forms, drawer). */
export type LpConfig = {
  id: "lp1" | "lp2" | "lp3" | "lp4";
  slug: string;
  defaultVersion: Version;
  hero: Record<Version, HeroCopy> & Partial<Record<string, HeroCopy>>;
  formTitle: string;
  formCta: string;
  /** Label of the hero's main button (default: "Get floor plans & cost sheet"). */
  heroCta?: string;
  /** Optional page-specific paragraph under the Homes heading. */
  homesSub?: string;
  /** Optional page-specific Homes eyebrow; when set it becomes part of the h2 (keyword heading). */
  homesEyebrow?: string;
  /** Per-page pictures, so pages never repeat each other's renders. */
  images?: {
    amenities?: Partial<Record<"care" | "work" | "family" | "gardens", { img: string; caption: string }>>;
    visit?: string;
  };
  /** Page-specific offer lines that replace the shared Pay 5% copy (LP2 · Pay Your Way). */
  offer?: {
    price: string;
    priceNote: string;
    rail: string;
    plansHook: string;
    plansBody: string;
    plansWhen: string;
    plansCta: string;
    terms: string;
  };
  /**
   * Replaces the form's budget / timeline questions (LP2 asks how and when the buyer will pay).
   * `value` is what reaches the CRM in the budget / timeline columns.
   */
  formFields?: {
    budget: { label: string; options: readonly { label: string; value: string }[] };
    timeline: { label: string; options: readonly { label: string; value: string }[] };
    error: string;
  };
  /** Lead intent sent with the page's main forms. */
  intent?: "enquiry" | "site_visit" | "payment_schedule" | "brochure";
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
