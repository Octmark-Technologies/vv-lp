/**
 * LP2 · "Pay Your Way" (replaces the withdrawn Pay 5% offer, 20 Nov 2026).
 * Source: "Skyvue — Pay Your Way Offer" doc (main tab + Landing page tab).
 *
 * The offer: one public price, ₹7,399 per sq ft. No-cost EMI on bookings till 31 Dec 2026 (the
 * only dated part; corrected 21 Nov 2026, the earlier ₹7,149-till-31-Dec line was wrong).
 * The buyer proposes how and when to pay; sales quotes a price for that schedule in writing.
 * Rules (doc): show only ₹7,399 per sq ft and the no-cost EMI date; never a negotiated rate, a percentage
 * off or "lowest price"; RERA in the hero and footer; no investment-return language; no Pay 5%.
 * Every "*" links to the terms note (lp2.offer.terms).
 */
import { faqs, type HeroCopy, type Version } from "./skyvue-landing";

export const PRICE = 7399;
const rate = "No-cost EMI till 31 Dec";

/**
 * Hero versions on ?v= (doc "Top 5 page versions" + default LP01). Headlines ≤ 12 words.
 * Headlines match the 4 static ads (20 Nov 2026): buyer (default) = Ad 1 · plan = Ad 2 ·
 * upgrade = Ad 3 · deadline = Ad 4. buyers = LP04 · nri = LP07. family/parents kept so older
 * ad links still land on a match.
 */
const hero = {
  buyer: {
    eyebrow: `TS RERA P01100010545 · ${rate}`,
    title: "Your flat. Your payment plan.",
    sub: "Explore premium 3 BHK flats in Tellapur at Vaishno SkyVue, ranging from 2,010 to 2,890 sq. ft., starting at ₹7,399/sq. ft., with flexible payment plans and no-cost EMI on eligible bookings until 31 December 2026.*",
  },
  deadline: {
    eyebrow: "TS RERA P01100010545 · No-cost EMI till 31 Dec",
    title: "Pay your way. Till the structure's done.*",
    sub: "3 BHK, 2,010 to 2,890 sq ft, near Tellapur. Bring your payment plan to the site and leave with a written quote.",
    size: "₹7,399 per sq ft. No-cost EMI on bookings till 31 Dec 2026.*",
  },
  buyers: {
    eyebrow: `TS RERA P01100010545 · ${rate}`,
    title: "Same flat. Two buyers. Two payment plans. That's Pay Your Way.",
    sub: "Tell us how you'd like to pay. We'll quote for your plan, in writing.",
    size: "3 BHK only. 2,010 to 2,890 sq ft.",
  },
  upgrade: {
    eyebrow: `TS RERA P01100010545 · ${rate}`,
    title: "You choose the amounts. You choose the dates.*",
    sub: "Pay Your Way at SkyVue: flexible payments until the structure is complete, written into your agreement.",
    size: "3 BHK only. 2,010 to 2,890 sq ft.",
  },
  nri: {
    eyebrow: `TS RERA P01100010545 · ${rate}`,
    title: "NRIs: plan your SkyVue payments once, from wherever you are.",
    sub: "One payment plan, one written quote, one registered agreement. Talk to us on WhatsApp in your time zone.",
    size: "3 BHK only. 2,010 to 2,890 sq ft.",
  },
  plan: {
    eyebrow: `TS RERA P01100010545 · ${rate}`,
    title: "Pay on your dates, not slab dates.",
    sub: "Own funds, home loan or both. Tell us your amounts and dates; we build your quote around them.",
    size: "3 BHK only. 2,010 to 2,890 sq ft.",
  },
  family: {
    eyebrow: `TS RERA P01100010545 · ${rate}`,
    title: "Bring your dates. We'll bring the plan.",
    sub: "Salary, bonus, FD, flat sale: Pay Your Way builds your SkyVue payments around them.",
    size: "Every home starts at 2,010 sq ft. Up to 2,890.",
  },
  parents: {
    eyebrow: `TS RERA P01100010545 · ${rate}`,
    title: "Your parents paid the builder's way. You can Pay Your Way.",
    sub: "3 BHK at SkyVue, near Tellapur. ₹7,399 per sq ft, no-cost EMI till 31 Dec.*",
    size: "A room for everyone. Every home from 2,010 sq ft.",
  },
} satisfies Record<string, HeroCopy> & Record<Version, HeroCopy>;

export const lp2 = {
  id: "lp2" as const,
  slug: "skyvue-pay-your-way",
  defaultVersion: "buyer" as Version,
  intent: "payment_schedule" as const,
  hero,
  /** Keyword line at the start of the page's h1 (Google Ads relevance), above the ad-matched headline. */
  h1: "3 BHK Flats for Sale in Tellapur",
  /** Keyword eyebrows built into each section's h2 (21 Nov 2026). */
  kw: {
    price: "3 BHK Flat Prices in Tellapur",
    life: "Amenities & Lifestyle at SkyVue, Tellapur",
    plan: "3 BHK Payment Plan · Pay Your Way",
    enquire: "Book a Site Visit · 3 BHK Flats in Tellapur",
  },
  heroCta: "Get my Pay Your Way quote",
  /** Homes section paragraph on this page (21 Nov 2026 section copy). */
  homesEyebrow: "3 BHK Floor Plans & Apartment Sizes",
  homesSub: "Explore spacious 3 BHK apartments in Tellapur, ranging from 2,010 to 2,890 sq. ft., with east- and west-facing options, 10′4″ floor-to-floor heights and balconies offering 180° views. Explore the floor plans at Vaishno SkyVue.",
  /** LP2 never repeats LP1's pictures. */
  images: {
    amenities: {
      care: { img: "/lp/skyvue/fr/badminton.webp", caption: "Double-height badminton court" },
      work: { img: "/lp/skyvue/fr/activity-room.webp", caption: "Activity room" },
      family: { img: "/lp/skyvue/fr/party-hall.webp", caption: "Party hall" },
      gardens: { img: "/lp/skyvue/fr/miyawaki.webp", caption: "Miyawaki forest" },
    },
    visit: "/lp/skyvue/fr/entrance.webp",
  },
  formTitle: "Tell us how you'd like to pay. We'll call you with your quote.",
  formCta: "Get my Pay Your Way quote",
  offerEnds: "2026-12-31T23:59:59+05:30",
  /** Drawer form asks how and when the buyer will pay (sent in the budget / timeline columns). */
  formFields: {
    budget: {
      label: "How will you pay?",
      options: [
        { label: "Own funds", value: "Pay: Own funds" },
        { label: "Home loan", value: "Pay: Home loan" },
        { label: "Both", value: "Pay: Own funds + home loan" },
      ],
    },
    timeline: {
      label: "When would you start?",
      options: [
        { label: "This month", value: "Start: This month" },
        { label: "In 1–3 months", value: "Start: In 1–3 months" },
        { label: "In 3–6 months", value: "Start: In 3–6 months" },
      ],
    },
    error: "Please choose how you'll pay and when you'd like to start.",
  },
  /** Replaces the shared Pay 5% lines on this page (fact rail, plan card, footer terms). */
  offer: {
    price: "₹7,399/sq ft",
    priceNote: "· No-cost EMI till 31 Dec",
    rail: "Pay Your Way",
    plansHook: "Pay Your Way for this home.",
    plansBody: "Tell us how much you can pay and when: own funds, home loan or both. We quote a price for your schedule, in writing.",
    plansWhen: "₹7,399 per sq ft. No-cost EMI on bookings till 31 Dec 2026.*",
    plansCta: "Get my Pay Your Way quote",
    terms:
      "*Flexible payment schedule until the structure is complete, as set out in your written quote and registered sale agreement. The base price is ₹7,399 per sq ft. No-cost EMI applies to bookings made until 31 December 2026; conditions apply. Your rate and payment schedule are given in a written quote and in your registered sale agreement. The booking token is up to 10% of the price. GST, parking and other charges are extra.",
  },
  seo: {
    title: "3 BHK Flats for Sale in Tellapur | Vaishno SkyVue | ₹7,399 per sq ft",
    description:
      "Pay Your Way at Vaishno SkyVue: tell us how and when you'd like to pay, and get a written quote. 3 BHK homes, 2,010 to 2,890 sq ft, near Tellapur. ₹7,399 per sq ft, no-cost EMI on bookings till 31 Dec 2026. TS RERA P01100010545.",
  },
};

/** Pay Your Way in 3 steps (doc, "How it works"). */
export const howItWorks = [
  { t: "Tell us your amounts and dates", d: "Own funds, home loan or both. Salary dates, bonus month, FD maturity, a flat sale: whatever your money follows." },
  { t: "Visit and get a written quote", d: "See the site and the homes. Sales prepares your quote for the schedule you propose, with a quote number." },
  { t: "Book and register", d: "Book with a token of up to 10% of the price. Your rate and schedule go into the registered agreement." },
] as const;

/** Why Pay Your Way (value stack). Confirmed facts only. */
export const valueStack = [
  { k: "What you get", v: "An exclusive 3 BHK", d: "2,010 to 2,890 sq ft, 10'4\" floor to floor, extended balconies. 2 towers, 36 floors, 3.76 acres." },
  { k: "What you decide", v: "Your payment schedule", d: "Not three plans to pick from. You propose how much and when; the quote follows your plan." },
  { k: "Why you can trust it", v: "TS RERA P01100010545", d: "Your rate and schedule are written into a registered sale agreement." },
  { k: "The one price", v: "₹7,399 per sq ft*", d: "No-cost EMI on bookings till 31 Dec 2026." },
] as const;

/** Sent after the form. */
export const whatYouGet = [
  "A call to understand how you'd like to pay",
  "A written quote for your schedule",
  "The floor plan for your size",
  "A weekday or weekend site visit slot",
] as const;

/** Pay Your Way questions first (doc FAQ), then the shared FAQ (minus its price and Pay 5% answers). */
export const lp2Faqs = [
  {
    q: "Is ₹7,399 the final price?",
    a: "It is the base price per sq ft, before GST, parking and other charges, which your written quote lists.",
  },
  {
    q: "What is the no-cost EMI offer?",
    a: "Bookings made until 31 December 2026 can use no-cost EMI. Conditions apply; your written quote shows the details.",
  },
  {
    q: "Can I pay faster or slower than construction?",
    a: "Tell us your plan; the sales team will quote for it, in writing.",
  },
  {
    q: "Does Pay Your Way work with a home loan?",
    a: "Yes. Plan your own funds around your dates; the loan follows construction.",
  },
  {
    q: "How much do I pay to book?",
    a: "A token of up to 10% of the price. Your rate and payment schedule then go into the registered sale agreement.",
  },
  ...faqs.filter((f) => !/payment plan|what is the price/i.test(f.q)),
] as const;
