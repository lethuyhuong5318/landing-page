import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Caveat, Quicksand } from "next/font/google";
import { getAssetPath } from "./basePath";
import JsonLd from "../components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "../lib/schema";
import { SITE_NAME, SITE_URL } from "../lib/seo";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Chỉ dùng cho điểm nhấn nhỏ dạng chữ viết tay (logo tagline, ghi chú hero) — không dùng cho nội dung dài.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  display: "swap",
});

const HOME_TITLE = "Học Hóa mất gốc Quận 9 & Online | ChamChamEdemy - Cô Trâm";
const HOME_DESCRIPTION =
  "ChamChamEdemy cùng Cô Trâm dạy Hóa THCS–THPT cho học sinh mất gốc: học trực tiếp tại Quận 9, TP. Thủ Đức hoặc online toàn quốc, gia sư 1:1 và lớp nhóm nhỏ.";
const SHARE_IMAGE = getAssetPath("/co-tram-mascot.jpg");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: [
    "học Hóa mất gốc",
    "gia sư Hóa Quận 9",
    "học Hóa Quận 9",
    "học Hóa online",
    "lớp Hóa cô Trâm",
    "ôn thi vào 10 môn Hóa",
    "lấy gốc Hóa THCS",
    "gia sư KHTN 9",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: SHARE_IMAGE, width: 620, height: 620, alt: "Mascot Cô Trâm - ChamChamEdemy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
  icons: {
    icon: [
      { url: getAssetPath("/favicon.ico"), type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      { url: getAssetPath("/favicon-48x48.png"), type: "image/png", sizes: "48x48" },
      { url: getAssetPath("/favicon.png"), type: "image/png", sizes: "512x512" },
    ],
    shortcut: getAssetPath("/favicon.ico"),
    apple: [
      { url: getAssetPath("/apple-touch-icon.png"), type: "image/png", sizes: "180x180" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${beVietnamPro.variable} ${quicksand.variable} ${caveat.variable} antialiased`}
      >
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        {children}
      </body>
    </html>
  );
}
