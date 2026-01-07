# Deployment Checklist

## Pre-Deployment
- [ ] **Environment Variables**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in production environment variables.
- [ ] **Build**: Run `npm run build` to verify no compilation errors.
- [ ] **Lint**: Run `npm run lint` to ensure code quality.

## Post-Deployment
- [ ] Verify `BackgroundVideo` plays correctly without error loop.
- [ ] Test `MusicModal` URL input with valid/invalid URLs.
- [ ] Verify Rate Limiting on Streak updates is active.
