/**
 * LP4 · "Builder proof" — the likelihood page (Hormozi: perceived likelihood of achievement ↑, risk ↓).
 * Audience: careful buyers, NRIs and parents who check the builder before the brochure.
 * Every claim here is checkable: RERA, delivered projects (vaishnoventures.com), monthly site footage.
 */
import type { HeroCopy, Version } from "./skyvue-landing";

export const lp4 = {
  id: "lp4" as const,
  slug: "skyvue-builder-proof",
  defaultVersion: "family" as Version,
  hero: {
    family: {
      eyebrow: "TS RERA P01100010545 · By Vaishno Ventures",
      title: "Don't trust a brochure. Check us.",
      sub: "Delivered homes in Bangalore you can visit. The SkyVue site filmed every month. Every approval shared before you pay.",
    },
    buyer: {
      eyebrow: "Tellapur · Starting from ₹1.6 Cr",
      title: "The builder matters more than the brochure.",
      sub: "Vaishno Ventures has delivered homes across East Bangalore. Watch SkyVue rise, month by month, before you book.",
    },
    parents: {
      eyebrow: "For families who check everything",
      title: "Check the builder before you book.",
      sub: "Registered with Telangana RERA. Delivered homes in Bangalore. Monthly drone footage of the site. And just 5% to book.",
    },
  } satisfies Record<Version, HeroCopy>,
  heroCta: "Send me the proof pack",
  formTitle: "Get your proof pack: approvals, track record & cost sheet",
  formCta: "Send me the proof pack",
  intent: "site_visit" as const,
  images: { visit: "/lp/skyvue/fr/entrance.webp" },
  seo: {
    title: "Vaishno SkyVue Tellapur | Check the Builder Before You Book | RERA P01100010545",
    description:
      "Check the builder before you book: see the homes Vaishno Ventures has delivered in Bangalore. Watch Vaishno SkyVue rise in Tellapur, month by month. Exclusive 3 BHK, starting from ₹1.6 Cr. RERA P01100010545.",
  },
};

/** Questions careful buyers ask first; the shared FAQ follows. */
export const lp4Faqs = [
  { q: "How do I check SkyVue's RERA registration?", a: "SkyVue is registered with Telangana RERA under P01100010545. Search the number on the Telangana RERA website; we also share the certificate on WhatsApp." },
  { q: "What has Vaishno Ventures delivered?", a: "Projects across East Bangalore, from Hoodi and KR Puram to Varthur: Signature, Spark, Lotus, Solitair, Excellency, Silverbells, Seasons, White Petals and Palash. Luxuria and Ambaram are under construction." },
  { q: "How do I follow construction?", a: "We film the SkyVue site every month and share the drone update on this page, on our social handles and on WhatsApp on request." },
  { q: "Can I visit a delivered project?", a: "Ask our team on WhatsApp and we will share the addresses of our delivered projects in Bangalore." },
] as const;
