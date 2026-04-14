import { BaseSource } from './base-source.js'

// British Airways Executive Club uses distance-based award chart
// Short-haul Avios redemptions are among the best value in Europe
export class BritishAirwaysAvios extends BaseSource {
  constructor(config) {
    super('ba-avios', config)
    this.partnerName = 'British Airways Executive Club'
  }

  async fetchDeals() {
    return [
      this.makeFlightDeal({ origin: 'LHR', destination: 'CDG', cabin: 'business', points: 7500,   cashInr: 18000,  notes: 'Short-haul sweet spot, Club Europe', region: 'europe' }),
      this.makeFlightDeal({ origin: 'LHR', destination: 'AMS', cabin: 'economy',  points: 4500,   cashInr: 9000,   notes: 'Zone 1 short-haul saver', region: 'europe' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'LHR', cabin: 'economy',  points: 40000,  cashInr: 65000,  notes: 'Direct BA service', region: 'europe' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'LHR', cabin: 'business', points: 80000,  cashInr: 200000, notes: 'Club World long-haul', region: 'europe' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'DXB', cabin: 'economy',  points: 9750,   cashInr: 14000,  notes: 'Short hop to Dubai', region: 'middle_east' }),
      this.makeFlightDeal({ origin: 'LHR', destination: 'JFK', cabin: 'business', points: 50000,  cashInr: 145000, notes: 'Transatlantic Club World', region: 'americas' }),
      this.makeFlightDeal({ origin: 'MAD', destination: 'BCN', cabin: 'economy',  points: 4500,   cashInr: 7500,   notes: 'Iberia partner, Zone 1', region: 'europe' }),
    ]
  }
}
