import type { Metadata } from "next";
import SiteChrome from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Blog Hóa học THCS–THPT | ChamChamEdemy",
  description: "Kiến thức Hóa học dễ hiểu: cân bằng phương trình, nồng độ dung dịch và lộ trình lấy gốc Hóa trước khi vào lớp 10.",
};

const posts = [
  { href: "/blog/cach-can-bang-phuong-trinh-hoa-hoc", image: "/infographic-hoa-co-ban.jpg", tag: "HÓA THCS", title: "Cách cân bằng phương trình hóa học: thứ tự làm ít sai", excerpt: "Quy trình 5 bước, ví dụ và lỗi học sinh thường gặp khi đặt hệ số." },
  { href: "/blog/bai-toan-nong-do-dung-dich", image: "/so-do-dong-chat-fe-cu.jpg", tag: "BÀI TẬP HÓA", title: "Bài toán nồng độ dung dịch: đọc đề và đi đúng dòng chất", excerpt: "Tách dữ kiện, đổi số mol và theo dõi chất trước – sau phản ứng bằng sơ đồ." },
  { href: "/blog/lo-trinh-lay-goc-hoa-thcs-vao-10", image: "/khoa-hoc-khtn-9.jpg", tag: "LỘ TRÌNH HỌC", title: "Lộ trình lấy gốc Hóa THCS trước khi vào lớp 10", excerpt: "Những phần kiến thức cần ưu tiên để không bị ngợp trong các tuần đầu THPT." },
];

export default function BlogPage() {
  return (
    <SiteChrome>
      <div className="content-shell">
        <section className="page-hero"><p className="section-kicker">BLOG HÓA DỄ HIỂU</p><h1>Mỗi bài viết giải quyết<br />một điểm học sinh hay vướng.</h1><p>Nội dung ngắn gọn, có quy trình và ví dụ trực quan dành cho học sinh THCS–THPT.</p></section>
        <section className="blog-grid">
          {posts.map((post) => <a className="blog-card" href={post.href} key={post.href}><img src={post.image} alt="" /><div><small>{post.tag}</small><h2>{post.title}</h2><p>{post.excerpt}</p><span>Đọc bài viết →</span></div></a>)}
        </section>
      </div>
    </SiteChrome>
  );
}
