import { BUSINESS_ADDRESS, CONTACT_PHONE, SAME_AS, SITE_NAME, SITE_TAGLINE, SITE_URL, TEACHER_NAME, absoluteUrl } from "./seo";

// Mọi hàm dưới đây chỉ dùng dữ liệu đã có thật và đang hiển thị trên giao diện.
// Không thêm rating, offer, địa chỉ đầy đủ hay số liệu chưa được xác nhận.

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "ChamCham Edemy",
    url: SITE_URL,
    slogan: SITE_TAGLINE,
    description:
      "ChamChamEdemy dạy Hóa học và Khoa học tự nhiên cho học sinh THCS–THPT, học trực tiếp tại Quận 9 (TP.HCM) và học online toàn quốc, cùng Cô Lê Thùy Trâm.",
    logo: absoluteUrl("/chamcham-logo-256.webp"),
    image: absoluteUrl("/chamcham-logo-256.webp"),
    telephone: CONTACT_PHONE,
    address: {
      "@type": "PostalAddress",
      ...BUSINESS_ADDRESS,
    },
    areaServed: [
      { "@type": "City", name: "Quận 9, TP. Hồ Chí Minh" },
      { "@type": "City", name: "Thành phố Thủ Đức" },
      { "@type": "AdministrativeArea", name: "Toàn quốc (học online)" },
    ],
    sameAs: SAME_AS,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "vi-VN",
  };
}

export function teacherPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#co-tram`,
    name: TEACHER_NAME,
    jobTitle: "Giáo viên Hóa học",
    worksFor: { "@id": `${SITE_URL}/#organization` },
    description:
      "Giáo viên Hóa học với hơn 4 năm kinh nghiệm giảng dạy THCS–THPT, tốt nghiệp Sư phạm Hóa học tại Đại học Đồng Nai và chứng chỉ liên môn Khoa học tự nhiên tại Đại học Thủ đô Hà Nội.",
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Đại học Đồng Nai" },
      { "@type": "CollegeOrUniversity", name: "Đại học Thủ đô Hà Nội" },
    ],
    image: absoluteUrl("/co-le-thuy-tram-professional.webp"),
  };
}

export function articleSchema(args: {
  headline: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.headline,
    description: args.description,
    image: absoluteUrl(args.image),
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    author: { "@id": `${SITE_URL}/#co-tram` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: absoluteUrl(args.path),
    inLanguage: "vi-VN",
  };
}

export function courseSchema(args: {
  name: string;
  description: string;
  path: string;
  numberOfLessons: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE_URL}${args.path}#course`,
    name: args.name,
    description: args.description,
    url: absoluteUrl(args.path),
    provider: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "vi-VN",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: ["online", "onsite"],
      courseWorkload: `${args.numberOfLessons} bài học`,
    },
  };
}

export function howToSchema(args: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: args.name,
    description: args.description,
    step: args.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
