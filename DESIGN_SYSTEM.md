# ChamChamEdemy Design System

## Color Palette

### Primary Colors
- **Primary**: `#0F4C81` - Brand blue, buttons, active states
- **Primary Hover**: `#0B3B65` - Hover state
- **Primary Active**: `#082A48` - Active state
- **Secondary**: `#22A6A1` - Teal, gradients, accents
- **Accent**: `#F6B73C` - Golden yellow, highlights, focus

### Semantic Colors
- **Success**: `#159A64` - Completion, success states (green)
- **Danger**: `#C94A4A` - Errors, destructive actions (red)
- **Warning**: `#E89B3C` - Warnings (orange)
- **Info**: `#0B9BD0` - Information (cyan)

### Neutral Scale
- **Background**: `#F7FAFC` - Page background
- **Surface**: `#FFFFFF` - Card background, modals
- **Surface Variant**: `#F2F5F8` - Hover backgrounds
- **Border**: `#D9E4EC` - Borders, dividers
- **Text Primary**: `#102A43` - Body text
- **Text Secondary**: `#627D98` - Secondary text
- **Text Tertiary**: `#89A0B3` - Subtle text
- **Text Inverse**: `#FFFFFF` - On dark backgrounds

### Dark Mode
- **Background**: `#0A1628`
- **Surface**: `#0F1B2E`
- **Surface Variant**: `#142844`
- **Text Primary**: `#E8F1F8`
- **Text Secondary**: `#A7BDD4`

## Typography

### Font Families
- **Base**: 'Be Vietnam Pro' - Body text, general UI
- **Heading**: 'Baloo 2' - Titles, headings
- **Cursive**: 'Patrick Hand' - Tagline, decorative

### Font Weights
- Regular (400): Body text
- Medium (500): Labels, subtle emphasis
- Semibold (600): Subheadings, labels
- Bold (700): Headings, strong emphasis
- Extrabold (800): Large titles

### Font Sizes
| Size | Value | Usage |
|------|-------|-------|
| xs | 11px | Small labels |
| sm | 12px | Captions |
| base | 15px | Body text (desktop) |
| lg | 16px | Body text (mobile), emphasized |
| xl | 18px | Subheadings |
| 2xl | 20px | Section titles |
| 3xl | 24px | Page titles |
| 4xl | 28px | Hero titles |
| 5xl | 32px | Large hero |

### Line Heights
- **Tight**: 1.25 - Headings
- **Normal**: 1.5 - Default UI
- **Relaxed**: 1.65 - Body text
- **Loose**: 1.75 - Mobile body text

## Spacing Scale

All spacing follows 4px base unit:
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- 2xl: 24px
- 3xl: 32px
- 4xl: 40px
- 5xl: 48px
- 6xl: 64px
- 7xl: 80px

## Border Radius

- sm: 8px - Small elements
- md: 12px - Cards, buttons
- lg: 16px - Larger elements
- xl: 20px - Modal headers
- 2xl: 24px - Large modals
- full: 9999px - Pills, circles

## Shadows

### Shadow Scale
- xs: `0 1px 2px rgba(15, 76, 129, 0.05)`
- sm: `0 2px 4px rgba(15, 76, 129, 0.08)`
- base: `0 4px 8px rgba(15, 76, 129, 0.10), 0 1px 2px rgba(15, 76, 129, 0.06)`
- md: `0 6px 16px rgba(15, 76, 129, 0.12), 0 2px 4px rgba(15, 76, 129, 0.08)`
- lg: `0 8px 24px rgba(15, 76, 129, 0.14), 0 2px 6px rgba(15, 76, 129, 0.10)`
- xl: `0 12px 32px rgba(15, 76, 129, 0.16), 0 3px 8px rgba(15, 76, 129, 0.12)`
- 2xl: `0 16px 40px rgba(15, 76, 129, 0.18), 0 4px 12px rgba(15, 76, 129, 0.14)`

## Animation

### Durations
- fast: 150ms
- base: 200ms
- normal: 240ms
- slow: 320ms
- slower: 480ms
- slowest: 640ms

### Easing Functions
- linear: `linear`
- ease-in: `cubic-bezier(0.4, 0, 1, 1)`
- ease-out: `cubic-bezier(0, 0, 0.2, 1)` - **Default for interactions**
- ease-in-out: `cubic-bezier(0.4, 0, 0.2, 1)`
- standard: `cubic-bezier(0.2, 0, 0, 1)`
- emphasized: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- bounce: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`

### Common Animations
- **Fade**: Opacity 0→1 (150-240ms)
- **Slide Up**: translateY 20px→0 with fade (240ms)
- **Slide Down**: translateY -8px→0 with fade (240ms)
- **Scale**: scale 0.98→1 for interactions (150ms)
- **Lift**: translateY -2px on hover, shadow enhancement
- **Stagger**: nth-child delays for cascading reveals

## Responsive Breakpoints

| Breakpoint | Size | Device | Usage |
|-----------|------|--------|-------|
| xs | 320px | Small mobile | Minimum support |
| sm | 480px | Mobile | Small phones |
| md | 768px | Tablet | Tablet devices |
| lg | 1024px | Desktop | Desktop + sidebar |
| xl | 1280px | Wide | Large desktop |
| 2xl | 1536px | Ultra-wide | Full width support |

### Key Breakpoint Patterns
- **< 480px**: Single column, optimized touch targets (48px+)
- **480-768px**: Mobile-optimized layouts
- **768-1024px**: Tablet responsive
- **1024px+**: Desktop sidebar layout introduced
- **1180px container max-width**: Main layout constraint
- **270px sidebar width**: Desktop sidebar
- **820px main content max-width**: Reading optimized

## Z-Index Scale

- dropdown: 100 - Dropdown menus
- sticky: 20 - Sticky headers
- overlay: 150 - Overlay backgrounds
- modal: 200 - Modal dialogs
- notification: 250 - Notifications
- tooltip: 300 - Tooltips

## Touch Targets

All interactive elements minimum:
- **Height**: 44px
- **Width**: 44px
- **Minimum padding**: 12px (md spacing)

Examples:
- Buttons: 44x44px or more
- Links in navigation: 44px min-height
- Mobile menu items: 44px min-height with 16px padding

## Accessibility

### Focus States
- **Focus outline**: 3px solid accent color
- **Outline offset**: 2px external, -3px internal for modals
- **Border radius**: 2-8px

### Color Contrast
- **AAA compliance**: All text pairs meet 7:1 ratio where possible
- **AA compliance**: Minimum 4.5:1 for all interactive elements
- **High contrast mode**: Enhanced colors for vision-impaired

### Reduced Motion
- All animations disabled when `prefers-reduced-motion: reduce`
- Transition durations set to 0ms
- Easing functions set to `linear`
- Transforms remain but instant

### Semantic HTML
- Proper heading hierarchy (h1 > h2 > h3)
- ARIA labels on interactive elements
- ARIA progressbar for progress indicators
- ARIA modal for dialogs
- Focus management in modals (focus trap)

## Component Examples

### Buttons
- **Desktop**: 44px height, 16px padding, 12px border-radius
- **Mobile**: 48px height, 12px padding, 8px border-radius
- **Touch**: Minimum 44x44px interaction area

### Cards
- **Padding**: 24px (3xl) desktop, 16px (lg) mobile
- **Border-radius**: 12px (md)
- **Shadow**: md level on hover
- **Hover effect**: translateY(-2px), shadow upgrade

### Modals
- **Max-width**: 500px (desktop), 100% (mobile)
- **Max-height**: 90vh (desktop), 85vh (mobile)
- **Border-radius**: 20px (xl) top/bottom, 0 on mobile
- **Header gradient**: Primary → Primary Hover (135deg)
- **Focus trap**: Tab cycles within modal
- **Animations**: slideUp 240ms ease-out

### Progress Indicators
- **Height**: 4px (sticky bar), 6px (card progress)
- **Fill animation**: scaleX transform, 200ms ease-out
- **Gradient**: Accent → Secondary (90deg)

## Implementation Notes

1. **CSS Variables**: All values stored in `app/styles/design-tokens.css`
2. **Mobile-first**: Start mobile, progressively enhance
3. **Prefers-reduced-motion**: Always respect accessibility preferences
4. **Device detection**: Optimize quality based on device capabilities
5. **Performance**: Use GPU-accelerated properties (transform, opacity)
6. **Browser support**: Modern browsers (ES2020+)

## References

- **Global styles**: `app/globals.css`
- **Design tokens**: `app/styles/design-tokens.css`
- **Learning layout**: `app/styles/learning-lesson.css`
- **Component modules**: `app/components/learning/*.module.css`
