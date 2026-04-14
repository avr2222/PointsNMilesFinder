import { BaseSource } from './base-source.js'

// Marriott Bonvoy — Amex transfers at 3:1 ratio (3 Amex MR → 1 Bonvoy point)
// But 60K Bonvoy bonus: transfer 60K Amex → get 20K Bonvoy + 5K bonus = 25K Bonvoy
// Effective ratio: 2.4:1 with bonus, 3:1 without
export class MarriottBonvoy extends BaseSource {
  constructor(config) {
    super('marriott', config)
    this.partnerName = 'Marriott Bonvoy'
  }

  async fetchDeals() {
    // Note: transferRatio 3 means 3 Amex MR → 1 Bonvoy point
    // cashInr reflects what the redemption would cost in cash
    return [
      this.makeHotelDeal({ hotelName: 'Sheraton Grand Bangalore', city: 'Bangalore', hotelCategory: '5-star', nights: 2, points: 50000, cashInr: 25000, notes: 'Category 5, peak season', transferRatio: 3, region: 'asia' }),
      this.makeHotelDeal({ hotelName: 'JW Marriott Mumbai', city: 'Mumbai', hotelCategory: '5-star', nights: 1, points: 35000, cashInr: 22000, notes: 'Category 5 property, great location', transferRatio: 3, region: 'asia' }),
      this.makeHotelDeal({ hotelName: 'W Bali – Seminyak', city: 'Bali', hotelCategory: '5-star', nights: 3, points: 120000, cashInr: 110000, notes: 'Category 7 resort, best value at 5th night free', transferRatio: 3, region: 'asia' }),
      this.makeHotelDeal({ hotelName: 'Marriott Maldives Kuda Funafaru', city: 'Maldives', hotelCategory: '5-star', nights: 5, points: 350000, cashInr: 380000, notes: '5th night free — best Maldives redemption', transferRatio: 3, region: 'asia', bonusActive: true }),
      this.makeHotelDeal({ hotelName: 'The Ritz-Carlton Paris', city: 'Paris', hotelCategory: '5-star', nights: 2, points: 120000, cashInr: 200000, notes: 'Category 8, peak Paris. High in points but high in value', transferRatio: 3, region: 'europe' }),
    ]
  }
}
