import { BaseSource } from './base-source.js'

// Cathay Pacific Asia Miles — strong sweet spots in premium cabins to Australia/Europe
export class CathayPacificAsiaMiles extends BaseSource {
  constructor(config) {
    super('cathay', config)
    this.partnerName = 'Cathay Pacific Asia Miles'
  }

  async fetchDeals() {
    return [
      this.makeFlightDeal({ origin: 'HKG', destination: 'SYD', cabin: 'business', points: 50000,  cashInr: 90000,  notes: 'Business Class to Sydney', region: 'asia' }),
      this.makeFlightDeal({ origin: 'HKG', destination: 'LHR', cabin: 'business', points: 75000,  cashInr: 200000, notes: 'Business class via HKG, competitive rate', region: 'europe' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'HKG', cabin: 'economy',  points: 22500,  cashInr: 32000,  notes: 'Economy via Hong Kong', region: 'asia' }),
      this.makeFlightDeal({ origin: 'HKG', destination: 'NRT', cabin: 'business', points: 27500,  cashInr: 65000,  notes: 'Short premium to Tokyo', region: 'asia' }),
      this.makeFlightDeal({ origin: 'HKG', destination: 'JFK', cabin: 'first',    points: 110000, cashInr: 350000, notes: 'Cathay First Class: exceptional value', region: 'americas' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'SYD', cabin: 'economy',  points: 38000,  cashInr: 55000,  notes: 'Economy to Sydney via Hong Kong', region: 'asia' }),
    ]
  }
}
