/**
 * Shared valuation helpers used by all source modules.
 */

const HOT_THRESHOLD  = 1.5
const GOOD_THRESHOLD = 1.0

/**
 * Given a cash value (INR) and points required, return enriched valuation fields.
 */
export function classifyDeal(cashValueInr, pointsRequired, exchangeRate = 83.5) {
  const vppInr = pointsRequired > 0
    ? parseFloat((cashValueInr / pointsRequired).toFixed(4))
    : 0

  return {
    cash_value_usd:       parseFloat((cashValueInr / exchangeRate).toFixed(2)),
    value_per_point_inr:  vppInr,
    value_per_point_usd:  parseFloat((vppInr / exchangeRate).toFixed(6)),
    rating:               vppInr >= HOT_THRESHOLD ? 'hot' : vppInr >= GOOD_THRESHOLD ? 'good' : 'skip',
  }
}

/**
 * Generate a deterministic deal ID.
 * Format: "{partnerId}-{routeSlug}-{YYYYMMDD}"
 */
export function makeId(partnerId, routeSlug) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `${partnerId}-${routeSlug.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${date}`
}
