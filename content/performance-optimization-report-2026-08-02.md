# Báo cáo tối ưu hiệu suất ChamChamEdemy — 02/08/2026

## Phạm vi đã thực hiện

- Giữ nguyên nội dung SEO, form, bảng nguyên tố, game, mô phỏng, localStorage và tiến độ học.
- Tập trung nhóm có tác động lớn nhất: ảnh, Analytics placeholder, cache asset và forced reflow trang chủ.
- Production build và TypeScript đều thành công.

## Nguyên nhân gốc

1. `chamcham-logo.png` có kích thước 2048×1940 và nặng 4.426,8 KiB nhưng chỉ hiển thị 52–58 px.
2. `co-le-thuy-tram-professional.png` nặng 1.796 KiB dù hiển thị trong card giáo viên dưới màn hình đầu.
3. Analytics luôn tải `gtag.js` với ID fallback `G-XXXXXXXXXX`, tạo request bên thứ ba khoảng 142 KiB nhưng không đo lường hợp lệ.
4. Ảnh public tên cố định chưa có chính sách cache rõ trong output static.
5. Hiệu ứng nghiêng ảnh giáo viên đọc `getBoundingClientRect()` trên mỗi `mousemove`, có thể tạo forced reflow.
6. Các section dài dưới màn hình đầu vẫn tham gia render/layout ngay từ đầu.

## Asset trước và sau

| Asset | Trước | Sau | Giảm |
|---|---:|---:|---:|
| Logo ChamChamEdemy | 4.426,8 KiB PNG | 13,7 KiB WebP | 99,7% |
| Ảnh Cô Trâm chuyên nghiệp | 1.796 KiB PNG | 39,8 KiB WebP | 97,8% |
| Mascot | 275,3 KiB JPG | 61,8 KiB WebP | 77,5% |
| Feedback buổi live | 372,7 KiB JPG | 124,2 KiB WebP | 66,7% |
| Sơ đồ dòng chất | 390,8 KiB JPG | 123,7 KiB WebP | 68,3% |
| Tài liệu KHTN 9 | 380,4 KiB JPG | 132,5 KiB WebP | 65,2% |
| Infographic Hóa cơ bản | 269,4 KiB JPG | 103,2 KiB WebP | 61,7% |
| Mindmap lấy gốc | 229,5 KiB JPG | 91,8 KiB WebP | 60,0% |
| Phiếu nhận xét | 116,1 KiB JPG | 32,9 KiB WebP | 71,7% |
| **Tổng nhóm đã tối ưu** | **8.257 KiB** | **723,6 KiB** | **91,2%** |

Bản gốc vẫn được giữ trong repository để có thể phục hồi hoặc tạo biến thể chất lượng cao; giao diện đã chuyển sang các file WebP tối ưu.

## Analytics

- Chỉ đọc một nguồn ưu tiên: `NEXT_PUBLIC_GA_ID`, hỗ trợ tương thích `NEXT_PUBLIC_GA4_ID` cũ.
- Không render script và không gửi request Google khi ID thiếu, sai định dạng hoặc là `G-XXXXXXXXXX`.
- Development hiển thị cảnh báo cấu hình.
- Khi ID hợp lệ, script dùng `lazyOnload`.
- Static export đã được kiểm tra: không có URL `googletagmanager.com` hoặc placeholder trong HTML/JS được xuất khi chưa cấu hình ID.

## Cache header

Đã thêm `public/_headers`:

- `/_next/static/*`: 1 năm, immutable.
- WebP/ICO/element visuals: 30 ngày + stale-while-revalidate.
- `/assets/*`: 7 ngày + stale-while-revalidate.
- HTML: revalidate, không immutable.

File `_headers` có mặt trong static export. Cần xác minh nền tảng production thực tế áp dụng header sau deploy bằng DevTools hoặc `curl -I`.

## Forced reflow và DOM/render

- Loại bỏ hiệu ứng mousemove trên ảnh giáo viên vốn đọc layout rồi ghi transform liên tục.
- Thêm `content-visibility: auto` cho courses, teacher và proof sections dưới màn hình đầu, kèm intrinsic size để hạn chế layout shift.
- Bổ sung kích thước và `decoding="async"` cho các ảnh tài liệu quan trọng.
- Giữ nguyên counter, form, bảng nguyên tố và các tương tác hiện có.

## Client component và bundle

- Chưa refactor toàn bộ `app/page.tsx` từ Client Component thành nhiều Server/Client island vì đây là thay đổi kiến trúc rủi ro cao, cần một vòng kiểm thử riêng.
- Tác động JavaScript bên thứ ba lớn nhất đã được loại bỏ khi Analytics chưa cấu hình: khoảng 142 KiB theo Lighthouse đầu vào.
- Three.js vẫn được dynamic import ở các route game/mô phỏng; mô hình 3D không được thêm vào homepage bundle.
- Chưa có số Lighthouse sau deploy; không tự tuyên bố điểm 90+ khi chưa đo production ba lần.

## Kiểm tra đã chạy

- `npx tsc --noEmit`: thành công.
- Next.js production build/static export: thành công, 24 route.
- Kiểm tra placeholder Analytics trong static export: không còn request/script.
- Kiểm tra topic cluster generator: thành công.
- `git diff --check`: không có whitespace error.

## File/nhóm file chính đã sửa

- `components/Analytics.tsx`
- `app/page.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/components/SiteChrome.tsx`
- `app/blog/**`
- `content/lay-goc-hoa-source.html`
- `scripts/build-chemistry-topic-cluster.mjs`
- `public/_headers`
- 9 WebP mới trong `public/`

## Vấn đề còn lại

1. Cần chạy Lighthouse production mobile/desktop ba lần sau deploy và lấy trung vị.
2. Cần xác minh `_headers` thực sự được hosting áp dụng.
3. Cần cấu hình Measurement ID thật rồi kiểm tra GA4 Realtime/DebugView và một page_view duy nhất.
4. Refactor homepage thành Server Component + client islands nên thực hiện ở PR riêng.
5. 11 trang bài học vẫn cần tách đúng một panel HTML mỗi URL theo báo cáo Technical SEO.
6. Chưa chạy bundle analyzer vì không cài thêm dependency trong vòng sửa an toàn này.

## Cách xác minh sau deploy

1. Network: logo phải tải `chamcham-logo-256.webp`, không tải PNG 4,4 MiB.
2. Network: khi chưa có GA ID, không có request `googletagmanager.com`.
3. `curl -I` các WebP và `/_next/static/*` để kiểm tra Cache-Control.
4. GA4 Realtime/DebugView: xác nhận đúng Measurement ID và một page_view.
5. PageSpeed Insights: chạy ba lần cho mobile và desktop, lấy trung vị; so sánh LCP, transfer size và cache audit.
