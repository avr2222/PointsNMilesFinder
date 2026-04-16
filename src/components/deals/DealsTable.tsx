import type { Deal, SortKey } from '../../types'
import { DealRow } from './DealRow'
import { EmptyState } from '../shared/EmptyState'
import { useFilters } from '../../hooks/useFilters'

interface Props {
  deals: Deal[]
}

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) return <span className="text-gray-300 ml-1">↕</span>
  return <span className="text-brand-600 ml-1">{dir === 'asc' ? '↑' : '↓'}</span>
}

export function DealsTable({ deals }: Props) {
  const { sort, setSort, resetFilters } = useFilters()

  if (deals.length === 0) return <EmptyState onReset={resetFilters} />

  const uniqueCols = [
    { key: 'partner_name'   as SortKey, label: 'Partner',      cls: 'pl-4 pr-3 text-left' },
    { key: 'partner_name'   as SortKey, label: 'Route / Hotel', cls: 'px-3 text-left', skip: true },
    { key: 'value_per_point' as SortKey, label: 'Region',      cls: 'px-3 text-left hidden md:table-cell', skip: true },
    { key: 'points_required' as SortKey, label: 'Amex Pts',    cls: 'px-3 text-right' },
    { key: 'value_per_point' as SortKey, label: 'Est. Value',  cls: 'px-3 text-right hidden sm:table-cell', skip: true },
    { key: 'value_per_point' as SortKey, label: '₹/pt',        cls: 'px-3 text-right' },
    { key: 'rating'          as SortKey, label: 'Rating',      cls: 'pl-3 pr-2 text-right' },
    { key: 'rating'          as SortKey, label: 'Book',        cls: 'pl-2 pr-4 text-right', skip: true },
  ]

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {uniqueCols.map((col, i) => (
              <th
                key={i}
                className={`py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${col.cls} ${col.skip ? '' : 'cursor-pointer select-none hover:text-gray-800'}`}
                onClick={col.skip ? undefined : () => setSort(col.key)}
              >
                {col.label}
                {!col.skip && (
                  <SortIcon
                    active={sort.key === col.key}
                    dir={sort.direction}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <DealRow key={deal.id} deal={deal} />
          ))}
        </tbody>
      </table>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 text-right">
        {deals.length} deal{deals.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
