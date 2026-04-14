import { BaseSource } from './base-source.js'

export class AirIndiaFlyingReturns extends BaseSource {
  constructor(config) {
    super('air-india', config)
    this.partnerName = 'Air India Flying Returns'
  }

  async fetchDeals() {
    return [
      this.makeFlightDeal({ origin: 'DEL', destination: 'LHR', cabin: 'economy',  points: 35000,  cashInr: 55000,  notes: 'Direct AI service, economy saver', region: 'europe' }),
      this.makeFlightDeal({ origin: 'DEL', destination: 'LHR', cabin: 'business', points: 70000,  cashInr: 175000, notes: 'Business class, direct AI flight', region: 'europe' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'DEL', cabin: 'economy',  points: 3500,   cashInr: 5000,   notes: 'Short domestic sector', region: 'asia' }),
      this.makeFlightDeal({ origin: 'DEL', destination: 'JFK', cabin: 'economy',  points: 50000,  cashInr: 75000,  notes: 'Non-stop Delhi to New York', region: 'americas' }),
      this.makeFlightDeal({ origin: 'BOM', destination: 'SIN', cabin: 'economy',  points: 20000,  cashInr: 28000,  notes: 'Mumbai to Singapore', region: 'asia' }),
      this.makeFlightDeal({ origin: 'DEL', destination: 'SFO', cabin: 'business', points: 85000,  cashInr: 200000, notes: 'Premium cabin transpacific', region: 'americas' }),
    ]
  }
}
