import { BaseSource } from './base-source.js'

// Air France / KLM Flying Blue — monthly Promo Awards are exceptional value
export class AirFranceKLMFlyingBlue extends BaseSource {
  constructor(config) {
    super('flying-blue', config)
    this.partnerName = 'Air France/KLM Flying Blue'
  }

  async fetchDeals() {
    return [
      this.makeFlightDeal({ origin: 'CDG', destination: 'JFK', cabin: 'business', points: 50000,  cashInr: 120000, notes: 'La Première / Business La Suite', region: 'americas' }),
      this.makeFlightDeal({ origin: 'CDG', destination: 'NRT', cabin: 'business', points: 60000,  cashInr: 145000, notes: 'Paris to Tokyo Business', region: 'asia' }),
      this.makeFlightDeal({ origin: 'AMS', destination: 'JFK', cabin: 'business', points: 50000,  cashInr: 118000, notes: 'KLM World Business Class', region: 'americas' }),
      this.makeFlightDeal({ origin: 'CDG', destination: 'GRU', cabin: 'business', points: 65000,  cashInr: 150000, notes: 'Business to São Paulo', region: 'americas' }),
      this.makeFlightDeal({ origin: 'AMS', destination: 'SIN', cabin: 'economy',  points: 35000,  cashInr: 48000,  notes: 'Economy to Singapore via Amsterdam', region: 'asia' }),
      this.makeFlightDeal({ origin: 'CDG', destination: 'LAX', cabin: 'economy',  points: 30000,  cashInr: 45000,  notes: 'Promo Award economy to LA', region: 'americas' }),
    ]
  }
}
