export const NOTRUF_NUMBERS = {
  emergency: '112',
  onCallDoctor: '116117',
  patientTransport: '19222',
};

export const BORDER_COLOR = '#2db9bc';
export const SHADOW_COLOR = '#2a2a2ad9';

export const MAX_FILES_PER_POST = 5;
export const MAX_FILES_PER_USER = 10;

export const MAX_IMAGE_SIZE_MB = 9;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const PROFILE_TYPE_SMART_HEALTH = 'SMART_HEALTH';
export const PROFILE_TYPE_MEDIZIN_UND_PFLEGE = 'MEDIZIN_UND_PFLEGE';
export const PROFILE_TYPE_NOTFALLE = 'NOTFALLE';
export const PROFILE_TYPE_THE_HEALTH_BAR = 'THE_HEALTH_BAR';

export const MAX_BIO_LENGTH_CLAMP = 100;

export const PAGINATION_BULLET_QUANTITY = 4;

export const CATEGORY_FACHARZTE = 'Fachärzte';

export const CATEGORY_NAMES = {
  news: {
    name: 'News für meine Gesundheit',
    link: '/news',
  },
  smartHealth: {
    name: 'Gut für meine Gesundheit',
    link: '/smart-health',
  },
  medizinUndPflege: {
    name: 'Medizin & Pflege',
    link: '/medizin-und-pflege',
  },
  notfalle: {
    name: 'Notfälle',
    link: '/notfalle',
  },
};

/**
 * Prisma Accelerate Cache Strategies
 *
 * TTL (Time To Live): How long data is considered fresh (in seconds)
 * SWR (Stale-While-Revalidate): How long to serve stale data while refreshing in background
 *
 * Total cache time = TTL + SWR
 */
export const CACHE_STRATEGY = {
  /** No caching - always fetch from database (for real-time or sensitive data) */
  NONE: { ttl: 0 },

  /** 15s fresh + 10s stale = 25s total (for rapidly changing admin data) */
  REAL_TIME: { ttl: 15, swr: 10 },

  /** 30s fresh + 15s stale = 45s total (for admin dashboards) */
  ADMIN: { ttl: 30, swr: 15 },

  /** 60s fresh + 30s stale = 90s total (for frequently updated content like news) */
  SHORT: { ttl: 60, swr: 30 },

  /** 90s fresh + 45s stale = 135s total (for user-generated content) */
  MEDIUM_SHORT: { ttl: 90, swr: 45 },

  /** 2min fresh + 1min stale = 3min total (for user profiles and settings) */
  MEDIUM: { ttl: 120, swr: 60 },

  /** 3min fresh + 90s stale = 4.5min total (for stable profiles) */
  MEDIUM_LONG: { ttl: 180, swr: 90 },

  /** 5min fresh + 2.5min stale = 7.5min total (for static/rarely changing content) */
  LONG: { ttl: 300, swr: 150 },

  /** 10min fresh + 5min stale = 15min total (for very static content) */
  VERY_LONG: { ttl: 600, swr: 300 },
} as const;

/**
 * Helper type for cache strategies
 */
export type CacheStrategyType =
  (typeof CACHE_STRATEGY)[keyof typeof CACHE_STRATEGY];
