import type { Deal, Partner } from '../types'

function cathayCabin(c: string | null): string {
  if (c === 'first') return 'F'
  if (c === 'economy') return 'Y'
  return 'J'
}

export function buildBookingUrl(deal: Deal, partner: Partner): string {
  const date = deal.valid_travel_window

  if (deal.partner_id === 'cathay' && deal.origin && deal.destination && date) {
    const params = new URLSearchParams({
      adults: '1',
      cabin: cathayCabin(deal.cabin_class),
      origin: deal.origin,
      destination: deal.destination,
      departure: date,
      type: 'OW',
      miles: 'true',
    })
    return `https://book.cathaypacific.com/CathayPacificAirways/dyn/air/booking/searchflights?${params}`
  }

  return partner.redemption_url
}

export function formatTravelDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
