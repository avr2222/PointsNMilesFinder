import { BaseSource } from './base-source.js'

export class EtihadGuest extends BaseSource {
  constructor(config) {
    super('etihad', config)
    this.partnerName = 'Etihad Guest'
  }

  async fetchDeals() {
    return [
      this.makeFlightDeal({ origin: 'BLR', destination: 'AUH', cabin: 'economy',  points: 16000,  cashInr: 19000,  notes: 'Saver to Abu Dhabi', region: 'middle_east' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'LHR', cabin: 'business', points: 65000,  cashInr: 160000, notes: 'Business Studio via Abu Dhabi', region: 'europe' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'LHR', cabin: 'first',    points: 90000,  cashInr: 300000, notes: 'The Residence / First Suite — best-in-class product', region: 'europe' }),
      this.makeFlightDeal({ origin: 'DEL', destination: 'AUH', cabin: 'economy',  points: 14000,  cashInr: 18000,  notes: 'Delhi to Abu Dhabi saver', region: 'middle_east' }),
      this.makeFlightDeal({ origin: 'AUH', destination: 'JFK', cabin: 'business', points: 58000,  cashInr: 140000, notes: 'Transatlantic Business Studio', region: 'americas' }),
    ]
  }
}
