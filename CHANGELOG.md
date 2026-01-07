# Changelog

## [1.0.1] - 2026-01-08

### Security
- Added `eslint-plugin-security` to linting pipeline.
- Fixed synchronous state update in `BackgroundVideo.tsx`.
- Improved regex safety in `MusicModal.tsx`.
- Fixed rate limiting logic and types in `updateStreak.ts` and `auth/callback/route.ts`.
- Enforced `const` usage where appropriate.

### Configuration
- Updated `.env.example` with `SUPABASE_SERVICE_ROLE_KEY`.
