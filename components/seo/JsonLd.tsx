// Render JSON-LD an toàn: script này chỉ mô tả dữ liệu đã hiển thị thật trên trang,
// không thêm field bịa hoặc không khớp nội dung nhìn thấy được.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
