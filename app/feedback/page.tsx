import type { Metadata } from "next";
import SiteChrome from "../components/SiteChrome";
import { getAssetPath } from "../basePath";

export const metadata: Metadata = {
  title: "Feedback học viên | ChamChamEdemy",
  description: "Kết quả khảo sát thật sau buổi học lấy gốc Hóa THCS cùng cô Trâm tại ChamChamEdemy.",
};

export default function FeedbackPage() {
  return (
    <SiteChrome>
      <div className="content-shell">
        <section className="page-hero">
          <p className="section-kicker">FEEDBACK HỌC VIÊN</p>
          <h1>Không dùng lời khen chung chung.<br />Dùng dữ liệu sau buổi học.</h1>
          <p>Kết quả dưới đây đến từ khảo sát sau buổi live lấy gốc Hóa THCS. ChamChamEdemy công khai cả điểm tốt lẫn góp ý để tiếp tục điều chỉnh cách dạy.</p>
          <div className="page-actions"><a href={getAssetPath("/#dang-ky")}>Đăng ký học thử</a><a className="secondary" href={getAssetPath("/blog")}>Đọc Blog Hóa</a></div>
        </section>
        <div className="feedback-layout">
          <figure className="feedback-image"><img src={getAssetPath("/feedback-buoi-live.jpg")} alt="Infographic kết quả khảo sát buổi live lấy gốc Hóa THCS ChamChamEdemy" /></figure>
          <aside className="feedback-stats">
            <article><strong>28</strong><h2>Học sinh tham gia khảo sát</h2><p>100% người điền khảo sát đã tham gia buổi học.</p></article>
            <article><strong>4,07/5</strong><h2>Điểm hiểu bài trung bình</h2><p>Phần lớn học sinh tự đánh giá ở mức hiểu khá hoặc rất hiểu.</p></article>
            <article><strong>100%</strong><h2>Chọn “cách giảng dễ hiểu”</h2><p>Đây là điểm được học sinh yêu thích nhiều nhất trong buổi học.</p></article>
            <article><strong>75%</strong><h2>Đánh giá cao ví dụ minh họa</h2><p>Minh họa trực quan giúp công thức bớt rời rạc và dễ áp dụng hơn.</p></article>
          </aside>
        </div>
      </div>
    </SiteChrome>
  );
}
