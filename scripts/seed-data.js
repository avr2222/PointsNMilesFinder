/**
 * One-time seeder. Run locally before first deploy:
 *   cd scripts && npm install && node seed-data.js
 *
 * This calls fetch-deals.js logic directly — same result as the GitHub Action.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { logger } from './utils/logger.js'

import { fetchExchangeRate }        from './utils/exchange-rate.js'
import { KrisFlyer }               from './sources/krisflyer.js'
import { BritishAirwaysAvios }     from './sources/ba-avios.js'
import { AirIndiaFlyingReturns }   from './sources/air-india.js'
import { EmiratesSkywards }        from './sources/emirates.js'
import { EtihadGuest }             from './sources/etihad.js'
import { CathayPacificAsiaMiles }  from './sources/cathay.js'
import { DeltaSkyMiles }           from './sources/delta.js'
import { AirFranceKLMFlyingBlue }  from './sources/flying-blue.js'
import { MarriottBonvoy }          from './sources/marriott.js'
import { HiltonHonors }            from './sources/hilton.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR  = join(__dirname, '..', 'public', 'data')

const SOURCES = [
  KrisFlyer, BritishAirwaysAvios, AirIndiaFlyingReturns,
  EmiratesSkywards, EtihadGuest, CathayPacificAsiaMiles,
  DeltaSkyMiles, AirFranceKLMFlyingBlue,
  MarriottBonvoy, HiltonHonors,
]

async function main() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

  const { rate: EXCHANGE_RATE } = await fetchExchangeRate(join(DATA_DIR, 'last-updated.json'))
  const config = { exchangeRate: EXCHANGE_RATE }
  const allDeals = []

  for (const Src of SOURCES) {
    const src = new Src(config)
    try {
      const deals = await src.fetchDeals()
      allDeals.push(...deals)
      logger.success(`${src.partnerName}: ${deals.length} deals`)
    } catch (err) {
      logger.error(`${src.partnerName}: ${err.message}`)
    }
  }

  // Deduplicate
  const seen = new Set()
  const deduped = allDeals.filter((d) => {
    if (seen.has(d.id)) return false
    seen.add(d.id)
    return true
  })

  deduped.sort((a, b) => b.value_per_point_inr - a.value_per_point_inr)

  const hot  = deduped.filter((d) => d.rating === 'hot').length
  const good = deduped.filter((d) => d.rating === 'good').length
  const skip = deduped.filter((d) => d.rating === 'skip').length

  const now = new Date().toISOString()

  const dealsOutput = {
    version:               '1.0',
    generated_at:          now,
    exchange_rate_usd_inr: EXCHANGE_RATE,
    deals:                 deduped,
  }

  const lastUpdatedOutput = {
    timestamp:             now,
    run_id:                `seed-${Date.now()}`,
    deals_count:           deduped.length,
    hot_deals_count:       hot,
    good_deals_count:      good,
    skip_deals_count:      skip,
    new_hot_deals:         [],
    exchange_rate_usd_inr: EXCHANGE_RATE,
    sources_attempted:     SOURCES.length,
    sources_succeeded:     SOURCES.length,
    error_log:             [],
    exchange_rate_source:  'live',
  }

  writeFileSync(join(DATA_DIR, 'deals.json'),         JSON.stringify(dealsOutput, null, 2) + '\n')
  writeFileSync(join(DATA_DIR, 'deals-previous.json'), JSON.stringify(dealsOutput, null, 2) + '\n')
  writeFileSync(join(DATA_DIR, 'last-updated.json'),  JSON.stringify(lastUpdatedOutput, null, 2) + '\n')

  logger.success(`Seeded ${deduped.length} deals → public/data/`)
  logger.info(`🔥 Hot: ${hot}  👍 Good: ${good}  ❌ Skip: ${skip}`)
}

main().catch((err) => {
  logger.error('Seed failed', err)
  process.exit(1)
})
