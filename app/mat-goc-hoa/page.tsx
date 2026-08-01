import type { Metadata } from "next";
import SiteChrome from "../components/SiteChrome";
import JsonLd from "../../components/seo/JsonLd";
import { breadcrumbSchema } from "../../lib/schema";
import { getAssetPath } from "../basePath";

const TITLE = "Mất Gốc Hóa Nên Bắt Đầu Từ Đâu? Lộ Trình Cô Trâm";
const DESCRIPTION = "Bị mất gốc Hóa? Tìm hiểu nguyên nhân, phần nào cần ưu tiên lấy lại, và lộ trình lấy gốc Hóa 8–9–10–11–12 từ cơ bản.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["mất gốc hóa", "lấy gốc hóa", "học lại hóa từ đầu"],
  alternates: { canonical: "/mat-goc-hoa" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/mat-goc-hoa" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function MatGocHoaPage() {
  return (
    <SiteChrome>
      <JsonLd data={breadcrumbSchema([
        { name: "Trang chủ", path: "/" },
        { name: "Mất gốc Hóa", path: "/mat-goc-hoa" },
      ])} />

      <div className="content-shell">
        <section className="page-hero">
          <p className="section-kicker">BỊ MẤT GỐC HÓA?</p>
          <h1>Lộ trình lấy lại gốc Hóa<br />từ cơ bản cho THCS–THPT</h1>
          <p>Hiểu nguyên nhân tại sao mất gốc, phần nào cần ưu tiên, và cách học từng bước để không còn sợ Hóa.</p>
        </section>

        <section style={{ padding: "48px 20px" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Tại sao bị mất gốc Hóa?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
              <div style={{ padding: "20px", backgroundColor: "#fff5d9", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>❌ Học phải tập trung quá sớm</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>Quên công thức, cách cân bằng, mol không hiểu rõ nên không nhớ lâu.</p>
              </div>
              <div style={{ padding: "20px", backgroundColor: "#fff5d9", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>❌ Không hiểu bản chất</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>Học một công thức mà không biết vì sao, dễ nhầm lẫn khi áp dụng.</p>
              </div>
              <div style={{ padding: "20px", backgroundColor: "#fff5d9", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>❌ Kiến thức lớp trước thiếu</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>Hóa 8 không chắc nên cả Hóa 9 đều bị ảnh hưởng.</p>
              </div>
              <div style={{ padding: "20px", backgroundColor: "#fff5d9", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>❌ Quá tải thông tin</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>Học tối với 10 chủ đề đồng thời, không kịp tiếp thu từng phần.</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "48px 20px", backgroundColor: "rgba(255,255,255,.5)" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Phần nào cần ưu tiên lấy lại?</h2>
            <div style={{ backgroundColor: "#edf7fa", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "16px" }}>🎯 Hóa 8–9 là nền tảng</h3>
              <ul style={{ fontSize: "14px", lineHeight: "2", paddingLeft: "20px" }}>
                <li><strong>Hóa trị:</strong> Xác định được số hóa trị từng nguyên tố, viết công thức</li>
                <li><strong>Cân bằng PTHH:</strong> Đặt đúng hệ số, không bất đắc dĩ</li>
                <li><strong>Mol & nồng độ:</strong> Hiểu mol là gì, cách tính n = m/M</li>
                <li><strong>Phân loại chất:</strong> Phân biệt oxide, acid, base, muối</li>
              </ul>
            </div>

            <p style={{ fontSize: "15px", lineHeight: "1.8", marginBottom: "16px" }}>
              <strong>Nếu bị mất ở lớp 8–9:</strong> Phải quay lại từ hóa trị. Đây là từng một đầu, không thể bỏ qua.
            </p>
            <p style={{ fontSize: "15px", lineHeight: "1.8" }}>
              <strong>Nếu mặc sức vào lớp 10:</strong> Lớp 10 sẽ tiếp tục nâng cao Hóa 8–9 mà không ôn lại. Sẽ rất khó khăn.
            </p>
          </div>
        </section>

        <section style={{ padding: "48px 20px" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Lộ trình lấy gốc Hóa từng lớp</h2>

            <div style={{ display: "grid", gap: "20px" }}>
              <div style={{ padding: "24px", border: "2px solid #e3f5b5", borderRadius: "12px", backgroundColor: "#f9fcf0" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>📚 Lấy gốc Hóa 8</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.8", marginBottom: "12px" }}>
                  <strong>Thời gian:</strong> 4–6 tuần (2–3 buổi/tuần)
                </p>
                <ul style={{ fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginBottom: "12px" }}>
                  <li>Các chất hóa học thường gặp (O₂, H₂, Cl₂, N₂)</li>
                  <li>Công thức hóa học, số hóa trị</li>
                  <li>Phương trình hóa học cơ bản</li>
                  <li>Chia sẻ electron, liên kết hóa học</li>
                </ul>
              </div>

              <div style={{ padding: "24px", border: "2px solid #b8d6e5", borderRadius: "12px", backgroundColor: "#f0f8fc" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>📚 Lấy gốc Hóa 9</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.8", marginBottom: "12px" }}>
                  <strong>Thời gian:</strong> 6–8 tuần (3 buổi/tuần)
                </p>
                <ul style={{ fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginBottom: "12px" }}>
                  <li>Oxide, Acid, Base, Muối</li>
                  <li>Dãy hoạt động kim loại</li>
                  <li>Mol, nồng độ dung dịch</li>
                  <li>Phản ứng trung hòa, tủa chất</li>
                </ul>
              </div>

              <div style={{ padding: "24px", border: "2px solid #c7ddff", borderRadius: "12px", backgroundColor: "#f0f6ff" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>📚 Tiên phong Hóa 10</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.8", marginBottom: "12px" }}>
                  <strong>Thời gian:</strong> 2–3 tuần trước khi vào 10
                </p>
                <ul style={{ fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginBottom: "12px" }}>
                  <li>Ôn lại toàn bộ Hóa 8–9 ngắn gọn</li>
                  <li>Làm quen cách học Hóa THPT (kỹ năng viết phương trình, đọc đề)</li>
                  <li>Cơ bản về đơn chất nguyên tố phi kim (Hóa 10)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "48px 20px", backgroundColor: "rgba(255,255,255,.5)" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Bước đầu tiên: Bài test chẩn đoán</h2>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <p style={{ fontSize: "15px", lineHeight: "1.8", marginBottom: "24px" }}>
                Không biết bị mất gốc ở phần nào? Làm bài test 15 phút để Cô Trâm xác định chính xác điểm hổng, rồi tạo lộ trình học riêng cho em.
              </p>
              <a href={getAssetPath("/#dang-ky")} className="button button-primary">
                Đăng ký bài test miễn phí →
              </a>
            </div>
          </div>
        </section>

        <section style={{ padding: "48px 20px" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>FAQ: Mất gốc Hóa</h2>
            <div style={{ display: "grid", gap: "16px" }}>
              <details style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px", cursor: "pointer" }}>
                <summary style={{ fontWeight: "700", fontSize: "15px" }}>Bao lâu thì lấy lại được gốc Hóa?</summary>
                <p style={{ fontSize: "14px", marginTop: "12px", lineHeight: "1.6" }}>
                  Tùy tình trạng mất gốc. Nếu bị mất ở Hóa 8, cần 4–6 tuần. Nếu cả Hóa 8–9, cần 10–12 tuần (2–3 buổi/tuần).
                </p>
              </details>
              <details style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px", cursor: "pointer" }}>
                <summary style={{ fontWeight: "700", fontSize: "15px" }}>Có thể vừa lấy gốc vừa theo kịp bài trên lớp không?</summary>
                <p style={{ fontSize: "14px", marginTop: "12px", lineHeight: "1.6" }}>
                  Khó. Nên tập trung lấy gốc trước (có thể bỏ học trên lớp 1–2 tuần hoặc học kèm song song), rồi mới theo kịp.
                </p>
              </details>
              <details style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px", cursor: "pointer" }}>
                <summary style={{ fontWeight: "700", fontSize: "15px" }}>Học lại từ đầu có bị điểm số giảm không?</summary>
                <p style={{ fontSize: "14px", marginTop: "12px", lineHeight: "1.6" }}>
                  Có thể tạm thời, nhưng sau 4–6 tuần lấy gốc chắc chắn, điểm sẽ lên nhanh.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section style={{ padding: "48px 20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "32px" }}>Sẵn sàng bắt đầu?</h2>
          <p style={{ fontSize: "15px", lineHeight: "1.8", marginBottom: "24px", maxWidth: "600px", margin: "0 auto 24px" }}>
            Hãy đăng ký bài test chẩn đoán 15 phút. Cô Trâm sẽ tư vấn lộ trình lấy gốc phù hợp với tình trạng hiện tại.
          </p>
          <a href={getAssetPath("/#dang-ky")} className="button button-primary">
            Đăng ký bài test →
          </a>
        </section>
      </div>
    </SiteChrome>
  );
}
