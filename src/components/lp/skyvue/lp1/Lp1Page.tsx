import "@fontsource-variable/jost";
import { lpPaths } from "@/data/lp-paths";
import "./lp1.css";
import { lp1 } from "@/data/skyvue-lp1";
import { Opening } from "./Opening";
import { BuildScene } from "./BuildScene";
import { TowerBridge } from "./TowerBridge";
import { Neighbourhood } from "./Neighbourhood";
import { BalconyFilm, ClubhouseFilm, HorizonFilm, PodiumFilm, TowersFilm } from "./FrameScenes";
import { Amenities } from "./Amenities";
import { LpProvider } from "./PageConfig";
import { Approvals, Builder, Care, Compare, Enquire, Faq, Footer, Homes, Location, PaymentPlan, Visit, ProgressBlock } from "./Sections";
import { DesktopWhatsApp, FactRail, Header, ProgressPillar } from "./Chrome";
import { ScrollCue } from "../ScrollCue";
import { EnquiryDrawer } from "./EnquiryDrawer";

/**
 * LP1 · "570 homes. Not a township."  →  /lp/skyvue-570-homes/  (versions: ?v=buyer | family | parents)
 *
 * Order (Blueprint · The 4 pages, LP1): Opening → The build → Neighbourhood (570) → Compare →
 * Homes & plans → Life at SkyVue → Care → Location → Approvals → Who is Vaishno → Payment plan →
 * Enquire → FAQ → Site visit → Footer. Fact rail, header, enquiry drawer and progress pillar are fixed.
 */
export function Lp1Page() {
  return (
    <LpProvider value={lp1}>
    <div className="sv1" data-lp={lp1.id} id="top">
      <Header />
      <main>
        <Opening />
        <TowerBridge />
        <BuildScene />
        <HorizonFilm />
        <Neighbourhood />
        <PodiumFilm />
        <Compare />
        <TowersFilm />
        <BalconyFilm />
        <Homes />
        <ClubhouseFilm />
        <Amenities />
        <Care />
        <Location />
        <Approvals />
        <ProgressBlock />
        <Builder />
        <PaymentPlan />
        <Enquire />
        <Faq />
        <Visit />
      </main>
      <Footer />
      <FactRail />
      <ProgressPillar />
      <ScrollCue tone="light" />
      <DesktopWhatsApp />
      <EnquiryDrawer pageId={lp1.id} pageSlug={lp1.slug} title={lp1.formTitle} cta={lp1.formCta} />
    </div>
    </LpProvider>
  );
}

export const lp1Metadata = {
  title: { absolute: lp1.seo.title },
  description: lp1.seo.description,
  alternates: { canonical: lpPaths.lp1 },
  robots: { index: true, follow: true },
  openGraph: {
    title: lp1.seo.title,
    description: lp1.seo.description,
    url: lpPaths.lp1,
    images: [{ url: "/lp/skyvue/fr/elevation.webp" }],
  },
};
