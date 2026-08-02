# Audit SEO và đề xuất kiến trúc ChamChamEdemy

Ngày audit: 02/08/2026  
Phạm vi: source local, bản build cục bộ và kiểm tra trang chủ production `https://chamchamedemy.id.vn/`  
Trạng thái: **Giai đoạn 1 — audit và đề xuất, chưa triển khai thay đổi SEO hàng loạt**

## 1. Kết luận điều hành

Website đã có nền tảng tốt: trang chủ crawlable, nội dung thương hiệu rõ, 11 URL bài học trả HTTP 200, phần lớn route Next.js có title, description, canonical và breadcrumb. Tuy nhiên chưa nên mở thêm hàng loạt URL trước khi xử lý các lỗi P0 sau:

| Mức | Phát hiện | Ảnh hưởng | Đề xuất |
|---|---|---|---|
| P0 | Mỗi file của 11 bài học vẫn chứa đủ cả 11 panel nội dung, chỉ ẩn bằng CSS/JS | Trùng nội dung mạnh, intent không rõ, tải tài nguyên thừa | Build mỗi URL với đúng một bài học; chỉ giữ shared CSS/JS |
| P0 | Có hai nguồn sitemap: `app/sitemap.ts` và `public/sitemap.xml`; URL thực tế cục bộ chỉ trả sitemap 12 URL của cụm Lấy gốc Hóa | Trang chủ, dịch vụ và blog có thể không nằm trong sitemap | Chỉ giữ một nguồn sitemap sinh tự động, chứa toàn bộ canonical indexable |
| P0 | `/robots.txt` cục bộ trả 308, URL có slash trả 404 | Bot có thể không đọc được robots/sitemap directive | Loại bỏ xung đột trailing slash cho metadata route và kiểm tra production |
| P0 | `/lay-goc-hoa.html` trả 200 + meta refresh, không phải 301 | URL cũ vẫn indexable, phân tán tín hiệu | Redirect 301 một bước sang `/lay-goc-hoa/` ở hosting |
| P0 | `/mat-goc-hoa/`, `/lay-goc-hoa/`, hai bài blog “mất gốc/lộ trình” cùng nhắm intent gần nhau | Cannibalization từ khóa “mất gốc hóa/lấy gốc hóa” | Phân vai rõ: hub, trang tư vấn thương mại, bài giải đáp và bài chuyển cấp |
| P1 | Chưa có hub `/gia-su-hoa/`; intent “gia sư hóa” đang phân tán giữa trang chủ, `/hoc-hoa/`, local pages và blog | Không có landing page thương mại trung tâm | Tạo hub dịch vụ sau khi duyệt nội dung, liên kết các lớp/local page |
| P1 | Chưa có hub `/cong-cu/`; bảng tuần hoàn đang nằm trong bài học | Khó nhắm intent tra cứu volume lớn | Tách công cụ tương tác sang URL chính; bài học chỉ hướng dẫn cách dùng |
| P1 | `/chem-mining/`, `/chem-mining/embed/`, `/chemistry-simulation/` thiếu metadata riêng; embed nên noindex | Có nguy cơ kế thừa canonical trang chủ hoặc index trang tiện ích | Thêm metadata/noindex đúng vai trò; chỉ index trang công cụ có nội dung crawlable |
| P1 | GA4 đang fallback `G-XXXXXXXXXX`; utility event chưa được gọi trong UI | Không đo được chuyển đổi thật | Chỉ tải GA khi có ID hợp lệ; gắn sự kiện CTA/form/tool/lesson/3D |
| P2 | Trang chủ production H1 thiên thương hiệu, chưa diễn đạt rõ Quận 9/online/1–1 | Intent local-commercial chưa tối ưu | Điều chỉnh H1 nhưng giữ giọng thương hiệu, không nhồi từ khóa |
| P2 | Structured data bài học chỉ có LearningResource, chưa có BreadcrumbList; hub chưa đủ CollectionPage | Chưa mô tả tốt quan hệ topic cluster | Chuẩn hóa schema theo loại trang, không khai báo dữ liệu không hiển thị |

## 2. Inventory URL hiện tại

### Route Next.js

| URL | Vai trò hiện tại | Indexability dự kiến | Quyết định đề xuất |
|---|---|---:|---|
| `/` | Trang chủ thương hiệu/local | Index | Giữ; chỉ nhắm local + học 1–1 |
| `/hoc-hoa/` | Hub khóa học | Index | Đổi vai trò thành danh mục lớp; không nhắm “gia sư hóa” chính |
| `/hoc-hoa-online/` | Lớp online | Index | Có thể chuyển 301 sang `/gia-su-hoa/gia-su-hoa-online/` sau khi tạo trang mới |
| `/hoc-hoa-quan-9/` | Local landing | Index | Giữ nếu nội dung/dịch vụ thực; cân nhắc slug mới dưới hub dịch vụ |
| `/hoc-hoa-thu-duc/` | Local landing | Index | Giữ nếu khác biệt thực với Quận 9 |
| `/mat-goc-hoa/` | Landing tư vấn mất gốc | Index | Giữ như commercial investigation; tránh cạnh tranh hub học miễn phí |
| `/blog/` | Hub blog | Index | Giữ |
| 9 URL blog hiện có | Bài thông tin/local | Index | Giữ, hợp nhất intent trùng nếu cần |
| `/feedback/` | Minh chứng | Index | Giữ, không schema rating |
| `/chem-mining/` | Game 3D | Cần quyết định | Noindex hoặc đặt dưới công cụ có nội dung giải thích |
| `/chem-mining/embed/` | Iframe nội bộ | Noindex | Bắt buộc noindex, không sitemap |
| `/chemistry-simulation/` | Mô phỏng 3D | Cần quyết định | Chỉ index nếu có nội dung HTML hữu ích |

### Cụm Lấy gốc Hóa

Tất cả 12 URL hub + bài học trả HTTP 200 cục bộ, có H1 duy nhất và canonical tự tham chiếu. Tuy nhiên mỗi bài chứa 11 panel HTML, nên chưa đạt yêu cầu “mỗi URL một intent”.

| URL hiện tại | Vai trò đề xuất | Hành động |
|---|---|---|
| `/lay-goc-hoa/` | Hub lộ trình | Giữ |
| `/lay-goc-hoa/nen-tang-hoa-hoc-6-7/` | Bài nền tảng | Giữ; tách HTML riêng |
| `/lay-goc-hoa/cong-thuc-hoa-hoc/` | Đang gộp mol, nồng độ, độ tan | Cần chia intent hoặc đổi thành bài tổng quan dẫn đến bài chuyên sâu |
| `/lay-goc-hoa/hoa-tri/` | Hóa trị + lập công thức | Có thể giữ chung nếu lộ trình coi là một bài; title phải phản ánh cả hai |
| `/lay-goc-hoa/bang-tuan-hoan/` | Bài học + công cụ | Tách vai trò với `/cong-cu/bang-tuan-hoan-hoa-hoc/` |
| `/lay-goc-hoa/phan-ung-va-phuong-trinh-hoa-hoc/` | Phản ứng, bảo toàn, cân bằng | Giữ như bài học; dẫn tới công cụ cân bằng |
| `/lay-goc-hoa/tan-ph-quy-tim/` | Độ tan/pH/quỳ | Giữ |
| `/lay-goc-hoa/day-hoat-dong-khi-ket-tua/` | Ba chủ đề gộp | Giữ theo lộ trình hoặc đổi title để không nhắm riêng “dãy hoạt động” quá rộng |
| `/lay-goc-hoa/hoa-hoc-huu-co-co-ban/` | Hữu cơ cơ bản | Giữ |
| `/lay-goc-hoa/danh-phap-iupac/` | Danh pháp | Giữ |
| `/lay-goc-hoa/phan-tu-khoi/` | Phân tử khối | Giữ |
| `/lay-goc-hoa/bai-tap-lay-goc-hoa/` | Quiz tổng hợp | Giữ |
| `/lay-goc-hoa.html` | URL cũ | 301 sang `/lay-goc-hoa/` |

## 3. Keyword map đề xuất

| Keyword chính | Keyword phụ | Intent | Volume | KD | URL mục tiêu | Loại trang | Ưu tiên |
|---|---|---|---:|---:|---|---|---|
| gia sư hóa | gia sư hóa học, gia sư môn hóa, giáo viên dạy kèm hóa | Transactional | 320 / 50 / 50 | 4 / 3 / 3 | `/gia-su-hoa/` | Service hub | P0 |
| gia sư hóa học online | gia sư hóa online, học Hóa 1–1 online | Transactional | 30 | 3 | `/gia-su-hoa/gia-su-hoa-online/` | Service | P1 |
| gia sư hóa lớp 10 | học Hóa lớp 10 mất gốc | Transactional | ~30 | — | `/gia-su-hoa/gia-su-hoa-lop-10/` | Service | P1 |
| gia sư hóa lớp 12 | gia sư Hóa ôn thi lớp 12 | Transactional | 90 | 5 | `/gia-su-hoa/gia-su-hoa-lop-12/` | Service | P1 |
| học hóa quận 9 | gia sư hóa quận 9, lớp Hóa Quận 9 | Local/Transactional | chưa có | — | `/hoc-hoa-quan-9/` hoặc URL mới đã chọn | Local service | P0 |
| học hóa thủ đức | gia sư hóa thủ đức | Local/Transactional | chưa có | — | `/hoc-hoa-thu-duc/` hoặc URL mới đã chọn | Local service | P0 |
| lấy gốc hóa | lộ trình lấy gốc hóa, gốc hóa | Informational + tool | 320 / 70 | 21 / 28 | `/lay-goc-hoa/` | Learning hub | P0 |
| mất gốc hóa | học lại Hóa từ đầu, dấu hiệu mất gốc | Commercial investigation | 110 | 20 | `/mat-goc-hoa/` | Advisory landing | P0 |
| lấy lại gốc hóa | cách lấy lại gốc, cách lấy lại gốc hóa | Informational | 110 / 30 | 13 / 12 | `/blog/mat-goc-hoa-nen-bat-dau-tu-dau/` | Pillar article | P0 |
| tài liệu cho người mất gốc hóa 8, 9 | tài liệu hóa cho người mất gốc | Informational | 170 | 22 | `/blog/tai-lieu-hoa-cho-nguoi-mat-goc/` | Resource article | P1 |
| lấy gốc hóa 8 | lấy gốc Hóa lớp 8 | Informational | 110 | 26 | Một section trong hub hoặc bài chất lượng riêng sau dữ liệu GSC | Guide | P2 |
| cách học hóa hiệu quả | cách học hóa hiệu quả cho người mất gốc | Informational | 110 / 30 | 10 / — | `/blog/cach-hoc-hoa-hieu-qua/` | Pillar article | P1 |
| cách học giỏi hóa | học giỏi Hóa không học vẹt | Informational | 30 | 8 | `/blog/cach-hoc-gioi-hoa/` | Article | P1 |
| bảng tuần hoàn hóa học | bảng nguyên tố hóa học, bảng tuần hoàn các nguyên tố hóa học | Informational/tool | 40.500 / 60.500 / 8.100 | 42 / 62 / 22 | `/cong-cu/bang-tuan-hoan-hoa-hoc/` | Interactive tool | P2 |
| từ điển hóa học | thuật ngữ hóa học, tra cứu hóa học | Informational/tool | 18.100 | 23 | `/cong-cu/tu-dien-hoa-hoc/` | Dictionary tool | P1 |
| phương trình hóa học | cân bằng phương trình hóa học | Informational/tool | 9.900 | 20 | `/cong-cu/can-bang-phuong-trinh/` | Tool + guide | P1 |
| hóa học | kiến thức hóa học | Broad informational | 9.900 | 27 | Không nhắm trực tiếp ở giai đoạn đầu; xây topical authority | — | P3 |

### Quy tắc phân vai để tránh cannibalization

- `/lay-goc-hoa/`: học miễn phí theo lộ trình, progress và bài tương tác.
- `/mat-goc-hoa/`: giúp phụ huynh/học sinh nhận biết vấn đề và chọn hình thức hỗ trợ.
- `/blog/mat-goc-hoa-nen-bat-dau-tu-dau/`: trả lời trực tiếp câu hỏi “bắt đầu từ đâu”, dẫn về hub.
- `/gia-su-hoa/`: landing thương mại chính cho “gia sư hóa”. Trang chủ không tranh từ khóa này.
- `/cong-cu/bang-tuan-hoan-hoa-hoc/`: tra cứu tương tác. Bài `/lay-goc-hoa/bang-tuan-hoan/` chỉ dạy cách đọc và bài tập.
- `/cong-cu/can-bang-phuong-trinh/`: công cụ kiểm tra. Bài blog giải thích phương pháp; bài lộ trình luyện nền tảng.

## 4. Cây URL cuối cùng đề xuất

```text
/
├── lay-goc-hoa/
│   ├── [11 bài hiện có — sau khi mỗi file chỉ chứa đúng nội dung bài]
├── gia-su-hoa/
│   ├── gia-su-hoa-online/
│   ├── gia-su-hoa-lop-10/
│   ├── gia-su-hoa-lop-12/
│   └── chỉ mở lớp 8/9/11 khi có nội dung và dịch vụ riêng
├── hoc-hoa-quan-9/          # giữ URL hiện có để tránh redirect không cần thiết
├── hoc-hoa-thu-duc/         # giữ URL hiện có nếu nội dung thực sự khác biệt
├── cong-cu/
│   ├── bang-tuan-hoan-hoa-hoc/
│   ├── tu-dien-hoa-hoc/
│   ├── can-bang-phuong-trinh/
│   ├── tinh-khoi-luong-mol/
│   └── tra-cuu-hoa-tri/
├── blog/
├── co-tram/
├── hoc-phi/
├── dang-ky-hoc-thu/
├── lien-he/
├── chinh-sach-bao-mat/
└── dieu-khoan/
```

Không đề xuất đổi ngay `/hoc-hoa-quan-9/` thành URL lồng dưới `/gia-su-hoa/`: giá trị SEO của URL không đến từ việc lồng thư mục, trong khi đổi URL tạo thêm redirect và rủi ro. Chỉ đổi nếu muốn chuẩn hóa taxonomy dài hạn và có 301 đúng.

## 5. Title, description và H1 mục tiêu cho URL trọng điểm

| URL | Title đề xuất | H1 đề xuất |
|---|---|---|
| `/` | Học Hóa Quận 9, Thủ Đức – Gia sư Hóa 1–1 | ChamChamEdemy | Học Hóa 1–1 tại Quận 9 và online cùng Cô Trâm |
| `/lay-goc-hoa/` | Lấy Gốc Hóa Từ Cơ Bản Cho Người Mất Gốc | ChamChamEdemy | Lộ trình lấy gốc Hóa từ cơ bản dành cho học sinh mất gốc |
| `/mat-goc-hoa/` | Mất Gốc Hóa: Cách Xác Định Phần Hổng Và Chọn Lộ Trình | ChamChamEdemy | Mất gốc Hóa: xác định đúng phần hổng trước khi học lại |
| `/gia-su-hoa/` | Gia Sư Hóa 1–1 Lớp 8–12, Trực Tiếp Và Online | ChamChamEdemy | Gia sư Hóa 1–1 cho học sinh lớp 8–12 |
| `/hoc-hoa-quan-9/` | Học Hóa Quận 9 1–1 Và Nhóm Nhỏ Cùng Cô Trâm | ChamChamEdemy | Học Hóa tại Quận 9 theo đúng điểm xuất phát |
| `/hoc-hoa-thu-duc/` | Học Hóa Thủ Đức Cho Học Sinh Lớp 8–12 | ChamChamEdemy | Lớp Hóa tại Thủ Đức cùng Cô Trâm |
| `/cong-cu/bang-tuan-hoan-hoa-hoc/` | Bảng Tuần Hoàn Hóa Học Tương Tác, Tra Cứu 118 Nguyên Tố | ChamChamEdemy | Bảng tuần hoàn hóa học tương tác |
| `/cong-cu/tu-dien-hoa-hoc/` | Từ Điển Hóa Học: Tra Cứu Thuật Ngữ Dễ Hiểu | ChamChamEdemy | Từ điển Hóa học dành cho học sinh THCS–THPT |
| `/cong-cu/can-bang-phuong-trinh/` | Cân Bằng Phương Trình Hóa Học Có Hướng Dẫn | ChamChamEdemy | Công cụ cân bằng phương trình hóa học |

Meta description sẽ được viết riêng khi chốt nội dung thực tế của từng dịch vụ/công cụ; không dùng một template thay tên từ khóa.

## 6. Internal linking map

```text
Trang chủ
├── Lấy gốc Hóa → 11 bài học → công cụ liên quan
├── Gia sư Hóa → online/lớp/local → đăng ký học thử
├── Công cụ → bài hướng dẫn → bài học nền → dịch vụ phù hợp
└── Blog → hub kiến thức hoặc service theo intent
```

Mỗi bài học cần: breadcrumb, hub, bài trước, bài sau, 2–4 link liên quan và một CTA dịch vụ nhẹ. Mỗi blog cần link đến một hub chính, một công cụ và tối đa một CTA thương mại phù hợp.

## 7. Redirect map đề xuất

| Nguồn | Đích | Loại |
|---|---|---|
| `/lay-goc-hoa.html` | `/lay-goc-hoa/` | 301 |
| `/hoc-hoa-online/` | `/gia-su-hoa/gia-su-hoa-online/` | Chỉ 301 sau khi trang mới hoàn thiện |
| URL bảng tuần hoàn bài học | Không redirect | Giữ bài học, canonical tự tham chiếu; link sang công cụ |
| `/chem-mining/embed/` | Không redirect | Noindex, dùng nội bộ |

Không tạo redirect trước khi URL đích có nội dung hoàn chỉnh và đã qua kiểm tra.

## 8. Structured data map

| Loại trang | Schema |
|---|---|
| Trang chủ | WebSite + EducationalOrganization; LocalBusiness chỉ khi dữ liệu kinh doanh hiển thị và xác thực |
| Hub Lấy gốc Hóa | CollectionPage + ItemList + BreadcrumbList |
| Bài học | LearningResource + BreadcrumbList |
| Hồ sơ Cô Trâm | ProfilePage + Person |
| Hub/landing lớp học | Course + BreadcrumbList; Offer chỉ khi giá hiển thị |
| Blog | Article + BreadcrumbList |
| Công cụ | WebApplication hoặc SoftwareApplication chỉ khi phù hợp + BreadcrumbList |

## 9. Kế hoạch 90 ngày rút gọn

### Ngày 1–30 — sửa nền kỹ thuật và BOFU

1. Tách HTML thật cho 11 bài; sửa sitemap/robots/301.
2. Chốt hub `/gia-su-hoa/` và nội dung dịch vụ thật.
3. Chuẩn hóa trang chủ, Quận 9, Thủ Đức, online.
4. Hoàn thiện trang Cô Trâm, học phí, liên hệ, bảo mật.
5. Gắn GA4 thật và sự kiện chuyển đổi.

### Ngày 31–60 — MOFU

1. Cách học Hóa hiệu quả cho người mất gốc.
2. Cách học giỏi Hóa không học thuộc máy móc.
3. Tài liệu Hóa cho người mất gốc lớp 8–9.
4. Gia sư Hóa lớp 10 và lớp 12 nếu nội dung dịch vụ đủ khác biệt.
5. Nâng cấp internal link từ blog sang hub/công cụ/service.

### Ngày 61–90 — công cụ và topical authority

1. Bảng tuần hoàn tương tác ở URL công cụ chính.
2. Công cụ cân bằng phương trình có nội dung HTML hướng dẫn.
3. Từ điển Hóa học bản biên tập đầu tiên, không sinh hàng loạt.
4. Bài cách đọc bảng tuần hoàn, cách nhớ hóa trị, mol, nồng độ.
5. Dùng dữ liệu Search Console để cập nhật trang vị trí 8–20.

## 10. Đo lường cần triển khai

- Xác minh Search Console và gửi đúng sitemap duy nhất.
- Cấu hình `NEXT_PUBLIC_GA4_ID`; không tải placeholder.
- Event: `click_zalo`, `click_phone`, `click_facebook`, `submit_trial_form`, `start_lesson`, `complete_lesson`, `use_chemistry_tool`, `open_3d_model`, `blog_to_service`.
- Báo cáo tuần: indexability, impressions, clicks, CTR, vị trí, conversion, crawl errors, Core Web Vitals.

## 11. Những phần chưa thể xác nhận hoặc chưa nên tự đoán

- Chưa có dữ liệu Search Console/GA4 thật để xác nhận impression, CTR, query hoặc cannibalization thực tế.
- Chưa xác nhận học phí, lịch học, giờ liên hệ và chính sách học bù; không tạo Offer/schema hoặc nội dung dịch vụ giả.
- Chưa xác nhận Google Business Profile và trạng thái bản đồ production bằng quyền quản trị.
- Chưa kiểm tra toàn bộ production URL bằng crawler ngoài; audit status hiện dựa trên build/local HTTP và trang chủ production.
- Chưa tạo trang địa phương/lớp học mới vì cần nội dung dịch vụ thực và khác biệt.

## 12. Thứ tự triển khai đề nghị sau khi duyệt

1. P0 technical: một bài/một HTML, một sitemap, robots 200, redirect 301.
2. Keyword ownership: hub Lấy gốc, trang mất gốc, blog, local pages.
3. Hub Gia sư Hóa và điều hướng trang chủ.
4. Công cụ bảng tuần hoàn/cân bằng/từ điển.
5. Metadata/schema/internal link/analytics.
6. Crawl build và kiểm tra production trước khi gửi sitemap.
