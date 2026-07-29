import type { Metadata } from "next";
import SiteChrome from "../../components/SiteChrome";
import JsonLd from "../../../components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "../../../lib/schema";
import { getAssetPath } from "../../basePath";

const TITLE = "Cách cân bằng phương trình hóa học dễ hiểu";
const DESCRIPTION = "Hướng dẫn cân bằng phương trình hóa học theo thứ tự kim loại, nhóm nguyên tử, phi kim, H và O.";
const SLUG = "/blog/cach-can-bang-phuong-trinh-hoa-hoc";
const IMAGE = "/infographic-hoa-co-ban.jpg";
const DATE_PUBLISHED = "2026-07-20";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: SLUG, images: [getAssetPath(IMAGE)] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function Article() { return <SiteChrome><JsonLd data={breadcrumbSchema([{ name: "Trang chủ", path: "/" }, { name: "Blog Hóa", path: "/blog" }, { name: TITLE, path: SLUG }])} /><JsonLd data={articleSchema({ headline: TITLE, description: DESCRIPTION, path: SLUG, image: IMAGE, datePublished: DATE_PUBLISHED })} /><article className="article-wrap"><p className="section-kicker">HÓA THCS · 6 PHÚT ĐỌC</p><h1>Cách cân bằng phương trình hóa học: làm theo thứ tự để ít sai</h1><p className="article-lead">Cân bằng phương trình không phải đoán hệ số. Mục tiêu là làm cho số nguyên tử của mỗi nguyên tố ở hai vế bằng nhau mà không thay đổi chỉ số trong công thức.</p><p className="article-byline">Tác giả: Cô Lê Thùy Trâm · Đăng ngày 20/07/2026</p><img className="cover" src={getAssetPath(IMAGE)} alt="Quy tắc cân bằng phương trình hóa học" /><div className="article-body"><h2>1. Ba nguyên tắc bắt buộc</h2><ul><li>Chỉ được thêm hệ số trước công thức hóa học.</li><li>Không sửa chỉ số nhỏ trong công thức.</li><li>Cuối cùng phải rút gọn hệ số về tỉ lệ nguyên nhỏ nhất.</li></ul><h2>2. Thứ tự cân bằng dễ áp dụng</h2><ol><li>Cân bằng kim loại.</li><li>Cân bằng nhóm nguyên tử giữ nguyên ở hai vế như SO₄, CO₃, NO₃.</li><li>Cân bằng các phi kim khác.</li><li>Để H và O về cuối.</li></ol><div className="tip"><strong>Mẹo:</strong> Nếu số nguyên tử O ở một vế lẻ còn vế kia chẵn, có thể nhân đôi chất chứa số O lẻ trước rồi cân bằng lại.</div><h2>3. Ví dụ</h2><p>Với Fe + O₂ → Fe₂O₃, chọn 2Fe₂O₃ để có 6 nguyên tử O. Khi đó đặt 3O₂ và cuối cùng đặt 4Fe. Kết quả: 4Fe + 3O₂ → 2Fe₂O₃.</p><h2>4. Cách tự kiểm tra</h2><p>Lập một bảng nhỏ, đếm từng nguyên tố ở vế trái và vế phải. Nếu tất cả bằng nhau và hệ số đã tối giản, phương trình đã cân bằng đúng.</p></div></article></SiteChrome>; }
