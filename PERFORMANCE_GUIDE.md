# Performance & Animation Optimization Guide

## Rendering Performance

### GPU-Accelerated Properties
Always animate these properties for 60fps performance:
- `transform` (translate, rotate, scale)
- `opacity`
- `filter`

### Avoid Expensive Animations
Don't animate (causes reflow/repaint):
- ❌ `top`, `left`, `bottom`, `right` (use `transform: translate()`)
- ❌ `width`, `height` (use `transform: scale()`)
- ❌ `background-color` (use `opacity` overlay instead)
- ❌ `box-shadow` (transition on hover only if needed)

### Current Implementations
✅ Reading progress: `scaleX()` transform
✅ Section reveals: `translateY()` + `opacity`
✅ Button hover: `translateY(-2px)` + shadow
✅ Link indent: Padding change (acceptable for non-frequent)

## Animation Durations

### Recommended Ranges
- **Micro**: 100-150ms (hover states, clicks)
- **Short**: 200-300ms (page transitions, reveals)
- **Standard**: 300-500ms (major animations)
- **Long**: 500ms+ (only for attention-grabbing)

### Current Implementation
```css
--duration-fast: 150ms        /* Hover effects */
--duration-base: 200ms        /* Standard transitions */
--duration-normal: 240ms      /* UI animations */
--duration-slow: 320ms        /* Slow reveals */
--duration-slower: 480ms      /* Section cascades */
--duration-slowest: 640ms     /* Long animations */
```

### Stagger Timing
For cascading animations:
```css
.item:nth-child(1) { transition-delay: 0ms; }
.item:nth-child(2) { transition-delay: 150ms; }
.item:nth-child(3) { transition-delay: 300ms; }
.item:nth-child(4) { transition-delay: 450ms; }
/* Max 4-5 items; beyond that use same delay */
```

## Easing Functions

### Performance-Optimized Easings
- **ease-out**: `cubic-bezier(0, 0, 0.2, 1)` - **Primary for UI**
  - Natural deceleration, feels responsive
  - Best for entering animations
  
- **ease-in-out**: `cubic-bezier(0.4, 0, 0.2, 1)` - Smooth transitions
  - Balanced acceleration/deceleration
  - Use for page transitions

- **ease-in**: `cubic-bezier(0.4, 0, 1, 1)` - Exiting animations
  - Accelerates then exits
  - Use sparingly

### Avoid
- ❌ `ease` (too bouncy, unnatural)
- ❌ `ease-in-out` for everything (overused)
- ❌ Complex curves for simple transitions

## React Performance Optimization

### Code Splitting
```tsx
// Dynamic imports for heavy libraries
import dynamic from 'next/dynamic';

const AtomicLabViewer = dynamic(
  () => import('@/components/learning/AtomicLabViewer'),
  { loading: () => <SkeletonLoader /> }
);
```

### Memoization
```tsx
// Prevent unnecessary re-renders
const Component = React.memo(({ prop }) => {
  return <div>{prop}</div>;
}, (prev, next) => prev.prop === next.prop);
```

### useCallback for Event Handlers
```tsx
const handleClick = useCallback(() => {
  // Only recreated when dependencies change
}, [dependency]);
```

### Suspense for Async Components
```tsx
<Suspense fallback={<LoadingUI />}>
  <AsyncComponent />
</Suspense>
```

## Browser APIs for Performance

### requestAnimationFrame
For smooth scroll/resize handlers:
```tsx
useEffect(() => {
  let frameId: number;
  
  const handleScroll = () => {
    frameId = requestAnimationFrame(() => {
      // Update state here
    });
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

### Intersection Observer
For lazy loading and animations:
```tsx
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    // Trigger animation
  }
}, { threshold: 0.1 });

observer.observe(element);
```

### will-change (Use Sparingly!)
```css
/* Only for actively animated elements */
.animated-element {
  will-change: transform, opacity;
}

/* Remove after animation ends */
.animated-element.done {
  will-change: auto;
}
```

## Accessibility & Performance

### prefers-reduced-motion
All animations must respect this:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Current Implementation ✅
- All components use `@media (prefers-reduced-motion: reduce)`
- SoundContext respects audio preferences
- EffectPreferenceContext manages effect levels

## Network Performance

### Bundle Size Targets
- **Main JS**: <50KB gzipped
- **Learning components**: <30KB lazy
- **3D viewers**: <400KB Three.js dynamic
- **Total app**: <150KB gzipped

### Monitoring
```bash
# Check bundle size
npm run build
npx next-bundle-analyzer
```

## Lighthouse Optimization

### Current Score Targets
- **Performance**: 85+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 95+

### Key Optimizations
1. ✅ Image optimization (Next.js Image)
2. ✅ Code splitting (Dynamic imports)
3. ✅ Lazy loading (Suspense, dynamic)
4. ✅ CSS optimization (Tailwind purge)
5. ✅ Font optimization (Google Fonts + swap)
6. ✅ Caching strategy (Cache headers)

### Testing
```bash
# Local lighthouse audit
npm run build
npx lighthouse http://localhost:3000 --view
```

## Animation Checklist

- [ ] Uses `transform` or `opacity`
- [ ] Duration 150-480ms (no >1s)
- [ ] Easing is `ease-out` or `ease-in-out`
- [ ] Respects `prefers-reduced-motion`
- [ ] GPU-accelerated (check DevTools)
- [ ] 60fps on low-end devices (throttle test)
- [ ] No jank/stutter (smooth timeline)
- [ ] Fallback for reduced data mode

## 3D Performance

### Three.js Optimization
- ✅ Device capability detection
- ✅ Quality scaling (high/medium/low)
- ✅ Particle count optimization
- ✅ Anti-aliasing toggle
- ✅ WebGL context management
- ✅ Proper cleanup/disposal

### Canvas 2D
- ✅ Responsive canvas sizing
- ✅ Lazy loading (dynamic import)
- ✅ Error boundary fallback

## Monitoring in Production

### Tools
- **Google Analytics**: Track Core Web Vitals
- **Lighthouse API**: Automated audits
- **Real User Monitoring**: Segment analytics

### Key Metrics to Track
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- TTI (Time to Interactive)
- FCP (First Contentful Paint)

## References

- [Google Web Vitals Guide](https://web.dev/vitals/)
- [MDN Animation Performance](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [React Performance](https://react.dev/reference/react#performance)
- [Next.js Performance Optimization](https://nextjs.org/learn-pages/seo/improve-performance)
