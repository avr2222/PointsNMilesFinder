import { BaseSource } from './base-source.js'

// Hilton Honors — Amex transfers at 1:2 ratio (1 Amex MR → 2 Hilton points)
// Hilton 5th night free on award bookings is a key multiplier
export class HiltonHonors extends BaseSource {
  constructor(config) {
    super('hilton', config)
    this.partnerName = 'Hilton Honors'
  }

  async fetchDeals() {
    // transferRatio 0.5 means 1 Amex MR → 2 Hilton points (so Hilton pts cost 0.5x Amex pts)
    return [
      this.makeHotelDeal({ hotelName: 'Conrad Bengaluru', city: 'Bangalore', hotelCategory: '5-star', nights: 2, points: 80000, cashInr: 25000, notes: 'Conrad, Category 7 equivalent', transferRatio: 0.5, region: 'asia' }),
      this.makeHotelDeal({ hotelName: 'Waldorf Astoria Maldives', city: 'Maldives', hotelCategory: '5-star', nights: 5, points: 480000, cashInr: 600000, notes: '5th night free bonus applies! Best Maldives luxury value', transferRatio: 0.5, region: 'asia', bonusActive: true }),
      this.makeHotelDeal({ hotelName: 'Conrad Singapore Orchard', city: 'Singapore', hotelCategory: '5-star', nights: 2, points: 80000, cashInr: 42000, notes: 'Top Singapore hotel, good points value', transferRatio: 0.5, region: 'asia' }),
      this.makeHotelDeal({ hotelName: 'Conrad New York Downtown', city: 'New York', hotelCategory: '5-star', nights: 3, points: 180000, cashInr: 180000, notes: 'Prime Manhattan location at good rates', transferRatio: 0.5, region: 'americas' }),
      this.makeHotelDeal({ hotelName: 'Hilton Tokyo Odaiba', city: 'Tokyo', hotelCategory: '5-star', nights: 3, points: 120000, cashInr: 105000, notes: 'Tokyo bay views, solid points rate', transferRatio: 0.5, region: 'asia' }),
    ]
  }
}
