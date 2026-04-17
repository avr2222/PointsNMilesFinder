import type { Deal, Partner } from '../types'

// ── Date helpers ─────────────────────────────────────────────────────────────

/** Parse a travel-window string into YYYY-MM-DD.
 *  Handles: "2026-05-20", "May 2026", "Apr-Jun 2026" (first month), "Q2 2026". */
function parseTravelWindowDate(window: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(window)) return window

  const monthYear = window.match(/^([A-Za-z]+)[,\s]+(\d{4})$/)
  if (monthYear) {
    const d = new Date(`${monthYear[1]} 1, ${monthYear[2]}`)
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }

  const monthRange = window.match(/^([A-Za-z]+)-[A-Za-z]+\s+(\d{4})$/)
  if (monthRange) {
    const d = new Date(`${monthRange[1]} 1, ${monthRange[2]}`)
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }

  const quarter = window.match(/^Q([1-4])\s+(\d{4})$/)
  if (quarter) {
    const month = (parseInt(quarter[1]) - 1) * 3 + 1
    const d = new Date(`${quarter[2]}-${String(month).padStart(2, '0')}-01`)
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }

  return null
}

function defaultTravelDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

function addNights(isoDate: string, nights: number): string {
  const d = new Date(isoDate)
  d.setDate(d.getDate() + nights)
  return d.toISOString().slice(0, 10)
}

function toCompact(iso: string): string {
  return iso.replace(/-/g, '')
}

function toMMDDYYYY(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y}`
}

// ── Cabin-class codes per airline ────────────────────────────────────────────

type CabinKey = 'economy' | 'business' | 'first'

const CABIN: Record<string, Record<CabinKey, string>> = {
  krisflyer:     { economy: 'Y',        business: 'J',        first: 'F'       },
  'ba-avios':    { economy: 'M',        business: 'C',        first: 'F'       },
  'air-india':   { economy: 'economy',  business: 'business', first: 'first'   },
  emirates:      { economy: 'Y',        business: 'J',        first: 'F'       },
  etihad:        { economy: 'Economy',  business: 'Business', first: 'First'   },
  cathay:        { economy: 'Y',        business: 'J',        first: 'F'       },
  delta:         { economy: 'COACH',    business: 'BE',       first: 'D1'      },
  'flying-blue': { economy: 'ECONOMY',  business: 'BUSINESS', first: 'FIRST'   },
}

// ── Main URL builder ──────────────────────────────────────────────────────────

export function buildBookingUrl(deal: Deal, partner: Partner | undefined): string {
  const fallback = partner?.redemption_url ?? '#'

  const travelDate: string | null = deal.valid_travel_window
    ? (parseTravelWindowDate(deal.valid_travel_window) ?? null)
    : null

  const origin      = deal.origin ?? ''
  const destination = deal.destination ?? ''
  const cabin       = (deal.cabin_class ?? 'economy') as CabinKey

  // ── Flight deals ─────────────────────────────────────────────────────────
  if (deal.category === 'flight') {
    const date = travelDate ?? defaultTravelDate()

    switch (deal.partner_id) {
      case 'krisflyer': {
        const c = CABIN.krisflyer[cabin] ?? 'Y'
        return (
          'https://www.singaporeair.com/en_UK/us/book-a-flight/book-flight-form/?' +
          new URLSearchParams({
            tripType: 'O', origin, destination,
            departureDate: toCompact(date),
            cabinClass: c, noOfPax: '1', type: 'pointspay',
          })
        )
      }

      case 'ba-avios': {
        const c = CABIN['ba-avios'][cabin] ?? 'M'
        return (
          'https://www.britishairways.com/travel/book/public/en_gb?' +
          new URLSearchParams({
            eId: '113014', Origin: origin, Destination: destination,
            CabinCode: c, RewardFlight: 'true', Adt: '1', theme: 'avios',
          })
        )
      }

      case 'air-india': {
        const c = CABIN['air-india'][cabin] ?? 'economy'
        return (
          'https://www.airindia.com/in/en/redeem-miles.html?' +
          new URLSearchParams({ origin, destination, departureDate: date, class: c })
        )
      }

      case 'emirates': {
        const c = CABIN.emirates[cabin] ?? 'Y'
        return (
          'https://www.emirates.com/english/booking/search/?' +
          new URLSearchParams({
            type: 'REDEEM', triptype: 'O',
            origin, destination, d1: date, c, ADT: '1',
          })
        )
      }

      case 'etihad': {
        const c = CABIN.etihad[cabin] ?? 'Economy'
        return (
          'https://www.etihad.com/en-us/fly-etihad/book/search/?' +
          new URLSearchParams({
            from: origin, to: destination,
            departureDate: date, cabinType: c, journeyType: 'ONE_WAY',
          })
        )
      }

      case 'cathay': {
        const c = CABIN.cathay[cabin] ?? 'Y'
        return (
          'https://book.cathaypacific.com/CathayPacificAirways/dyn/air/booking/searchflights?' +
          new URLSearchParams({
            adults: '1', cabin: c,
            origin, destination, departure: date,
            type: 'OW', miles: 'true',
          })
        )
      }

      // Delta — confirmed URL format from delta.com (awardTravel=true, cabinFareClass BE/D1)
      case 'delta': {
        const c = CABIN.delta[cabin] ?? 'COACH'
        return (
          'https://www.delta.com/flightsearch/search?' +
          new URLSearchParams({
            action: 'findFlights',
            awardTravel: 'true',
            tripType: 'ONE_WAY',
            originCity: origin,
            destinationCity: destination,
            departureDate: toMMDDYYYY(date),
            departureTime: 'AT',
            paxCount: '1',
            searchByCabin: 'true',
            cabinFareClass: c,
            deltaOnlySearch: 'false',
          })
        )
      }

      case 'flying-blue': {
        return (
          'https://www.flyingblue.com/en/flights/reward-tickets?' +
          new URLSearchParams({ origin, destination, departureDate: date })
        )
      }

      default:
        return fallback
    }
  }

  // ── Hotel deals ──────────────────────────────────────────────────────────
  if (deal.category === 'hotel') {
    const checkIn  = travelDate ?? defaultTravelDate()
    const nights   = deal.nights ?? 2
    const checkOut = addNights(checkIn, nights)

    switch (deal.partner_id) {
      case 'marriott': {
        return (
          'https://www.marriott.com/search/default.mi?' +
          new URLSearchParams({
            checkInDate: checkIn, checkOutDate: checkOut,
            numberOfNights: String(nights), awards: 'true',
          })
        )
      }

      case 'hilton': {
        return (
          'https://www.hilton.com/en/search/find-hotels/?' +
          new URLSearchParams({
            checkInDate: checkIn, checkOutDate: checkOut,
            lengthOfStay: String(nights), redeemPts: 'true',
          })
        )
      }

      default:
        return fallback
    }
  }

  return fallback
}

/** Format an ISO date string for display: "17 May 2026" */
export function formatTravelDate(isoDate: string): string {
  return new Date(isoDate + 'T00:00:00Z').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
