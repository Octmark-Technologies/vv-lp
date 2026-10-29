/**
 * Project portfolio data.
 *
 * Sources: vaishnoventures.com project pages, SkyVue client-confirmed facts
 * (23 Oct 2026), Karnataka RERA listing for Vaishno Excellency.
 * Fields left undefined were not published anywhere — fill them from the
 * client's brochures / price sheets before launch.
 */

export type ProjectStatus = "ongoing" | "completed" | "upcoming";
export type City = "Hyderabad" | "Bengaluru";

export interface Project {
  slug: string;
  name: string;
  city: City;
  locality: string;
  address?: string;
  status: ProjectStatus;
  type: "Apartments" | "Villas";
  tagline: string;
  description: string;
  acres: number;
  units: number;
  towers?: number;
  floors?: string;
  configurations?: string;
  sizeRange?: string;
  priceFrom?: string;
  possession?: string;
  rera?: string;
  openSpace?: string;
  highlights?: string[];
  amenities?: string[];
  externalUrl?: string;
  featured?: boolean;
  /** Placeholder visual tones until renders are supplied. */
  tone: [string, string];
  /** Drop renders into /public/images/projects/<slug>/ and list them here. */
  images?: string[];
}

/**
 * URL paths — mirror the existing vaishnoventures.com structure exactly (same
 * domain, preserve SEO). Only SkyVue (previously an external microsite) and
 * Excellency (never listed) get new paths. DO NOT rename existing paths.
 */
export const projectPaths: Record<string, string> = {
  skyvue: "/project/vaishno-skyvue/",
  sapphire: "/sapphire/",
  luxuria: "/luxuria-lp/",
  ambaram: "/project/ambaram-bengaluru/",
  signature: "/project/vaishno-signature/",
  spark: "/project/vaishno-spark/",
  lotus: "/project/vaishno-palash-2/",
  solitair: "/project/vaishno-solitair/",
  excellency: "/project/vaishno-excellency/",
  silverbells: "/project/vaishno-silverbells/",
  seasons: "/project/vaishno-seasons/",
  "white-petals": "/project/project-item3/",
  palash: "/project/vaishno-palash/",
};

export const projects: Project[] = [
  // ───────────── Ongoing — Hyderabad ─────────────
  {
    slug: "skyvue",
    name: "Vaishno SkyVue",
    city: "Hyderabad",
    locality: "Tellapur",
    status: "ongoing",
    type: "Apartments",
    tagline: "Only 570 families. 350 sq ft of lifestyle each.",
    description:
      "Two 36-storey towers on 3.76 acres, built only for 3 BHK+ homes. Car-free podium living, a G+5 clubhouse with a rooftop pool, and 75% open space — with living floors starting 70 ft above the podium for unbroken 180° views.",
    acres: 3.76,
    units: 570,
    towers: 2,
    floors: "36 storeys",
    configurations: "3 BHK",
    sizeRange: "2,010 – 2,890 sq ft",
    priceFrom: "₹1.49 Cr*",
    rera: "P01100010545",
    openSpace: "75%",
    featured: true,
    highlights: [
      "2 lakh sq ft lifestyle area",
      "G+5 clubhouse with rooftop pool",
      "Car-free podium, 6 parking levels",
      "Floor-to-floor height of 10′4″",
      "Extended balconies up to ~46 ft",
      "Pay 5%, then hands-free till tower structure completes",
    ],
    amenities: [
      "Miyawaki forest",
      "Clinic & pharmacy",
      "Pet clinic & spa",
      "Cooking & baking studio",
      "Day care with nap zone",
      "Guest rooms",
      "Rooftop pool",
      "Home theatre-ready units",
    ],
    externalUrl: "https://info.skyvuebyvaishno.com/skyvue",
    tone: ["#1F3A32", "#B08D57"],
  },
  {
    slug: "sapphire",
    name: "Vaishno Sapphire",
    city: "Hyderabad",
    locality: "Kollur",
    status: "ongoing",
    type: "Apartments",
    tagline: "A low-density gated community in a terracotta skin.",
    description:
      "Two G+12 towers on 2.8 acres near the ORR — 20 minutes to the Financial District and 9 minutes to Neopolis. A terracotta façade, landscaped gardens and a full clubhouse, financed by Aditya Birla Housing Finance.",
    acres: 2.8,
    units: 258,
    towers: 2,
    floors: "G+12",
    configurations: "2 & 3 BHK",
    sizeRange: "1,365 – 2,030 sq ft",
    possession: "August 2028",
    rera: "P01100010046",
    featured: true,
    highlights: [
      "Low density — 92 units per acre",
      "5% down payment",
      "9 min to Neopolis, 20 min to Financial District",
      "Financing partner: Aditya Birla Housing Finance",
    ],
    amenities: [
      "Adult & kids' pool",
      "Spa & salon",
      "Supermarket & pharmacy",
      "Pickleball court",
      "Amphitheatre",
      "Pet park",
      "Skating rink",
      "Cricket practice pitch",
      "Senior citizen reflexology garden",
      "6 guest rooms",
      "Crèche",
      "Jogging track",
    ],
    tone: ["#3B2A22", "#C2774F"],
  },
  // ───────────── Ongoing — Bengaluru ─────────────
  {
    slug: "luxuria",
    name: "Vaishno Luxuria",
    city: "Bengaluru",
    locality: "Varthur",
    status: "ongoing",
    type: "Villas",
    tagline: "70 triplex villas, each with its own garden.",
    description:
      "A gated enclave of 70 luxury 4 BHK triplex villas on 4.5 acres, each with a private backyard garden and access to a clubhouse with 30+ amenities. 15 minutes to Whitefield, 20 minutes to ITPL.",
    acres: 4.5,
    units: 70,
    configurations: "4 BHK Triplex Villas",
    sizeRange: "From 1,550 sq ft",
    possession: "December 2026",
    featured: true,
    highlights: [
      "Private backyard garden in every villa",
      "30+ amenities",
      "15 min to Whitefield",
      "20 min to ITPL",
    ],
    amenities: [
      "Clubhouse",
      "Swimming pool",
      "Gym",
      "Indoor badminton",
      "Cafeteria",
      "Grocery store",
      "Jogging track",
      "Kids' play area",
    ],
    tone: ["#2E3B2B", "#8FA36B"],
  },
  {
    slug: "ambaram",
    name: "Vaishno Ambaram",
    city: "Bengaluru",
    locality: "Gunjur",
    status: "ongoing",
    type: "Apartments",
    tagline: "A sky-themed tower with 270° open views.",
    description:
      "A 28-storey luxury tower on 1.45 acres in Gunjur with only 143 homes, around 75% open space and 270-degree views. 25+ amenities, designed by reputed architects and financed by ABHFL.",
    acres: 1.45,
    units: 143,
    towers: 1,
    floors: "28 storeys",
    configurations: "3 BHK",
    sizeRange: "1,350 – 1,820 sq ft",
    openSpace: "~75%",
    highlights: ["270° open views", "Only 143 homes", "25+ amenities", "Financed by ABHFL"],
    amenities: [
      "Swimming pool",
      "Squash court",
      "Golf putting",
      "Gymnasium",
      "Banquet hall",
      "Badminton court",
      "Gaming zone",
      "Grand reception",
    ],
    tone: ["#22303F", "#7C98B3"],
  },
  // ───────────── Delivered — Bengaluru ─────────────
  {
    slug: "signature",
    name: "Vaishno Signature",
    city: "Bengaluru",
    locality: "Hoodi",
    address: "1st Main Rd, Ayyappa Nagar Main Rd, Anup Layout, Hoodi, Bengaluru 560048",
    status: "completed",
    type: "Apartments",
    tagline: "An embodiment of refined living.",
    description: "154 homes on 3 acres in Hoodi, with avant-garde architecture and a suite of premium amenities.",
    acres: 3,
    units: 154,
    tone: ["#2B2B2B", "#B08D57"],
  },
  {
    slug: "spark",
    name: "Vaishno Spark",
    city: "Bengaluru",
    locality: "KR Puram",
    address: "Priyanka Nagar, Seegehalli, Krishnarajapura, Bengaluru 560067",
    status: "completed",
    type: "Apartments",
    tagline: "A dynamic fusion of style and functionality.",
    description: "172 contemporary homes across 2.3 acres in Seegehalli, KR Puram.",
    acres: 2.3,
    units: 172,
    tone: ["#3A2E1F", "#D29B4B"],
  },
  {
    slug: "lotus",
    name: "Vaishno Lotus",
    city: "Bengaluru",
    locality: "Choodasandra",
    address: "Chikkanayakana Halli Rd, Muneshwara Layout, Choodasandra, Bengaluru 560035",
    status: "completed",
    type: "Apartments",
    tagline: "A serene and exclusive community.",
    description: "168 residences on 2.4 acres off Sarjapur Road.",
    acres: 2.4,
    units: 168,
    tone: ["#3B2433", "#C48AA6"],
  },
  {
    slug: "solitair",
    name: "Vaishno Solitair",
    city: "Bengaluru",
    locality: "Ramamurthy Nagar",
    address: "Ramamurthi Nagar Main Rd, Dasappa Layout, Bengaluru 560016",
    status: "completed",
    type: "Apartments",
    tagline: "Contemporary architecture in a prime address.",
    description: "147 homes on 1.72 acres in Ramamurthy Nagar.",
    acres: 1.72,
    units: 147,
    tone: ["#1E2A33", "#9FB4C4"],
  },
  {
    slug: "excellency",
    name: "Vaishno Excellency",
    city: "Bengaluru",
    locality: "Mullur, Varthur",
    status: "completed",
    type: "Apartments",
    tagline: "Thoughtful 2 BHK homes in East Bengaluru.",
    description: "100 homes on 1.5 acres in Mullur, Varthur Hobli, with over half the land kept open.",
    acres: 1.5,
    units: 100,
    configurations: "2 BHK",
    rera: "PRM/KA/RERA/1251/446/PR/210312/004010",
    tone: ["#26332A", "#A4B88E"],
  },
  {
    slug: "silverbells",
    name: "Vaishno Silverbells",
    city: "Bengaluru",
    locality: "Varthur",
    address: "Gokula Layout, Balagere Road, Devasthanagalu, Varthur 560087",
    status: "completed",
    type: "Apartments",
    tagline: "Finely crafted homes, a limited collection.",
    description: "76 homes on 1 acre off Balagere Road, Varthur.",
    acres: 1,
    units: 76,
    tone: ["#2C2F36", "#C9CCD3"],
  },
  {
    slug: "seasons",
    name: "Vaishno Seasons",
    city: "Bengaluru",
    locality: "KR Puram",
    address: "Survey No. 26/4, Anandapura, Krishnarajapura, Bengaluru 560036",
    status: "completed",
    type: "Apartments",
    tagline: "Where every moment blooms with beauty.",
    description: "56 homes on 0.68 acres in Anandapura, designed around nature and the changing seasons.",
    acres: 0.68,
    units: 56,
    tone: ["#33301E", "#C9B458"],
  },
  {
    slug: "white-petals",
    name: "Vaishno White Petals",
    city: "Bengaluru",
    locality: "Varthur",
    address: "Balagere Rd, Devasthanagalu, Varthur, Bengaluru 560087",
    status: "completed",
    type: "Apartments",
    tagline: "40 residences on half an acre.",
    description: "A limited collection of 40 homes with modern design, green landscaping and tight security.",
    acres: 0.5,
    units: 40,
    tone: ["#2F3433", "#E4DED2"],
  },
  {
    slug: "palash",
    name: "Vaishno Palash",
    city: "Bengaluru",
    locality: "Varthur",
    address: "Devasthanagalu, Varthur, Bengaluru 560087",
    status: "completed",
    type: "Apartments",
    tagline: "An exclusive boutique address.",
    description: "30 homes on 0.44 acres in Devasthanagalu, Varthur.",
    acres: 0.44,
    units: 30,
    tone: ["#3A1F1F", "#D0705A"],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const projectHref = (p: Pick<Project, "slug">) => projectPaths[p.slug];

/** Projects served under /project/<segment>/ — segment → project. */
export const projectSegments = Object.fromEntries(
  Object.entries(projectPaths)
    .filter(([, path]) => path.startsWith("/project/"))
    .map(([slug, path]) => [path.split("/")[2], slug]),
) as Record<string, string>;
export const ongoingProjects = projects.filter((p) => p.status === "ongoing");
export const completedProjects = projects.filter((p) => p.status === "completed");
export const featuredProjects = projects.filter((p) => p.featured);
