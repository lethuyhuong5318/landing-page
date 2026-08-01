import type { Metadata } from "next";
import SiteChrome from "./components/SiteChrome";
import { getAssetPath } from "./basePath";

export const metadata: Metadata = {
  title: "Trang không tìm thấy | ChamChamEdemy",
  description: "Trang bạn tìm kiếm không tồn tại. Quay lại trang chủ để khám phá các khóa học Hóa của Cô Trâm.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="wrap" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "16px", color: "#0B2F5B" }}>
          404 — Trang không tìm thấy
        </h1>
        <p style={{ fontSize: "16px", color: "#718399", marginBottom: "32px", maxWidth: "600px", margin: "0 auto 32px" }}>
          Rất tiếc, trang bạn tìm kiếm không tồn tại. Quay lại trang chủ hoặc truy cập menu để tìm khóa học phù hợp.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={getAssetPath("/")} className="button button-primary">
            Quay lại trang chủ
          </a>
          <a href={getAssetPath("/blog")} className="button button-ghost">
            Blog Hóa
          </a>
        </div>
      </div>
    </SiteChrome>
  );
}
