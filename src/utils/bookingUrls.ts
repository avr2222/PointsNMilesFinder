import type { Deal, Partner } from '../types'

function cathayCabin(c: string | null): string {
  if (c === 'first') return 'F'
  if (c === 'economy') return 'Y'
  return 'J'
}

function deltaCabin(c: string | null): string {
  if (c === 'first') return 'D1'
  if (c === 'business') return 'BE'
  return 'COACH'
}

function toMMDDYYYY(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y}`
}

function addDays(iso: string, days: number): string {
  const date = new Date(iso + 'T00:00:00Z')
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().split('T')[0]
}

export function buildBookingUrl(deal: Deal, partner: Partner): string {
  const date = deal.valid_travel_window

  // Cathay Pacific — deep link format confirmed by user
  if (deal.partner_id === 'cathay' && deal.origin && deal.destination && date) {
    return (
      'https://book.cathaypacific.com/CathayPacificAirways/dyn/air/booking/searchflights?' +
      new URLSearchParams({
        adults: '1',
        cabin: cathayCabin(deal.cabin_class),
        origin: deal.origin,
        destination: deal.destination,
        departure: date,
        type: 'OW',
        miles: 'true',
      })
    )
  }

  // Delta — confirmed URL format from delta.com search results
  if (deal.partner_id === 'delta' && deal.origin && deal.destination && date) {
    return (
      'https://www.delta.com/flightsearch/search?' +
      new URLSearchParams({
        action: 'findFlights',
        awardTravel: 'true',
        tripType: 'ONE_WAY',
        originCity: deal.origin,
        destinationCity: deal.destination,
        departureDate: toMMDDYYYY(date),
        departureTime: 'AT',
        paxCount: '1',
        searchByCabin: 'true',
        cabinFareClass: deltaCabin(deal.cabin_class),
        deltaOnlySearch: 'false',
      })
    )
  }

  // Hilton — search by hotel name + arrival/departure dates
  if (deal.partner_id === 'hilton' && date) {
    const checkout = addDays(date, deal.nights ?? 1)
    return (
      'https://www.hilton.com/en/hotels/?' +
      new URLSearchParams({
        query: deal.hotel_name ?? deal.hotel_city ?? 'Maldives',
        arrivalDate: date,
        departureDate: checkout,
        room1NumAdults: '2',
      })
    )
  }

  // Marriott — search by hotel name + dates
  if (deal.partner_id === 'marriott' && date) {
    const checkout = addDays(date, deal.nights ?? 1)
    return (
      'https://www.marriott.com/search/default.mi?' +
      new URLSearchParams({
        isSearch: 'true',
        searchType: 'InCity',
        city: deal.hotel_name ?? deal.hotel_city ?? '',
        fromDate: toMMDDYYYY(date),
        toDate: toMMDDYYYY(checkout),
      })
    )
  }

  return partner.redemption_url
}

export function formatTravelDate(isoDate: string): string {
  return new Date(isoDate + 'T00:00:00Z').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
