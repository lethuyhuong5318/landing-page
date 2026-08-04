# QA & Final Testing Checklist

## Browser Compatibility

### Desktop Browsers (macOS/Windows)
- [ ] **Chrome** - Latest 2 versions
- [ ] **Firefox** - Latest 2 versions
- [ ] **Safari** - Latest 2 versions
- [ ] **Edge** - Latest 2 versions

### Mobile Browsers
- [ ] **iOS Safari** - iOS 14+
- [ ] **Chrome Mobile** - Android 8+
- [ ] **Samsung Internet** - Latest version

### Testing Steps
1. Open homepage and lesson pages
2. Test all interactive elements (buttons, modals, menus)
3. Verify animations play smoothly
4. Check responsive layout at each breakpoint
5. Test 3D viewers (if WebGL supported)
6. Verify audio playback

## Responsive Design Testing

### Breakpoints to Test
- [ ] **Mobile** (375×812) - iPhone SE
- [ ] **Mobile Large** (480×812) - Pixel 4a
- [ ] **Tablet** (768×1024) - iPad
- [ ] **Desktop** (1280×800) - Laptop
- [ ] **Desktop Large** (1920×1080) - Large monitor

### Mobile Testing
- [ ] Touch interactions responsive (no hover states)
- [ ] 44px+ touch targets working
- [ ] Mobile menu opens/closes smoothly
- [ ] Bottom sheet navigation works
- [ ] Viewport meta tags correct
- [ ] No horizontal scrolling

### Tablet Testing
- [ ] Sidebar visible and functional
- [ ] Responsive columns adjust properly
- [ ] Touch and mouse both work
- [ ] Spacing appropriate for medium screens

### Desktop Testing
- [ ] Sticky header positions correctly
- [ ] Sidebar doesn't overlap content
- [ ] Hover states work on all interactive elements
- [ ] Wide screens show full content without scrolling

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab order logical and visible
- [ ] All interactive elements focusable
- [ ] Escape key closes modals
- [ ] Focus trap works in modals
- [ ] No keyboard traps

### Screen Reader Testing (NVDA/JAWS)
- [ ] Page structure announced correctly
- [ ] Heading hierarchy proper (h1→h2→h3)
- [ ] Form labels associated with inputs
- [ ] ARIA labels present on interactive elements
- [ ] Progress bar reads correctly
- [ ] Modal title announced

### Color & Contrast
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Heading contrast meets WCAG AAA (7:1)
- [ ] Color not sole indicator of state
- [ ] Focus indicators clearly visible

### Reduced Motion
- [ ] All animations respect prefers-reduced-motion
- [ ] Animations disabled in settings
- [ ] Page remains functional without motion
- [ ] No 'jank' on disable toggle

## Performance Testing

### Lighthouse Audit
- [ ] Performance: 85+
- [ ] Accessibility: 95+
- [ ] Best Practices: 90+
- [ ] SEO: 95+

### Core Web Vitals
- [ ] **LCP** (Largest Contentful Paint): <2.5s
- [ ] **FID** (First Input Delay): <100ms
- [ ] **CLS** (Cumulative Layout Shift): <0.1

### Network Testing
- [ ] Fast 3G connection testing
- [ ] 4G connection testing
- [ ] Offline behavior (if applicable)
- [ ] Asset loading order correct

### Browser DevTools
- [ ] No console errors
- [ ] No console warnings
- [ ] No unused CSS
- [ ] No memory leaks (heap snapshot)
- [ ] Performance timeline smooth (60fps)

## Feature Testing

### Learning Pages
- [ ] Course title displays correctly
- [ ] Progress indicator accurate
- [ ] Sidebar shows all lessons
- [ ] Active lesson highlighted
- [ ] Navigation buttons enable/disable properly
- [ ] Reading progress bar works
- [ ] Section reveals animate correctly

### Interactive Components
- [ ] Audio plays/mutes correctly
- [ ] Sound toggle saves preference
- [ ] Focus mode toggles
- [ ] Modal opens/closes smoothly
- [ ] Modal focus trap works
- [ ] Element details display in modal

### 3D Viewers
- [ ] Atomic lab viewer loads
- [ ] Displacement lab viewer loads
- [ ] Chemistry miner viewer loads
- [ ] Virtual lab loads
- [ ] Viewers respond to interactions
- [ ] Fallback displays on unsupported browsers

### Animations
- [ ] Hover effects smooth (60fps)
- [ ] Click effects immediate
- [ ] Section reveals stagger
- [ ] Progress bar fills smoothly
- [ ] Modal slide-up animation works
- [ ] No jank or stuttering

## Visual Testing

### Design Consistency
- [ ] Colors match design system
- [ ] Typography follows spec
- [ ] Spacing follows scale (4px units)
- [ ] Border radius consistent
- [ ] Shadows at correct depth

### Layout Verification
- [ ] Content centered and aligned
- [ ] Padding/margins consistent
- [ ] Cards properly sized
- [ ] Images responsive
- [ ] No layout shift on load
- [ ] Sticky elements don't obscure content

### Dark Mode (if applicable)
- [ ] Colors invert properly
- [ ] Contrast maintained
- [ ] All elements visible
- [ ] No hardcoded colors break theme

## Content Testing

### Text Content
- [ ] No typos or grammar errors
- [ ] Vietnamese text renders correctly
- [ ] Diacritical marks display properly
- [ ] Links working and correct
- [ ] External links open in new tab

### Images
- [ ] All images load correctly
- [ ] Alt text present and descriptive
- [ ] Image dimensions correct
- [ ] No stretched/distorted images
- [ ] Loading states visible

### Metadata
- [ ] Page title correct
- [ ] Meta description present
- [ ] Open Graph tags present
- [ ] Favicon displays

## Cross-Device Testing Checklist

### Test Devices
- [ ] iPhone 12/13
- [ ] Samsung Galaxy A12
- [ ] iPad Air
- [ ] iPad Mini
- [ ] MacBook
- [ ] Windows Laptop

### Touch Interaction
- [ ] All buttons respond to touch
- [ ] Menu opens on first tap
- [ ] No "hover on first tap" behavior
- [ ] Swipe/gesture if applicable

## Audio Testing

### Sound Functionality
- [ ] Sound plays on click
- [ ] Sound plays on completion
- [ ] Mute button works
- [ ] Sound persists after page reload
- [ ] Volume control works (if present)
- [ ] prefers-reduced-motion disables sound

### Browser Audio Policies
- [ ] iOS: Sound plays after user interaction
- [ ] Android: Sound plays as expected
- [ ] Desktop: Sound plays without restrictions

## Build & Deployment

### Build Process
- [ ] `npm run build` completes without errors
- [ ] No console errors during build
- [ ] File sizes within targets
- [ ] Source maps generated (dev only)

### Production Deployment
- [ ] Staging deployment successful
- [ ] Production deployment successful
- [ ] Environment variables set correctly
- [ ] Database migrations applied (if any)
- [ ] Cache headers correct
- [ ] CDN cache purged

## Regression Testing

### Existing Features
- [ ] Homepage loads without errors
- [ ] Blog pages work correctly
- [ ] Previous lesson pages still function
- [ ] Learning components still display
- [ ] No broken links

### Previous Bug Fixes
- [ ] Modal stays centered on mobile ✅
- [ ] Touch targets 44px+ ✅
- [ ] Keyboard navigation works ✅
- [ ] Focus management correct ✅
- [ ] Animations smooth ✅

## Final Sign-Off

- [ ] All critical tests passed
- [ ] No P1 issues remaining
- [ ] No P2 issues blocking ship
- [ ] Performance targets met
- [ ] Accessibility standards met
- [ ] Mobile experience polished
- [ ] Cross-browser tested
- [ ] Ready for production

## Notes

**Test Date**: ___________
**Tester**: ___________
**Issues Found**: 
- [ ] None
- [ ] Fixed
- [ ] Deferred

**Final Status**: ___READY FOR SHIP___
