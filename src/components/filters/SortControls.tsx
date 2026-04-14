import type { SortKey } from '../../types'
import { useFilters } from '../../hooks/useFilters'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'value_per_point', label: 'Best Value (₹/pt)' },
  { key: 'cash_value',      label: 'Est. Cash Value' },
  { key: 'points_required', label: 'Fewest Points' },
  { key: 'rating',          label: 'Rating' },
  { key: 'partner_name',    label: 'Partner A-Z' },
]

export function SortControls() {
  const { sort, setSort } = useFilters()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sort:</span>
      <select
        value={sort.key}
        onChange={(e) => setSort(e.target.value as SortKey)}
        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.key} value={o.key}>{o.label}</option>
        ))}
      </select>
      <button
        onClick={() => setSort(sort.key)}  // toggles direction
        className="btn-secondary px-2 py-1.5 text-xs"
        title="Toggle sort direction"
      >
        {sort.direction === 'desc' ? '↓ Desc' : '↑ Asc'}
      </button>
    </div>
  )
}
