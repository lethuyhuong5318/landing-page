import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/seo";

export const dynamic = "force-static";

const blogPosts = [
  "/blog/mat-goc-hoa-nen-bat-dau-tu-dau",
  "/blog/bai-kiem-tra-chan-doan-mat-goc-hoa",
  "/blog/checklist-kien-thuc-hoa-thcs",
  "/blog/hoc-hoa-tai-quan-9",
  "/blog/gia-su-luyen-thi-hoa-quan-9-tp-thu-duc",
  "/blog/meo-hoc-tot-khtn-9-lay-goc-hoa-thcs-quan-9",
  "/blog/cach-can-bang-phuong-trinh-hoa-hoc",
  "/blog/bai-toan-nong-do-dung-dich",
  "/blog/lo-trinh-lay-goc-hoa-thcs-vao-10",
];

function withTrailingSlash(path: string): string {
  return `${SITE_URL}${path}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1.0,
      lastModified: new Date("2026-08-02"),
    },
    {
      url: withTrailingSlash("/hoc-hoa"),
      changeFrequency: "monthly",
      priority: 0.95,
      lastModified: new Date("2026-08-02"),
    },
    {
      url: withTrailingSlash("/hoc-hoa-quan-9"),
      changeFrequency: "monthly",
      priority: 0.9,
      lastModified: new Date("2026-08-02"),
    },
    {
      url: withTrailingSlash("/hoc-hoa-thu-duc"),
      changeFrequency: "monthly",
      priority: 0.9,
      lastModified: new Date("2026-08-02"),
    },
    {
      url: withTrailingSlash("/hoc-hoa-online"),
      changeFrequency: "monthly",
      priority: 0.9,
      lastModified: new Date("2026-08-02"),
    },
    {
      url: withTrailingSlash("/mat-goc-hoa"),
      changeFrequency: "monthly",
      priority: 0.9,
      lastModified: new Date("2026-08-02"),
    },
    {
      url: withTrailingSlash("/blog"),
      changeFrequency: "weekly",
      priority: 0.85,
      lastModified: new Date("2026-07-30"),
    },
    {
      url: withTrailingSlash("/feedback"),
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: new Date("2026-07-28"),
    },
    {
      url: `${SITE_URL}/lay-goc-hoa/`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date("2026-07-25"),
    },
    ...blogPosts.map((path) => ({
      url: withTrailingSlash(path),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      lastModified: new Date("2026-07-20"),
    })),
  ];
}
