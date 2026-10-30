/**
 * SkyVue landing pages — content (single source of truth).
 *
 * 4 test landing pages (60-day test, then the winner is kept and updated):
 *   LP1  /lp/skyvue-570-homes/        Exclusivity   "570 homes. Not a township."
 *   LP2  /lp/skyvue-pay-5-percent/    Payment plan  "Pay 5%. Then stay hands-free…"
 *   LP3  /lp/skyvue-70ft-above/       Lifestyle     "Come home 70 ft above the traffic."
 *   LP4  /lp/skyvue-builder-proof/    Builder proof "Who is Vaishno?"
 *
 * Each page has 3 message versions, chosen with ?v=buyer | family | parents
 * (no persona names in URLs or copy). Approvals, comparison, location guide and
 * FAQ are sections INSIDE every page — not separate pages.
 *
 * COPY RULES (Confirmed-Project-Facts 23 Oct 2026 + Strategy Review 24 Oct 2026)
 *  - Location is Tellapur only. RERA P01100010545 on every page.
 *  - Open space 75% only. No "highest open space", no "lowest price".
 *  - No competitor names in page copy; ranges only. Named sheet goes on WhatsApp.
 *  - Avoid "luxury", "world-class", "best". Renders = "Artist's impression".
 *  - Anything marked PENDING comes from the client before it is shown as fact.
 */

export type Version = "buyer" | "family" | "parents";
export type SectionKey =
  | "facts"
  | "angle"
  | "homes"
  | "plan"
  | "lifestyle"
  | "comparison"
  | "location"
  | "approvals"
  | "builder"
  | "progress"
  | "faq"
  | "visit";

export const skyvue = {
  name: "Vaishno SkyVue",
  developer: "Vaishno Ventures",
  location: "Tellapur, West Hyderabad",
  rera: "P01100010545",
  reraUrl: "https://rerait.telangana.gov.in/SearchList/Search",
  /** The only price shown on the pages. No per-sq-ft or per-plan prices anywhere. */
  priceFrom: "₹1.6 Cr",
  priceLine: "Starting from ₹1.6 Cr",
  sizeRange: "2,010 – 2,890 sq ft",
  /** Possession date (the first-screen countdown runs to it). */
  possession: "31 March 2030",
  possessionAt: "2030-03-31T23:59:59+05:30",
  offer: {
    text: "Pay 5%, then nothing more until your block's structure is complete.* No-cost EMI on bookings till 31 Dec 2026.*",
    short: "Pay 5%, then nothing more till your block's structure is complete*",
    validTill: "31 December 2026",
    /** The note every * on the pages points to (footer, id="terms"). */
    terms:
      "*Conditions apply. Offer on bookings till 31 December 2026. The 5% booking amount, the payment schedule, the no-cost EMI terms (no-cost EMI on bookings till 31 December 2026) and the structure-completion milestone for the block your home is in are given in your cost sheet and agreement. GST, parking and other charges are extra.",
  },
  phone: "+919696965566",
  phoneLabel: "+91 96969 65566",
  whatsapp: "919696965566",
  facts: [
    { value: "570", label: "Homes only" },
    { value: "2", label: "Towers, 36 storeys" },
    { value: "3.76", label: "Acres" },
    { value: "75%", label: "Open space" },
    { value: "70 ft", label: "Above the podium" },
  ],
} as const;

/** One unit plan from the brochure (Vaishno SkyVue Latest.pdf, pp. 51–61), cut out per unit. */
export type UnitPlan = { unit: string; tower: "A" | "B"; facing: "East" | "West"; img: string };

const P = (unit: string, facing: "East" | "West", file: string): UnitPlan => ({
  unit,
  tower: unit.startsWith("A") ? "A" : "B",
  facing,
  img: `/lp/skyvue/plans/units/${file}.webp`,
});

/**
 * Typical units by size (brochure pp. 51–56) and the extended-balcony 2,890 sq ft units (pp. 58–61).
 * `plans` lists every unit plan of that size; `plan` is the first, for places that show one image.
 */
export const units: { size: number; facing: string; label: string; units: string; plan: string | null; plans: UnitPlan[] }[] = (
  [
    { size: 2010, label: "Exclusive 3 BHK", plans: [P("A-2/3", "West", "a23-2010"), P("B-2/3", "West", "b23-2010")] },
    { size: 2225, label: "Exclusive 3 BHK", plans: [P("A-6/7", "East", "a67-2225"), P("B-6/7", "East", "b67-2225")] },
    {
      size: 2460,
      label: "Exclusive 3 BHK",
      plans: [P("A-4", "West", "a4-2460"), P("A-5", "East", "a5-2460"), P("B-1", "West", "b1-2460"), P("B-8", "East", "b8-2460")],
    },
    { size: 2595, label: "Exclusive 3 BHK", plans: [P("A-1", "West", "a1-2595"), P("B-4", "West", "b4-2595")] },
    { size: 2705, label: "Exclusive 3 BHK", plans: [P("B-5", "East", "b5-2705")] },
    { size: 2725, label: "Exclusive 3 BHK", plans: [P("A-8", "East", "a8-2725")] },
    {
      size: 2890,
      label: "Exclusive 3 BHK · Extended balcony",
      plans: [
        P("A-1", "West", "a1-2890-ext"),
        P("A-4", "West", "a4-2890-ext"),
        P("A-5", "East", "a5-2890-ext"),
        P("A-8", "East", "a8-2890-ext"),
        P("B-1", "West", "b1-2890-ext"),
        P("B-4", "West", "b4-2890-ext"),
        P("B-5", "East", "b5-2890-ext"),
        P("B-8", "East", "b8-2890-ext"),
      ],
    },
  ] as { size: number; label: string; plans: UnitPlan[] }[]
).map((u) => {
  const f = [...new Set(u.plans.map((x) => x.facing))];
  return {
    ...u,
    facing: f.length > 1 ? "East & West" : f[0],
    units: u.plans.map((x) => x.unit).join(" · "),
    plan: u.plans[0]?.img ?? null,
  };
});

export const masterPlans = [
  { title: "Ground level", img: "/lp/skyvue/plans/master-plan-ground.jpg" },
  { title: "Podium level", img: "/lp/skyvue/plans/podium-plan.jpg" },
  { title: "Typical floor", img: "/lp/skyvue/plans/typical-floor-plan.jpg" },
  { title: "Typical floor · extended balcony", img: "/lp/skyvue/plans/typical-floor-plan-extended-balcony.jpg" },
] as const;

const r = (f: string) => `/lp/skyvue/renders/${f}`;

export const lifestyle = [
  { title: "Rooftop pool", note: "On the clubhouse terrace", img: r("rooftop-pool.jpg") },
  { title: "Miyawaki forest", note: "A dense native forest inside the gate", img: r("miyawaki.jpg") },
  { title: "Car-free podium", note: "Ground reserved for people and trees", img: r("garden-walk.jpg") },
  { title: "G+5 clubhouse", note: "Part of 2 lakh sq ft for lifestyle", img: r("clubhouse-exterior.jpg") },
  { title: "Double-height badminton court", note: "Indoor sports", img: r("badminton.jpg") },
  { title: "Gymnasium", note: "With city views", img: r("gym.jpg") },
  { title: "Banquet hall", note: "Double height, for family occasions", img: r("banquet.jpg") },
  { title: "Activity zone", note: "For every generation", img: r("activity-zone.jpg") },
  { title: "Crèche", note: "Day care inside the community", img: r("creche.jpg") },
  { title: "Kids' play area", note: "On the podium, away from cars", img: r("kids-play.jpg") },
  { title: "Senior citizen gym", note: "Open-air, on the podium", img: r("senior-gym.jpg") },
  { title: "Pickleball & half-basketball", note: "Outdoor courts", img: r("pickleball.jpg") },
  { title: "Pet park", note: "Plus a pet clinic & spa", img: r("pet-park.jpg") },
  { title: "Party lawn", note: "Pergolas and seating", img: r("party-lawn.jpg") },
] as const;

export const careInsideTheGate = [
  "Clinic & waiting lounge",
  "Pharmacy",
  "Day care centre & crèche",
  "Senior citizen gym & garden",
  "Pet clinic & spa",
  "Supermarket",
  "Guest rooms",
  "Co-working & private office",
] as const;

/**
 * Approvals block. `value: null` = PENDING from the client; the page shows
 * "Shared on request" until it is filled in here.
 */
export const approvals: { label: string; value: string | null; note?: string }[] = [
  { label: "TS RERA registration", value: "P01100010545", note: "Check it on the Telangana RERA website" },
  { label: "HMDA building permission", value: null }, // TODO(client): HMDA permit number
  { label: "Lake & water-body clearance", value: null }, // TODO(client): status / NOC reference
  { label: "Construction finance partner", value: null }, // TODO(client): bank / NBFC name
  { label: "Possession (as committed)", value: "31 March 2030" },
];

/**
 * Comparison — base price to base price, no competitor names in page copy.
 * Source: Confirmed-Project-Facts (23 Oct 2026). Range = 4 other projects in
 * the Tellapur–Kollur belt. TODO(Octmark): on-site/broker verification before launch.
 */
export const comparison = {
  rows: [
    { label: "Homes in the community", skyvue: "570", others: "759 – 2,055" },
    { label: "Every home has a study", skyvue: "Yes", others: "Rarely" },
    { label: "Homes start above a car-free podium", skyvue: "70 ft up", others: "Varies" },
    { label: "Clinic & pharmacy inside the gate", skyvue: "Yes", others: "Varies" },
  ],
  footnote:
    "Others = 4 other projects near SkyVue, from public sources, October 2026. Ask for the named comparison sheet on WhatsApp.",
} as const;

export const locationGuide = {
  intro:
    "Tellapur sits on the western edge of Hyderabad's IT corridor, close to the Financial District and the Outer Ring Road, with Osman Nagar Lake and open green land nearby.",
  groups: [
    { title: "Work", items: ["Financial District", "Gachibowli", "HITEC City", "Kokapet", "Neopolis"] },
    { title: "Schools & education", items: ["Samashti International School", "Delhi Public School", "University of Hyderabad"] },
    { title: "Healthcare", items: ["Aksha Hospitals", "Aptamed Multispeciality Center", "Clinic & pharmacy inside SkyVue"] },
    { title: "Roads & nature", items: ["Outer Ring Road (ORR)", "Nallagandla Road", "Radial Road 7", "Osman Nagar Lake"] },
  ],
  // TODO(client): drive times are on HOLD — add only after they are confirmed.
  map: "/lp/skyvue/plans/location-map.jpg",
} as const;

/** Bangalore track record (vaishnoventures.com). TODO(client): handover years, photos, owner consent for testimonials. */
export const delivered = [
  { name: "Vaishno Signature", area: "Hoodi", homes: 154 },
  { name: "Vaishno Spark", area: "KR Puram", homes: 172 },
  { name: "Vaishno Lotus", area: "Choodasandra", homes: 168 },
  { name: "Vaishno Solitair", area: "Ramamurthy Nagar", homes: 147 },
  { name: "Vaishno Excellency", area: "Mullur, Varthur", homes: 100 },
  { name: "Vaishno Silverbells", area: "Varthur", homes: 76 },
  { name: "Vaishno Seasons", area: "KR Puram", homes: 56 },
  { name: "Vaishno White Petals", area: "Varthur", homes: 40 },
  { name: "Vaishno Palash", area: "Varthur", homes: 30 },
] as const;
export const deliveredHomes = delivered.reduce((s, p) => s + p.homes, 0);

export const faqs = [
  { q: "Where exactly is Vaishno SkyVue?", a: "In Tellapur, West Hyderabad, close to the Financial District and the Outer Ring Road. Share your number and we'll send the location pin on WhatsApp." },
  { q: "What is the RERA number?", a: "SkyVue is registered with Telangana RERA under P01100010545. You can check it on the Telangana RERA website before you call us." },
  { q: "What homes are available?", a: "Only exclusive 3 BHK homes, and every one has a study or multipurpose room. Sizes range from 2,010 to 2,890 sq ft, with east- and west-facing options and extended balconies on select floors." },
  { q: "What is the price?", a: "Homes start from ₹1.6 Cr. Share your number and we will send the cost sheet for the home you choose. Taxes, parking and other charges are listed in it." },
  { q: "How does the payment plan work?", a: "Pay 5% to book, then pay nothing more until the structure of your block is complete. No-cost EMI is available on bookings till 31 December 2026. This plan applies to bookings made until 31 December 2026. Conditions apply." },
  { q: "When is possession?", a: "Possession is planned for 31 March 2030. The countdown at the top of this page runs to that date." },
  { q: "How many homes are there in the community?", a: "570 homes in 2 towers of 36 storeys, on 3.76 acres with 75% open space." },
  { q: "Where do cars go?", a: "Cars stay on 6 parking levels. The ground and the podium are kept for people: gardens, a Miyawaki forest, play areas and a jogging track." },
  { q: "What is inside the clubhouse?", a: "A G+5 clubhouse that is part of 2 lakh sq ft set aside for lifestyle, with a rooftop pool, gym, double-height badminton court, banquet hall, crèche, indoor games, mini theatres, guest rooms, a clinic and a pharmacy." },
  { q: "Who is Vaishno Ventures?", a: "A real estate developer with 10+ projects across Bangalore and Hyderabad, and 900+ families living in homes it has delivered, including Vaishno Signature, Spark, Lotus and Solitair. SkyVue is its high-rise project in Tellapur." },
  { q: "Can I visit the site?", a: "Yes. Book a weekday or weekend visit and our team will confirm the slot on WhatsApp within minutes." },
] as const;

/* ───────────────────────── Page definitions ───────────────────────── */

export interface HeroCopy {
  eyebrow: string;
  title: string;
  sub: string;
  /** One-line home-size statement under the headline (27 Oct 2026). */
  size?: string;
}

export interface AngleBlock {
  eyebrow: string;
  title: string;
  body: string;
  points: { title: string; text: string }[];
  img: string;
  imgAlt: string;
}

export interface LandingPage {
  id: "lp1" | "lp2" | "lp3" | "lp4";
  slug: string;
  name: string;
  angle: string;
  traffic: string;
  defaultVersion: Version;
  heroImage: string;
  heroAlt: string;
  hero: Record<Version, HeroCopy>;
  angleBlock: AngleBlock;
  order: SectionKey[];
  formTitle: string;
  ctaLabel: string;
  seo: { title: string; description: string; index: boolean };
}

export const landingPages: LandingPage[] = [
  {
    id: "lp1",
    slug: "skyvue-570-homes",
    name: "LP1 · 570 Homes (Exclusivity)",
    angle: "Exclusivity — a boutique community, not a township",
    traffic: "Google Search (category: 3 BHK Tellapur), Meta M1 Exclusivity, creative C1, Inwest Realty",
    defaultVersion: "family",
    heroImage: r("twin-towers.jpg"),
    heroAlt: "Vaishno SkyVue twin towers in Tellapur",
    hero: {
      family: {
        eyebrow: "Tellapur · 3 BHK homes",
        title: "570 homes. Not a township.",
        sub: "Two towers on 3.76 acres with 75% open space. A community small enough to know your neighbours, with a G+5 clubhouse shared by 570 families.",
      },
      buyer: {
        eyebrow: "Tellapur · Starting from ₹1.6 Cr",
        title: "Bigger projects don't mean bigger homes.",
        sub: "Every home at SkyVue is a 3 BHK with a study, 2,010 to 2,890 sq ft, in a community of only 570 homes.",
      },
      parents: {
        eyebrow: "Tellapur · 570 families · 2 towers",
        title: "A neighbourhood your parents can know by name.",
        sub: "570 homes, a clinic and pharmacy inside the gate, a senior citizen gym and garden, and a car-free podium to walk on.",
      },
    },
    angleBlock: {
      eyebrow: "Why 570 matters",
      title: "A township is a city. 570 homes is a neighbourhood.",
      body: "Most large 3 BHK homes in this belt come inside communities of 750 to 2,000+ homes. SkyVue keeps it to 570 homes in 2 towers, so the pool, the courts and the lifts are shared by fewer families.",
      points: [
        { title: "570 homes, 2 towers", text: "8 homes a floor across 36 storeys, on 3.76 acres." },
        { title: "75% open space", text: "Gardens, a Miyawaki forest and a car-free podium." },
        { title: "2 lakh sq ft for lifestyle", text: "Including a G+5 clubhouse with a rooftop pool." },
        { title: "Only 3 BHK", text: "No small units. Every family has room to grow." },
      ],
      img: r("aerial-forest.jpg"),
      imgAlt: "Aerial view of SkyVue towers surrounded by green",
    },
    order: ["facts", "angle", "comparison", "homes", "lifestyle", "location", "approvals", "progress", "builder", "plan", "faq", "visit"],
    formTitle: "Get the floor plans & cost sheet",
    ctaLabel: "Send me the details",
    seo: {
      title: "Vaishno SkyVue Tellapur | 570 Homes, 3 BHK | RERA P01100010545",
      description:
        "570 homes in 2 towers on 3.76 acres in Tellapur. 3 BHK, 2,010–2,890 sq ft, starting from ₹1.6 Cr. 75% open space. RERA P01100010545.",
      index: true,
    },
  },
  {
    id: "lp2",
    slug: "skyvue-pay-5-percent",
    name: "LP2 · Pay 5% (Payment plan)",
    angle: "Payment plan — pay 5%, hands-free until tower structure, no-cost EMI",
    traffic: "Meta M1 Payment plan, creative C3 / I2, retargeting R3, Google ad copy on price",
    defaultVersion: "buyer",
    heroImage: r("balcony-sunset.jpg"),
    heroAlt: "Balcony at SkyVue overlooking West Hyderabad at sunset",
    hero: {
      buyer: {
        eyebrow: "Offer on bookings till 31 Dec 2026",
        title: "Pay 5%. Then stay hands-free until your tower's structure is complete.",
        sub: "No-cost EMI on bookings till 31 Dec 2026. 3 BHK homes in Tellapur starting from ₹1.6 Cr, 2,010 to 2,890 sq ft.",
      },
      family: {
        eyebrow: "Offer on bookings till 31 Dec 2026",
        title: "Move up to a 3 BHK with a study. Start with 5%.",
        sub: "Pay 5% to book, then stay hands-free until your tower's structure is complete. No-cost EMI on bookings till 31 Dec 2026.",
      },
      parents: {
        eyebrow: "RERA P01100010545 · Starting from ₹1.6 Cr",
        title: "Book with 5%. Check every detail before you do.",
        sub: "Pay 5%, then stay hands-free until your tower's structure is complete. No-cost EMI on bookings till 31 Dec 2026. Check our RERA number before you call us.",
      },
    },
    angleBlock: {
      eyebrow: "How the plan works",
      title: "Your money moves with the building.",
      body: "Before you pay 20% down anywhere, ask whether 5% is possible. At SkyVue it is, on bookings made until 31 December 2026.",
      points: [
        { title: "1 · Pay 5% to book", text: "Choose your home and book it with 5% of the agreement value." },
        { title: "2 · Stay hands-free", text: "No further payment is asked until the structure of your tower is complete." },
        { title: "3 · No-cost EMI", text: "On bookings till 31 Dec 2026. Our team shares the exact schedule in your cost sheet." },
        { title: "4 · Check the progress", text: "Track construction against the RERA schedule before every payment." },
      ],
      img: r("tower-single.jpg"),
      imgAlt: "SkyVue tower",
    },
    order: ["facts", "angle", "plan", "homes", "approvals", "progress", "comparison", "lifestyle", "location", "builder", "faq", "visit"],
    formTitle: "Get the payment schedule for your size",
    ctaLabel: "Get my cost sheet",
    seo: {
      title: "Vaishno SkyVue Tellapur | Pay 5% & Stay Hands-Free | 3 BHK",
      description:
        "Pay 5%, then stay hands-free until your tower's structure is complete. No-cost EMI on bookings till 31 Dec 2026. 3 BHK in Tellapur starting from ₹1.6 Cr. RERA P01100010545.",
      index: false,
    },
  },
  {
    id: "lp3",
    slug: "skyvue-70ft-above",
    name: "LP3 · 70 ft Above (Lifestyle)",
    angle: "Lifestyle — Chaos to Calm, homes 70 ft above a car-free podium",
    traffic: "Meta cold creative C2 / V2, YouTube, Google image assets I4",
    defaultVersion: "buyer",
    heroImage: r("podium-lobby.jpg"),
    heroAlt: "Podium-level lobby at SkyVue with garden views",
    hero: {
      buyer: {
        eyebrow: "Chaos to Calm · Tellapur",
        title: "Come home 70 ft above the traffic.",
        sub: "Homes start 70 ft above a car-free podium. 3 BHK, 2,010 to 2,890 sq ft, with balconies up to ~46 ft and 180° views.",
      },
      family: {
        eyebrow: "Chaos to Calm · Tellapur",
        title: "Your kids play downstairs. There isn't a single car.",
        sub: "The ground and podium are for people: a Miyawaki forest, play areas and a jogging track. Cars stay on 6 parking levels.",
      },
      parents: {
        eyebrow: "Chaos to Calm · Tellapur",
        title: "Evening walks among trees, not parked cars.",
        sub: "A Miyawaki forest, a senior citizen garden and gym, and a clinic and pharmacy, all inside the gate.",
      },
    },
    angleBlock: {
      eyebrow: "Podium living in calm",
      title: "The car stays below. The ground stays green.",
      body: "Six levels of parking keep cars off the ground. Above them, a podium with gardens and courts, and above that, homes that start 70 ft up with floor-to-floor heights of 10′4″.",
      points: [
        { title: "No cars, just calm", text: "Ground level reserved for nature, paths and play." },
        { title: "A forest inside the gate", text: "A Miyawaki forest, bamboo and tropical gardens." },
        { title: "70 ft up", text: "Living floors begin 70 ft above the podium." },
        { title: "Balconies up to ~46 ft", text: "Sculpted balconies with 180° views, east or west." },
      ],
      img: r("aerial-podium.jpg"),
      imgAlt: "Aerial view of the SkyVue podium and gardens",
    },
    order: ["facts", "angle", "lifestyle", "homes", "location", "comparison", "approvals", "progress", "builder", "plan", "faq", "visit"],
    formTitle: "Get the brochure & floor plans",
    ctaLabel: "Send me the brochure",
    seo: {
      title: "Vaishno SkyVue Tellapur | Homes 70 ft Above a Car-Free Podium",
      description:
        "Chaos to Calm. 3 BHK homes that start 70 ft above a car-free podium, with a Miyawaki forest and a G+5 clubhouse. Tellapur. RERA P01100010545.",
      index: false,
    },
  },
  {
    id: "lp4",
    slug: "skyvue-builder-proof",
    name: "LP4 · Builder Proof (Trust)",
    angle: "Builder proof — answer 'Who is Vaishno?' before anything else",
    traffic: "Meta M1 Builder proof, builder film C4/C5, retargeting R1, Google brand search",
    defaultVersion: "parents",
    heroImage: r("entrance-gate.jpg"),
    heroAlt: "SkyVue entrance with Vaishno Ventures signage",
    hero: {
      parents: {
        eyebrow: "Vaishno Ventures · Bangalore to Hyderabad",
        title: "Who is Vaishno? Here's what we've already built.",
        sub: "900+ families live in homes we built across East Bangalore. SkyVue in Tellapur is registered with Telangana RERA, P01100010545.",
      },
      buyer: {
        eyebrow: "Vaishno Ventures · RERA P01100010545",
        title: "3 questions to ask any builder new to Hyderabad. We'll answer all 3.",
        sub: "Is it RERA registered? What have they delivered? How will you see the progress? Here are our answers, before you call.",
      },
      family: {
        eyebrow: "Vaishno Ventures · RERA P01100010545",
        title: "Check us before you book.",
        sub: "Our RERA number, the homes we've handed over in Bangalore, and the construction you can follow, all on one page.",
      },
    },
    angleBlock: {
      eyebrow: "3 questions, answered",
      title: "Never book an under-construction home without these answers.",
      body: "Hyderabad buyers worry about delays and approvals, and they should. Here is how SkyVue answers the three questions that matter most.",
      points: [
        { title: "Is it registered?", text: "Yes. Telangana RERA P01100010545. Check it yourself on the RERA website." },
        { title: "What have they delivered?", text: "Homes for 900+ families across 9 projects in East Bangalore, from Hoodi to Varthur." },
        { title: "How will I see progress?", text: "Construction updates against the RERA schedule, shared with every buyer." },
        { title: "When is possession?", text: "Planned for 31 March 2030." },
      ],
      img: r("street-view.jpg"),
      imgAlt: "SkyVue street view",
    },
    order: ["facts", "angle", "builder", "approvals", "progress", "homes", "plan", "comparison", "lifestyle", "location", "faq", "visit"],
    formTitle: "Get our approvals & track record",
    ctaLabel: "Send me the proof pack",
    seo: {
      title: "Vaishno SkyVue Tellapur | By Vaishno Ventures | RERA P01100010545",
      description:
        "Who is Vaishno? Homes for 900+ families delivered in Bangalore. Now Vaishno SkyVue in Tellapur: 570 homes, 3 BHK, starting from ₹1.6 Cr. RERA P01100010545.",
      index: false,
    },
  },
];

export const getLandingPage = (id: LandingPage["id"]) => landingPages.find((p) => p.id === id)!;

/** Form qualifiers (Channel & Funnel Architecture, instant-form bands). */
export const formOptions = {
  budget: ["₹1.6 – 1.8 Cr", "₹1.8 – 2.2 Cr", "Above ₹2.2 Cr"],
  timeline: ["Within 3 months", "3 – 6 months", "After 6 months"],
} as const;

export const formatCr = (n: number) => `₹${(n / 1e7).toFixed(2)} Cr`;
export const formatLakh = (n: number) => `₹${(n / 1e5).toFixed(2)} L`;

/** Track record line (Rahul, 27 Oct 2026). */
export const trackRecord = { projects: "10+", projectsLine: "10+ projects across Bangalore and Hyderabad", families: "900+" } as const;

/**
 * Amenities from the brochure master plan (16 outdoor + 28 indoor, photographed 27 Oct 2026).
 * Lobby, toilets, administrative office and storage are left out: 40 amenities in 4 groups.
 * `img` = the closest Final Render; its caption names what the render really shows.
 */
export const amenityGroups = [
  {
    id: "care",
    title: "Health & care",
    line: "Care for every age, a lift ride away.",
    img: "/lp/skyvue/fr/open-gym.webp",
    caption: "Open gym on the podium",
    items: [
      "Clinic & waiting lounge",
      "Pharmacy",
      "Pet clinic & spa",
      "Senior citizen gym",
      "Sauna & steam room",
      "Yoga & meditation corner",
      "Zumba centre",
      "Yoga lawn",
    ],
  },
  {
    id: "work",
    title: "Work & learning",
    line: "An office and a library inside the gate.",
    img: "/lp/skyvue/fr/waiting-lounge.webp",
    caption: "Clubhouse reception & waiting lounge",
    items: [
      "Co-working space",
      "Business centre",
      "Conference lounge",
      "Library & reading corner",
      "Learning & development centre",
      "Work from the garden",
      "Reception & waiting lounge",
    ],
  },
  {
    id: "family",
    title: "Kids & family",
    line: "Room for children, grandparents and every celebration.",
    img: "/lp/skyvue/fr/indoor-games.webp",
    caption: "Indoor games room",
    items: [
      "Play zone",
      "Day care centre",
      "Story telling & nap zone",
      "Open play lawns",
      "Indoor games",
      "Private theatre",
      "Community hall",
      "Cooking & baking centre",
    ],
  },
  {
    id: "gardens",
    title: "Gardens & open air",
    line: "Lawns, pergolas and five kinds of garden.",
    img: "/lp/skyvue/fr/podium-pergola.webp",
    caption: "Pergolas on the podium",
    items: [
      "Amphitheatre",
      "Mini amphitheatre",
      "Party & festival lawn",
      "Sloped lawn",
      "Tropical garden",
      "Bamboo garden",
      "Hanging garden",
      "Rock garden",
      "Mound garden",
      "Planting island",
      "Stepping stones",
      "Swings under pergola",
      "Pergola with seating",
      "Seating deck",
      "Elderly seating",
      "Outdoor table tennis",
      "Board games",
    ],
  },
] as const;
export const amenityCount = amenityGroups.reduce((n, g) => n + g.items.length, 0);
/** Also in SkyVue, shown elsewhere in the brochure. */
export const amenityExtras = ["Rooftop pool", "Miyawaki forest", "Double-height badminton court", "Gym", "Pickleball & half-basketball", "Pet park"] as const;
