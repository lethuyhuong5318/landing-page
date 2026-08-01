import type { Metadata } from "next";
import SiteChrome from "../components/SiteChrome";
import JsonLd from "../../components/seo/JsonLd";
import { breadcrumbSchema } from "../../lib/schema";
import { getAssetPath } from "../basePath";

const TITLE = "Học Hóa Online 1 Kèm 1 THCS–THPT | Cô Trâm";
const DESCRIPTION = "Học Hóa online tương tác, chữa bài trực tiếp cùng Cô Trâm. Hóa 8–12, ôn thi vào 10, luyện thi tốt nghiệp. Lịch linh hoạt, toàn quốc.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["học hóa online", "học hóa online 1 kèm 1", "gia sư hóa online"],
  alternates: { canonical: "/hoc-hoa-online" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/hoc-hoa-online" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function HocHoaOnlinePage() {
  return (
    <SiteChrome>
      <JsonLd data={breadcrumbSchema([
        { name: "Trang chủ", path: "/" },
        { name: "Học Hóa", path: "/hoc-hoa" },
        { name: "Online", path: "/hoc-hoa-online" },
      ])} />

      <div className="content-shell">
        <section className="page-hero">
          <p className="section-kicker">HỌC ONLINE · TOÀN QUỐC</p>
          <h1>Học Hóa online tương tác<br />cùng Cô Trâm</h1>
          <p>Gia sư 1:1 qua Zoom, chữa bài trực tiếp. Hóa 8–12, ôn thi vào 10, luyện thi tốt nghiệp. Lịch linh hoạt sáng, chiều, tối, cuối tuần.</p>
          <div className="hero-actions">
            <a href={getAssetPath("/#dang-ky")} className="button button-primary">Đăng ký tư vấn</a>
          </div>
        </section>

        <section style={{ padding: "48px 20px" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Tại sao học Hóa online?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
              <div style={{ padding: "24px", backgroundColor: "#edf7fa", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>🕐 Lịch linh hoạt</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>Chọn giờ học sáng, chiều, tối hoặc cuối tuần. Thích hợp cho học sinh bận rộn.</p>
              </div>
              <div style={{ padding: "24px", backgroundColor: "#dff5e9", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>🌍 Toàn quốc</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>Học sinh ở bất kỳ đâu cũng có thể tham gia. Không cần di chuyển, tiết kiệm thời gian.</p>
              </div>
              <div style={{ padding: "24px", backgroundColor: "#f1edfb", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>👥 1 kèm 1 tập trung</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>Gia sư chỉ dạy một em, tùy chỉnh lộ trình theo từng người.</p>
              </div>
              <div style={{ padding: "24px", backgroundColor: "#edf7fa", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>📱 Công nghệ Zoom</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>Chia sẻ màn hình, bảng trắng ảo, ghi chú trực tiếp. Tương tác như lớp học thực.</p>
              </div>
              <div style={{ padding: "24px", backgroundColor: "#dff5e9", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>📝 Chữa bài ngay</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>Làm bài trực tiếp, Cô sửa từng bước, giải thích lỗi sai.</p>
              </div>
              <div style={{ padding: "24px", backgroundColor: "#f1edfb", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>📄 Báo cáo sau buổi</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>Phụ huynh nhận phiếu: những phần đã học, cần cải thiện, bài tập về nhà.</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "48px 20px", backgroundColor: "rgba(255,255,255,.5)" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Quy trình học</h2>
            <ol style={{ fontSize: "15px", lineHeight: "2.2", paddingLeft: "24px" }}>
              <li><strong>Đăng ký & tư vấn:</strong> Nhắn Zalo hoặc form đăng ký, Cô Trâm tư vấn lộ trình</li>
              <li><strong>Bài test chẩn đoán:</strong> 15 phút kiểm tra kiến thức (nếu cần)</li>
              <li><strong>Lên kế hoạch:</strong> Xác định mục tiêu, chọn lịch học hợp lý</li>
              <li><strong>Học từng buổi:</strong> Zoom 60–90 phút/buổi, chữa bài trực tiếp</li>
              <li><strong>Báo cáo định kỳ:</strong> Phụ huynh nhận phiếu nhận xét buổi học</li>
              <li><strong>Điều chỉnh lộ trình:</strong> Theo tiến độ, thay đổi chủ đề nếu cần</li>
            </ol>
          </div>
        </section>

        <section style={{ padding: "48px 20px" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Các chương trình chính</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
                <strong style={{ fontSize: "15px" }}>📚 Hóa 8–9</strong>
                <p style={{ fontSize: "13px", marginTop: "8px", color: "#666" }}>Lấy gốc, xây nền, chuẩn bị vào 10</p>
              </div>
              <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
                <strong style={{ fontSize: "15px" }}>🎯 Ôn thi vào 10</strong>
                <p style={{ fontSize: "13px", marginTop: "8px", color: "#666" }}>Ôn toàn diện, chinh phục vào 10/chuyên</p>
              </div>
              <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
                <strong style={{ fontSize: "15px" }}>🚀 Hóa 10–12</strong>
                <p style={{ fontSize: "13px", marginTop: "8px", color: "#666" }}>Chương trình THPT, chuyên đề</p>
              </div>
              <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
                <strong style={{ fontSize: "15px" }}>⭐ Luyện thi TN</strong>
                <p style={{ fontSize: "13px", marginTop: "8px", color: "#666" }}>Ôn thi tốt nghiệp THPT</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "48px 20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "32px" }}>Sẵn sàng bắt đầu?</h2>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <p style={{ fontSize: "15px", lineHeight: "1.8", marginBottom: "24px" }}>
              Hãy liên hệ ngay qua Zalo hoặc form đăng ký. Cô Trâm sẽ tư vấn miễn phí lộ trình học phù hợp với mục tiêu của em.
            </p>
            <a href={getAssetPath("/#dang-ky")} className="button button-primary">
              Đăng ký tư vấn ngay →
            </a>
          </div>
        </section>
      </div>
    </SiteChrome>
  );
}
