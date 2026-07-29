// Nguồn thông tin duy nhất cho domain, tên thương hiệu và các kênh chính thức đã xác minh.
// Mọi file metadata / JSON-LD nên import từ đây thay vì hard-code lại.

export const SITE_URL = "https://chamchamedemy.id.vn";
export const SITE_NAME = "ChamChamEdemy";
export const SITE_TAGLINE = "Học Hóa bằng tư duy trực quan";
export const TEACHER_NAME = "Lê Thùy Trâm";
export const CONTACT_PHONE = "+84329309293";
export const CONTACT_PHONE_DISPLAY = "0329 309 293";

// Địa chỉ xác nhận từ hồ sơ Google Business Profile của ChamChamEdemy.
export const BUSINESS_ADDRESS = {
  streetAddress: "9/5A Đường Số 1",
  addressLocality: "Thành phố Thủ Đức",
  addressRegion: "TP. Hồ Chí Minh",
  addressCountry: "VN",
};
export const GOOGLE_MAPS_URL = "https://share.google/9M0kjGvY9F44mu6cC";

// Chỉ các URL kênh chính thức đã xác nhận có thật trong nội dung hiện tại của site.
export const SAME_AS = [
  "https://www.facebook.com/profile.php?id=61590518783118",
  "https://www.youtube.com/@chamcham97-c6f",
  "https://www.tiktok.com/@chamchamedemy",
];

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}
