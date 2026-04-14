import { useFilters } from '../../hooks/useFilters'

export function StatsBar() {
  const { filteredDeals } = useFilters()

  const hot  = filteredDeals.filter((d) => d.rating === 'hot').length
  const good = filteredDeals.filter((d) => d.rating === 'good').length
  const skip = filteredDeals.filter((d) => d.rating === 'skip').length

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="card text-center">
        <p className="text-2xl font-bold text-gray-900">{filteredDeals.length}</p>
        <p className="text-xs text-gray-500 mt-0.5">Showing</p>
      </div>
      <div className="card text-center">
        <p className="text-2xl font-bold text-red-500">{hot}</p>
        <p className="text-xs text-gray-500 mt-0.5">🔥 Hot Deals</p>
      </div>
      <div className="card text-center">
        <p className="text-2xl font-bold text-green-500">{good}</p>
        <p className="text-xs text-gray-500 mt-0.5">👍 Good Deals</p>
      </div>
      <div className="card text-center">
        <p className="text-2xl font-bold text-gray-400">{skip}</p>
        <p className="text-xs text-gray-500 mt-0.5">❌ Skip</p>
      </div>
    </div>
  )
}
