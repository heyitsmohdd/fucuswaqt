# FocusWaqt Media Assets Manifest

This document catalogs all media assets used in the FocusWaqt application.

## Video Backgrounds

Located in: `/public/videos/`

| File | Size | Description |
|------|------|-------------|
| `flowers.mp4` | 1.2 MB | Animated flower scene |
| `forest.mp4` | 1.3 MB | Forest landscape with ambient motion |
| `jungle-walk.mp4` | 13.2 MB | Walking through jungle path |
| `sky-loop.mp4` | 2.2 MB | Looping sky with clouds |
| `sky.mp4` | 4.7 MB | Sky scene with cloud movement |
| `sleeping-in-flowers.mp4` | 2.1 MB | Peaceful flower field scene |
| `three-loop.mp4` | 2.2 MB | Tree/nature loop animation |
| `train-view.mp4` | 0.8 MB | Train window view |

---

## Audio Tracks

Located in: `/public/sounds/`

| File | Size | Description | Icon |
|------|------|-------------|------|
| `fire-sound.mp3` | 1.4 MB | Crackling fireplace | 🔥 |
| `drip-coffee.mp3` | 1.1 MB | Coffee shop ambiance | ☕ |
| `sea-waves.mp3` | 2.5 MB | Ocean waves | 🌊 |
| `birds-sound-2.mp3` | 5.1 MB | Forest bird sounds | 🐦 |

### External Audio

| Source | URL | Description |
|--------|-----|-------------|
| Mixkit | `https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3` | Rain sounds |

---

## Image Backgrounds

Located in: `/public/images/`

| File | Size | Description |
|------|------|-------------|
| `calm.jpg` | 45 KB | Calm nature scene |
| `cat.jpg` | 45 KB | Cat image |
| `goku.jpg` | 137 KB | Goku anime image |
| `nature2.jpg` | 45 KB | Nature landscape |

---

## Naming Convention

All files follow these patterns:
- **lowercase** with **hyphens** (kebab-case)
- Descriptive names (e.g., `fire-sound.mp3` not `sfx1.mp3`)
- Clear file extensions

## Adding New Assets

1. Place files in appropriate `/public/` subdirectory
2. Update `src/constants.ts` with new asset data
3. Update this manifest
4. Test loading and fallback behavior
