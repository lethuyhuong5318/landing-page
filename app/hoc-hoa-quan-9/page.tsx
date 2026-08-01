import type { Metadata } from "next";
import SiteChrome from "../components/SiteChrome";
import JsonLd from "../../components/seo/JsonLd";
import { breadcrumbSchema } from "../../lib/schema";
import { getAssetPath } from "../basePath";
import { BUSINESS_ADDRESS, GOOGLE_MAPS_URL, CONTACT_PHONE_DISPLAY } from "../../lib/seo";

const TITLE = "Học Hóa Quận 9 1 Kèm 1 & Nhóm Nhỏ | Cô Trâm | ChamChamEdemy";
const DESCRIPTION = "Lớp học Hóa THCS–THPT tại Quận 9, TP.HCM: gia sư 1 kèm 1, nhóm nhỏ, lấy gốc và ôn thi vào 10 cùng Cô Trâm. Đăng ký học thử miễn phí.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["học hóa quận 9", "gia sư hóa quận 9", "lớp học thêm hóa q9", "lớp hóa quận 9 tp hcm"],
  alternates: { canonical: "/hoc-hoa-quan-9" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/hoc-hoa-quan-9" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function HocHoaQuan9Page() {
  return (
    <SiteChrome>
      <JsonLd data={breadcrumbSchema([
        { name: "Trang chủ", path: "/" },
        { name: "Học Hóa", path: "/hoc-hoa" },
        { name: "Quận 9", path: "/hoc-hoa-quan-9" },
      ])} />

      <div className="content-shell">
        <section className="page-hero">
          <p className="section-kicker">QUẬN 9 · TP.HCM</p>
          <h1>Lớp học Hóa tại Quận 9<br />cho học sinh mất gốc & cần cải thiện</h1>
          <p>Học trực tiếp hoặc gia sư 1:1, ôn thi vào 10, chuyên Hóa cùng Cô Trâm. Học thử miễn phí, chẩn đoán trước.</p>
          <div className="hero-actions">
            <a href={getAssetPath("/#dang-ky")} className="button button-primary">Đăng ký học thử</a>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer" className="button button-ghost">Xem địa điểm</a>
          </div>
        </section>

        <section style={{ padding: "48px 20px" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Địa chỉ & Thông tin liên hệ</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px" }}>
              <div>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", fontWeight: "700" }}>📍 Địa chỉ học trực tiếp</h3>
                <p style={{ fontSize: "15px", lineHeight: "1.6", marginBottom: "16px" }}>
                  {BUSINESS_ADDRESS.streetAddress}<br />
                  {BUSINESS_ADDRESS.addressLocality}, {BUSINESS_ADDRESS.addressRegion}
                </p>
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer" style={{ color: "#2878C8", fontWeight: "700" }}>
                  Xem trên Google Maps →
                </a>
              </div>
              <div>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", fontWeight: "700" }}>📞 Liên hệ ngay</h3>
                <p style={{ fontSize: "15px", lineHeight: "1.6" }}>
                  <strong>Zalo/SĐT:</strong> {CONTACT_PHONE_DISPLAY}<br />
                  <a href="https://www.facebook.com/profile.php?id=61590518783118" target="_blank" rel="noreferrer" style={{ color: "#2878C8" }}>
                    Nhắn Facebook →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "48px 20px", backgroundColor: "rgba(255,255,255,.5)" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Hình thức & Lộ trình học</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              <div style={{ padding: "24px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Học nhóm nhỏ</h3>
                <ul style={{ fontSize: "14px", lineHeight: "1.8", margin: "0", paddingLeft: "20px" }}>
                  <li>3–5 học sinh/lớp</li>
                  <li>90 phút/buổi</li>
                  <li>Tương tác, chữa bài</li>
                  <li>Phù hợp: tập thể, học tập ổn định</li>
                </ul>
              </div>
              <div style={{ padding: "24px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Gia sư 1:1</h3>
                <ul style={{ fontSize: "14px", lineHeight: "1.8", margin: "0", paddingLeft: "20px" }}>
                  <li>Riêng từng em</li>
                  <li>60–90 phút/buổi</li>
                  <li>Lộ trình tùy chỉnh</li>
                  <li>Phù hợp: cần hỗ trợ riêng</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "48px 20px" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Tại sao chọn ChamChamEdemy?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              <div>
                <strong style={{ fontSize: "16px" }}>✓ Chẩn đoán trước</strong>
                <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>Test 15 phút tìm điểm hổng, chọn đúng lộ trình</p>
              </div>
              <div>
                <strong style={{ fontSize: "16px" }}>✓ Giáo viên có kinh nghiệm</strong>
                <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>Cô Trâm: 4+ năm dạy THCS–THPT, chuyên lấy gốc</p>
              </div>
              <div>
                <strong style={{ fontSize: "16px" }}>✓ Báo cáo buổi học</strong>
                <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>Phụ huynh nhận phiếu sau mỗi buổi học</p>
              </div>
              <div>
                <strong style={{ fontSize: "16px" }}>✓ Linh hoạt giờ học</strong>
                <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>Sáng, chiều, tối, cuối tuần theo kế hoạch</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "48px 20px", backgroundColor: "rgba(255,255,255,.5)" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Các chương trình chính</h2>
            <ul style={{ fontSize: "15px", lineHeight: "2", listStyleType: "none", padding: "0" }}>
              <li>📚 Hóa 8–9: Lấy gốc & Xây nền tảng</li>
              <li>🎯 Ôn thi vào 10 / Chuyên Hóa</li>
              <li>🚀 Hóa 10: Tiên phong lớp 10</li>
              <li>⭐ Hóa 11–12 & Luyện thi tốt nghiệp</li>
              <li>🔬 KHTN 9: Lý – Hóa – Sinh toàn diện</li>
            </ul>
          </div>
        </section>

        <section style={{ padding: "48px 20px", textAlign: "center" }}>
          <a href={getAssetPath("/#dang-ky")} className="button button-primary">
            Đăng ký bài test đầu vào 15 phút →
          </a>
        </section>
      </div>
    </SiteChrome>
  );
}
