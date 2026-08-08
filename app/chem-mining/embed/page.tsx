import type { Metadata } from "next";
import MiningGameEmbedClient from "./MiningGameEmbedClient";

// Iframe-only surface embedded inside /lay-goc-hoa/hoa-tri/ and linked
// full-screen from /chem-mining/ — no standalone content of its own, so
// indexing it separately would just be a thin/duplicate result. Keep it
// crawlable enough for Google to render the iframe context, but out of
// the index.
export const metadata: Metadata = {
  title: "Đào Hóa Trị 2D (nhúng) | ChamChamEdemy",
  alternates: { canonical: "/chem-mining/embed/" },
  robots: { index: false, follow: false },
};

export default function ChemistryMiningEmbedPage() {
  return <MiningGameEmbedClient />;
}
