import type { Metadata } from "next";
import SiteChrome from "../../components/SiteChrome";
import JsonLd from "../../../components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "../../../lib/schema";
import { getAssetPath } from "../../basePath";

const TITLE = "Cách giải bài toán nồng độ dung dịch";
const DESCRIPTION = "Quy trình đọc đề, đổi số mol, lập phương trình và tính nồng độ dung dịch sau phản ứng.";
const SLUG = "/blog/bai-toan-nong-do-dung-dich/";
const IMAGE = "/so-do-dong-chat-fe-cu.webp";
const DATE_PUBLISHED = "2026-07-20";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: SLUG, images: [getAssetPath(IMAGE)] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function Article() { return <SiteChrome><JsonLd data={breadcrumbSchema([{ name: "Trang chủ", path: "/" }, { name: "Blog Hóa", path: "/blog/" }, { name: TITLE, path: SLUG }])} /><JsonLd data={articleSchema({ headline: TITLE, description: DESCRIPTION, path: SLUG, image: IMAGE, datePublished: DATE_PUBLISHED })} /><article className="article-wrap"><p className="section-kicker">BÀI TẬP HÓA · 7 PHÚT ĐỌC</p><h1>Bài toán nồng độ dung dịch: đi theo dòng chất, không nhảy bước</h1><p className="article-lead">Dạng nồng độ thường khó vì đề cho nhiều đại lượng. Cách an toàn nhất là đưa dữ kiện về số mol và theo dõi chất nào phản ứng, dư hoặc tạo thành.</p><p className="article-byline">Tác giả: Cô Lê Thùy Trâm · Đăng ngày 20/07/2026</p><img className="cover" src={getAssetPath(IMAGE)} alt="Sơ đồ dòng chất trong bài toán hóa học" /><div className="article-body"><h2>1. Tóm tắt dữ kiện theo ba nhóm</h2><ul><li>Chất ban đầu: khối lượng, thể tích, nồng độ.</li><li>Hiện tượng phản ứng: khí, kết tủa, chất dư.</li><li>Đại lượng cần tìm: C%, C<sub>M</sub>, khối lượng hay thể tích.</li></ul><h2>2. Đổi về số mol</h2><p>Dùng n = m/M khi biết khối lượng; n = C<sub>M</sub>·V khi biết nồng độ mol; với khí ở điều kiện chuẩn theo chương trình hiện hành, dùng thể tích mol phù hợp với dữ kiện đề bài.</p><h2>3. Lập và cân bằng phương trình</h2><p>Ghi số mol đã biết dưới từng chất. So sánh theo tỉ lệ hệ số để xác định chất hết và chất dư trước khi tính tiếp.</p><div className="tip"><strong>Lưu ý:</strong> Nồng độ sau phản ứng phải tính từ lượng chất còn trong dung dịch sau cùng, không lấy trực tiếp lượng ban đầu.</div><h2>4. Kiểm tra kết quả</h2><p>Đơn vị phải thống nhất, nồng độ phần trăm hợp lý và khối lượng các chất phải phù hợp với định luật bảo toàn khối lượng.</p></div></article></SiteChrome>; }
