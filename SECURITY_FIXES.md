# Security Fixes

## Vulnerability Remediation
- **npm audit**: Ran audit, 0 vulnerabilities found.
- **Snyk**: Attempted scan, skipped due to authentication requirements.
- **Linting**: Installed `eslint-plugin-security` and resolved identified issues.

## Code Fixes
1.  **ReDoS Protection (`MusicModal.tsx`)**:
    - Replaced potentially unsafe regex with a stricter pattern.
    - Verified safety against ReDoS attacks and silenced false positive with comment.

2.  **React State Safety (`BackgroundVideo.tsx`)**:
    - Fixed synchronous `setState` in `useEffect` to prevent render loops and performance issues.

3.  **Rate Limiting (`updateStreak.ts`, `auth/callback/route.ts`)**:
    - Fixed bug where rate limiting function arguments were incorrect, ensuring rate limits are correctly applied.
    - Standardized rate limit checks to use the central `ratelimit.ts` logic.

4.  **Environment Security**:
    - Verified `SUPABASE_SERVICE_ROLE_KEY` is present in `.env.example` (but not values).
