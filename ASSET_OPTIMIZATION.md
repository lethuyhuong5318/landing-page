# Asset Optimization Guide

## Image Optimization Checklist

### Current Status (Audit 2026-08-02)
- Logo: 4.4 MiB PNG → 13.7 KiB WebP (99.7% reduction)
- Teacher photo: 1.8 KiB PNG → 39.8 KiB WebP (97.8% reduction)
- Mascot: 275 KiB JPG → 61.8 KiB WebP (77.5% reduction)

### Next.js Image Component
All images must use Next.js `Image` component for:
- ✅ Automatic format selection (WebP/AVIF)
- ✅ Responsive image sizing
- ✅ Lazy loading by default
- ✅ Async decoding

**Pattern:**
```tsx
import Image from 'next/image';

<Image
  src="/path/to/image.webp"
  alt="Descriptive alt text"
  width={1920}
  height={1080}
  priority={false}
  loading="lazy"
  decoding="async"
/>
```

### Image Formats
1. **WebP** (Primary) - Modern format, ~30% smaller
2. **JPG** (Fallback) - For older browsers
3. **AVIF** (Future) - Even smaller, limited support

### Image Sizes
- **Hero images**: Max 2000px width
- **Thumbnails**: Max 400px width
- **Icons**: 48px - 128px (SVG preferred)
- **Logos**: 256px - 512px

### Lazy Loading
```tsx
// Below-the-fold content
<Image loading="lazy" />

// Above-the-fold, visible immediately
<Image priority={true} />
```

### Responsive Images
```tsx
// Use srcSet via Image component
<Image
  src="/image.webp"
  alt="Responsive image"
  width={1920}
  height={1080}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## Asset Delivery

### Cache Headers (_headers file)
```
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=2592000, stale-while-revalidate=604800

/static/*
  Cache-Control: public, max-age=2592000, stale-while-revalidate=604800

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

### Key Recommendations
1. **Immutable static**: `/styles`, `/scripts`, images with hash
2. **Revalidate regularly**: HTML, dynamic content
3. **CDN caching**: 30 days with stale-while-revalidate
4. **Browser caching**: 1 year for versioned assets

## Performance Optimizations

### Already Implemented
- ✅ Image optimization in build
- ✅ Lazy loading on all off-screen images
- ✅ Responsive image sizing
- ✅ Async decoding on images
- ✅ WebP format with JPG fallback
- ✅ Content-visibility for off-screen sections

### Next Steps
1. Convert all JPG/PNG to WebP
2. Add AVIF format for cutting-edge browsers
3. Generate responsive srcSet for all images
4. Implement blur placeholder for fade-in effect
5. Add bandwidth-aware image sizing

## JavaScript Bundle

### Code Splitting Strategy
- Main app: ~50KB (gzipped)
- Learning components: ~30KB (lazy loaded)
- 3D viewers: ~400KB Three.js (dynamic import)
- Charts: Dynamic import on demand

### Bundle Analysis
```bash
npm run build
npx next-bundle-analyzer
```

### Optimization Techniques
1. **Dynamic imports** for heavy libraries (Three.js)
2. **Tree shaking** for unused code
3. **Minification** in production builds
4. **Compression** with gzip/brotli

## CSS Optimization

### Current Approach
- Tailwind CSS 4.2.1 with PostCSS
- CSS modules for component styles
- Global base styles in `globals.css`
- Design tokens in `design-tokens.css`

### Size Targets
- Global CSS: ~20KB (gzipped)
- Component CSS modules: Inlined per route
- Total CSS: <100KB gzipped

## Monitoring

### Lighthouse Targets
- **Performance**: 85+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 95+

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Tools
- Google PageSpeed Insights
- WebPageTest
- Bundle Analyzer
- Chrome DevTools Performance tab

## Checklist for New Assets

- [ ] Compress image to <500KB
- [ ] Convert to WebP format
- [ ] Add JPG fallback
- [ ] Set appropriate width/height
- [ ] Add descriptive alt text
- [ ] Use Next.js Image component
- [ ] Set loading="lazy" for below-fold
- [ ] Test on mobile (3G throttle)
- [ ] Verify Lighthouse impact
- [ ] Update cache headers if new format

## References

- [Next.js Image Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/images)
- [Web Performance Working Group](https://www.w3.org/webperf/)
- [Core Web Vitals Guide](https://web.dev/vitals/)
