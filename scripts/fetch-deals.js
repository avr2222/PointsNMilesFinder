/**
 * Main data refresh orchestrator.
 * Runs as a GitHub Actions step or locally via: node scripts/fetch-deals.js
 *
 * Steps:
 *  1. Snapshot existing deals.json → deals-previous.json
 *  2. Fetch exchange rate
 *  3. Run all 10 source modules
 *  4. Merge, deduplicate, classify, sort
 *  5. Write deals.json + last-updated.json
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { fetchExchangeRate } from './utils/exchange-rate.js'
import { logger } from './utils/logger.js'

// Source modules
import { KrisFlyer }               from './sources/krisflyer.js'
import { BritishAirwaysAvios }     from './sources/ba-avios.js'
import { AirIndiaFlyingReturns }   from './sources/air-india.js'
import { EmiratesSkywards }        from './sources/emirates.js'
import { EtihadGuest }             from './sources/etihad.js'
import { CathayPacificAsiaMiles }  from './sources/cathay.js'
import { MarriottBonvoy }          from './sources/marriott.js'
import { HiltonHonors }            from './sources/hilton.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR  = process.env.DATA_DIR ?? join(__dirname, '..', 'public', 'data')

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function readJsonFile(path) {
  if (!existsSync(path)) return null
  try { return JSON.parse(readFileSync(path, 'utf8')) } catch { return null }
}

function writeJsonFile(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

async function runSource(SourceClass, config) {
  const src = new SourceClass(config)
  try {
    const deals = await src.fetchDeals()
    logger.success(`${src.partnerName}: ${deals.length} deal(s)`)
    return { deals, error: null }
  } catch (err) {
    logger.error(`${src.partnerName}: failed — ${err.message}`)
    return { deals: [], error: err.message }
  }
}

async function main() {
  ensureDir(DATA_DIR)

  const dealsPath       = join(DATA_DIR, 'deals.json')
  const prevDealsPath   = join(DATA_DIR, 'deals-previous.json')
  const lastUpdatedPath = join(DATA_DIR, 'last-updated.json')

  // Step 1 — snapshot
  const existing = readJsonFile(dealsPath)
  if (existing) {
    writeJsonFile(prevDealsPath, existing)
    logger.info(`Snapshotted ${existing.deals?.length ?? 0} existing deals → deals-previous.json`)
  }

  // Step 2 — exchange rate
  const { rate: exchangeRate } = await fetchExchangeRate(lastUpdatedPath)

  // Step 3 — run all sources
  const config = { exchangeRate }
  const SOURCES = [
    KrisFlyer, BritishAirwaysAvios, AirIndiaFlyingReturns,
    EmiratesSkywards, EtihadGuest, CathayPacificAsiaMiles,
    MarriottBonvoy, HiltonHonors,
  ]

  const results = await Promise.allSettled(
    SOURCES.map((Src) => runSource(Src, config)),
  )

  const allDeals   = []
  const errorLog   = []
  let   succeeded  = 0

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allDeals.push(...result.value.deals)
      if (result.value.error) errorLog.push(result.value.error)
      else succeeded++
    } else {
      errorLog.push(result.reason?.message ?? 'Unknown error')
    }
  }

  // Step 4 — deduplicate by id, sort by value desc
  const seen     = new Set()
  const deduped  = allDeals.filter((d) => {
    if (seen.has(d.id)) return false
    seen.add(d.id)
    return true
  })

  deduped.sort((a, b) => b.value_per_point_inr - a.value_per_point_inr)

  // Step 5 — write outputs
  const hotDeals  = deduped.filter((d) => d.rating === 'hot')
  const goodDeals = deduped.filter((d) => d.rating === 'good')
  const skipDeals = deduped.filter((d) => d.rating === 'skip')

  const prevIds  = new Set((existing?.deals ?? []).map((d) => d.id))
  const newHotIds = hotDeals.filter((d) => !prevIds.has(d.id)).map((d) => d.id)

  const dealsOutput = {
    version:                '1.0',
    generated_at:           new Date().toISOString(),
    exchange_rate_usd_inr:  exchangeRate,
    deals:                  deduped,
  }

  const lastUpdatedOutput = {
    timestamp:             new Date().toISOString(),
    run_id:                process.env.GITHUB_RUN_ID ?? `local-${Date.now()}`,
    deals_count:           deduped.length,
    hot_deals_count:       hotDeals.length,
    good_deals_count:      goodDeals.length,
    skip_deals_count:      skipDeals.length,
    new_hot_deals:         newHotIds,
    exchange_rate_usd_inr: exchangeRate,
    sources_attempted:     SOURCES.length,
    sources_succeeded:     succeeded,
    error_log:             errorLog,
  }

  writeJsonFile(dealsPath, dealsOutput)
  writeJsonFile(lastUpdatedPath, lastUpdatedOutput)

  logger.success(`Done! ${deduped.length} deals (🔥 ${hotDeals.length} hot, 👍 ${goodDeals.length} good, ❌ ${skipDeals.length} skip)`)
  logger.info(`New hot deals: ${newHotIds.length}`)

  if (errorLog.length > 0) {
    logger.warn(`${errorLog.length} source error(s)`, errorLog)
  }
}

main().catch((err) => {
  logger.error('Fatal error in fetch-deals.js', err)
  process.exit(1)
})
