# Security Fixes Documentation

This document outlines all security features and fixes implemented in FocusWaqt.

## Overview

FocusWaqt implements multiple layers of security to protect user data and prevent common web vulnerabilities.

---

## 1. Rate Limiting

### Implementation
- **File**: `src/lib/ratelimit.ts`
- **Database**: Supabase `rate_limits` table with Service Role Key bypass

### Endpoints Protected
| Endpoint | Limit | Window |
|----------|-------|--------|
| Authentication | 5 requests | 1 minute |
| Streak Updates | 60 requests | 1 minute |

### Behavior
- Uses IP-based tracking
- Fails open (allows request) if database unavailable
- Silent failure without logging sensitive information

---

## 2. XSS Protection

### Implementation
- **Library**: DOMPurify
- **Components Protected**: QuoteWidget, TaskModal

### Sanitization
All user inputs are sanitized before:
- Storing in database
- Rendering in the DOM
- Displaying in UI components

---

## 3. OAuth Security

### Redirect URL Validation
- **File**: `src/constants.ts` - `ALLOWED_ORIGINS`
- **File**: `src/components/SimpleLogin.tsx` - `getSafeRedirectOrigin()`

### Allowed Origins
```typescript
export const ALLOWED_ORIGINS = [
  'https://focuswaqt.vercel.app',
  'https://www.focuswaqt.com',
  'http://localhost:3000',
  'http://localhost:3001',
] as const;
```

### Protection Against
- Open redirect attacks
- Malicious redirect injection

---

## 4. Content Security Policy

### Implementation
- **File**: `next.config.ts`

### Headers Configured
| Header | Value |
|--------|-------|
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | Restricted browser features |

---

## 5. Input Validation

### Character Limits
- **File**: `src/constants.ts`

```typescript
export const TASK_MAX_LENGTH = 200;
export const QUOTE_MAX_LENGTH = 300;
```

### Components Using Validation
- TaskModal - task title input
- QuoteWidget - custom quote input
- MusicModal - YouTube URL input

---

## 6. Row Level Security (RLS)

### Tables with RLS Enabled
1. **daily_focus** - Focus session data
2. **profiles** - User streak information
3. **tasks** - User tasks
4. **rate_limits** - Rate limiting data

### Policy Pattern
- Users can only SELECT/INSERT/UPDATE their own data
- `auth.uid() = user_id` check on all operations

---

## 7. Error Handling

### Error Boundaries
- **File**: `src/components/ErrorBoundary.tsx`
- Wraps entire application in `layout.tsx`
- Graceful error recovery without exposing sensitive information

### Silent Failure
- No console.log/console.error in production code
- Error details returned in structured response objects
- User-friendly error messages

---

## 8. Environment Variables

### Required Secrets
```
NEXT_PUBLIC_SUPABASE_URL     # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Public anon key
SUPABASE_SERVICE_ROLE_KEY    # Server-side only (never exposed to client)
```

### Security Notes
- Service Role Key used only in server actions
- Anon Key has limited permissions via RLS
- All secrets stored in `.env.local` (gitignored)

---

## Database Schema (Rate Limits)

```sql
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX idx_rate_limits_reset_at ON rate_limits(reset_at);
```

---

## Security Checklist

- [x] Rate limiting on sensitive endpoints
- [x] XSS protection with DOMPurify
- [x] OAuth redirect validation
- [x] Content Security Policy headers
- [x] Input length validation
- [x] Row Level Security on all tables
- [x] Error boundaries for graceful failures
- [x] No sensitive data in logs
- [x] Environment variables for secrets

---

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly by contacting the maintainers directly. Do not create public GitHub issues for security vulnerabilities.

---

**Last Updated**: January 21, 2026
