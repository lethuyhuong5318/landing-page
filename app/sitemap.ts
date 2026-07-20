import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://chamchamedemy.tranthanhhanek.chatgpt.site";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/feedback`, changeFrequency: "monthly", priority: .8 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: .9 },
    { url: `${base}/blog/cach-can-bang-phuong-trinh-hoa-hoc`, changeFrequency: "monthly", priority: .8 },
    { url: `${base}/blog/bai-toan-nong-do-dung-dich`, changeFrequency: "monthly", priority: .8 },
    { url: `${base}/blog/lo-trinh-lay-goc-hoa-thcs-vao-10`, changeFrequency: "monthly", priority: .8 },
  ];
}
