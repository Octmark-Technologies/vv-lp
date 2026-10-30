import "@fontsource-variable/jost";
import { lpPaths } from "@/data/lp-paths";
import "../lp1/lp1.css";
import "./lp4.css";
import { faqs } from "@/data/skyvue-landing";
import { lp4, lp4Faqs } from "@/data/skyvue-lp4";
import { Amenities } from "../lp1/Amenities";
import { Approvals, Compare, Enquire, Faq, Footer, Homes, Location, PaymentPlan, ProgressBlock, Visit } from "../lp1/Sections";
import { DesktopWhatsApp, FactRail, Header, ProgressPillar } from "../lp1/Chrome";
import { EnquiryDrawer } from "../lp1/EnquiryDrawer";
import { LpProvider } from "../lp1/PageConfig";
import { ScrollCue } from "../ScrollCue";
import { BangaloreFilm, Ledger, SiteLive } from "./Lp4Scenes";

/**
 * LP4 · "Don't trust a brochure. Check us."  →  /builder-proof/  (?v=buyer | family | parents)
 * Proof first (the site today, the delivered record, approvals, monthly progress), then the homes,
 * the plan and the form.
 */
export function Lp4Page() {
  return (
    <LpProvider value={lp4}>
      <div className="sv1 sv-lp4" data-lp={lp4.id} id="top">
        <Header />
        <main>
          <SiteLive />
          <Ledger />
          <BangaloreFilm />
          <Approvals />
          <ProgressBlock />
          <Compare />
          <Homes />
          <PaymentPlan />
          <Amenities />
          <Location />
          <Enquire />
          <Faq items={[...lp4Faqs, ...faqs.filter((f) => !/Who is Vaishno/i.test(f.q))]} />
          <Visit />
        </main>
        <Footer />
        <FactRail />
        <ProgressPillar />
        <ScrollCue tone="dark" onImage />
        <DesktopWhatsApp />
        <EnquiryDrawer pageId={lp4.id} pageSlug={lp4.slug} title={lp4.formTitle} cta={lp4.formCta} />
      </div>
    </LpProvider>
  );
}

export const lp4Metadata = {
  title: { absolute: lp4.seo.title },
  description: lp4.seo.description,
  alternates: { canonical: lpPaths.lp4 },
  robots: { index: true, follow: true },
  openGraph: { title: lp4.seo.title, description: lp4.seo.description, url: lpPaths.lp4, images: [{ url: "/progress/2026-10.webp" }] },
};
