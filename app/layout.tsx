import type { Metadata } from "next";
import { Be_Vietnam_Pro, Quicksand } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gia sư & Luyện thi Hóa học Quận 9 (TP. Thủ Đức) | ChamChamEdemy - Cô Trâm",
  description:
    "Luyện thi Hóa & gia sư Hóa Quận 9, TP. Thủ Đức cùng Cô Trâm ChamChamEdemy: Lấy gốc Hóa THCS (lớp 8–9), học tốt KHTN 9, ôn thi vào 10 và luyện thi Hóa THPT lớp 11–12.",
  keywords: [
    "gia sư Hóa Quận 9",
    "luyện thi Hóa Quận 9",
    "học Hóa Quận 9",
    "lớp Hóa cô Trâm Quận 9",
    "ôn thi vào 10 Hóa Quận 9",
    "lấy gốc Hóa THCS Quận 9",
    "gia sư KHTN 9 Quận 9",
    "lớp học Hóa TP Thủ Đức"
  ],
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
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
        className={`${beVietnamPro.variable} ${quicksand.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
