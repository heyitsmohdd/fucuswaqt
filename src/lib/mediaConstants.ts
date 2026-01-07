/**
 * Media Constants
 * 
 * Centralized location for all external media URLs and fallback assets.
 * This file ensures easy updates and consistent error handling.
 */

// External Audio URLs
export const EXTERNAL_AUDIO = {
    RAIN_SOUND: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3',
} as const;

// Fallback assets for failed loads
export const FALLBACK_ASSETS = {
    // Default background gradient when video fails to load
    VIDEO_BACKGROUND: 'linear-gradient(to bottom right, #1f2937, #111827, #1f2937)',

    // Default placeholder for images
    IMAGE_PLACEHOLDER: '/images/calm.jpg',
} as const;

// Asset paths
export const ASSET_PATHS = {
    VIDEOS: '/videos',
    SOUNDS: '/sounds',
    IMAGES: '/images',
} as const;
