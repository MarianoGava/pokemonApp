// API Configuration
export const API_CONFIG = {
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
  DEBOUNCE_DELAY: 500,
  MAX_STAT_VALUE: 255,
} as const;

// UI Configuration
export const UI_CONFIG = {
  MAX_CONTENT_WIDTH: '780px',
} as const;

// LocalStorage Keys
export const STORAGE_KEYS = {
  AUTH: import.meta.env.VITE_AUTH_KEY || 'pokemon_app_auth',
} as const;
