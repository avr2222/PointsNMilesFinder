import type { Deal } from '../../types'
import { RatingBadge } from '../shared/RatingBadge'
import { useCurrency } from '../../hooks/useCurrency'
import { formatPoints } from '../../utils/formatters'
import { useDealsStore } from '../../store/dealsStore'
import { buildBookingUrl } from '../../utils/bookingUrls'

interface Props {
  deal: Deal
}

export function DealRow({ deal }: Props) {
  const { format, formatVpp } = useCurrency()
  const partners = useDealsStore((s) => s.partners)
  const partner  = partners.find((p) => p.id === deal.partner_id)
  const bgColor  = partner?.logo_color ?? '#6b7280'
  const bookingUrl = buildBookingUrl(deal, partner)

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
      {/* Partner */}
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: bgColor }}
          >
            {partner?.logo_char ?? deal.partner_id.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{deal.partner_name}</p>
            <p className="text-xs text-gray-400 capitalize">{deal.category}</p>
          </div>
        </div>
      </td>

      {/* Route / Hotel */}
      <td className="py-3 px-3">
        <p className="text-sm font-semibold text-gray-900">{deal.route_label}</p>
        <p className="text-xs text-gray-500 capitalize">
          {deal.cabin_class ?? (deal.nights ? `${deal.nights} nights · ${deal.hotel_category ?? ''}` : '')}
        </p>
        {deal.valid_travel_window && (
          <p className="text-[10px] text-indigo-600 font-medium mt-0.5">
            📅 {deal.valid_travel_window}
          </p>
        )}
      </td>

      {/* Region */}
      <td className="py-3 px-3 hidden md:table-cell">
        <span className="text-xs text-gray-500 capitalize">{deal.region.replace('_', ' ')}</span>
      </td>

      {/* Amex Points */}
      <td className="py-3 px-3 text-right">
        <span className="text-sm font-bold text-gray-800 tabular-nums">{formatPoints(deal.amex_points_needed)}</span>
        {deal.amex_transfer_ratio !== 1 && (
          <p className="text-[10px] text-gray-400">({deal.amex_transfer_ratio}:1 ratio)</p>
        )}
      </td>

      {/* Est. Value */}
      <td className="py-3 px-3 text-right hidden sm:table-cell">
        <span className="text-sm text-gray-700 tabular-nums">{format(deal.cash_value_inr, deal.cash_value_usd)}</span>
      </td>

      {/* Value/pt */}
      <td className="py-3 px-3 text-right">
        <span className={`text-sm font-bold tabular-nums ${deal.rating === 'hot' ? 'text-green-600' : deal.rating === 'good' ? 'text-blue-600' : 'text-gray-400'}`}>
          {formatVpp(deal.value_per_point_inr, deal.value_per_point_usd)}
        </span>
      </td>

      {/* Rating */}
      <td className="py-3 pl-3 pr-2">
        <div className="flex items-center justify-end gap-1">
          <RatingBadge rating={deal.rating} size="sm" />
          {deal.transfer_bonus_active && (
            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 rounded px-1.5 py-0.5">
              🎁 Bonus
            </span>
          )}
        </div>
      </td>

      {/* Book */}
      <td className="py-3 pl-2 pr-4">
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-white rounded-md px-2.5 py-1.5 transition-opacity hover:opacity-90 whitespace-nowrap"
          style={{ backgroundColor: bgColor }}
          onClick={(e) => e.stopPropagation()}
        >
          Book →
        </a>
      </td>
    </tr>
  )
}
