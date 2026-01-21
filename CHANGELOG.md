# Changelog

All notable changes to FocusWaqt are documented here.

## [1.0.0] - 2026-01-21

### Added
- **Focus Heatmap**: GitHub-style heatmap visualization for tracking focus sessions
- **Streak Tracking**: Daily study streak counter with current and longest streak display
- **Rate Limiting**: Supabase-based rate limiting for authentication and API endpoints
- **XSS Protection**: DOMPurify integration for input sanitization
- **Error Boundaries**: React error boundaries for graceful error handling
- **Unit Tests**: Vitest + React Testing Library setup with tests for timerStore, StreakCounter, and utils
- **Accessibility**: Comprehensive ARIA labels and keyboard navigation support
- **Loading States**: Visual loading indicators for background picker and video components
- **Media Manifest**: Documented media asset inventory in `public/MEDIA_MANIFEST.md`

### Security
- **OAuth Redirect Validation**: Whitelist-based redirect URL validation
- **Content Security Policy**: Next.js security headers configuration
- **Input Length Validation**: Character limits on user inputs
- **Rate Limiting**: IP-based rate limiting on auth endpoints (5 req/min) and streak updates (60 req/min)

### Changed
- Simplified authentication UI: Replaced CubeLogin with SimpleLogin component
- Updated default background from 'flowers' to 'catt' (valid video entry)
- Consolidated background selection to use `setCurrentBackground` only
- Replaced Coffee icon with Moon icon for Night audio track

### Removed
- `CubeLogin.tsx` and `CubeLogin.module.css` - replaced with SimpleLogin
- `BackgroundSwitcher.tsx` - unused component
- `TaskInput.tsx` - unused component
- `currentVideoId` property from appStore (consolidated with `currentBackgroundId`)
- All console.log and console.error statements for production readiness
- Unused SVG files (file.svg, globe.svg, window.svg)
- Unused Coffee icon import from SoundMixer

### Fixed
- TypeScript compilation errors across the codebase
- ESLint warnings and errors
- Video file size optimization (reduced from 8.7MB to 1.3MB)

### Documentation
- Created `SECURITY_FIXES.md` - security implementation details
- Created `DEPLOYMENT_CHECKLIST.md` - pre-deployment verification steps
- Created `TEST_REPORT.md` - test coverage report
- Updated `supabase_heatmap_schema.sql` with profiles table schema

## [0.1.0] - 2025-12-28

### Added
- Initial application scaffold with Next.js 15
- Pomodoro timer with focus/break modes
- Video and image background picker
- Ambient sound mixer with multiple tracks
- YouTube music player integration
- Task management with Supabase backend
- User authentication with GitHub and Google OAuth
- Quote widget for motivation
- Full-screen mode support
