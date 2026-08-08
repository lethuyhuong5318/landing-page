import type { Metadata } from "next";
import SiteChrome from "../../components/SiteChrome";
import JsonLd from "../../../components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "../../../lib/schema";
import { getAssetPath } from "../../basePath";

const TITLE = "Lộ trình lấy gốc Hóa THCS trước khi vào lớp 10";
const DESCRIPTION = "Các kiến thức Hóa trị, công thức hóa học, phương trình, mol và nồng độ cần ôn trước lớp 10.";
const SLUG = "/blog/lo-trinh-lay-goc-hoa-thcs-vao-10/";
const IMAGE = "/khoa-hoc-khtn-9.webp";
const DATE_PUBLISHED = "2026-07-20";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: SLUG, images: [getAssetPath(IMAGE)] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function Article() { return <SiteChrome><JsonLd data={breadcrumbSchema([{ name: "Trang chủ", path: "/" }, { name: "Blog Hóa", path: "/blog/" }, { name: TITLE, path: SLUG }])} /><JsonLd data={articleSchema({ headline: TITLE, description: DESCRIPTION, path: SLUG, image: IMAGE, datePublished: DATE_PUBLISHED })} /><article className="article-wrap"><p className="section-kicker">LỘ TRÌNH HỌC · 5 PHÚT ĐỌC</p><h1>Lấy gốc Hóa THCS trước khi vào lớp 10: nên bắt đầu từ đâu?</h1><p className="article-lead">Không cần học lại toàn bộ sách. Học sinh nên ưu tiên những kiến thức được dùng lặp lại trong Hóa THPT và luyện theo đúng thứ tự.</p><p className="article-byline">Tác giả: Cô Lê Thùy Trâm · Đăng ngày 20/07/2026</p><img className="cover" src={getAssetPath(IMAGE)} alt="Tài liệu khóa học KHTN 9 ChamChamEdemy" /><div className="article-body"><h2>Giai đoạn 1: Ngôn ngữ Hóa học</h2><p>Ôn kí hiệu nguyên tố, hóa trị, cách đọc công thức và lập công thức hóa học. Đây là nền để viết đúng chất trong phương trình.</p><h2>Giai đoạn 2: Phương trình phản ứng</h2><p>Học cách nhận biết chất tham gia, sản phẩm và cân bằng hệ số. Luyện từ phương trình một bước trước khi làm chuỗi phản ứng.</p><h2>Giai đoạn 3: Mol và chuyển đổi đại lượng</h2><p>Thành thạo ba hướng đổi: khối lượng ↔ mol, thể tích khí ↔ mol và số hạt ↔ mol.</p><h2>Giai đoạn 4: Nồng độ và bài toán theo phương trình</h2><p>Học C%, C<sub>M</sub>, xác định chất dư – hết và trình bày bài giải theo từng dòng rõ ràng.</p><div className="tip"><strong>Cách học hiệu quả:</strong> Sau mỗi phần lý thuyết, làm 3–5 câu cùng dạng và ghi lại đúng một lỗi sai cần tránh. Khi lỗi cũ không lặp lại, mới chuyển sang dạng tiếp theo.</div></div></article></SiteChrome>; }
