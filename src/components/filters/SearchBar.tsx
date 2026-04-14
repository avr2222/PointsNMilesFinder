import { useFilters } from '../../hooks/useFilters'

export function SearchBar() {
  const { filters, setFilter } = useFilters()

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
      <input
        type="text"
        value={filters.searchQuery}
        onChange={(e) => setFilter('searchQuery', e.target.value)}
        placeholder="Search partner, route, city…"
        className="w-full sm:w-64 pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 placeholder:text-gray-400"
      />
      {filters.searchQuery && (
        <button
          onClick={() => setFilter('searchQuery', '')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
        >
          ×
        </button>
      )}
    </div>
  )
}
