import type { Deal, Partner } from '../types'

// ── Date helpers ────────────────────────────────────────────────────────────

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

/** Default travel date: 30 days from today, YYYY-MM-DD */
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

type CabinKey = 'economy' | 'business' | 'first'

// ── Booking URL builder ──────────────────────────────────────────────────────

/**
 * Build the best possible booking URL for a deal.
 *
 * Singapore Airlines: uses the officially documented API parameter names
 *   (originAirportCode, destinationAirportCode, cabinClass Y/J/F, YYYY-MM-DD date).
 *
 * British Airways: documented Avios deep-link params (eId, Origin, Destination,
 *   outboundDate, CabinCode M/C/F, RewardFlight).
 *
 * Emirates / Etihad / Cathay / Delta / Flying Blue: these airlines do not publish
 *   URL param specs — we link straight to their award redemption page so the user
 *   always lands on the right program page (never a broken/empty form).
 *
 * Marriott / Hilton: check-in/check-out date params are part of their standard
 *   search-URL contract and reliably pre-fill the search form.
 */
export function buildBookingUrl(deal: Deal, partner: Partner | undefined): string {
  const fallback = partner?.redemption_url ?? '#'

  const travelDate: string | null = deal.valid_travel_window
    ? (parseTravelWindowDate(deal.valid_travel_window) ?? null)
    : null

  const origin      = deal.origin ?? ''
  const destination = deal.destination ?? ''
  const cabin       = (deal.cabin_class ?? 'economy') as CabinKey

  // ── Flights ───────────────────────────────────────────────────────────────
  if (deal.category === 'flight') {
    const date = travelDate ?? defaultTravelDate()

    switch (deal.partner_id) {

      // Singapore Airlines — documented API params (developer.singaporeair.com)
      case 'krisflyer': {
        const cabinCode: Record<CabinKey, string> = { economy: 'Y', business: 'J', first: 'F' }
        const params = new URLSearchParams({
          originAirportCode:      origin,
          destinationAirportCode: destination,
          departureDate:          date,          // YYYY-MM-DD (documented)
          cabinClass:             cabinCode[cabin] ?? 'Y',  // Y / J / F (documented)
          adultCount:             '1',
          tripType:               'O',
        })
        return `https://www.singaporeair.com/en_UK/us/book-a-flight/book-flight-form/?${params}`
      }

      // British Airways — observed Avios deep-link params
      case 'ba-avios': {
        const cabinCode: Record<CabinKey, string> = { economy: 'M', business: 'C', first: 'F' }
        const params = new URLSearchParams({
          eId:          '113014',
          Origin:       origin,
          Destination:  destination,
          outboundDate: date,
          CabinCode:    cabinCode[cabin] ?? 'M',
          RewardFlight: 'true',
          Adt:          '1',
          theme:        'avios',
        })
        return `https://www.britishairways.com/travel/book/public/en_gb?${params}`
      }

      // Air India — no documented params; land on redemption page
      case 'air-india':
        return fallback

      // Emirates — no documented params; land on Skywards redemption page
      case 'emirates':
        return fallback

      // Etihad — no documented params; land on Etihad Guest redemption page
      case 'etihad':
        return fallback

      // Cathay Pacific — no documented params; land on Asia Miles page
      case 'cathay':
        return fallback

      // Delta — no documented params; land on SkyMiles redemption page
      case 'delta':
        return fallback

      // Flying Blue — no documented params; land on redemption page
      case 'flying-blue':
        return fallback

      default:
        return fallback
    }
  }

  // ── Hotels ────────────────────────────────────────────────────────────────
  if (deal.category === 'hotel') {
    const checkIn  = travelDate ?? defaultTravelDate()
    const nights   = deal.nights ?? 2
    const checkOut = addNights(checkIn, nights)

    switch (deal.partner_id) {

      // Marriott Bonvoy — check-in/out params are part of their stable search URL
      case 'marriott': {
        const params = new URLSearchParams({
          checkInDate:    checkIn,
          checkOutDate:   checkOut,
          numberOfNights: String(nights),
          awards:         'true',
        })
        return `https://www.marriott.com/search/default.mi?${params}`
      }

      // Hilton Honors — check-in/out params work reliably
      case 'hilton': {
        const params = new URLSearchParams({
          checkInDate:  checkIn,
          checkOutDate: checkOut,
          lengthOfStay: String(nights),
          redeemPts:    'true',
        })
        return `https://www.hilton.com/en/search/find-hotels/?${params}`
      }

      default:
        return fallback
    }
  }

  return fallback
}

/** Human-readable label for the travel window field (null = no window known). */
export function formatTravelWindow(window: string | null): string | null {
  return window
}

/**
 * Returns the travel date (YYYY-MM-DD) that will be embedded in the booking URL,
 * only for partners whose booking form actually reads the date from the URL.
 * Returns null for partners that fall back to a generic redemption page.
 */
export function getEffectiveBookingDate(deal: Deal): string | null {
  const supportsDeepLink = ['krisflyer', 'ba-avios', 'marriott', 'hilton'].includes(deal.partner_id)
  if (!supportsDeepLink) return null
  if (deal.valid_travel_window) {
    return parseTravelWindowDate(deal.valid_travel_window)
  }
  return defaultTravelDate()
}

/** Format a YYYY-MM-DD date as "16 May 2026" */
export function formatBookingDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}
