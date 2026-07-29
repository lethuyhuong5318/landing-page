import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/seo";

export const dynamic = "force-static";

const posts = [
  "/blog/gia-su-luyen-thi-hoa-quan-9-tp-thu-duc",
  "/blog/meo-hoc-tot-khtn-9-lay-goc-hoa-thcs-quan-9",
  "/blog/cach-can-bang-phuong-trinh-hoa-hoc",
  "/blog/bai-toan-nong-do-dung-dich",
  "/blog/lo-trinh-lay-goc-hoa-thcs-vao-10",
];

// next.config.mjs bật trailingSlash: true nên URL thật luôn có dấu "/" cuối (trừ trang chủ).
function withTrailingSlash(path: string): string {
  return `${SITE_URL}${path}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: withTrailingSlash("/feedback"), changeFrequency: "monthly", priority: 0.8 },
    { url: withTrailingSlash("/blog"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/lay-goc-hoa.html`, changeFrequency: "monthly", priority: 0.9 },
    ...posts.map((path) => ({
      url: withTrailingSlash(path),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
