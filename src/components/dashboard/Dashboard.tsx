import { useDeals }        from '../../hooks/useDeals'
import { useFilters }      from '../../hooks/useFilters'
import { BestDealsToday }  from './BestDealsToday'
import { StatsBar }        from './StatsBar'
import { FilterBar }       from '../filters/FilterBar'
import { DealsTable }      from '../deals/DealsTable'
import { LoadingSpinner }  from '../shared/LoadingSpinner'

export function Dashboard() {
  const { loading, error } = useDeals()
  const { filteredDeals }  = useFilters()

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Could not load deals</h3>
        <p className="text-sm text-gray-500 max-w-sm">{error}</p>
        <p className="mt-3 text-xs text-gray-400">
          If you just cloned this repo, run <code className="bg-gray-100 px-1 py-0.5 rounded">node scripts/seed-data.js</code> to generate the data files.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BestDealsToday />
      <StatsBar />
      <FilterBar />
      <section>
        <h2 className="text-base font-bold text-gray-900 mb-3">All Deals</h2>
        <DealsTable deals={filteredDeals} />
      </section>
    </div>
  )
}
