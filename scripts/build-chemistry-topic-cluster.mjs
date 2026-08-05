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
  .replaceAll('src="../', 'src="/')
  .replaceAll('href="/lay-goc-hoa.html"', 'href="/lay-goc-hoa/');

let shared = source
  .replace(/<style>[\s\S]*?<\/style>/i, '<link rel="stylesheet" href="/assets/css/lay-goc-hoa.css">')
  .replace(/<script>[\s\S]*?<\/script>/i, '<script src="/assets/js/lay-goc-hoa-core.js"></script>')
  .replace(/<script>[\s\S]*?<\/script>\s*<\/body>/i, '<script src="/assets/js/lay-goc-hoa-init.js"></script></body>');
shared = absoluteAssets(shared);

function lessonNav(index) {
  const lesson = lessons[index];
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const options = lessons.map((item, i) => `<option value="/lay-goc-hoa/${item.slug}/" ${i === index ? "selected" : ""}>B&#224;i ${String(i + 1).padStart(2, "0")} - ${item.title}</option>`).join("");
  return `<nav class="cluster-breadcrumb" aria-label="Breadcrumb"><a href="/">Trang chủ</a><span>›</span><a href="/lay-goc-hoa/">Lấy gốc Hóa</a><span>›</span><span aria-current="page">${lesson.title}</span></nav>
  <header class="cluster-lesson-header">
    <a class="cluster-home-link" href="/lay-goc-hoa/">← Về lộ trình Lấy gốc Hóa</a>
    <span class="cluster-kicker">Bài ${String(index + 1).padStart(2, "0")} · ${lesson.time}</span>
    <h1>${lesson.title}</h1><p>${lesson.description}</p><div class="cluster-lesson-side" aria-label="Diem hoc tap"><div class="xp-ring cluster-xp-compact" id="xpBadge"><svg class="xp-ring-svg" viewBox="0 0 64 64" aria-hidden="true"><circle class="xp-ring-track" cx="32" cy="32" r="27"></circle><circle class="xp-ring-fill" id="xpRingFill" cx="32" cy="32" r="27" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></circle></svg><span class="xp-ring-num" id="xpNum">0</span><span class="xp-ring-lbl">&#272;i&#7875;m</span><span class="lvl-lbl" id="lvlLbl">C&#7845;p 1</span></div><div class="mascot-badge"><img src="/co-tram-mascot.webp" alt="Mascot ChamChamEdemy"></div></div>
  </header>
  <nav class="cluster-lesson-nav" aria-label="Dieu huong bai hoc">
    ${prev ? `<a class="cluster-prev" href="/lay-goc-hoa/${prev.slug}/"><span class="cluster-nav-arrow">&larr;</span><span>${prev.title}</span></a>` : `<a class="cluster-prev" href="/"><span class="cluster-nav-arrow">&larr;</span><span>Trang ch&#7911;</span></a>`}
    ${next ? `<a class="cluster-next" href="/lay-goc-hoa/${next.slug}/"><span>${next.title}</span><span class="cluster-nav-arrow">&rarr;</span></a>` : `<a class="cluster-next" href="/lay-goc-hoa/"><span>Ho&#224;n th&#224;nh l&#7897; tr&#236;nh</span><span class="cluster-nav-arrow">&rarr;</span></a>`}
    <label class="cluster-lesson-picker"><span>Ch&#7885;n m&#7909;c ki&#7871;n th&#7913;c</span><select aria-label="Ch&#7885;n m&#7909;c ki&#7871;n th&#7913;c" onchange="if(this.value)location.href=this.value">${options}</select></label>
  </nav>
  `;
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
    .replace(/\s*<div class="hero">[\s\S]*?<div class="util-bar">/i, `<div class="util-bar">`)
    .replace('</body>', `<script src="/assets/js/chemistry-lesson-progress.js"></script><script>document.addEventListener("DOMContentLoaded",()=>{selectTab("${lesson.id}");document.querySelectorAll(".panel").forEach(p=>{if(p.id!=="${lesson.id}")p.setAttribute("hidden","")});});</script></body>`);
}

const clusterCss = `
.cluster-breadcrumb,.cluster-lesson-header,.cluster-lesson-nav{font-family:"Be Vietnam Pro",sans-serif}
.cluster-breadcrumb{display:flex;align-items:center;gap:8px;margin:0 0 12px;padding:10px 14px;border:1px solid #d8e8f1;border-radius:14px;background:#fff;font-size:12px;overflow-x:auto;white-space:nowrap}.cluster-breadcrumb a{color:#1765a8;font-weight:700;text-decoration:none}
.cluster-lesson-header{width:min(100%,880px);margin:0 auto 14px;padding:14px 16px;display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:16px;overflow:hidden;position:relative;border:1px solid #4aa6e5;border-radius:18px;background:linear-gradient(120deg,#0a4778 0%,#1477b9 62%,#2397dd 100%);color:#fff;box-shadow:0 10px 24px rgba(8,47,85,.16)}.cluster-lesson-header:after{content:"";position:absolute;right:-48px;top:-70px;width:170px;height:170px;border-radius:50%;background:rgba(255,209,102,.16)}.cluster-lesson-header>*:not(.cluster-lesson-side){grid-column:1;position:relative;z-index:1}.cluster-home-link{display:inline-flex;min-height:36px;align-items:center;color:#fff;text-decoration:none;font-size:11px;font-weight:800}.cluster-kicker{display:block;margin-top:2px;color:#ffd46d;font-size:9px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cluster-lesson-header h1{margin:4px 0 3px;font-size:clamp(21px,3vw,30px);line-height:1.15}.cluster-lesson-header p{max-width:620px;margin:0;color:#e8f5ff;font-size:11px;line-height:1.5}.cluster-lesson-side{grid-column:2;grid-row:1/5;align-self:center;display:flex;align-items:center;gap:10px;position:relative;z-index:2}.cluster-lesson-side .mascot-badge{position:static;flex:0 0 62px;width:62px;height:62px;margin:0;border:3px solid #ffd166;border-radius:50%;background:#fff;box-shadow:0 7px 18px rgba(5,35,62,.24);overflow:hidden}.cluster-lesson-side .mascot-badge img{width:100%;height:100%;object-fit:cover}.cluster-lesson-side .xp-ring{position:static;width:72px;height:72px;display:grid;place-items:center;filter:drop-shadow(0 7px 14px rgba(5,35,62,.22))}.cluster-lesson-side .xp-ring-svg{grid-area:1/1;width:100%;height:100%;transform:rotate(-90deg)}.cluster-lesson-side .xp-ring-track{fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.28);stroke-width:5}.cluster-lesson-side .xp-ring-fill{fill:none;stroke:#ffd166;stroke-width:5;stroke-linecap:round;transition:stroke-dashoffset .5s cubic-bezier(.22,1,.36,1)}.cluster-lesson-side .xp-ring-num{grid-area:1/1;margin-top:-7px;color:#fff;font-size:19px;font-weight:900;line-height:1}.cluster-lesson-side .xp-ring-lbl{grid-area:1/1;margin-top:14px;color:#bfe0f2;font-size:7px;font-weight:900;letter-spacing:.05em;text-transform:uppercase}.cluster-lesson-side .lvl-lbl{grid-area:1/1;align-self:end;margin-bottom:-9px;padding:2px 7px;border-radius:999px;background:#14966f;color:#fff;font-size:7px;font-weight:900;box-shadow:0 3px 8px rgba(0,0,0,.18)}.cluster-lesson-side .xp-ring.bump{animation:xpRingBump .3s ease}@keyframes xpRingBump{50%{transform:scale(1.12)}}@media(prefers-reduced-motion:reduce){.cluster-lesson-side .xp-ring-fill{transition:none}.cluster-lesson-side .xp-ring.bump{animation:none}}.cluster-original-title{display:none}
.cluster-lesson-nav{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0}.cluster-lesson-nav a{min-height:54px;padding:8px 12px;display:flex;align-items:center;justify-content:center;gap:9px;border:1px solid #cfe1ed;border-radius:14px;background:#fff;color:#123f67;font-size:11px;font-weight:800;text-align:center;text-decoration:none}.cluster-next{background:#eaf6ff!important}.cluster-nav-arrow{display:grid;flex:0 0 34px;width:34px;height:34px;place-items:center;border-radius:999px;background:#ffc83d;color:#0c3a62;font-size:22px;line-height:1;box-shadow:0 4px 10px rgba(216,155,0,.25)}.cluster-lesson-picker{grid-column:1/-1;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:10px;padding:10px 12px;border:1px solid #cfe1ed;border-radius:14px;background:#f7fbfe;color:#123f67;font-size:11px;font-weight:800}.cluster-lesson-picker select{width:100%;min-height:44px;padding:0 38px 0 12px;border:1px solid #b9d6e7;border-radius:11px;background:#fff;color:#123f67;font:700 12px inherit}
body[data-cluster-lesson] .panel{display:none!important}
body[data-cluster-lesson="p-basics"] #p-basics,body[data-cluster-lesson="p-formula"] #p-formula,body[data-cluster-lesson="p-valence"] #p-valence,body[data-cluster-lesson="p-table"] #p-table,body[data-cluster-lesson="p-reaction"] #p-reaction,body[data-cluster-lesson="p-rules"] #p-rules,body[data-cluster-lesson="p-series"] #p-series,body[data-cluster-lesson="p-organic"] #p-organic,body[data-cluster-lesson="p-iupac"] #p-iupac,body[data-cluster-lesson="p-mass"] #p-mass,body[data-cluster-lesson="p-quiz"] #p-quiz{display:block!important}
body[data-cluster-lesson] .tabs-wrap{display:none}body[data-cluster-lesson] .hero{display:none!important}
@media(max-width:680px){.cluster-lesson-nav{grid-template-columns:1fr 1fr}.cluster-prev,.cluster-next{flex-direction:column;line-height:1.35}.cluster-prev>span:last-child,.cluster-next>span:first-child{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2}.cluster-lesson-picker{grid-template-columns:1fr}.cluster-lesson-header{padding:12px;grid-template-columns:minmax(0,1fr) auto;column-gap:8px}.cluster-lesson-header p{font-size:9px;line-height:1.4}.cluster-lesson-side{grid-column:2;grid-row:1/5;gap:6px;flex-direction:column-reverse;justify-content:center}.cluster-lesson-side .mascot-badge{width:50px;height:50px;flex-basis:50px}.cluster-lesson-side .xp-ring{width:60px;height:60px}.cluster-lesson-side .xp-ring-num{font-size:16px}.cluster-home-link{min-height:32px}.cluster-breadcrumb{margin-top:8px}}
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
const hub = `<!doctype html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lấy gốc Hóa từ cơ bản cho học sinh mất gốc | ChamChamEdemy</title><meta name="description" content="Lộ trình 11 bài Lấy gốc Hóa THCS từ nền tảng, hóa trị, bảng tuần hoàn đến phương trình và bài tập tổng hợp."><link rel="canonical" href="https://chamchamedemy.id.vn/lay-goc-hoa/"><link rel="icon" href="/favicon.ico"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/css/chemistry-hub.css"><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Course", name: "Lấy gốc Hóa từ cơ bản", description: "Lộ trình 11 bài học Hóa học THCS dành cho học sinh mất gốc.", provider: { "@type": "EducationalOrganization", name: "ChamChamEdemy", url: "https://chamchamedemy.id.vn/" }, hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", inLanguage: "vi" } }).replaceAll("</", "<\\/")}</script><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", itemListElement: itemList }).replaceAll("</", "<\\/")}</script></head><body><header class="hub-site-header"><a href="/" class="hub-brand"><img src="/chamcham-logo-256.webp" alt="ChamChamEdemy"><span>ChamChamEdemy<small>Học Hóa bằng tư duy trực quan</small></span></a><a href="/" class="hub-home-button">← Về trang chủ</a></header><main><nav class="hub-breadcrumb" aria-label="Breadcrumb"><a href="/">Trang chủ</a><span>›</span><span aria-current="page">Lấy gốc Hóa</span></nav><section class="hub-hero"><div><span class="hub-eyebrow">LỘ TRÌNH HÓA HỌC THCS</span><h1>Lấy gốc Hóa từ cơ bản dành cho học sinh mất gốc</h1><p>Đi từng bước từ khái niệm nền tảng đến bài tập tổng hợp. Mỗi bài có minh họa, công cụ tính, trò chơi hoặc mô phỏng để học sinh hiểu bản chất thay vì học thuộc máy móc.</p><a href="/lay-goc-hoa/${lessons[0].slug}/" class="hub-primary">Bắt đầu từ bài 01 →</a></div><aside><strong id="hubProgressText">0/11 bài đã học</strong><div class="hub-progress"><i id="hubProgressBar"></i></div><small>Tiến độ được lưu trên thiết bị này.</small></aside></section><section class="hub-lessons" aria-labelledby="lessonHeading"><div class="hub-section-heading"><span>NỘI DUNG LỘ TRÌNH</span><h2 id="lessonHeading">11 bài học Lấy gốc Hóa</h2></div><div class="hub-grid">${hubCards}</div></section></main><footer><strong>ChamChamEdemy</strong><a href="/">Trang chủ</a><a href="/blog/">Blog H&#243;a</a><div class="hub-developer">Ph&#225;t tri&#7875;n b&#7903;i <b>Thehuntech</b> &#8212; Gi&#7843;i ph&#225;p s&#7889; cho doanh nghi&#7879;p &#183; <a href="tel:0354375305">0354 375 305</a></div></footer><script src="/assets/js/chemistry-cluster-progress.js"></script></body></html>`;
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
