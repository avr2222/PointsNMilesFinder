export type DealCategory = 'flight' | 'hotel'
export type DealRegion = 'asia' | 'europe' | 'americas' | 'middle_east' | 'global'
export type DealRating = 'hot' | 'good' | 'skip'
export type CabinClass = 'economy' | 'business' | 'first'
export type Currency = 'INR' | 'USD'
export type SortKey = 'value_per_point' | 'points_required' | 'rating' | 'partner_name'
export type SortDir = 'asc' | 'desc'
export type DataSource = 'mock' | 'scraped' | 'manual'

export interface Deal {
  id: string
  partner_id: string
  partner_name: string
  category: DealCategory
  region: DealRegion
  origin: string | null
  destination: string | null
  route_label: string
  cabin_class: CabinClass | null
  hotel_name: string | null
  hotel_city: string | null
  hotel_category: string | null
  nights: number | null
  points_required: number
  cash_value_inr: number
  cash_value_usd: number
  value_per_point_inr: number
  value_per_point_usd: number
  rating: DealRating
  amex_transfer_ratio: number
  amex_points_needed: number
  transfer_bonus_active: boolean
  transfer_bonus_percent: number
  notes: string
  valid_travel_window: string | null
  data_source: DataSource
  last_verified: string
}

export interface Partner {
  id: string
  name: string
  category: DealCategory
  region: DealRegion
  logo_char: string
  logo_color: string
  amex_transfer_ratio: string
  transfer_time: 'instant' | '24-48h' | '3-5d'
  program_url: string
  redemption_url: string
  typical_sweet_spots: string[]
}

export interface DealsData {
  version: string
  generated_at: string
  exchange_rate_usd_inr: number
  deals: Deal[]
}

export interface PartnersData {
  partners: Partner[]
}

export interface LastUpdatedData {
  timestamp: string
  run_id: string
  deals_count: number
  hot_deals_count: number
  good_deals_count: number
  skip_deals_count: number
  new_hot_deals: string[]
  exchange_rate_usd_inr: number
  sources_attempted: number
  sources_succeeded: number
  error_log: string[]
}

export interface FilterState {
  category: DealCategory | 'all'
  region: DealRegion | 'all'
  partnerIds: string[]
  rating: DealRating | 'all'
  searchQuery: string
}

export interface SortState {
  key: SortKey
  direction: SortDir
}

export interface UserConfig {
  alert_email: string
  min_value_threshold_inr: number
  preferred_origins: string[]
  preferred_destinations: string[]
  preferred_routes: Array<{ origin: string; destination: string }>
  preferred_partners: string[]
  preferred_categories: DealCategory[]
  preferred_cabin_classes: CabinClass[]
  alert_on_transfer_bonus: boolean
  display_currency: Currency
}
