import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "@fontsource-variable/manrope";
import "./globals.css";
import { motionBootScript } from "@/lib/motion";

/**
 * skyvue.vaishnoventures.com — the 4 SkyVue campaign landing pages (separate from the
 * main WordPress-structured website at vaishnoventures.com).
 * Set NEXT_PUBLIC_GTM_ID (e.g. GTM-XXXXXXX) to load Google Tag Manager; GA4, the Meta pixel
 * and conversion tags live inside GTM. Leads push the `skyvue_lead` event to the dataLayer.
 */
const siteUrl = "https://skyvue.vaishnoventures.com";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Vaishno SkyVue, Tellapur | Exclusive 3 BHK Luxury Homes", template: "%s | Vaishno SkyVue" },
  description: "Vaishno SkyVue in Tellapur: 570 exclusive 3 BHK luxury homes by Vaishno Ventures. TS RERA P01100010545.",
  openGraph: { type: "website", siteName: "Vaishno SkyVue", locale: "en_IN", url: siteUrl },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#00355d" };

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
        {children}
      </body>
    </html>
  );
}
