import "@fontsource-variable/jost";
import { lpPaths } from "@/data/lp-paths";
import "../lp1/lp1.css";
import "./lp3.css";
import { faqs } from "@/data/skyvue-landing";
import { lp3, lp3Faqs } from "@/data/skyvue-lp3";
import { Amenities } from "../lp1/Amenities";
import { Approvals, Builder, Compare, Enquire, Faq, Footer, Homes, Location, PaymentPlan, ProgressBlock, Visit } from "../lp1/Sections";
import { DesktopWhatsApp, FactRail, Header, ProgressPillar } from "../lp1/Chrome";
import { EnquiryDrawer } from "../lp1/EnquiryDrawer";
import { LpProvider } from "../lp1/PageConfig";
import { ScrollCue } from "../ScrollCue";
import { Altitude, DownUp, PodiumBelow, RooftopAbove, ViewScene } from "./Lp3Scenes";

/**
 * LP3 · "Life starts 70 ft up."  →  /70ft-above/  (?v=buyer | family | parents)
 * Dream outcome first (altitude, the view, the podium below and the rooftop above), then the
 * contrast, the homes, the amenities, proof and the form.
 */
export function Lp3Page() {
  return (
    <LpProvider value={lp3}>
      <div className="sv1 sv-lp3" data-lp={lp3.id} id="top">
        <Header />
        <main>
          <Altitude />
          <ViewScene />
          <PodiumBelow />
          <DownUp />
          <RooftopAbove />
          <Homes />
          <Amenities />
          <ProgressBlock />
          <Location />
          <Compare />
          <Approvals />
          <Builder />
          <PaymentPlan />
          <Enquire />
          <Faq items={[...lp3Faqs, ...faqs]} />
          <Visit />
        </main>
        <Footer />
        <FactRail />
        <ProgressPillar />
        <ScrollCue tone="light" right />
        <DesktopWhatsApp />
        <EnquiryDrawer pageId={lp3.id} pageSlug={lp3.slug} title={lp3.formTitle} cta={lp3.formCta} />
      </div>
    </LpProvider>
  );
}

export const lp3Metadata = {
  title: { absolute: lp3.seo.title },
  description: lp3.seo.description,
  alternates: { canonical: lpPaths.lp3 },
  robots: { index: true, follow: true },
  openGraph: { title: lp3.seo.title, description: lp3.seo.description, url: lpPaths.lp3, images: [{ url: "/lp/skyvue/fr/elevation.webp" }] },
};
