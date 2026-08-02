import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const sourcePath = path.join(root, "content", "lay-goc-hoa-source.html");
const legacyPath = path.join(publicDir, "lay-goc-hoa.html");
const source = fs.readFileSync(sourcePath, "utf8");

const lessons = [
  { id: "p-basics", slug: "nen-tang-hoa-hoc-6-7", title: "Nền tảng Hóa học lớp 6–7", description: "Phân biệt chất, vật thể, hỗn hợp, dung dịch, nguyên tử, nguyên tố và phân tử.", time: "25 phút" },
  { id: "p-formula", slug: "cong-thuc-hoa-hoc", title: "Công thức và tính toán Hóa học", description: "Ôn số mol, tỉ khối, nồng độ dung dịch và độ tan qua công cụ tính tương tác.", time: "30 phút" },
  { id: "p-valence", slug: "hoa-tri", title: "Hóa trị và lập công thức hóa học", description: "Nắm quy tắc hóa trị, luyện flashcard và ghi nhớ bằng game Đào Hóa Trị.", time: "35 phút" },
  { id: "p-table", slug: "bang-tuan-hoan", title: "Bảng tuần hoàn hóa học", description: "Khám phá nguyên tố, cấu tạo nguyên tử, mô hình 2D–3D và ứng dụng trong đời sống.", time: "30 phút" },
  { id: "p-reaction", slug: "phan-ung-va-phuong-trinh-hoa-hoc", title: "Phản ứng và phương trình hóa học", description: "Hiểu biến đổi hóa học, bảo toàn khối lượng và luyện cân bằng phương trình.", time: "35 phút" },
  { id: "p-rules", slug: "tan-ph-quy-tim", title: "Độ tan, pH và quỳ tím", description: "Nhận biết chất tan, kết tủa, môi trường axit–bazơ và màu quỳ tím.", time: "25 phút" },
  { id: "p-series", slug: "day-hoat-dong-khi-ket-tua", title: "Dãy hoạt động, chất khí và kết tủa", description: "Vận dụng dãy hoạt động kim loại, nhận biết khí và màu kết tủa thường gặp.", time: "30 phút" },
  { id: "p-organic", slug: "hoa-hoc-huu-co-co-ban", title: "Hóa học hữu cơ cơ bản", description: "Làm quen hydrocarbon, alcohol, acid acetic và các nhóm chất hữu cơ quan trọng.", time: "30 phút" },
  { id: "p-iupac", slug: "danh-phap-iupac", title: "Danh pháp IUPAC", description: "Học quy tắc gọi tên oxide, acid, base, muối và hydrocarbon theo hệ thống.", time: "30 phút" },
  { id: "p-mass", slug: "phan-tu-khoi", title: "Phân tử khối và bài tập", description: "Tính phân tử khối tương đối theo từng bước và luyện tập với ví dụ có lời giải.", time: "20 phút" },
  { id: "p-quiz", slug: "bai-tap-lay-goc-hoa", title: "Bài tập tổng hợp Lấy gốc Hóa", description: "Kiểm tra kiến thức toàn lộ trình bằng mini quiz tổng hợp có chấm điểm.", time: "20 phút" },
];

const inlineStyles = [...source.matchAll(/<style>([\s\S]*?)<\/style>/gi)].map(match => match[1]).join("\n");
const inlineScripts = [...source.matchAll(/<script>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
fs.mkdirSync(path.join(publicDir, "assets", "css"), { recursive: true });
fs.mkdirSync(path.join(publicDir, "assets", "js"), { recursive: true });
fs.writeFileSync(path.join(publicDir, "assets", "css", "lay-goc-hoa.css"), inlineStyles);
fs.writeFileSync(path.join(publicDir, "assets", "js", "lay-goc-hoa-core.js"), inlineScripts[0] ?? "");
fs.writeFileSync(path.join(publicDir, "assets", "js", "lay-goc-hoa-init.js"), inlineScripts.slice(1).join("\n"));

const absoluteAssets = html => html
  .replaceAll('href="./', 'href="/')
  .replaceAll('src="./', 'src="/')
  .replaceAll('href="../', 'href="/')
  .replaceAll('src="../', 'src="/');

let shared = source
  .replace(/<style>[\s\S]*?<\/style>/i, '<link rel="stylesheet" href="/assets/css/lay-goc-hoa.css">')
  .replace(/<script>[\s\S]*?<\/script>/i, '<script src="/assets/js/lay-goc-hoa-core.js"></script>')
  .replace(/<script>[\s\S]*?<\/script>\s*<\/body>/i, '<script src="/assets/js/lay-goc-hoa-init.js"></script></body>');
shared = absoluteAssets(shared);

function lessonNav(index) {
  const lesson = lessons[index];
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const related = lessons.filter((_, i) => i !== index).slice(Math.max(0, index - 1), Math.max(0, index - 1) + 3);
  return `<nav class="cluster-breadcrumb" aria-label="Breadcrumb"><a href="/">Trang chủ</a><span>›</span><a href="/lay-goc-hoa/">Lấy gốc Hóa</a><span>›</span><span aria-current="page">${lesson.title}</span></nav>
  <header class="cluster-lesson-header">
    <a class="cluster-home-link" href="/lay-goc-hoa/">← Về lộ trình Lấy gốc Hóa</a>
    <span class="cluster-kicker">Bài ${String(index + 1).padStart(2, "0")} · ${lesson.time}</span>
    <h1>${lesson.title}</h1><p>${lesson.description}</p>
  </header>
  <nav class="cluster-lesson-nav" aria-label="Điều hướng bài học">
    ${prev ? `<a href="/lay-goc-hoa/${prev.slug}/">← ${prev.title}</a>` : `<a href="/">← Trang chủ</a>`}
    <a href="/lay-goc-hoa/">Xem 11 bài học</a>
    ${next ? `<a href="/lay-goc-hoa/${next.slug}/">${next.title} →</a>` : `<a href="/lay-goc-hoa/">Hoàn thành lộ trình →</a>`}
  </nav>
  <aside class="cluster-related"><h2>Nội dung liên quan</h2><div>${related.map(item => `<a href="/lay-goc-hoa/${item.slug}/">${item.title}<span>Đọc bài →</span></a>`).join("")}</div></aside>`;
}

function addSeo(html, lesson, index) {
  const canonical = `https://chamchamedemy.id.vn/lay-goc-hoa/${lesson.slug}/`;
  const seo = `<meta name="description" content="${lesson.description}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article"><meta property="og:title" content="${lesson.title} | ChamChamEdemy"><meta property="og:description" content="${lesson.description}"><meta property="og:url" content="${canonical}">
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "LearningResource", name: lesson.title,
    description: lesson.description, url: canonical, inLanguage: "vi",
    educationalLevel: "THCS", isPartOf: { "@type": "Course", name: "Lấy gốc Hóa", url: "https://chamchamedemy.id.vn/lay-goc-hoa/" },
    position: index + 1, provider: { "@type": "EducationalOrganization", name: "ChamChamEdemy", url: "https://chamchamedemy.id.vn/" }
  }).replaceAll("</", "<\\/")}</script>`;
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${lesson.title} | Lấy gốc Hóa ChamChamEdemy</title>${seo}`)
    .replace(/<body>/i, `<body data-cluster-lesson="${lesson.id}">`)
    .replace('<div class="wrap">', `<div class="wrap">${lessonNav(index)}`)
    .replace(/<h1>[\s\S]*?<\/h1>/i, `<p class="cluster-original-title">Lấy gốc Hóa học THCS</p>`)
    .replace('</body>', `<script>document.addEventListener("DOMContentLoaded",()=>{selectTab("${lesson.id}");document.querySelectorAll(".panel").forEach(p=>{if(p.id!=="${lesson.id}")p.setAttribute("hidden","")});});</script></body>`);
}

const clusterCss = `
.cluster-breadcrumb,.cluster-lesson-header,.cluster-lesson-nav,.cluster-related{font-family:"Be Vietnam Pro",sans-serif}
.cluster-breadcrumb{display:flex;align-items:center;gap:8px;margin:0 0 12px;padding:10px 14px;border:1px solid #d8e8f1;border-radius:14px;background:#fff;font-size:12px;overflow-x:auto;white-space:nowrap}.cluster-breadcrumb a{color:#1765a8;font-weight:700;text-decoration:none}
.cluster-lesson-header{margin-bottom:14px;padding:20px 22px;border-radius:22px;background:linear-gradient(135deg,#0d3c66,#176cae);color:#fff}.cluster-home-link{display:inline-flex;min-height:44px;align-items:center;color:#fff;text-decoration:none;font-weight:700}.cluster-kicker{display:block;margin-top:6px;color:#ffd46d;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.cluster-lesson-header h1{margin:8px 0 6px;font-size:clamp(24px,4vw,38px);line-height:1.18}.cluster-lesson-header p{max-width:760px;margin:0;color:#e8f5ff;line-height:1.65}.cluster-original-title{font-size:clamp(25px,4vw,40px);font-weight:800;line-height:1.1;margin:0}
.cluster-lesson-nav{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;margin:14px 0}.cluster-lesson-nav a{min-height:48px;padding:10px 13px;display:flex;align-items:center;justify-content:center;border:1px solid #cfe1ed;border-radius:14px;background:#fff;color:#123f67;font-size:11px;font-weight:800;text-align:center;text-decoration:none}.cluster-lesson-nav a:last-child{background:#eaf6ff}
.cluster-related{margin:18px 0;padding:18px;border-radius:20px;background:#eff7fc}.cluster-related h2{margin:0 0 12px;color:#103d68;font-size:18px}.cluster-related>div{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.cluster-related a{padding:14px;border-radius:14px;background:#fff;color:#173f60;font-size:12px;font-weight:800;text-decoration:none}.cluster-related a span{display:block;margin-top:8px;color:#267fc1;font-size:10px}
body[data-cluster-lesson] .tabs-wrap{display:none}body[data-cluster-lesson] .hero{margin-top:0}
@media(max-width:680px){.cluster-lesson-nav{grid-template-columns:1fr 1fr}.cluster-lesson-nav a:nth-child(2){grid-column:1/-1;grid-row:2}.cluster-related>div{grid-template-columns:1fr}.cluster-lesson-header{padding:17px}.cluster-breadcrumb{margin-top:8px}}
`;
fs.appendFileSync(path.join(publicDir, "assets", "css", "lay-goc-hoa.css"), clusterCss);

for (const [index, lesson] of lessons.entries()) {
  const dir = path.join(publicDir, "lay-goc-hoa", lesson.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), addSeo(shared, lesson, index));
}

const hubCards = lessons.map((lesson, index) => `<a href="/lay-goc-hoa/${lesson.slug}/" class="hub-lesson-card" data-lesson="${lesson.id}">
  <span class="hub-lesson-number">Bài ${String(index + 1).padStart(2, "0")}</span><span class="hub-status">Chưa học</span>
  <h2>${lesson.title}</h2><p>${lesson.description}</p>
  <span class="hub-card-meta">${lesson.time}<b>Bắt đầu học →</b></span>
</a>`).join("");

const itemList = lessons.map((lesson, index) => ({ "@type": "ListItem", position: index + 1, name: lesson.title, url: `https://chamchamedemy.id.vn/lay-goc-hoa/${lesson.slug}/` }));
const hub = `<!doctype html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lấy gốc Hóa từ cơ bản cho học sinh mất gốc | ChamChamEdemy</title><meta name="description" content="Lộ trình 11 bài Lấy gốc Hóa THCS từ nền tảng, hóa trị, bảng tuần hoàn đến phương trình và bài tập tổng hợp."><link rel="canonical" href="https://chamchamedemy.id.vn/lay-goc-hoa/"><link rel="icon" href="/favicon.ico"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/css/chemistry-hub.css"><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Course", name: "Lấy gốc Hóa từ cơ bản", description: "Lộ trình 11 bài học Hóa học THCS dành cho học sinh mất gốc.", provider: { "@type": "EducationalOrganization", name: "ChamChamEdemy", url: "https://chamchamedemy.id.vn/" }, hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", inLanguage: "vi" } }).replaceAll("</", "<\\/")}</script><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", itemListElement: itemList }).replaceAll("</", "<\\/")}</script></head><body><header class="hub-site-header"><a href="/" class="hub-brand"><img src="/chamcham-logo.png" alt="ChamChamEdemy"><span>ChamChamEdemy<small>Học Hóa bằng tư duy trực quan</small></span></a><a href="/" class="hub-home-button">← Về trang chủ</a></header><main><nav class="hub-breadcrumb" aria-label="Breadcrumb"><a href="/">Trang chủ</a><span>›</span><span aria-current="page">Lấy gốc Hóa</span></nav><section class="hub-hero"><div><span class="hub-eyebrow">LỘ TRÌNH HÓA HỌC THCS</span><h1>Lấy gốc Hóa từ cơ bản dành cho học sinh mất gốc</h1><p>Đi từng bước từ khái niệm nền tảng đến bài tập tổng hợp. Mỗi bài có minh họa, công cụ tính, trò chơi hoặc mô phỏng để học sinh hiểu bản chất thay vì học thuộc máy móc.</p><a href="/lay-goc-hoa/${lessons[0].slug}/" class="hub-primary">Bắt đầu từ bài 01 →</a></div><aside><strong id="hubProgressText">0/11 bài đã học</strong><div class="hub-progress"><i id="hubProgressBar"></i></div><small>Tiến độ được lưu trên thiết bị này.</small></aside></section><section class="hub-lessons" aria-labelledby="lessonHeading"><div class="hub-section-heading"><span>NỘI DUNG LỘ TRÌNH</span><h2 id="lessonHeading">11 bài học Lấy gốc Hóa</h2></div><div class="hub-grid">${hubCards}</div></section></main><footer><strong>ChamChamEdemy</strong><a href="/">Trang chủ</a><a href="/blog/">Blog Hóa</a></footer><script src="/assets/js/chemistry-cluster-progress.js"></script></body></html>`;
fs.mkdirSync(path.join(publicDir, "lay-goc-hoa"), { recursive: true });
fs.writeFileSync(path.join(publicDir, "lay-goc-hoa", "index.html"), hub);

const redirect = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lấy gốc Hóa | ChamChamEdemy</title><link rel="canonical" href="https://chamchamedemy.id.vn/lay-goc-hoa/"><meta http-equiv="refresh" content="0;url=/lay-goc-hoa/"></head><body><p>Trang Lấy gốc Hóa đã chuyển sang <a href="/lay-goc-hoa/">lộ trình mới</a>.</p></body></html>`;
fs.writeFileSync(legacyPath, redirect);

const sitemapPath = path.join(publicDir, "sitemap.xml");
let sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
const urls = ["https://chamchamedemy.id.vn/lay-goc-hoa/", ...lessons.map(item => `https://chamchamedemy.id.vn/lay-goc-hoa/${item.slug}/`)];
const additions = urls.filter(url => !sitemap.includes(`<loc>${url}</loc>`)).map(url => `<url><loc>${url}</loc><changefreq>monthly</changefreq><priority>${url.endsWith("/lay-goc-hoa/") ? "0.9" : "0.8"}</priority></url>`).join("");
sitemap = sitemap.replace("</urlset>", `${additions}</urlset>`);
fs.writeFileSync(sitemapPath, sitemap);

console.log(`Built topic cluster: 1 hub + ${lessons.length} lessons.`);
