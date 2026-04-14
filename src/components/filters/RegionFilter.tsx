import type { DealRegion } from '../../types'
import { useFilters } from '../../hooks/useFilters'
import { REGION_LABELS } from '../../utils/constants'

const REGIONS = ['all', 'asia', 'europe', 'americas', 'middle_east', 'global'] as const

export function RegionFilter() {
  const { filters, setFilter } = useFilters()

  return (
    <select
      value={filters.region}
      onChange={(e) => setFilter('region', e.target.value as DealRegion | 'all')}
      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer"
    >
      {REGIONS.map((r) => (
        <option key={r} value={r}>{REGION_LABELS[r]}</option>
      ))}
    </select>
  )
}
