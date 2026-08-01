import type { Metadata } from "next";
import SiteChrome from "../components/SiteChrome";
import JsonLd from "../../components/seo/JsonLd";
import { breadcrumbSchema } from "../../lib/schema";
import { getAssetPath } from "../basePath";

const TITLE = "Học Hóa THCS–THPT: Chọn lớp, mục tiêu & hình thức | ChamChamEdemy";
const DESCRIPTION = "Hóa 8–9 lấy gốc, Hóa 10, luyện thi vào 10, Hóa 11–12, KHTN 9: học trực tiếp Quận 9 hoặc online cùng Cô Trâm.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/hoc-hoa" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/hoc-hoa" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function HocHoaPage() {
  return (
    <SiteChrome>
      <JsonLd data={breadcrumbSchema([
        { name: "Trang chủ", path: "/" },
        { name: "Học Hóa", path: "/hoc-hoa" },
      ])} />
      <div className="content-shell">
        <section className="page-hero">
          <p className="section-kicker">HỌC HÓA THCS–THPT</p>
          <h1>Chọn khóa học phù hợp<br />với mục tiêu của em.</h1>
          <p>Từ lấy gốc Hóa 8–9 đến ôn thi lớp 11–12: mỗi em có một lộ trình riêng theo từng giai đoạn.</p>
        </section>

        <section style={{ padding: "48px 20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "32px" }}>Các khóa học chính</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            <a href={getAssetPath("/#khoa-hoc")} className="course-preview">
              <strong>Hóa 8–9 & Ôn vào 10</strong>
              <p>Xây nền, bám chắc chương trình phổ thông hoặc ôn thi vào 10/chuyên</p>
            </a>
            <a href={getAssetPath("/#khoa-hoc")} className="course-preview">
              <strong>KHTN 9: Lý – Hóa – Sinh</strong>
              <p>Kiến thức trọng tâm lớp 9 qua bài giảng, tài liệu và bài tập</p>
            </a>
            <a href={getAssetPath("/#khoa-hoc")} className="course-preview">
              <strong>Hóa 10: Lấy gốc & Tiên phong</strong>
              <p>Nối lại kiến thức THCS, làm quen học Hóa THPT từ đầu năm</p>
            </a>
            <a href={getAssetPath("/#khoa-hoc")} className="course-preview">
              <strong>Hóa 11–12 & Luyện thi</strong>
              <p>Học chắc kiến thức, luyện bài theo chuyên đề và mục tiêu điểm</p>
            </a>
          </div>
        </section>

        <section style={{ padding: "48px 20px", backgroundColor: "rgba(255,255,255,.5)" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "24px" }}>Hình thức học</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "12px" }}>
                <strong>Học trực tiếp Quận 9</strong>
                <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>Nhóm nhỏ 3–5 em, 90 phút/buổi</p>
              </div>
              <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "12px" }}>
                <strong>Gia sư 1 kèm 1</strong>
                <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>Riêng từng học sinh, linh hoạt giờ</p>
              </div>
              <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "12px" }}>
                <strong>Học online toàn quốc</strong>
                <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>Zoom tương tác, chữa bài trực tiếp</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "48px 20px", textAlign: "center" }}>
          <a href={getAssetPath("/#dang-ky")} className="button button-primary">
            Nhận tư vấn lộ trình miễn phí
          </a>
        </section>
      </div>
    </SiteChrome>
  );
}
