import { create } from 'zustand'
import type {
  Deal, Partner, FilterState, SortState, Currency,
  SortKey, DealCategory, DealRegion, DealRating,
} from '../types'
import { RATING_ORDER } from '../utils/constants'

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

interface DealsSlice {
  deals: Deal[]
  partners: Partner[]
  lastUpdated: string
  exchangeRate: number
  loading: boolean
  error: string | null
  setDeals: (deals: Deal[], partners: Partner[], lastUpdated: string, exchangeRate: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

interface FiltersSlice {
  filters: FilterState
  sort: SortState
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  togglePartner: (partnerId: string) => void
  setSort: (key: SortKey) => void
  resetFilters: () => void
}

interface CurrencySlice {
  currency: Currency
  toggleCurrency: () => void
}

type StoreState = DealsSlice & FiltersSlice & CurrencySlice

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_FILTERS: FilterState = {
  category:   'all',
  region:     'all',
  partnerIds: [],
  rating:     'all',
  searchQuery: '',
}

const DEFAULT_SORT: SortState = {
  key:       'value_per_point',
  direction: 'desc',
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useDealsStore = create<StoreState>((set) => ({
  // Deals slice
  deals:       [],
  partners:    [],
  lastUpdated: '',
  exchangeRate: 83.5,
  loading:     true,
  error:       null,

  setDeals: (deals, partners, lastUpdated, exchangeRate) =>
    set({ deals, partners, lastUpdated, exchangeRate, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError:   (error)   => set({ error, loading: false }),

  // Filters slice
  filters: DEFAULT_FILTERS,
  sort:    DEFAULT_SORT,

  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),

  togglePartner: (partnerId) =>
    set((s) => {
      const ids = s.filters.partnerIds
      const next = ids.includes(partnerId)
        ? ids.filter((id) => id !== partnerId)
        : [...ids, partnerId]
      return { filters: { ...s.filters, partnerIds: next } }
    }),

  setSort: (key) =>
    set((s) => ({
      sort: {
        key,
        direction:
          s.sort.key === key
            ? s.sort.direction === 'asc' ? 'desc' : 'asc'
            : 'desc',
      },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS, sort: DEFAULT_SORT }),

  // Currency slice
  currency: 'INR',
  toggleCurrency: () =>
    set((s) => ({ currency: s.currency === 'INR' ? 'USD' : 'INR' })),
}))

// ---------------------------------------------------------------------------
// Derived selector — apply filters + sort to raw deals
// Call this in components with useMemo to avoid re-deriving on every render
// ---------------------------------------------------------------------------

export function applyFiltersAndSort(
  deals: Deal[],
  filters: FilterState,
  sort: SortState,
): Deal[] {
  let result = deals

  if (filters.category !== 'all') {
    result = result.filter((d) => d.category === (filters.category as DealCategory))
  }
  if (filters.region !== 'all') {
    result = result.filter((d) => d.region === (filters.region as DealRegion))
  }
  if (filters.partnerIds.length > 0) {
    result = result.filter((d) => filters.partnerIds.includes(d.partner_id))
  }
  if (filters.rating !== 'all') {
    result = result.filter((d) => d.rating === (filters.rating as DealRating))
  }
  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase()
    result = result.filter(
      (d) =>
        d.route_label.toLowerCase().includes(q) ||
        d.partner_name.toLowerCase().includes(q) ||
        (d.hotel_city ?? '').toLowerCase().includes(q),
    )
  }

  result = [...result].sort((a, b) => {
    let cmp = 0
    switch (sort.key) {
      case 'value_per_point':
        cmp = a.value_per_point_inr - b.value_per_point_inr
        break
      case 'cash_value':
        cmp = a.cash_value_inr - b.cash_value_inr
        break
      case 'points_required':
        cmp = a.amex_points_needed - b.amex_points_needed
        break
      case 'rating':
        cmp = RATING_ORDER[a.rating] - RATING_ORDER[b.rating]
        break
      case 'partner_name':
        cmp = a.partner_name.localeCompare(b.partner_name)
        break
    }
    return sort.direction === 'asc' ? cmp : -cmp
  })

  return result
}
