import type { ReactNode } from "react";
import { getAssetPath } from "../basePath";
import MobileMenu from "./MobileMenu";

const MOBILE_LINKS = [
  { href: getAssetPath("/#khoa-hoc"), label: "Khóa học" },
  { href: getAssetPath("/#giang-vien"), label: "Giảng viên" },
  { href: getAssetPath("/feedback"), label: "Feedback" },
  { href: getAssetPath("/lay-goc-hoa/"), label: "Lấy gốc hóa" },
  { href: getAssetPath("/blog"), label: "Blog Hóa" },
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
          <a href={getAssetPath("/feedback")}>Feedback</a>
          <a href={getAssetPath("/lay-goc-hoa/")}>Lấy gốc hóa</a>
          <a href={getAssetPath("/blog")}>Blog Hóa</a>
          <a href={getAssetPath("/#dang-ky")} className="nav-cta">Nhận tư vấn</a>
        </nav>
        <MobileMenu links={MOBILE_LINKS} navId="mobile-nav-chrome" />
      </header>
      <div id="page-content">{children}</div>
      <footer className="site-footer">
        <div className="footer-inner">
          <a className="brand footer-brand" href={getAssetPath("/")}><img className="brand-logo" src={getAssetPath("/chamcham-logo-256.webp")} alt="Logo ChamChamEdemy" width="52" height="52" /><span>ChamCham<span>Edemy</span><small>Học Hóa bằng tư duy trực quan</small></span></a>
          <nav className="footer-nav" aria-label="Liên kết cuối trang"><a href={getAssetPath("/#khoa-hoc")}>Khóa học</a><a href={getAssetPath("/#giang-vien")}>Giảng viên</a><a href={getAssetPath("/feedback")}>Feedback</a><a href={getAssetPath("/blog")}>Blog</a><a href={getAssetPath("/#dang-ky")}>Đăng ký</a></nav>
          <p className="footer-address">9/5A Đường Số 1, Thành phố Thủ Đức, TP. Hồ Chí Minh · Học trực tiếp tại Quận 9 & học online toàn quốc</p>
          <p className="footer-developer">Phát triển bởi <strong>Thehuntech</strong> — Giải pháp số cho doanh nghiệp · <a href="tel:0354375305">0354 375 305</a></p>
          <div className="footer-social" aria-label="Kết nối với ChamChamEdemy">
            <a href="https://maps.app.goo.gl/ujtgE2iRYuLd7j8m9" target="_blank" rel="noreferrer" aria-label="Địa chỉ ChamChamEdemy trên Google Maps"><span>⌖</span>Địa chỉ</a>
            <a href="https://www.youtube.com/@chamcham97-c6f" target="_blank" rel="noreferrer" aria-label="YouTube ChamChamEdemy"><span>▶</span>YouTube</a>
            <a href="https://www.facebook.com/profile.php?id=61590518783118" target="_blank" rel="noreferrer" aria-label="Facebook ChamChamEdemy"><span>f</span>Facebook</a>
            <a href="https://www.tiktok.com/@chamchamedemy?_r=1&_t=ZS-98BKi5KPsQB" target="_blank" rel="noreferrer" aria-label="TikTok ChamChamEdemy"><span>♪</span>TikTok</a>
          </div>
        </div>
      </footer>
      <div className="mobile-cta-bar" aria-label="Liên hệ nhanh"><a href="tel:0329309293" aria-label="Gọi điện cho Cô Trâm">Gọi điện</a><a href="https://www.facebook.com/profile.php?id=61590518783118" target="_blank" rel="noreferrer" aria-label="Nhắn tin qua Facebook">Facebook</a><a href="https://zalo.me/0329309293" target="_blank" rel="noreferrer" aria-label="Nhận tư vấn qua Zalo">Zalo tư vấn</a></div>
    </main>
  );
}
