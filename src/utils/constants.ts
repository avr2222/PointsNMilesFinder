import type { DealRating } from '../types'

export const RATING_THRESHOLDS = {
  HOT_MIN_INR: 1.5,
  GOOD_MIN_INR: 1.0,
} as const

export const RATING_LABELS: Record<DealRating, string> = {
  hot:  '🔥 Hot',
  good: '👍 Good',
  skip: '❌ Skip',
}

export const RATING_ORDER: Record<DealRating, number> = {
  hot:  0,
  good: 1,
  skip: 2,
}

export const REGION_LABELS: Record<string, string> = {
  all:         'All Regions',
  asia:        'Asia',
  europe:      'Europe',
  americas:    'Americas',
  middle_east: 'Middle East',
  global:      'Global',
}

export const CATEGORY_LABELS: Record<string, string> = {
  all:    'All',
  flight: 'Flights',
  hotel:  'Hotels',
}

export const CABIN_LABELS: Record<string, string> = {
  economy:  'Economy',
  business: 'Business',
  first:    'First Class',
}

// Public data paths (relative to Vite base)
export const DATA_BASE = import.meta.env.BASE_URL + 'data/'
export const DEALS_URL       = DATA_BASE + 'deals.json'
export const PARTNERS_URL    = DATA_BASE + 'partners.json'
export const LAST_UPDATED_URL = DATA_BASE + 'last-updated.json'
