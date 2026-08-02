import Script from "next/script";

const GA4_ID = process.env.NEXT_PUBLIC_GA_ID ?? process.env.NEXT_PUBLIC_GA4_ID;
const isValidGa4Id = typeof GA4_ID === "string" && /^G-[A-Z0-9]{6,}$/i.test(GA4_ID) && GA4_ID !== "G-XXXXXXXXXX";

export default function Analytics() {
  if (!isValidGa4Id) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Analytics] NEXT_PUBLIC_GA_ID chưa hợp lệ; gtag.js sẽ không được tải.");
    }
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="lazyOnload"
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}', {
              page_path: window.location.pathname,
              page_title: document.title,
            });
          `,
        }}
      />
    </>
  );
}
