import { useDealsStore } from '../../store/dealsStore'
import { DealCard } from '../deals/DealCard'

export function BestDealsToday() {
  const deals = useDealsStore((s) => s.deals)

  // Top 5 hot deals, sorted by value/pt desc
  const hotDeals = deals
    .filter((d) => d.rating === 'hot')
    .sort((a, b) => b.value_per_point_inr - a.value_per_point_inr)
    .slice(0, 5)

  if (hotDeals.length === 0) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base font-bold text-gray-900">🔥 Best Deals Today</h2>
        <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
          {hotDeals.length} hot
        </span>
      </div>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
          {hotDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
        {/* Right-edge fade to hint at horizontal scroll */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent" />
      </div>
    </section>
  )
}
