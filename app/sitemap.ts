import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/seo";

export const dynamic = "force-static";

const layGocHoaLessons = [
  "/lay-goc-hoa/nen-tang-hoa-hoc-6-7",
  "/lay-goc-hoa/cong-thuc-hoa-hoc",
  "/lay-goc-hoa/hoa-tri",
  "/lay-goc-hoa/bang-tuan-hoan",
  "/lay-goc-hoa/phan-ung-va-phuong-trinh-hoa-hoc",
  "/lay-goc-hoa/tan-ph-quy-tim",
  "/lay-goc-hoa/day-hoat-dong-khi-ket-tua",
  "/lay-goc-hoa/hoa-hoc-huu-co-co-ban",
  "/lay-goc-hoa/danh-phap-iupac",
  "/lay-goc-hoa/phan-tu-khoi",
  "/lay-goc-hoa/bai-tap-lay-goc-hoa",
];

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
  "/blog/hoc-hoa-online-co-hieu-qua-khong",
  "/blog/mat-goc-hoa-9-thi-vao-10-phai-lam-sao",
  "/blog/hoa-10-nen-bat-dau-hoc-tu-dau",
  "/blog/nen-hoc-gia-su-hoa-hay-trung-tam",
  "/blog/hoc-hoa-thu-duc-nen-chon-lop-nao",
  "/blog/hoa-tri-la-gi-hoc-the-nao-cho-de-nho",
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
      url: withTrailingSlash("/chem-mining"),
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: new Date("2026-08-06"),
    },
    {
      url: withTrailingSlash("/chemistry-simulation"),
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: new Date("2026-08-06"),
    },
    {
      url: `${SITE_URL}/lay-goc-hoa/`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date("2026-07-25"),
    },
    ...layGocHoaLessons.map((path) => ({
      url: withTrailingSlash(path),
      changeFrequency: "monthly" as const,
      priority: 0.85,
      lastModified: new Date("2026-08-06"),
    })),
    ...blogPosts.map((path) => ({
      url: withTrailingSlash(path),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      lastModified: new Date("2026-07-20"),
    })),
  ];
}
