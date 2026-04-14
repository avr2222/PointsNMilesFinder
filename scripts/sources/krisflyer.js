import { BaseSource } from './base-source.js'

export class KrisFlyer extends BaseSource {
  constructor(config) {
    super('krisflyer', config)
    this.partnerName = 'Singapore Airlines KrisFlyer'
  }

  async fetchDeals() {
    // Award chart as of 2026. Phase 2: replace with live scraping.
    return [
      this.makeFlightDeal({ origin: 'BLR', destination: 'SIN', cabin: 'economy',  points: 17500,  cashInr: 32000,  notes: 'Saver award, advance booking required', region: 'asia' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'SIN', cabin: 'business', points: 42500,  cashInr: 95000,  notes: 'Saver award, business class', region: 'asia' }),
      this.makeFlightDeal({ origin: 'DEL', destination: 'SIN', cabin: 'economy',  points: 17500,  cashInr: 30000,  notes: 'Saver economy from Delhi', region: 'asia' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'NRT', cabin: 'business', points: 67500,  cashInr: 185000, notes: 'Saver to Tokyo via Singapore', region: 'asia' }),
      this.makeFlightDeal({ origin: 'SIN', destination: 'LHR', cabin: 'business', points: 87500,  cashInr: 210000, notes: 'Sweet spot: SIN-LHR business', region: 'europe' }),
      this.makeFlightDeal({ origin: 'SIN', destination: 'SYD', cabin: 'business', points: 46500,  cashInr: 110000, notes: 'Saver to Sydney', region: 'asia' }),
      this.makeFlightDeal({ origin: 'BLR', destination: 'MEL', cabin: 'economy',  points: 35500,  cashInr: 55000,  notes: 'Economy to Melbourne via SIN', region: 'asia' }),
    ]
  }
}
