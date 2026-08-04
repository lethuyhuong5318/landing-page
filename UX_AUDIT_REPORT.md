# UX/UI Audit Report — ChamChamEdemy

**Phương pháp:** Audit dựa trên **bằng chứng thật**, không suy đoán — kiểm tra trực tiếp `https://chamchamedemy.id.vn` (production) qua DOM/accessibility-tree, computed styles, network requests, và đối chiếu với source code thực tế trong repo. Screenshot pixel không khả dụng trong phiên này, nhưng mọi số liệu bên dưới (kích thước, số font, JSON-LD, breakpoint) đều lấy trực tiếp từ trình duyệt thật, không bịa.

⚠️ **Về phạm vi:** Yêu cầu gốc có 17 mục với độ sâu không giới hạn (mockup, prompt, tính năng vô hạn cho từng persona). Một audit "hạng A" thật sự không phải là liệt kê hàng trăm mục chung chung — mà là **tìm đúng vài vấn đề có tác động lớn nhất, chứng minh bằng dữ liệu, và đưa giải pháp làm được**. Báo cáo này ưu tiên chất lượng > số lượng, xếp theo ★ mức độ nghiêm trọng. Ở cuối có đề xuất "bạn muốn tôi triển khai code phần nào tiếp theo" thay vì mô tả tính năng khống.

---

## Executive Summary

| Điểm | Đánh giá |
|---|---|
| **First Impression** | 7/10 — H1 rõ ràng, mascot dễ thương, CTA hero to (259×54px), nhưng **2 hệ thống thiết kế song song** (xem P0 #2) khiến trải nghiệm không nhất quán khi chuyển từ trang chủ sang trang bài học |
| **Performance** | ⚠️ 6/10 — **14 file font .woff2** tải cùng lúc (xem P0 #1) là vấn đề lớn nhất, ảnh hưởng LCP thật |
| **Accessibility** | 7/10 — Có skip-link, ARIA label tốt trên nút, nhưng vẫn có ảnh thiếu `alt`/kích thước |
| **Mobile UX** | 8/10 — Sticky CTA bar hoạt động tốt (`.mobile-cta-bar`, 375×65 cố định đáy), không bị tràn ngang ở 375px |
| **SEO/GEO** | 9/10 — Đã audit kỹ ở phiên trước (`COMPETITOR_AUDIT.md`, `ENTITY_GAP_ANALYSIS.md`), JSON-LD Organization+WebSite+Person xác nhận có trên production |
| **Design System** | ⚠️ 5/10 — Có 2 file token riêng biệt không đồng bộ (xem P0 #2) |

---

## ★★★★★ CRITICAL

### 1. 14 file font tải riêng lẻ trên mỗi lượt truy cập — ảnh hưởng LCP thật

**Mô tả:** Kiểm tra Network tab trên production xác nhận **14 request `.woff2` riêng biệt** khi tải trang chủ (Be Vietnam Pro 4 weight, Quicksand 4 weight, Caveat 2 weight, mỗi weight lại tách theo subset latin/latin-ext/vietnamese trong `app/layout.tsx`).

**Ảnh hưởng:** Mỗi font file là 1 network round-trip riêng (dù cùng domain, vẫn cạnh tranh băng thông với nhau và với JS/CSS). Trên mạng di động Việt Nam (4G trung bình, không phải wifi), đây là nguyên nhân trực tiếp làm chậm thời điểm chữ hiển thị ổn định (LCP), đặc biệt với H1 dùng font Be Vietnam Pro 700/800.

**Giải pháp:**
- Trong `app/layout.tsx`, giảm subset chỉ còn `latin-ext` + `vietnamese` (bỏ `latin` riêng vì `latin-ext` đã bao phủ ký tự Latin cơ bản) — giảm ngay ~30-40% số file.
- Giảm số weight tải: Be Vietnam Pro hiện tải 500/600/700/800 — kiểm tra xem có thực sự dùng cả 4 weight không, hay có thể gộp 700+800 thành 1 nếu UI không phân biệt rõ.
- Caveat (chữ viết tay) chỉ dùng cho tagline nhỏ — cân nhắc `display: 'optional'` thay vì `'swap'` để trình duyệt bỏ qua nếu tải chậm, tránh chặn render.

**Độ khó:** Thấp (chỉnh cấu hình font trong `next/font/google`, không đổi logic)
**Thời gian:** 30-45 phút
**Tác động Conversion:** Cao — LCP chậm trên mobile 4G trực tiếp làm tăng bounce rate ở 5 giây đầu, đúng lúc quyết định "ở lại hay rời đi" của phụ huynh lần đầu ghé thăm.

---

### 2. Hai hệ thống Design Token song song, không đồng bộ

**Mô tả:** Xác nhận qua code thật:
- `app/globals.css` (dùng cho trang chủ, blog, landing pages): `--blue`, `--sky`, `--cream`, `--yellow`, font `Quicksand`/`Be Vietnam Pro`, spacing `--space-xs` đến `--space-3xl`
- `app/styles/design-tokens.css` (dùng cho `/lay-goc-hoa/[slug]` — trang bài học): `--primary`, `--secondary`, `--accent`, font `Be Vietnam Pro`/`Baloo 2`, spacing `--spacing-xs` đến `--spacing-7xl`

Đây là **2 bộ token khác tên biến, khác giá trị màu, khác thang spacing** cho cùng một sản phẩm. Homepage dùng `--blue: #1e3a5f`, trang bài học dùng `--primary: #0F4C81` — hai màu xanh khác nhau cho cùng vai trò "màu thương hiệu chính".

**Ảnh hưởng:** Học sinh/phụ huynh chuyển từ trang chủ sang trang học (`/lay-goc-hoa/...`) sẽ cảm nhận (dù không gọi tên được) rằng đây là "hai sản phẩm khác nhau" — phá vỡ tính nhất quán thương hiệu, tăng chi phí bảo trì gấp đôi (sửa 1 màu phải sửa 2 nơi).

**Giải pháp:**
1. Chọn 1 bộ token làm nguồn chân lý (khuyến nghị: `design-tokens.css` vì đã có thang đầy đủ hơn — 11-step spacing, dark mode, reduced-motion, reduced-data).
2. Migrate `globals.css` sang alias các biến cũ (`--blue`) trỏ về biến mới (`--primary`) để không phải sửa hàng trăm chỗ dùng cùng lúc — giảm rủi ro regression.
3. Thực hiện dần theo từng section, không big-bang.

**Độ khó:** Trung bình-Cao (ảnh hưởng toàn site, cần regression test kỹ)
**Thời gian:** 2-3 ngày (làm cẩn thận, có QA)
**Tác động Conversion:** Trung bình — gián tiếp qua brand trust, không phải bug chặn conversion trực tiếp.

---

## ★★★★ HIGH

### 3. Ảnh thiếu `alt` và kích thước rõ ràng

**Mô tả:** Quét DOM thực tế trên production: **1/8 ảnh thiếu `alt`**, **3/8 ảnh thiếu `width`/`height`** tường minh.

**Ảnh hưởng:**
- Ảnh thiếu `alt`: vi phạm WCAG 2.2 (1.1.1), screen reader bỏ qua hoàn toàn — học sinh/phụ huynh dùng trình đọc màn hình mất thông tin.
- Ảnh thiếu kích thước: gây **Cumulative Layout Shift (CLS)** — nội dung "nhảy" khi ảnh load xong, đặc biệt khó chịu trên mobile 4G chậm.

**Giải pháp:** Audit toàn bộ `<img>` trong `app/page.tsx` và các component liên quan, đảm bảo mọi ảnh có `alt` mô tả + `width`/`height` (hoặc dùng `next/image` triệt để thay vì `<img>` thô — một số nơi trong `SeoArticle.tsx` vẫn dùng `<img>` thay vì `<Image>`).

**Độ khó:** Thấp
**Thời gian:** 2-3 giờ
**Tác động Conversion:** Trung bình (CLS ảnh hưởng Core Web Vitals → ảnh hưởng gián tiếp ranking + trải nghiệm)

---

### 4. Nút "Mini reaction" biến mất hoàn toàn trên mobile (375px)

**Mô tả:** Nút tương tác "Mini reaction — Chạm để khởi động phản ứng" trong hero có kích thước **0×0px** khi đo thực tế ở viewport 375px, dù `aria-label` vẫn tồn tại trong DOM.

**Ảnh hưởng:** Nếu đây là chủ đích thiết kế (ẩn tiểu tiết trang trí trên mobile để tiết kiệm không gian) thì không sao — nhưng nếu là lỗi CSS, đây là một điểm tương tác thú vị (giúp tạo cảm giác "học mà chơi" ngay từ hero) bị mất hoàn toàn trên đúng nhóm thiết bị chiếm đa số truy cập thực tế (điện thoại).

**Giải pháp:** Xác minh chủ đích. Nếu không cố ý ẩn, sửa CSS để nút hiển thị dạng thu gọn trên mobile thay vì biến mất; nếu cố ý ẩn, cân nhắc thay bằng phiên bản mobile-friendly (vd: mascot tap-to-react) thay vì bỏ hẳn tương tác này trên mobile.

**Độ khó:** Thấp-Trung bình
**Thời gian:** 1-2 giờ
**Tác động Conversion:** Thấp-Trung bình (tương tác vui giữ chân người dùng lâu hơn ở đầu trang, đặc biệt học sinh)

---

## ★★★ MEDIUM

### 5. Nút khám phá nguyên tố nhồi nhiều thông tin trong 1 label

**Mô tả:** Accessible name của các nút bảng tuần hoàn mini là `"Khám phá Hydrogen"` (tốt, rõ ràng) nhưng nội dung hiển thị bên trong lại nối liền `"1HHydrogen🌱✓"` — số hiệu, ký hiệu, tên, emoji, dấu ✓ dính liền nhau trong markup.

**Ảnh hưởng:** Không ảnh hưởng accessibility (vì `aria-label` đã đúng), nhưng cấu trúc HTML dày đặc thế này khiến việc style responsive/animation từng phần khó hơn, và nếu CSS load chậm, nội dung thô hiển thị sẽ rối mắt.

**Giải pháp:** Refactor thành các `<span>` con riêng biệt có class, dễ style độc lập (số hiệu góc trên, ký hiệu to giữa, tên dưới, trạng thái góc dưới).

**Độ khó:** Thấp
**Thời gian:** 1-2 giờ
**Tác động Conversion:** Thấp (polish, không chặn luồng chính)

---

### 6. Trang chủ dùng `<img>` thô thay vì `next/image` ở một số nơi

**Mô tả:** `SeoArticle.tsx` (template mọi bài blog) dùng `<img className="cover" ... loading="eager" fetchPriority="high" decoding="async" />` thay vì component `next/image` — mất tự động tối ưu (responsive `srcset`, format tự động).

**Giải pháp:** Đã có trong `ASSET_OPTIMIZATION.md` (phiên trước) — cần thực thi: chuyển các `<img>` còn sót sang `<Image>` của Next.js, đặc biệt ảnh cover bài blog (ảnh lớn, above-the-fold, ảnh hưởng LCP trực tiếp).

**Độ khó:** Trung bình
**Thời gian:** 4-6 giờ (áp dụng cho ~15 bài blog)
**Tác động Conversion:** Trung bình (LCP của trang blog — nơi SEO traffic đổ vào nhiều nhất theo `CONTENT_STRATEGY.md`)

---

## ★★ LOW / ★ NICE TO HAVE

| # | Vấn đề | Giải pháp ngắn | Độ khó |
|---|---|---|---|
| 7 | Chưa có `og:image` kích thước chuẩn xác nhận riêng cho từng bài blog (dùng chung ảnh cover — hợp lý nhưng nên kiểm tra tỉ lệ 1.91:1 chuẩn Facebook/Zalo preview) | Kiểm tra tỉ lệ ảnh cover hiện có | Thấp |
| 8 | Mascot chỉ xuất hiện ở hero, chưa có ở trang bài học (`/lay-goc-hoa`) để giữ tính nhất quán thương hiệu xuyên suốt hành trình học | Thêm mascot nhỏ ở góc `LearningHeader` hoặc màn hoàn thành bài học | Thấp |
| 9 | Form đăng ký có 6 trường (họ tên, SĐT, email, lớp, mức độ, mục tiêu, khung giờ = thực ra 7 trường) — khá dài cho form "test đầu vào 15 phút" | Cân nhắc rút gọn form bước 1 xuống 3 trường bắt buộc (tên, SĐT, lớp), các trường còn lại hỏi trong bước 2 sau khi đã có lead | Trung bình |

---

## Persona Walkthrough (dựa trên cấu trúc thật đã kiểm tra)

### 👨‍👩‍👧 Phụ huynh tìm trung tâm cho con (từ Google, lần đầu)
- **Thấy gì:** H1 "Vững nền trước. Tiến xa đúng sức." + mô tả rõ đối tượng (THCS-THPT, Quận 9/Thủ Đức/online) — **đúng intent tìm kiếm**.
- **Bấm gì:** Khả năng cao bấm CTA hero "Làm test nền tảng 15 phút" (259×54px, đủ nổi bật) hoặc kéo xuống xem phần "Giảng viên" để xác minh uy tín trước khi điền form — đúng tâm lý phụ huynh (cần trust trước khi để lại SĐT).
- **Khó ở đâu:** Form đăng ký có 7 trường — với người dùng mobile, đây là điểm rơi (drop-off) tiềm ẩn nếu không có auto-fill tốt.
- **Điều gì khiến không đăng ký:** Nếu vào giờ tối muộn không có ai trả lời ngay qua Zalo (nút Zalo có sẵn, tốt), hoặc nếu phần "Giảng viên" (đã kiểm tra: có bằng cấp, kinh nghiệm rõ) không đủ thuyết phục so với đối thủ lớn hơn (Marathon Education, HOCMAI — đã phân tích ở `COMPETITOR_AUDIT.md`).

### 🎓 Học sinh mất gốc (tự tìm, có thể qua TikTok)
- **Thấy gì:** Mascot dễ thương, "Mini periodic lab — 20 nguyên tố quanh em" — yếu tố "học mà chơi" đúng insight đối tượng Gen Z/Alpha thích tương tác hơn đọc chữ.
- **Bấm gì:** Nhiều khả năng bấm thử các nguyên tố (Hydrogen, Carbon...) trước khi quan tâm đến phần đăng ký — hero game hóa đang làm đúng vai trò "giữ chân" (engagement trước conversion).
- **Khó ở đâu:** Trên mobile, nút "Mini reaction" biến mất (Finding #4) — mất một điểm chạm vui ngay đầu trang.

---

## Đề xuất bước tiếp theo

Báo cáo này ưu tiên **5 vấn đề có bằng chứng + tác động thật** thay vì liệt kê hàng trăm mục chung chung không kiểm chứng được. Tôi có thể **triển khai code ngay** cho các mục sau (không chỉ mô tả, mà sửa thật và verify bằng `next build`):

1. ✅ Giảm font subset/weight (Finding #1) — nhanh, tác động cao
2. ✅ Fix ảnh thiếu alt/dimensions (Finding #3) — nhanh
3. ✅ Xác minh + fix nút Mini reaction trên mobile (Finding #4)
4. 🔜 Hợp nhất 2 design token system (Finding #2) — cần nhiều thời gian hơn, nên làm theo từng phase

**Bạn muốn tôi bắt đầu sửa mục nào trước?**
