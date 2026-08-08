import type { ReactNode } from "react";
import { getAssetPath } from "../basePath";
import MobileMenu from "./MobileMenu";
import Footer from "./Footer";

const MOBILE_LINKS = [
  { href: getAssetPath("/#khoa-hoc"), label: "Khóa học" },
  { href: getAssetPath("/#giang-vien"), label: "Giảng viên" },
  { href: getAssetPath("/feedback/"), label: "Feedback" },
  { href: getAssetPath("/lay-goc-hoa/"), label: "Lấy gốc hóa" },
  { href: getAssetPath("/blog/"), label: "Blog Hóa" },
  { href: getAssetPath("/#dang-ky"), label: "Nhận tư vấn" },
];

export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <main className="content-page">
      <a className="skip-link" href="#page-content">Bỏ qua điều hướng</a>
      <header className="site-header">
        <a className="brand" href={getAssetPath("/")} aria-label="ChamChamEdemy — trang chủ">
          <img className="brand-logo" src={getAssetPath("/chamcham-logo-256.webp")} alt="Logo ChamChamEdemy" width="58" height="58" />
          <span>ChamCham<span>Edemy</span><small>Học Hóa bằng tư duy trực quan</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          <a href={getAssetPath("/#khoa-hoc")}>Khóa học</a>
          <a href={getAssetPath("/#giang-vien")}>Giảng viên</a>
          <a href={getAssetPath("/feedback/")}>Feedback</a>
          <a href={getAssetPath("/lay-goc-hoa/")}>Lấy gốc hóa</a>
          <a href={getAssetPath("/blog/")}>Blog Hóa</a>
          <a href={getAssetPath("/#dang-ky")} className="nav-cta">Nhận tư vấn</a>
        </nav>
        <MobileMenu links={MOBILE_LINKS} navId="mobile-nav-chrome" />
      </header>
      <div id="page-content">{children}</div>
      <Footer />
      <div className="mobile-cta-bar" aria-label="Liên hệ nhanh"><a href="tel:0329309293" aria-label="Gọi điện cho Cô Trâm">Gọi điện</a><a href="https://www.facebook.com/profile.php?id=61590518783118" target="_blank" rel="noreferrer" aria-label="Nhắn tin qua Facebook">Facebook</a><a href="https://zalo.me/0329309293" target="_blank" rel="noreferrer" aria-label="Nhận tư vấn qua Zalo">Zalo tư vấn</a></div>
    </main>
  );
}
