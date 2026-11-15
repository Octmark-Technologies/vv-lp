import type { Metadata } from "next";
import { ThankYou } from "@/components/lp/skyvue/ThankYou";

// Where every SkyVue lead form lands after a successful submit (conversion page; not indexed).
export const metadata: Metadata = {
  title: "Thank you | Vaishno SkyVue",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ThankYou />;
}
