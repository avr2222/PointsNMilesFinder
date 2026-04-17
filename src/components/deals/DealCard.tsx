import type { Deal } from '../../types'
import { RatingBadge } from '../shared/RatingBadge'
import { useCurrency } from '../../hooks/useCurrency'
import { formatPoints } from '../../utils/formatters'
import { buildBookingUrl, formatTravelDate } from '../../utils/bookingUrls'
import { useDealsStore } from '../../store/dealsStore'

interface Props {
  deal: Deal
}

export function DealCard({ deal }: Props) {
  const { format, formatVpp } = useCurrency()
  const partners = useDealsStore((s) => s.partners)
  const partner  = partners.find((p) => p.id === deal.partner_id)

  const bgColor    = partner?.logo_color ?? '#6b7280'
  const bookingUrl = partner ? buildBookingUrl(deal, partner) : '#'

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="card flex flex-col gap-3 min-w-[240px] max-w-[280px] hover:shadow-md transition-shadow no-underline"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      {/* Partner header */}
      <div className="flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {partner?.logo_char ?? deal.partner_id.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">{deal.partner_name}</p>
          <p className="text-[11px] text-gray-500 capitalize">{deal.category}</p>
        </div>
        <div className="ml-auto">
          <RatingBadge rating={deal.rating} size="sm" />
        </div>
      </div>

      {/* Route / Hotel */}
      <div>
        <p className="font-semibold text-gray-900 text-sm">{deal.route_label}</p>
        {deal.cabin_class && (
          <p className="text-xs text-gray-500 capitalize">{deal.cabin_class}</p>
        )}
        {deal.nights && (
          <p className="text-xs text-gray-500">{deal.nights} nights · {deal.hotel_category}</p>
        )}
        {deal.valid_travel_window && (
          <p className="text-[11px] font-semibold text-indigo-600 mt-0.5">
            {formatTravelDate(deal.valid_travel_window)}
          </p>
        )}
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-1 pt-2 border-t border-gray-50">
        <div className="text-center">
          <p className="text-[11px] text-gray-400 uppercase tracking-wide">Points</p>
          <p className="text-sm font-bold text-gray-800">{formatPoints(deal.amex_points_needed)}</p>
        </div>
        <div className="text-center">
          <p className="text-[11px] text-gray-400 uppercase tracking-wide">Value</p>
          <p className="text-sm font-bold text-gray-800">{format(deal.cash_value_inr, deal.cash_value_usd)}</p>
        </div>
        <div className="text-center">
          <p className="text-[11px] text-gray-400 uppercase tracking-wide">₹/pt</p>
          <p className="text-sm font-bold text-green-600">{formatVpp(deal.value_per_point_inr, deal.value_per_point_usd)}</p>
        </div>
      </div>

      {/* Transfer bonus badge */}
      {deal.transfer_bonus_active && (
        <div className="text-center text-[11px] font-semibold text-amber-700 bg-amber-50 rounded-md py-1">
          🎁 +{deal.transfer_bonus_percent}% Transfer Bonus Active!
        </div>
      )}

      {/* Book CTA */}
      <div className="text-center text-[11px] font-semibold text-indigo-600 bg-indigo-50 rounded-md py-1">
        Book →
      </div>
    </a>
  )
}
