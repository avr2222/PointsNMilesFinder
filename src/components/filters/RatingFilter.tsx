import type { DealRating } from '../../types'
import { useFilters } from '../../hooks/useFilters'
import { RATING_LABELS } from '../../utils/constants'

const RATINGS = ['all', 'hot', 'good', 'skip'] as const

export function RatingFilter() {
  const { filters, setFilter } = useFilters()

  return (
    <div className="flex items-center gap-1">
      {RATINGS.map((r) => (
        <button
          key={r}
          onClick={() => setFilter('rating', r as DealRating | 'all')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
            filters.rating === r
              ? r === 'hot'  ? 'bg-red-100 text-red-700 border-red-200'
              : r === 'good' ? 'bg-green-100 text-green-700 border-green-200'
              : r === 'skip' ? 'bg-gray-200 text-gray-600 border-gray-300'
                             : 'bg-brand-100 text-brand-700 border-brand-200'
              : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600'
          }`}
        >
          {r === 'all' ? 'All Ratings' : RATING_LABELS[r as DealRating]}
        </button>
      ))}
    </div>
  )
}
