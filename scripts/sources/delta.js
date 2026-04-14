import { BaseSource } from './base-source.js'

// Delta SkyMiles — dynamic pricing, but still some good sweet spots
export class DeltaSkyMiles extends BaseSource {
  constructor(config) {
    super('delta', config)
    this.partnerName = 'Delta SkyMiles'
  }

  async fetchDeals() {
    return [
      this.makeFlightDeal({ origin: 'ATL', destination: 'LHR', cabin: 'business', points: 75000,  cashInr: 130000, notes: 'Delta One to London, good availability', region: 'europe' }),
      this.makeFlightDeal({ origin: 'JFK', destination: 'CDG', cabin: 'business', points: 70000,  cashInr: 125000, notes: 'Delta One to Paris', region: 'europe' }),
      this.makeFlightDeal({ origin: 'ATL', destination: 'NRT', cabin: 'economy',  points: 35000,  cashInr: 55000,  notes: 'Economy to Tokyo, off-peak', region: 'asia' }),
      this.makeFlightDeal({ origin: 'JFK', destination: 'SYD', cabin: 'business', points: 95000,  cashInr: 220000, notes: 'Delta One to Sydney via LAX', region: 'asia' }),
      this.makeFlightDeal({ origin: 'LAX', destination: 'HNL', cabin: 'economy',  points: 12000,  cashInr: 20000,  notes: 'Domestic Hawaii, off-peak', region: 'americas' }),
    ]
  }
}
