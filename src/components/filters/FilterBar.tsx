import { CategoryFilter } from './CategoryFilter'
import { RegionFilter }   from './RegionFilter'
import { RatingFilter }   from './RatingFilter'
import { SortControls }   from './SortControls'
import { SearchBar }      from './SearchBar'
import { useFilters }     from '../../hooks/useFilters'

export function FilterBar() {
  const { resetFilters, filters } = useFilters()

  const isFiltered =
    filters.category !== 'all' ||
    filters.region   !== 'all' ||
    filters.rating   !== 'all' ||
    filters.partnerIds.length > 0 ||
    filters.searchQuery !== ''

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
      {/* Row 1: category + search + sort */}
      <div className="flex flex-wrap items-center gap-3">
        <CategoryFilter />
        <div className="flex-1" />
        <SearchBar />
        <SortControls />
      </div>

      {/* Row 2: region + rating + reset */}
      <div className="flex flex-wrap items-center gap-3">
        <RegionFilter />
        <RatingFilter />
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="ml-auto text-xs text-gray-400 hover:text-gray-700 underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  )
}
