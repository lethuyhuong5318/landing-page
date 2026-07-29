import type { Metadata } from "next";
import SiteChrome from "../components/SiteChrome";
import JsonLd from "../../components/seo/JsonLd";
import { breadcrumbSchema } from "../../lib/schema";
import { getAssetPath } from "../basePath";

const TITLE = "Blog Hóa học THCS–THPT | ChamChamEdemy";
const DESCRIPTION = "Kiến thức Hóa học dễ hiểu: cân bằng phương trình, nồng độ dung dịch và lộ trình lấy gốc Hóa trước khi vào lớp 10.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/blog" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const posts = [
  { href: "/blog/mat-goc-hoa-nen-bat-dau-tu-dau", image: "/lay-goc-hoa-bang-mindmap.jpg", tag: "LỘ TRÌNH MẤT GỐC", title: "Mất gốc Hóa nên bắt đầu từ đâu?", excerpt: "Lộ trình chẩn đoán và học lại từng bước, không học lan man từ đầu sách." },
  { href: "/blog/bai-kiem-tra-chan-doan-mat-goc-hoa", image: "/phieu-nhan-xet-buoi-hoc.jpg", tag: "BÀI KIỂM TRA", title: "Bài kiểm tra chẩn đoán mất gốc Hóa", excerpt: "12 câu kiểm tra 6 nhóm kiến thức, kèm cách đọc kết quả và chọn bài học tiếp theo." },
  { href: "/blog/checklist-kien-thuc-hoa-thcs", image: "/infographic-hoa-co-ban.jpg", tag: "KIẾN THỨC NỀN", title: "Checklist kiến thức Hóa THCS trước lớp 10", excerpt: "Bản đồ rà soát công thức, hóa trị, phương trình, mol, dung dịch và hợp chất vô cơ." },
  { href: "/blog/hoc-hoa-tai-quan-9", image: "/hoc-hoa-tai-quan-9-thumbnail.webp", tag: "QUẬN 9 · TP.HCM", title: "Học Hóa tại Quận 9: chọn lộ trình theo điểm xuất phát", excerpt: "Tiêu chí chọn lớp, hình thức học và quy trình bù nền cho học sinh đang hổng kiến thức." },
  { href: "/blog/gia-su-luyen-thi-hoa-quan-9-tp-thu-duc", image: "/co-le-thuy-tram-professional.png", tag: "QUẬN 9 · TP. THỦ ĐỨC", title: "Luyện thi & Gia sư Hóa học Quận 9: Lộ trình lấy gốc & nâng cao cùng Cô Trâm", excerpt: "Học Hóa THCS–THPT, gia sư Hóa Quận 9, lấy gốc Hóa 8–9, ôn thi vào 10 và luyện thi lớp 11–12 tại Quận 9 cùng Cô Trâm." },
  { href: "/blog/meo-hoc-tot-khtn-9-lay-goc-hoa-thcs-quan-9", image: "/khoa-hoc-khtn-9.jpg", tag: "BÍ QUYẾT HỌC TẬP", title: "Mẹo học tốt KHTN 9 & Lấy gốc Hóa THCS cấp tốc cho học sinh Quận 9", excerpt: "Bí quyết học giỏi KHTN 9 phân môn Hóa, hệ thống hóa Hóa trị, cân bằng PTHH và lập sơ đồ dòng chất." },
  { href: "/blog/cach-can-bang-phuong-trinh-hoa-hoc", image: "/infographic-hoa-co-ban.jpg", tag: "HÓA THCS", title: "Cách cân bằng phương trình hóa học: thứ tự làm ít sai", excerpt: "Quy trình 5 bước, ví dụ và lỗi học sinh thường gặp khi đặt hệ số." },
  { href: "/blog/bai-toan-nong-do-dung-dich", image: "/so-do-dong-chat-fe-cu.jpg", tag: "BÀI TẬP HÓA", title: "Bài toán nồng độ dung dịch: đọc đề và đi đúng dòng chất", excerpt: "Tách dữ kiện, đổi số mol và theo dõi chất trước – sau phản ứng bằng sơ đồ." },
  { href: "/blog/lo-trinh-lay-goc-hoa-thcs-vao-10", image: "/lay-goc-hoa-bang-mindmap.jpg", tag: "LỘ TRÌNH HỌC", title: "Lộ trình lấy gốc Hóa THCS trước khi vào lớp 10", excerpt: "Những phần kiến thức cần ưu tiên để không bị ngợp trong các tuần đầu THPT." },
];

export default function BlogPage() {
  return (
    <SiteChrome>
      <JsonLd data={breadcrumbSchema([{ name: "Trang chủ", path: "/" }, { name: "Blog Hóa", path: "/blog" }])} />
      <div className="content-shell">
        <section className="page-hero"><p className="section-kicker">BLOG HÓA DỄ HIỂU</p><h1>Mỗi bài viết giải quyết<br />một điểm học sinh hay vướng.</h1><p>Nội dung ngắn gọn, có quy trình và ví dụ trực quan dành cho học sinh THCS–THPT.</p></section>
        <section className="blog-grid">
          {posts.map((post) => <a className="blog-card" href={getAssetPath(post.href)} key={post.href}><img src={getAssetPath(post.image)} alt={post.title} /><div><small>{post.tag}</small><h2>{post.title}</h2><p>{post.excerpt}</p><span>Đọc bài viết →</span></div></a>)}
        </section>
      </div>
    </SiteChrome>
  );
}
