import { BaseSource } from './base-source.js'

export class EmiratesSkywards extends BaseSource {
  constructor(config) {
    super('emirates', config)
    this.partnerName = 'Emirates Skywards'
  }

  async fetchDeals() {
    return [
      this.makeFlightDeal({ origin: 'BLR', destination: 'DXB', cabin: 'economy',  points: 15000,  cashInr: 18000,  notes: 'Short hop, good for positioning', region: 'middle_east' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'LHR', cabin: 'business', points: 72000,  cashInr: 165000, notes: 'Business via Dubai, flat bed', region: 'europe' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'LHR', cabin: 'first',    points: 106000, cashInr: 310000, notes: 'Emirates First Class suite', region: 'europe' }),
      this.makeFlightDeal({ origin: 'DEL', destination: 'JFK', cabin: 'business', points: 100000, cashInr: 220000, notes: 'Premium Flex via DXB', region: 'americas' }),
      this.makeFlightDeal({ origin: 'BOM', destination: 'DXB', cabin: 'economy',  points: 12000,  cashInr: 15000,  notes: 'Mumbai to Dubai saver', region: 'middle_east' }),
      this.makeFlightDeal({ origin: 'DXB', destination: 'SYD', cabin: 'business', points: 66000,  cashInr: 155000, notes: 'A380 Business to Sydney', region: 'asia' }),
    ]
  }
}
