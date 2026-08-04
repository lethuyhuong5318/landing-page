# Entity Gap Analysis — ChamChamEdemy vs. Top đối thủ

Mục tiêu: giúp AI (ChatGPT, Gemini, Claude, Grok, Perplexity) và Google Knowledge Graph hiểu ChamChamEdemy là một **thương hiệu giáo dục Hóa học uy tín**, có thật, có địa chỉ, có giáo viên cụ thể — không phải một site nội dung vô danh.

**Nguyên tắc bắt buộc (đã áp dụng trong `lib/schema.ts`):** chỉ khai báo entity dựa trên **dữ liệu có thật, đã hiển thị trên giao diện**. Không tự thêm rating, review, hay số liệu chưa xác thực — kể cả khi làm vậy có lợi cho SEO ngắn hạn, vì rủi ro bị Google phạt (spam structured data) hoặc AI trích dẫn sai thông tin cao hơn lợi ích.

---

## 1. Bảng so sánh Entity: ChamChamEdemy vs. Top đối thủ

| Entity | ChamChamEdemy hiện tại | HOCMAI/Marathon (big player) | Lâm Mạnh Cường (đối thủ local trực tiếp) | Đánh giá |
|---|---|---|---|---|
| **Person** (giáo viên) | ✅ `teacherPersonSchema()` — Cô Lê Thùy Trâm, có bằng cấp, alumniOf 2 trường | ⚠️ Thường ẩn danh giáo viên cụ thể sau thương hiệu lớn | ✅ Có, tên thật + bằng cấp công khai trên site | **Ngang bằng đối thủ local, TỐT HƠN big player** |
| **Organization** | ✅ `EducationalOrganization`, có logo, địa chỉ, areaServed | ✅ Đầy đủ, quy mô lớn | ⚠️ Không rõ có schema Organization | **ChamChamEdemy đã làm đúng chuẩn** |
| **Course** | ❌ **Chưa có Course schema** cho "Lấy gốc Hóa" dù đã có 12 bài học cấu trúc rõ ràng | ✅ Có (nền tảng lớn luôn khai báo Course) | ❌ Không rõ | **🔴 Gap cần lấp — xem mục 3, đã implement** |
| **LocalBusiness** | ⚠️ Dùng `EducationalOrganization` (có address) nhưng thiếu `openingHours`, `priceRange` | N/A (không phải local business) | ⚠️ Không rõ | **🟡 Gap nhỏ — nên bổ sung nếu có giờ hoạt động cố định** |
| **Review / AggregateRating** | ❌ Có dữ liệu khảo sát thật (28 học sinh, 4,07/5 điểm hiểu bài) nhưng **chưa đánh dấu schema** | ✅ Có (số lượng review lớn, tích lũy nhiều năm) | ⚠️ Không rõ | **🔴 Gap — nhưng KHÔNG nên retrofit số liệu khảo sát "hiểu bài" thành AggregateRating (sai ngữ nghĩa). Cần thu thập review đúng chuẩn — xem mục 4** |
| **FAQPage** | ✅ Có trên mọi bài blog (≥4 câu/bài) | ⚠️ Không phải bài nào cũng có (đã xác minh Colearn KHÔNG có FAQ schema) | ❌ Không rõ | **ChamChamEdemy đang VƯỢT đối thủ về điểm này** |
| **HowTo** | ✅ Mới thêm (Wave 1 trở đi) | ⚠️ HOCMAI dùng format "6 bước" nhưng không rõ có HowTo schema | ❌ Không rõ | **ChamChamEdemy đang dẫn đầu về điểm này** |
| **Blog / Article** | ✅ `articleSchema()` đầy đủ, author→Person, publisher→Organization | ✅ Có | ❌ Không thấy blog | **Ngang bằng big player, vượt Lâm Mạnh Cường** |
| **Video / VideoObject** | ❌ Có kênh YouTube (`SAME_AS`) nhưng **chưa có VideoObject schema** cho video cụ thể nào | ✅ Nhiều video có schema | ⚠️ Có video Facebook nhưng không rõ schema | **🟡 Gap — cần khi có video cụ thể để nhúng** |
| **YouTube** | ✅ Kênh có thật, đã link trong `sameAs`: `youtube.com/@chamcham97-c6f` | ✅ | ❓ Không xác định | OK, nhưng cần kiểm tra kênh có nội dung đều đặn không (ảnh hưởng E-E-A-T) |
| **Facebook** | ✅ Có thật, đã link trong `sameAs` | ✅ | ✅ (`facebook.com/lammanhcuong.vn`) | OK |
| **TikTok** | ✅ Có thật: `tiktok.com/@chamchamedemy` | ✅ (nhiều big player có) | ❓ | OK |
| **Google Business Profile** | ⚠️ Có link Google Maps thật (`GOOGLE_MAPS_URL`) nhưng **chưa rõ đã tối ưu đầy đủ** (giờ mở cửa, category, ảnh, bài đăng, Q&A, review) | ✅ Chắc chắn có, tối ưu tốt | ❓ Không xác định | **🔴 Gap quan trọng nhất cho Local SEO — xem mục 5** |
| **Citation (NAP)** | ❓ Chưa xác minh có nhất quán trên các directory (Foody, Cốc Cốc Map, các trang giáo dục địa phương) không | ✅ Thường có nhiều citation | ❓ | **🟡 Cần audit thủ công (không thể kiểm tra qua code)** |
| **Knowledge Graph** | ❌ Chưa xuất hiện (site mới, entity chưa đủ mạnh) | ✅ Một số big player có Knowledge Panel | ❌ | **Cần tích lũy theo thời gian — không có shortcut** |
| **Structured Data tổng thể** | ✅ Organization, WebSite, Person, Article, Breadcrumb, FAQPage, HowTo | ✅ Đầy đủ hơn (thêm Course, Review, Video) | ❓ | ChamChamEdemy đã có nền tảng tốt, cần bổ sung Course + Video |

---

## 2. Tóm tắt Gap ưu tiên

| Ưu tiên | Entity thiếu | Hành động |
|---|---|---|
| 🔴 P0 | **Course schema** | ✅ Đã implement — xem mục 3 |
| 🔴 P0 | **Google Business Profile tối ưu đầy đủ** | Hành động thủ công ngoài code — xem mục 5 |
| 🟡 P1 | **Review/AggregateRating đúng chuẩn** | Cần quy trình thu thập review thật — xem mục 4 |
| 🟡 P1 | **VideoObject schema** | Thêm khi có video cụ thể nhúng vào trang |
| 🟡 P1 | **LocalBusiness bổ sung `openingHours`/`priceRange`** | Cần xác nhận giờ hoạt động thật trước khi thêm |
| 🟢 P2 | **Citation audit (NAP consistency)** | Kiểm tra thủ công trên Foody, Cốc Cốc Map, các directory giáo dục |
| 🟢 P2 | **Knowledge Graph** | Hệ quả tự nhiên của việc làm tốt các mục trên theo thời gian, không có shortcut |

---

## 3. Đã triển khai: Course Schema

ChamChamEdemy đã có khóa học "Lấy gốc Hóa" với 12 bài học cấu trúc rõ ràng (`app/lib/lessons-data.ts`) nhưng chưa khai báo `Course` schema — đây là entity mà mọi nền tảng lớn (HOCMAI, Marathon) đều có. Đã thêm:

- `courseSchema()` trong `lib/schema.ts` — dùng dữ liệu thật từ `COURSE_TITLE`, `COURSE_DESCRIPTION`, số lượng bài học, provider = ChamChamEdemy Organization.
- Gắn vào `app/lay-goc-hoa/[slug]/page.tsx` (Server Component, chạy cùng `generateStaticParams`).

Xem code thực tế trong `lib/schema.ts` (hàm `courseSchema`) và `app/lay-goc-hoa/[slug]/page.tsx`.

---

## 4. Vì sao KHÔNG retrofit số liệu khảo sát thành AggregateRating

Trang `/feedback` có số liệu thật: *"4,07/5 Điểm hiểu bài trung bình"*, *"100% chọn cách giảng dễ hiểu"*. Có thể dùng làm `AggregateRating` không?

**Khuyến nghị: Không nên**, vì:
1. `AggregateRating` theo chuẩn Schema.org/Google gắn với **đánh giá mức độ hài lòng/khuyến nghị sản phẩm-dịch vụ** (dạng "bạn có hài lòng/sẽ giới thiệu không"), không phải "điểm tự đánh giá mức độ hiểu bài" — dùng sai ngữ cảnh có thể bị Google coi là structured data gây hiểu nhầm (misleading markup), dẫn đến bị phạt ẩn rich result cho toàn site.
2. Google yêu cầu review phải **có thể xác minh được** (thường cần liên kết tới nền tảng review bên thứ ba như Google, Facebook) — dữ liệu khảo sát nội bộ không đáp ứng yêu cầu này.

**Đề xuất thay thế (an toàn, đúng chuẩn):**
- Thu thập review có tên thật (hoặc tên viết tắt + xác nhận phụ huynh đồng ý công khai) trên **Google Business Profile** — đây là nguồn review chuẩn nhất, tự động được Google hiển thị sao đánh giá trong kết quả tìm kiếm mà không cần tự code schema.
- Khi có ≥5 review thật trên GBP, có thể cân nhắc thêm `Review` schema (không phải `AggregateRating` gộp) cho từng review cụ thể có trích dẫn, có tên người đánh giá, đăng đúng thời điểm thật.
- Số liệu khảo sát "4,07/5 điểm hiểu bài" vẫn nên **giữ nguyên hiển thị trên trang** (rất giá trị cho người đọc thật và cho E-E-A-T) — chỉ không nên ép vào schema `AggregateRating`.

---

## 5. Google Business Profile — Checklist tối ưu (hành động thủ công)

Địa chỉ đã xác nhận có thật (`lib/seo.ts`): 9/5A Đường Số 1, TP. Thủ Đức. Cần kiểm tra/tối ưu (ngoài phạm vi code):

- [ ] Đã claim & verify GBP chưa (qua thư/điện thoại/video call của Google)
- [ ] Category chính xác: "Trung tâm gia sư" / "Trung tâm giáo dục" (không chọn category quá rộng)
- [ ] Giờ hoạt động cập nhật đúng thực tế
- [ ] Ảnh: logo, ảnh giáo viên, ảnh lớp học thật (không dùng ảnh stock)
- [ ] Mô tả doanh nghiệp có từ khóa tự nhiên: "dạy Hóa học Quận 9, TP. Thủ Đức"
- [ ] Đăng bài (GBP Posts) định kỳ — mỗi bài blog mới có thể đăng kèm 1 GBP Post
- [ ] Trả lời Q&A trên GBP nếu có câu hỏi từ người dùng
- [ ] Chủ động xin review thật từ phụ huynh/học sinh sau mỗi khóa học (không mua review)
- [ ] Đồng bộ NAP (Name, Address, Phone) **chính xác tuyệt đối** giống với `lib/seo.ts` trên mọi nền tảng ngoài: Facebook Page, các directory giáo dục địa phương

**Vì sao quan trọng nhất:** GBP là yếu tố **quyết định nhất cho Local Pack** (3 kết quả bản đồ hiện trên đầu trang tìm kiếm khi search "gia sư hóa quận 9") — quan trọng hơn cả nội dung blog cho nhóm từ khóa Local (nhóm C trong `CONTENT_STRATEGY.md`).

---

## 6. Checklist Citation (NAP Consistency) — cần audit thủ công

Không thể kiểm tra qua code vì đây là dữ liệu bên ngoài site. Khuyến nghị kiểm tra thủ công trên:
- Google Business Profile (đã có link Maps)
- Facebook Page (đã có)
- Cốc Cốc Map, Foody (nếu áp dụng cho trung tâm giáo dục)
- Các trang danh bạ giáo dục địa phương (nếu từng đăng ký)

Đảm bảo Tên (ChamChamEdemy), Địa chỉ, Số điện thoại (`+84329309293`) **giống hệt nhau ký tự-cho-ký tự** ở mọi nơi — bất nhất NAP là nguyên nhân phổ biến khiến Google không tin tưởng entity địa phương.

---

## 7. Vì sao các bước này giúp AI (ChatGPT/Gemini/Claude/Grok/Perplexity) trích dẫn ChamChamEdemy

Các AI answer engine hiện đại ưu tiên trích dẫn nguồn có:
1. **Entity rõ ràng, nhất quán** (Person + Organization + Course liên kết chặt qua `@id`) — đã có sẵn trong `lib/schema.ts`, nay bổ sung Course càng đầy đủ hơn.
2. **Nội dung tự chứa đủ ngữ cảnh** (đoạn `quickAnswer` 40-80 từ trong mỗi bài) — đã áp dụng từ `CONTENT_STRATEGY.md`.
3. **Tín hiệu uy tín xác thực được** (địa chỉ thật, GBP, review thật) — nhóm AI này thường cross-check qua Google Knowledge Graph/GBP trước khi tin một nguồn nhỏ.

**Kết luận:** ChamChamEdemy đã có nền tảng schema tốt hơn nhiều đối thủ cùng quy mô (đặc biệt về FAQ+HowTo). Khoảng trống lớn nhất không nằm ở code mà ở **Google Business Profile chưa tối ưu** và **chưa có review thật** — đây là hai việc cần làm thủ công, ưu tiên cao nhất cho 30 ngày tới.
