"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LeadForm } from "../LeadForm";
import { Close } from "@/components/Icons";
import { useLpMaybe } from "./PageConfig";

const EVENT = "sv:enquire";

/** Opens the enquiry drawer from anywhere on the page (header, rail, hero, sections). */
export function openEnquiry(source: string, intent: "enquiry" | "site_visit" | "payment_schedule" | "brochure" = "enquiry") {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { source, intent } }));
}

/**
 * One form, one tap away on every screen: a side drawer on desktop, a bottom sheet on
 * phones (Motion for React). The form is the shared LeadForm, so every lead carries the
 * page id, message version, UTMs and click IDs.
 */
export function EnquiryDrawer({ pageId, pageSlug, title, cta }: { pageId: string; pageSlug: string; title: string; cta: string }) {
  const offer = useLpMaybe()?.offer;
  const [state, setState] = useState<{ open: boolean; source: string; intent: "enquiry" | "site_visit" | "payment_schedule" | "brochure" }>({
    open: false,
    source: "",
    intent: "enquiry",
  });

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent).detail ?? {};
      setState({ open: true, source: d.source ?? "", intent: d.intent ?? "enquiry" });
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setState((s) => ({ ...s, open: false }));
    window.addEventListener(EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = state.open ? "hidden" : "";
  }, [state.open]);

  const close = () => setState((s) => ({ ...s, open: false }));
  const visit = state.intent === "site_visit";
  const brochure = state.intent === "brochure";

  return (
    <AnimatePresence>
      {state.open && (
        <motion.div className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Close" onClick={close} className="absolute inset-0 bg-[rgba(20,45,71,0.55)] backdrop-blur-[2px]" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={visit ? "Book a site visit" : brochure ? "Download the SkyVue brochure" : title}
            className="absolute inset-x-0 bottom-0 max-h-[92svh] overflow-y-auto rounded-t-3xl bg-[var(--sv-paper)] p-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[440px] md:rounded-none md:p-6"
            initial={{ y: "100%", x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <div className="flex items-center justify-between px-4 pt-3 md:px-0 md:pt-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lp/skyvue/brand/skyvue-logo.svg" alt="Vaishno SkyVue" className="h-8 w-auto" />
              <button type="button" onClick={close} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--sv-line)]">
                <Close width={18} height={18} />
              </button>
            </div>
            <div className="mt-4">
              <LeadForm
                pageId={pageId}
                pageSlug={pageSlug}
                formId={`${pageId}-drawer-${state.source || "page"}`}
                title={visit ? "Book your site visit" : brochure ? "Get the full SkyVue brochure" : title}
                cta={visit ? "Book my visit" : brochure ? "Download the brochure" : cta}
                intent={state.intent}
              />
            </div>
            <ul className="mt-5 grid gap-2 px-4 pb-4 text-[13px] text-[var(--sv-muted)] md:px-1">
              {brochure ? (
                <>
                  <li>• The full SkyVue brochure: 62 pages, PDF (9 MB)</li>
                  <li>• Opens on the next screen, ready to download</li>
                </>
              ) : offer ? (
                <>
                  <li>• A SkyVue advisor calls to understand how you&apos;d like to pay</li>
                  <li>• A written quote for your schedule, at your site visit</li>
                </>
              ) : (
                <>
                  <li>• Floor plans for your size, the cost sheet and the RERA certificate on WhatsApp</li>
                  <li>• A SkyVue advisor calls you back to answer questions</li>
                </>
              )}
              <li>• Weekday and weekend site visits</li>
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
