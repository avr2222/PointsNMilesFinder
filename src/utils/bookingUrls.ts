import type { Deal, Partner } from '../types'

// ── Date helpers ────────────────────────────────────────────────────────────

/** Parse a travel-window string into YYYY-MM-DD.
 *  Handles: "2026-05-20", "May 2026", "Apr-Jun 2026" (first month), "Q2 2026". */
function parseTravelWindowDate(window: string): string | null {
  // ISO date already
  if (/^\d{4}-\d{2}-\d{2}$/.test(window)) return window

  // "May 2026" or "May, 2026"
  const monthYear = window.match(/^([A-Za-z]+)[,\s]+(\d{4})$/)
  if (monthYear) {
    const d = new Date(`${monthYear[1]} 1, ${monthYear[2]}`)
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }

  // "Apr-Jun 2026" – use first month
  const monthRange = window.match(/^([A-Za-z]+)-[A-Za-z]+\s+(\d{4})$/)
  if (monthRange) {
    const d = new Date(`${monthRange[1]} 1, ${monthRange[2]}`)
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }

  // "Q1 2026" → Jan, "Q2" → Apr, "Q3" → Jul, "Q4" → Oct
  const quarter = window.match(/^Q([1-4])\s+(\d{4})$/)
  if (quarter) {
    const month = (parseInt(quarter[1]) - 1) * 3 + 1 // 1, 4, 7, 10
    const d = new Date(`${quarter[2]}-${String(month).padStart(2, '0')}-01`)
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }

  return null
}

/** Default travel date: 30 days from today */
function defaultTravelDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

/** Add N nights to an ISO date string */
function addNights(isoDate: string, nights: number): string {
  const d = new Date(isoDate)
  d.setDate(d.getDate() + nights)
  return d.toISOString().slice(0, 10)
}

/** YYYYMMDD format (no dashes) */
function toCompact(iso: string): string {
  return iso.replace(/-/g, '')
}

// ── Cabin-class codes per airline ───────────────────────────────────────────

type CabinKey = 'economy' | 'business' | 'first'

const CABIN: Record<string, Record<CabinKey, string>> = {
  krisflyer:    { economy: 'Y',       business: 'J',        first: 'F'     },
  'ba-avios':   { economy: 'M',       business: 'C',        first: 'F'     },
  'air-india':  { economy: 'economy', business: 'business', first: 'first' },
  emirates:     { economy: 'Y',       business: 'J',        first: 'F'     },
  etihad:       { economy: 'Economy', business: 'Business', first: 'First' },
  cathay:       { economy: 'Y',       business: 'J',        first: 'F'     },
  delta:        { economy: 'COACH',   business: 'BUSINESS', first: 'FIRST' },
  'flying-blue':{ economy: 'ECONOMY', business: 'BUSINESS', first: 'FIRST' },
}

// ── Main URL builder ─────────────────────────────────────────────────────────

/**
 * Build the best possible booking URL for a deal.
 * - When valid_travel_window is set, that date is embedded in the URL.
 * - When null, falls back to the partner's generic redemption_url so the
 *   user lands on the right program page and can search themselves.
 */
export function buildBookingUrl(deal: Deal, partner: Partner | undefined): string {
  const fallback = partner?.redemption_url ?? '#'

  // Resolve travel date: parsed window → generic fallback
  const travelDate: string | null = deal.valid_travel_window
    ? (parseTravelWindowDate(deal.valid_travel_window) ?? null)
    : null

  const origin      = deal.origin ?? ''
  const destination = deal.destination ?? ''
  const cabin       = (deal.cabin_class ?? 'economy') as CabinKey

  // ── Flight deals ──────────────────────────────────────────────────────────
  if (deal.category === 'flight') {
    const date = travelDate ?? defaultTravelDate()

    switch (deal.partner_id) {
      case 'krisflyer': {
        const c = CABIN.krisflyer[cabin] ?? 'Y'
        const params = new URLSearchParams({
          tripType: 'O', origin, destination,
          departureDate: toCompact(date),
          cabinClass: c, noOfPax: '1', type: 'pointspay',
        })
        return `https://www.singaporeair.com/en_UK/us/book-a-flight/book-flight-form/?${params}`
      }

      case 'ba-avios': {
        const c = CABIN['ba-avios'][cabin] ?? 'M'
        const params = new URLSearchParams({
          eId: '113014', Origin: origin, Destination: destination,
          CabinCode: c, RewardFlight: 'true', Adt: '1', theme: 'avios',
        })
        return `https://www.britishairways.com/travel/book/public/en_gb?${params}`
      }

      case 'air-india': {
        const c = CABIN['air-india'][cabin] ?? 'economy'
        const params = new URLSearchParams({
          origin, destination, departureDate: date, class: c,
        })
        return `https://www.airindia.com/in/en/redeem-miles.html?${params}`
      }

      case 'emirates': {
        const c = CABIN.emirates[cabin] ?? 'Y'
        const params = new URLSearchParams({
          type: 'REDEEM', triptype: 'O',
          origin, destination, d1: date, c, ADT: '1',
        })
        return `https://www.emirates.com/english/booking/search/?${params}`
      }

      case 'etihad': {
        const c = CABIN.etihad[cabin] ?? 'Economy'
        const params = new URLSearchParams({
          from: origin, to: destination,
          departureDate: date, cabinType: c, journeyType: 'ONE_WAY',
        })
        return `https://www.etihad.com/en-us/fly-etihad/book/search/?${params}`
      }

      case 'cathay': {
        const c = CABIN.cathay[cabin] ?? 'Y'
        const params = new URLSearchParams({
          adults: '1', cabin: c,
          origin, destination, departure: date,
          type: 'OW', miles: 'true',
        })
        return `https://book.cathaypacific.com/CathayPacificAirways/dyn/air/booking/searchflights?${params}`
      }

      case 'delta': {
        const c = CABIN.delta[cabin] ?? 'COACH'
        const params = new URLSearchParams({
          origin, destination, departureDate: date, cabinType: c,
        })
        return `https://www.delta.com/us/en/skymiles/redeem-miles?${params}`
      }

      case 'flying-blue': {
        const params = new URLSearchParams({
          origin, destination, departureDate: date,
        })
        return `https://flyingblue.com/redeem-miles?${params}`
      }

      default:
        return fallback
    }
  }

  // ── Hotel deals ───────────────────────────────────────────────────────────
  if (deal.category === 'hotel') {
    const checkIn  = travelDate ?? defaultTravelDate()
    const nights   = deal.nights ?? 2
    const checkOut = addNights(checkIn, nights)

    switch (deal.partner_id) {
      case 'marriott': {
        const params = new URLSearchParams({
          checkInDate: checkIn, checkOutDate: checkOut,
          numberOfNights: String(nights), awards: 'true',
        })
        return `https://www.marriott.com/search/default.mi?${params}`
      }

      case 'hilton': {
        const params = new URLSearchParams({
          checkInDate: checkIn, checkOutDate: checkOut,
          lengthOfStay: String(nights), redeemPts: 'true',
        })
        return `https://www.hilton.com/en/search/find-hotels/?${params}`
      }

      default:
        return fallback
    }
  }

  return fallback
}

/** Human-readable label for the travel window field. */
export function formatTravelWindow(window: string | null): string | null {
  return window // already a display string; null means "no window known"
}
