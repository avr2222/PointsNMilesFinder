import fetch from 'node-fetch'
import { readFileSync } from 'fs'
import { logger } from './logger.js'

const FALLBACK_RATE = 83.5
const FRANKFURTER_URL = 'https://api.frankfurter.app/latest?from=USD&to=INR'

/**
 * Fetches the current USD→INR exchange rate.
 * Priority: API → cached (from last-updated.json) → hardcoded fallback
 */
export async function fetchExchangeRate(lastUpdatedPath) {
  try {
    const res = await fetch(FRANKFURTER_URL, { timeout: 8000 })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const rate = json?.rates?.INR
    if (typeof rate !== 'number') throw new Error('Unexpected API response shape')
    logger.success(`Exchange rate: 1 USD = ₹${rate} (from API)`)
    return { rate, source: 'api' }
  } catch (err) {
    logger.warn(`Exchange rate API failed: ${err.message}`)
  }

  // Try to read cached rate
  if (lastUpdatedPath) {
    try {
      const cached = JSON.parse(readFileSync(lastUpdatedPath, 'utf8'))
      const rate = cached?.exchange_rate_usd_inr
      if (typeof rate === 'number' && rate > 0) {
        logger.info(`Using cached exchange rate: 1 USD = ₹${rate}`)
        return { rate, source: 'cached' }
      }
    } catch {
      // file may not exist yet
    }
  }

  logger.warn(`Using hardcoded fallback exchange rate: 1 USD = ₹${FALLBACK_RATE}`)
  return { rate: FALLBACK_RATE, source: 'fallback' }
}
