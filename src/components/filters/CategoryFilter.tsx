import type { DealCategory } from '../../types'
import { useFilters } from '../../hooks/useFilters'
import { CATEGORY_LABELS } from '../../utils/constants'

const CATEGORIES = ['all', 'flight', 'hotel'] as const

export function CategoryFilter() {
  const { filters, setFilter } = useFilters()

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => setFilter('category', cat as DealCategory | 'all')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filters.category === cat
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {cat === 'flight' ? '✈ ' : cat === 'hotel' ? '🏨 ' : ''}
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  )
}
