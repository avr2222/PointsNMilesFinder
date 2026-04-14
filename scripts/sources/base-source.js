import { classifyDeal, makeId } from '../utils/value-calculator.js'

/**
 * Abstract base class for all loyalty program source modules.
 * Subclasses implement fetchDeals() and call helpers from this base.
 */
export class BaseSource {
  constructor(partnerId, config = {}) {
    this.partnerId    = partnerId
    this.exchangeRate = config.exchangeRate ?? 83.5
  }

  /** @returns {Promise<import('../../src/types').Deal[]>} */
  async fetchDeals() {
    throw new Error(`fetchDeals() not implemented for ${this.partnerId}`)
  }

  /**
   * Build a fully-classified Deal object for a flight redemption.
   * VPP is always calculated on Amex MR points (what the user actually spends).
   */
  makeFlightDeal({ origin, destination, cabin, points, cashInr, notes = '', transferRatio = 1, bonusActive = false, bonusPct = 0, region = 'asia', validWindow = null }) {
    const routeSlug  = `${origin}-${destination}-${cabin}`
    const amexPoints = Math.ceil(points * transferRatio)
    const classified = classifyDeal(cashInr, amexPoints, this.exchangeRate) // ← Amex MR points

    return {
      id: makeId(this.partnerId, routeSlug),
      partner_id:   this.partnerId,
      partner_name: this.partnerName,
      category:     'flight',
      region,
      origin,
      destination,
      route_label:  `${origin} → ${destination}`,
      cabin_class:  cabin,
      hotel_name:   null,
      hotel_city:   null,
      hotel_category: null,
      nights:       null,
      points_required: points,
      cash_value_inr: cashInr,
      amex_transfer_ratio: transferRatio,
      amex_points_needed:  amexPoints,
      transfer_bonus_active:  bonusActive,
      transfer_bonus_percent: bonusPct,
      notes,
      valid_travel_window: validWindow,
      data_source:   'mock',
      last_verified: new Date().toISOString(),
      ...classified,
    }
  }

  /**
   * Build a fully-classified Deal object for a hotel redemption.
   * VPP is always calculated on Amex MR points (what the user actually spends).
   */
  makeHotelDeal({ hotelName, city, hotelCategory, nights, points, cashInr, notes = '', transferRatio = 1, bonusActive = false, bonusPct = 0, region = 'asia', validWindow = null }) {
    const routeSlug  = `${city.toLowerCase().replace(/\s+/g, '-')}-${nights}n`
    const amexPoints = Math.ceil(points * transferRatio)
    const classified = classifyDeal(cashInr, amexPoints, this.exchangeRate) // ← Amex MR points

    return {
      id: makeId(this.partnerId, routeSlug),
      partner_id:   this.partnerId,
      partner_name: this.partnerName,
      category:     'hotel',
      region,
      origin:       null,
      destination:  null,
      route_label:  `${hotelName}, ${city}`,
      cabin_class:  null,
      hotel_name:   hotelName,
      hotel_city:   city,
      hotel_category: hotelCategory,
      nights,
      points_required: points,
      cash_value_inr: cashInr,
      amex_transfer_ratio: transferRatio,
      amex_points_needed:  amexPoints,
      transfer_bonus_active:  bonusActive,
      transfer_bonus_percent: bonusPct,
      notes,
      valid_travel_window: validWindow,
      data_source:   'mock',
      last_verified: new Date().toISOString(),
      ...classified,
    }
  }
}
