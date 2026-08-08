import type { Metadata } from "next";
import SiteChrome from "../components/SiteChrome";
import JsonLd from "../../components/seo/JsonLd";
import { breadcrumbSchema } from "../../lib/schema";
import { getAssetPath } from "../basePath";

const TITLE = "Học Hóa Thủ Đức THCS–THPT | Cô Trâm | ChamChamEdemy";
const DESCRIPTION = "Lớp học Hóa tại Thủ Đức: gia sư 1:1, nhóm nhỏ, lấy gốc Hóa 8–9, ôn thi vào 10 cùng Cô Trâm.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["học hóa thủ đức", "gia sư hóa tp thủ đức", "lớp hóa thủ đức"],
  alternates: { canonical: "/hoc-hoa-thu-duc" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/hoc-hoa-thu-duc" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function HocHoaThuDucPage() {
  return (
    <SiteChrome>
      <JsonLd data={breadcrumbSchema([
        { name: "Trang chủ", path: "/" },
        { name: "Học Hóa", path: "/hoc-hoa" },
        { name: "Thủ Đức", path: "/hoc-hoa-thu-duc" },
      ])} />

      <div className="content-shell">
        <section className="page-hero">
          <p className="section-kicker">THỦ ĐỨC · TP.HCM</p>
          <h1>Lớp học Hóa tại Thủ Đức<br />THCS–THPT cùng Cô Trâm</h1>
          <p>Học trực tiếp hoặc gia sư 1:1. Hóa 8–9 lấy gốc, ôn thi vào 10, Hóa 11–12 luyện thi. Chẩn đoán kiến thức trước khi xếp lớp.</p>
          <div className="hero-actions">
            <a href={getAssetPath("/#dang-ky")} className="button button-primary">Đăng ký học thử</a>
            <a href={getAssetPath("/hoc-hoa-quan-9/")} className="button button-ghost">Xem Quận 9</a>
          </div>
        </section>

        <section style={{ padding: "48px 20px" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Khu vực phục vụ Thủ Đức</h2>
            <p style={{ fontSize: "15px", lineHeight: "1.8", marginBottom: "24px" }}>
              ChamChamEdemy phục vụ học sinh tại TP. Thủ Đức thông qua hai hình thức chính:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
              <div style={{ padding: "24px", backgroundColor: "#edf7fa", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>1. Học trực tiếp Quận 9</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.8" }}>
                  Học sinh tại Thủ Đức có thể đến học tại địa chỉ Quận 9 (cách xa nhất khoảng 10–15km từ một số khu vực).
                </p>
              </div>
              <div style={{ padding: "24px", backgroundColor: "#dff5e9", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>2. Gia sư 1:1 online</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.8" }}>
                  Hoặc chọn gia sư 1:1 online toàn quốc, linh hoạt giờ giấc, tiết kiệm thời gian di chuyển.
                </p>
              </div>
            </div>

            <div style={{ padding: "20px", backgroundColor: "#fff9e6", borderRadius: "12px", marginBottom: "24px" }}>
              <strong style={{ fontSize: "15px" }}>💡 Lưu ý:</strong>
              <p style={{ fontSize: "14px", marginTop: "8px" }}>
                ChamChamEdemy hiện chỉ có một cơ sở học trực tiếp tại Quận 9. Nếu em ở Thủ Đức, hãy liên hệ để được tư vấn hình thức học phù hợp nhất.
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: "48px 20px", backgroundColor: "rgba(255,255,255,.5)" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Chương trình học phù hợp</h2>
            <ul style={{ fontSize: "15px", lineHeight: "2.2", listStyleType: "none", padding: "0" }}>
              <li>✅ <strong>Hóa 8–9 lấy gốc:</strong> Xây nền công thức, hóa trị, cân bằng PTHH</li>
              <li>✅ <strong>Ôn thi vào 10:</strong> Ôn tập toàn diện, chuẩn bị vào THPT</li>
              <li>✅ <strong>Hóa 10 tiên phong:</strong> Nối lại THCS, làm quen THPT từ đầu năm</li>
              <li>✅ <strong>Hóa 11–12 luyện thi:</strong> Học chắc, luyện bài theo chuyên đề</li>
              <li>✅ <strong>KHTN 9:</strong> Toàn diện Lý – Hóa – Sinh</li>
            </ul>
          </div>
        </section>

        <section style={{ padding: "48px 20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "32px" }}>Bước tiếp theo</h2>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <p style={{ fontSize: "15px", lineHeight: "1.8", marginBottom: "24px" }}>
              Hãy đăng ký bài test chẩn đoán 15 phút. Cô Trâm sẽ:
            </p>
            <ul style={{ fontSize: "14px", lineHeight: "1.8", listStyleType: "none", padding: "0" }}>
              <li>✓ Xác định phần kiến thức đang hổng</li>
              <li>✓ Tư vấn lộ trình phù hợp</li>
              <li>✓ Giới thiệu hình thức học tốt nhất</li>
            </ul>
            <a href={getAssetPath("/#dang-ky")} className="button button-primary" style={{ marginTop: "24px", display: "inline-block" }}>
              Đăng ký bài test miễn phí →
            </a>
          </div>
        </section>
      </div>
    </SiteChrome>
  );
}
