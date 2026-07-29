import type { Metadata } from "next";
import SiteChrome from "../../components/SiteChrome";
import JsonLd from "../../../components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "../../../lib/schema";
import { getAssetPath } from "../../basePath";

const TITLE = "Mẹo học tốt KHTN 9 & Lấy gốc Hóa THCS cấp tốc";
const DESCRIPTION = "Bí quyết học giỏi môn KHTN 9 phân môn Hóa học, lấy gốc Hóa THCS nhanh chóng cùng Cô Trâm ChamChamEdemy.";
const SLUG = "/blog/meo-hoc-tot-khtn-9-lay-goc-hoa-thcs-quan-9";
const IMAGE = "/khoa-hoc-khtn-9.jpg";
const DATE_PUBLISHED = "2026-07-21";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["học tốt KHTN 9 Quận 9", "lấy gốc Hóa THCS Quận 9", "bí quyết học giỏi Hóa lớp 9", "ôn thi lớp 10 môn Hóa Quận 9"],
  alternates: { canonical: SLUG },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: SLUG, images: [getAssetPath(IMAGE)] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function KHTN9Article() {
  return (
    <SiteChrome>
      <JsonLd data={breadcrumbSchema([{ name: "Trang chủ", path: "/" }, { name: "Blog Hóa", path: "/blog" }, { name: TITLE, path: SLUG }])} />
      <JsonLd data={articleSchema({ headline: TITLE, description: DESCRIPTION, path: SLUG, image: IMAGE, datePublished: DATE_PUBLISHED })} />
      <article className="article-wrap">
        <p className="section-kicker">BÍ QUYẾT HỌC TẬP · HỌC SINH THCS QUẬN 9</p>
        <h1>Mẹo học tốt KHTN 9 & Lấy gốc Hóa THCS cấp tốc cho học sinh Quận 9 – TP. Thủ Đức</h1>
        <p className="article-lead">
          Chương trình Khoa học tự nhiên 9 (KHTN 9) mới đòi hỏi học sinh kết hợp tư duy giữa Vật lý, Hóa học và Sinh học. Để không bị mất gốc Hóa và chuẩn bị tốt cho kỳ thi tuyển sinh vào lớp 10 tại Quận 9, dưới đây là những mẹo học tập hiệu quả được đúc kết bởi Cô Trâm ChamChamEdemy.
        </p>
        <p className="article-byline">Tác giả: Cô Lê Thùy Trâm · Đăng ngày 21/07/2026</p>

        <img className="cover" src={getAssetPath(IMAGE)} alt="Mẹo học tốt KHTN 9 và lấy gốc Hóa THCS tại Quận 9" />

        <div className="article-body">
          <h2>1. Hệ thống hóa bảng Hóa trị và Đơn chất - Hợp chất</h2>
          <p>
            Nguyên nhân hàng đầu khiến học sinh Quận 9 sợ Hóa là không thuộc hóa trị. Hãy lập một bảng ghi nhớ nhỏ các kim loại thường gặp (K, Na, Ca, Mg, Al, Zn, Fe, Cu, Ag) và các nhóm nguyên tử (OH, NO<sub>3</sub>, SO<sub>4</sub>, CO<sub>3</sub>, PO<sub>4</sub>). Khi nắm chắc hóa trị, bạn sẽ lập công thức nhanh và chính xác.
          </p>

          <h2>2. Học thuộc thứ tự 5 bước cân bằng phương trình</h2>
          <ol>
            <li><strong>Kim loại:</strong> Cân bằng các nguyên tố kim loại trước.</li>
            <li><strong>Nhóm nguyên tử:</strong> Giữ nguyên nhóm (như SO<sub>4</sub>, NO<sub>3</sub>) ở 2 vế.</li>
            <li><strong>Phi kim khác:</strong> Cân bằng Cl, S, P, C...</li>
            <li><strong>Hydrogen & Oxygen:</strong> Để H và O cân bằng cuối cùng.</li>
          </ol>

          <h2>3. Sử dụng sơ đồ dòng chất (Mindmap Hóa học)</h2>
          <p>
            Thay vì học thuộc lòng từng chuỗi phản ứng dài, học sinh tại ChamChamEdemy Quận 9 được học bằng phương pháp sơ đồ dòng chất. Phương pháp này giúp em nhìn thấy ngay mối liên hệ biến đổi từ <em>Kim loại → Oxide bazơ → Bazơ → Muối</em>.
          </p>

          <div className="tip">
            💡 <strong>Học cùng Cô Trâm Quận 9:</strong> Lớp học Hóa ChamChamEdemy tại Quận 9, TP. Thủ Đức luôn trang bị infographic trực quan và chuỗi bài tập tự luyện giúp học sinh nhớ lâu mà không cần học vẹt.
          </div>

          <h2>4. Kết nối cùng lớp học Hóa Cô Trâm tại Quận 9</h2>
          <p>
            Nếu em đang gặp vướng mắc với môn Hóa 8, Hóa 9 hoặc KHTN 9, hãy tham gia bài test chẩn đoán kiến thức miễn phí để nhận ngay tư vấn lộ trình học phù hợp từ Cô Trâm.
          </p>
        </div>
      </article>
    </SiteChrome>
  );
}
