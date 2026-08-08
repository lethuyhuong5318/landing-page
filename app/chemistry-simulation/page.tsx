import type { Metadata } from "next";
import ChemistrySimulationPageClient from "./ChemistrySimulationPageClient";

const TITLE = "Mô phỏng phản ứng điện hóa học 3D | ChamChamEdemy";
const DESCRIPTION = "Mô phỏng 3D quá trình điện phân: quan sát ion di chuyển trong dung dịch và kim loại bám trên điện cực, trực quan và dễ hiểu. Xem trực tiếp trên trình duyệt, miễn phí.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/chemistry-simulation/" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/chemistry-simulation/" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ChemistrySimulationPage() {
  return <ChemistrySimulationPageClient />;
}
