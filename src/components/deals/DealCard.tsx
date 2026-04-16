import type { Deal } from '../../types'
import { RatingBadge } from '../shared/RatingBadge'
import { useCurrency } from '../../hooks/useCurrency'
import { formatPoints } from '../../utils/formatters'
import { useDealsStore } from '../../store/dealsStore'
import { buildBookingUrl, getEffectiveBookingDate, formatBookingDate } from '../../utils/bookingUrls'

interface Props {
  deal: Deal
}

export function DealCard({ deal }: Props) {
  const { format, formatVpp } = useCurrency()
  const partners = useDealsStore((s) => s.partners)
  const partner  = partners.find((p) => p.id === deal.partner_id)

  const bgColor       = partner?.logo_color ?? '#6b7280'
  const bookingUrl    = buildBookingUrl(deal, partner)
  const bookingDate   = getEffectiveBookingDate(deal)

  return (
    <div className="card flex flex-col gap-3 min-w-[240px] max-w-[280px] hover:shadow-md transition-shadow">
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
        {/* Travel window */}
        {deal.valid_travel_window && (
          <p className="text-[11px] text-indigo-600 font-medium mt-0.5">
            📅 {deal.valid_travel_window}
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

      {/* Book with Miles button */}
      <div className="mt-auto">
        {bookingDate && (
          <p className="text-center text-[10px] text-gray-400 mb-1">
            Pre-selecting {formatBookingDate(bookingDate)}
          </p>
        )}
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs font-semibold text-white rounded-lg py-2 px-3 transition-opacity hover:opacity-90"
          style={{ backgroundColor: bgColor }}
        >
          {bookingDate ? 'Book with Miles →' : 'View Redemption Page →'}
        </a>
      </div>
    </div>
  )
}
