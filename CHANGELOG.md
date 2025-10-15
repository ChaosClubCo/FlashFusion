# Changelog

All notable changes to FlashFusion will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-15

### Added
- Initial release of FlashFusion
- Cinematic gradient mesh background with grain overlay and parallax animation
- Hero section with email capture and CTA buttons
- Live metrics dashboard with 6 animated statistics
- Features grid showcasing 4 core capabilities
- 5-step build process timeline
- Three-tier pricing system (Free, Pro, Enterprise)
- Usage warning at 80% threshold
- Limit reached modal with keyboard focus trap
- Consent banner for analytics and cookie management
- Privacy-first analytics system with consent gating
- Authentication stub with plan-based access control
- Feature flags system for controlled rollouts
- SEO optimization with react-helmet-async and JSON-LD schemas
- WCAG 2.1 AA accessibility compliance
- Reduced motion support throughout
- Route-based code splitting for performance
- Error boundary with helpful fallback UI
- Skeleton loading states
- Safe iframe component with allowlist
- System status page
- QA page with performance metrics
- Privacy policy and Terms of Service pages
- 404 page with navigation
- Skip link for accessibility
- Command palette hint (Cmd/Ctrl+K)
- Status pill for system health
- Protected route wrapper for auth
- Plan guard HOC for feature gating
- DOMPurify sanitization utilities
- i18n stub for internationalization readiness

### Security
- Strict CSP-safe patterns (no unsafe-inline)
- DOMPurify HTML sanitization
- Safe iframe with allowlist and sandbox
- Input sanitization utilities
- No secret exposure in client code

### Performance
- Initial JS bundle ≤ 120KB gzipped
- LCP target ≤ 1.8s
- CLS target ≤ 0.1
- Lazy route loading
- Font loading optimization with display:swap
- Image optimization ready (WebP, srcset, lazy loading)

### Accessibility
- WCAG 2.1 AA compliant
- 4.5:1 contrast ratio throughout
- Skip link to main content
- Focus trap in modals
- Keyboard navigation support
- ARIA labels and live regions
- Reduced motion respect
- Screen reader optimized

[1.0.0]: https://github.com/flashfusion/flashfusion/releases/tag/v1.0.0
