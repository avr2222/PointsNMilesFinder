import { BaseSource } from './base-source.js'

// Marriott Bonvoy — Amex MR transfers at 1:1 ratio (1 Amex MR = 1 Bonvoy point)
// Also update partners.json to reflect 1:1
export class MarriottBonvoy extends BaseSource {
  constructor(config) {
    super('marriott', config)
    this.partnerName = 'Marriott Bonvoy'
  }

  async fetchDeals() {
    // transferRatio: 1 → 1 Amex MR = 1 Marriott Bonvoy point
    return [
      this.makeHotelDeal({ hotelName: 'Sheraton Grand Bangalore', city: 'Bangalore', hotelCategory: '5-star', nights: 2, points: 50000, cashInr: 25000, notes: 'Category 5, peak season', transferRatio: 1, region: 'asia' }),
      this.makeHotelDeal({ hotelName: 'JW Marriott Mumbai', city: 'Mumbai', hotelCategory: '5-star', nights: 1, points: 35000, cashInr: 22000, notes: 'Category 5 property, great location', transferRatio: 1, region: 'asia' }),
      this.makeHotelDeal({ hotelName: 'W Bali – Seminyak', city: 'Bali', hotelCategory: '5-star', nights: 3, points: 120000, cashInr: 110000, notes: 'Category 7 resort, best value at 5th night free', transferRatio: 1, region: 'asia' }),
      this.makeHotelDeal({ hotelName: 'Marriott Maldives Kuda Funafaru', city: 'Maldives', hotelCategory: '5-star', nights: 5, points: 350000, cashInr: 380000, notes: '5th night free — best Maldives redemption', transferRatio: 1, region: 'asia', bonusActive: true }),
      this.makeHotelDeal({ hotelName: 'The Ritz-Carlton Paris', city: 'Paris', hotelCategory: '5-star', nights: 2, points: 120000, cashInr: 200000, notes: 'Category 8, peak Paris. High in points but high in value', transferRatio: 1, region: 'europe' }),
    ]
  }
}
