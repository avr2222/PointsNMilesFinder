import { useMemo } from 'react'
import { useDealsStore, applyFiltersAndSort } from '../store/dealsStore'
import type { FilterState, SortKey } from '../types'

export function useFilters() {
  const deals   = useDealsStore((s) => s.deals)
  const filters = useDealsStore((s) => s.filters)
  const sort    = useDealsStore((s) => s.sort)
  const setFilter     = useDealsStore((s) => s.setFilter)
  const togglePartner = useDealsStore((s) => s.togglePartner)
  const setSort       = useDealsStore((s) => s.setSort)
  const resetFilters  = useDealsStore((s) => s.resetFilters)

  const filteredDeals = useMemo(
    () => applyFiltersAndSort(deals, filters, sort),
    [deals, filters, sort],
  )

  return {
    filters,
    sort,
    filteredDeals,
    setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
      setFilter(key, value),
    togglePartner,
    setSort: (key: SortKey) => setSort(key),
    resetFilters,
  }
}
