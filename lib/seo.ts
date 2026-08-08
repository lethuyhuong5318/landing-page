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
  // next.config.mjs sets trailingSlash: true, so every real page URL
  // (and canonical/og:url, which Next's own metadata API already
  // normalizes) ends in "/". Structured-data URLs built from this
  // helper were missing that slash, pointing schema.org "item"/"url"
  // fields at the non-canonical form. Skip normalization for hash
  // and query paths (e.g. "/#dang-ky") and asset files, which must
  // never gain a trailing slash.
  const isPageRoute = !clean.includes("#") && !clean.includes("?") && !/\.[a-z0-9]+$/i.test(clean);
  const normalized = isPageRoute && !clean.endsWith("/") ? `${clean}/` : clean;
  return `${SITE_URL}${normalized}`;
}
