import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";
import { motionBootScript } from "@/lib/motion";

/**
 * skyvue.vaishnoventures.com — the 4 SkyVue campaign landing pages (separate from the
 * main WordPress-structured website at vaishnoventures.com).
 * Set NEXT_PUBLIC_GTM_ID (e.g. GTM-XXXXXXX) to load Google Tag Manager; GA4, the Meta pixel
 * and conversion tags live inside GTM. Leads push the `skyvue_lead` event to the dataLayer.
 */
const siteUrl = "https://skyvue.vaishnoventures.com";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-M52NSH9S";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Vaishno SkyVue, Tellapur | Exclusive 3 BHK Luxury Homes", template: "%s | Vaishno SkyVue" },
  description: "Vaishno SkyVue in Tellapur: 570 exclusive 3 BHK luxury homes by Vaishno Ventures. TS RERA P01100010545.",
  openGraph: { type: "website", siteName: "Vaishno SkyVue", locale: "en_IN", url: siteUrl },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#142d47" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body>
        {GTM_ID && (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
            <noscript>
              <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
            </noscript>
          </>
        )}
        {/* Call and WhatsApp clicks → dataLayer (call_click / whatsapp_click) for GTM conversions. */}
        <Script id="contact-clicks" strategy="afterInteractive">
          {`document.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest("a[href]");if(!a)return;var h=a.getAttribute("href")||"";var ev=/^tel:/i.test(h)?"call_click":/(wa\\.me|whatsapp\\.com)/i.test(h)?"whatsapp_click":"";if(!ev)return;var s=a.closest("section[id],[id]");var p=new URLSearchParams(location.search);(window.dataLayer=window.dataLayer||[]).push({event:ev,link_url:h.split("?")[0],click_text:(a.textContent||a.getAttribute("aria-label")||"").trim().slice(0,60),click_location:s?s.id:(a.closest("header")?"header":a.closest("footer")?"footer":"page"),lp_path:location.pathname,lp_version:p.get("v")||"default"});},true);`}
        </Script>
        {children}
      </body>
    </html>
  );
}
