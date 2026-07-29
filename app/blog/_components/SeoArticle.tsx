import "./article-seo.css";
import type { ReactNode } from "react";
import SiteChrome from "../../components/SiteChrome";
import JsonLd from "../../../components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "../../../lib/schema";
import { getAssetPath } from "../../basePath";

type Faq = { question: string; answer: string };
type Link = { href: string; label: string };

function faqSchema(items: Faq[]) {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };
}

export default function SeoArticle({
  title, description, path, image, imageAlt, kicker, readingTime,
  quickAnswer, summary, toc, children, faqs, links, cta,
}: {
  title: string; description: string; path: string; image: string; imageAlt: string;
  kicker: string; readingTime: string; quickAnswer: ReactNode; summary: string[];
  toc: Array<{ id: string; label: string }>; children: ReactNode; faqs: Faq[];
  links: Link[]; cta: { title: string; text: string; href: string; label: string };
}) {
  const published = "2026-07-30";
  return (
    <SiteChrome>
      <JsonLd data={articleSchema({ headline: title, description, path, image, datePublished: published, dateModified: published })} />
      <JsonLd data={breadcrumbSchema([{ name: "Trang chủ", path: "/" }, { name: "Blog Hóa", path: "/blog" }, { name: title, path }])} />
      <JsonLd data={faqSchema(faqs)} />
      <article className="article-wrap">
        <p className="section-kicker">{kicker}</p><h1>{title}</h1>
        <p className="article-lead">{description}</p>
        <p className="article-byline">Biên soạn bởi Cô Trâm – ChamChamEdemy · Cập nhật 30/07/2026 · {readingTime}</p>
        <img className="cover" src={getAssetPath(image)} alt={imageAlt} />
        <div className="article-body">
          <section className="answer-box"><h2 id="tra-loi-nhanh">Trả lời nhanh</h2>{quickAnswer}</section>
          <section className="quick-summary"><h2 id="tom-tat-nhanh">Tóm tắt nhanh</h2><ul>{summary.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <nav className="article-toc" aria-label="Mục lục bài viết"><strong>Mục lục</strong><ol>{toc.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}</ol></nav>
          {children}
          <section className="related-reading"><h2 id="bai-lien-quan">Bài học liên quan</h2><ul>{links.map((link) => <li key={link.href}><a href={getAssetPath(link.href)}>{link.label}</a></li>)}</ul></section>
          <section className="article-faq"><h2 id="cau-hoi-thuong-gap">Câu hỏi thường gặp</h2>{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
          <aside className="article-cta"><h2>{cta.title}</h2><p>{cta.text}</p><a className="button button-primary" href={getAssetPath(cta.href)}>{cta.label}</a></aside>
          <p className="article-source"><strong>Nguồn biên soạn:</strong> Chương trình Giáo dục phổ thông 2018 và sách giáo khoa Khoa học tự nhiên/Hóa học đang sử dụng tại trường. Em nên đối chiếu thuật ngữ và phạm vi với bộ sách của mình.</p>
        </div>
      </article>
    </SiteChrome>
  );
}
