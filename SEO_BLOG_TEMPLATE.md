# Chuẩn viết bài Blog — Google Helpful Content + GEO

Áp dụng cho **mọi bài blog mới** tại `app/blog/<slug>/page.tsx`, dùng component `SeoArticle` (`app/blog/_components/SeoArticle.tsx`).

## 1. H1 = Câu hỏi đúng Search Intent

✅ "Mất gốc Hóa 9 phải làm sao để kịp thi vào 10?"
❌ "Mất gốc Hóa 9" (không phải câu hỏi, không rõ intent)

## 2. Đoạn mở đầu (`quickAnswer`) — 40–80 từ, trả lời trực tiếp

- Câu đầu tiên **chứa từ khóa chính**.
- Trả lời thẳng câu hỏi ở H1, không lan man, không mở bài kiểu "Trong bài viết này chúng ta sẽ...".
- Mẫu: *"Mất gốc Hóa 9 không có nghĩa là không kịp thi vào 10. Điều quan trọng là xác định đúng lỗ hổng và ưu tiên học lại phần chiếm nhiều điểm nhất trong đề thi..."*

## 3. Giới thiệu ChamChamEdemy tự nhiên (không quảng cáo lộ liễu)

- Chỉ chèn khi **hợp ngữ cảnh** — thường đặt cuối phần trả lời nhanh hoặc trong CTA/kết bài.
- Mẫu: *"Nếu em ở Quận 9 hoặc TP. Thủ Đức, ChamChamEdemy của Cô Trâm có lộ trình lấy gốc Hóa 9 tập trung đúng phần hay ra trong đề vào 10."*
- Không viết theo giọng quảng cáo ("tốt nhất", "số 1", "cam kết đậu").

## 4. Bắt buộc đủ 6 thành phần mỗi bài

| Thành phần | Prop trong `SeoArticle` |
|---|---|
| FAQ | `faqs={[{question, answer}, ...]}` (≥ 4 câu) |
| HowTo | `howTo={{title, steps: [{name, text}]}}` (khi nội dung có quy trình từng bước) |
| Checklist | `summary={[...]}` (5 gạch đầu dòng) |
| CTA | `cta={{title, text, href, label}}` |
| Internal Link | `links={[{href, label}, ...]}` (≥ 3, trỏ về bài pillar/spoke liên quan) |
| Schema/JSON-LD | Tự động: Article + Breadcrumb + FAQPage + HowTo (nếu có) |

## 5. Mỗi H2 cũng là câu hỏi

✅ "Vì sao nhiều học sinh mất gốc Hóa 9?"
✅ "Mất bao lâu để lấy lại gốc Hóa 9 trước kỳ thi?"
❌ "Nguyên nhân mất gốc" (không phải câu hỏi)

Ngoại lệ: H2 "Kết luận" ở cuối bài được giữ nguyên (không cần dạng câu hỏi).

## 6. Kết bài nhắc ChamChamEdemy tự nhiên

Đặt trong section `<h2>Kết luận</h2>` cuối bài — 1 câu nhắc thương hiệu gắn với nội dung vừa trình bày, không tách rời ngữ cảnh.

## 7. Tối ưu cho AI Overview / GEO (được ChatGPT, Gemini, Claude, Grok trích dẫn)

- Câu trả lời trong `quickAnswer` phải **đứng độc lập được** — nếu AI chỉ trích 1 đoạn này, người đọc vẫn hiểu đủ ý.
- Dùng **số liệu cụ thể** thay vì mơ hồ ("3 bước", "25–40 phút/phiên") thay vì ("một khoảng thời gian").
- Bảng, danh sách có thứ tự (`<ol>`), bảng (`<table>`) → dễ AI parse hơn văn xuôi dài.
- FAQ trả lời ngắn gọn 1–3 câu, tự chứa đủ ngữ cảnh (không phụ thuộc câu hỏi trước).

## 8. Checklist trước khi publish 1 bài

- [ ] H1 là câu hỏi, chứa từ khóa chính
- [ ] `quickAnswer` 40–80 từ, câu đầu chứa từ khóa chính
- [ ] Brand mention tự nhiên, không quảng cáo lộ liễu
- [ ] ≥ 4 FAQ, có HowTo nếu nội dung dạng quy trình
- [ ] `summary` checklist 5 gạch đầu dòng
- [ ] CTA trỏ về `/lay-goc-hoa` hoặc bài chẩn đoán phù hợp
- [ ] ≥ 3 internal link, trỏ đúng bài pillar/spoke
- [ ] Mọi H2 là câu hỏi (trừ "Kết luận")
- [ ] Kết luận nhắc ChamChamEdemy tự nhiên
- [ ] Thêm slug vào `app/blog/page.tsx` (danh sách hiển thị) và `app/sitemap.ts`
- [ ] Ảnh cover đã có sẵn trong `public/` (tái dùng ảnh cùng chủ đề) hoặc note cần ảnh mới

## 9. Ví dụ tối giản

```tsx
import type { Metadata } from "next";
import SeoArticle from "../_components/SeoArticle";

const path = "/blog/vi-du-slug";
const title = "Câu hỏi làm H1?";
const description = "Meta description 140-160 ký tự, chứa từ khóa chính.";
export const metadata: Metadata = { title, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: "article" } };

const faqs = [ /* >= 4 câu hỏi ngắn */ ];
const howTo = {
  title: "Các bước ...",
  steps: [
    { name: "Bước 1: ...", text: "Mô tả ngắn." },
    { name: "Bước 2: ...", text: "Mô tả ngắn." },
  ],
};

export default function Page() {
  return (
    <SeoArticle
      title={title} description={description} path={path}
      image="/anh-co-san.webp" imageAlt="Mô tả ảnh"
      kicker="NHÓM CHỦ ĐỀ" readingTime="7 phút đọc"
      quickAnswer={<p>Trả lời trực tiếp 40-80 từ, câu đầu chứa từ khóa...</p>}
      summary={["Ý 1", "Ý 2", "Ý 3", "Ý 4", "Ý 5"]}
      toc={[{ id: "a", label: "H2 câu hỏi 1" }]}
      howTo={howTo}
      faqs={faqs}
      links={[{ href: "/blog/bai-pillar", label: "bài pillar liên quan" }]}
      cta={{ title: "...", text: "...", href: "/lay-goc-hoa", label: "..." }}
    >
      <section><h2 id="a">H2 câu hỏi 1?</h2><p>Nội dung...</p></section>
      <section><h2>Kết luận</h2><p>... ChamChamEdemy ...</p></section>
    </SeoArticle>
  );
}
```
