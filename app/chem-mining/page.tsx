import type { Metadata } from "next";
import ChemMiningPageClient from "./ChemMiningPageClient";

const TITLE = "Đào Hóa Trị 2D — Game học hóa trị tương tác | ChamChamEdemy";
const DESCRIPTION = "Chơi game Đào Hóa Trị 2D: canh móc cẩu, thu thập nguyên tố và trả lời đúng hóa trị để ghi điểm. Học hóa trị qua trò chơi, miễn phí, chơi ngay trên trình duyệt.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/chem-mining/" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/chem-mining/" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ChemMiningPage() {
  return <ChemMiningPageClient />;
}
