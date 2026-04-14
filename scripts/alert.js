/**
 * Alert script — runs after fetch-deals.js in GitHub Actions.
 * Diffs new vs previous deals, filters by user config, sends SendGrid email.
 *
 * Required env: SENDGRID_API_KEY
 * Optional env: DATA_DIR, CONFIG_PATH
 */

import sgMail from '@sendgrid/mail'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { diffDeals } from './diff-deals.js'
import { logger } from './utils/logger.js'

const __dirname   = dirname(fileURLToPath(import.meta.url))
const DATA_DIR    = process.env.DATA_DIR    ?? join(__dirname, '..', 'public', 'data')
const CONFIG_PATH = process.env.CONFIG_PATH ?? join(__dirname, '..', 'public', 'config', 'user-config.json')
const SITE_URL    = 'https://avr2222.github.io/PointsNMilesFinder/'

function readJson(path) {
  if (!existsSync(path)) return null
  try { return JSON.parse(readFileSync(path, 'utf8')) } catch { return null }
}

function formatDealRow(deal) {
  const vpp = `₹${deal.value_per_point_inr.toFixed(2)}/pt`
  return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${deal.partner_name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${deal.route_label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${deal.cabin_class ?? deal.hotel_category ?? ''}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">${deal.amex_points_needed.toLocaleString()}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">₹${deal.cash_value_inr.toLocaleString('en-IN')}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:bold;color:#16a34a">${vpp}</td>
    </tr>`
}

function buildEmailHtml(hotDeals, siteUrl) {
  const rows = hotDeals.map(formatDealRow).join('')
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Inter,Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#111">
  <div style="background:#7e22ce;color:white;padding:20px 24px;border-radius:12px 12px 0 0">
    <h1 style="margin:0;font-size:20px">🔥 New Hot Deals — PointsNMilesFinder</h1>
    <p style="margin:6px 0 0;opacity:0.85;font-size:14px">${hotDeals.length} new deal(s) above your threshold</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 12px 12px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead>
        <tr style="background:#f3f4f6">
          <th style="padding:8px 12px;text-align:left">Partner</th>
          <th style="padding:8px 12px;text-align:left">Route / Hotel</th>
          <th style="padding:8px 12px;text-align:left">Cabin</th>
          <th style="padding:8px 12px;text-align:right">Amex Points</th>
          <th style="padding:8px 12px;text-align:right">Est. Value</th>
          <th style="padding:8px 12px;text-align:right">Value/pt</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:20px;text-align:center">
      <a href="${siteUrl}" style="display:inline-block;background:#7e22ce;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600">
        View All Deals →
      </a>
    </div>
    <p style="margin-top:16px;font-size:12px;color:#9ca3af;text-align:center">
      You're receiving this because you set up PointsNMilesFinder alerts.<br>
      Data is for informational purposes only — verify before booking.
    </p>
  </div>
</body>
</html>`
}

async function main() {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) {
    logger.warn('SENDGRID_API_KEY not set — skipping email alert')
    process.exit(0)
  }

  const config = readJson(CONFIG_PATH)
  if (!config?.alert_email) {
    logger.warn('alert_email not set in user-config.json — skipping')
    process.exit(0)
  }

  const newDeals  = readJson(join(DATA_DIR, 'deals.json'))?.deals ?? []
  const prevDeals = readJson(join(DATA_DIR, 'deals-previous.json'))?.deals ?? []

  const { newHotDeals, newBonuses } = diffDeals(newDeals, prevDeals)

  // Filter by user preferences
  const prefs  = config.preferred_partners ?? []
  const origins = config.preferred_origins ?? []
  const dests  = config.preferred_destinations ?? []
  const minVPP = config.min_value_threshold_inr ?? 1.5

  let alerts = newHotDeals.filter((d) => {
    if (d.value_per_point_inr < minVPP) return false
    if (prefs.length > 0 && !prefs.includes(d.partner_id)) return false
    const routeMatch = origins.length === 0 && dests.length === 0
      ? true
      : origins.includes(d.origin) || dests.includes(d.destination)
    return routeMatch
  })

  if (config.alert_on_transfer_bonus) {
    alerts = [...alerts, ...newBonuses.filter((d) => !alerts.find((a) => a.id === d.id))]
  }

  if (alerts.length === 0) {
    logger.info('No new qualifying hot deals — no email sent')
    process.exit(0)
  }

  sgMail.setApiKey(apiKey)

  const msg = {
    to:      config.alert_email,
    from:    { email: 'alerts@pointsnmilesfinder.noreply', name: 'PointsNMilesFinder' },
    subject: `🔥 ${alerts.length} New Hot Deal${alerts.length > 1 ? 's' : ''} — PointsNMilesFinder`,
    html:    buildEmailHtml(alerts, SITE_URL),
  }

  try {
    await sgMail.send(msg)
    logger.success(`Alert email sent to ${config.alert_email} with ${alerts.length} deal(s)`)
  } catch (err) {
    logger.error('SendGrid error', err.response?.body ?? err.message)
    // Don't fail the workflow — alerts are non-critical
  }
}

main().catch((err) => {
  logger.error('Alert script error', err)
  process.exit(0)  // Non-fatal — don't fail the Actions workflow
})
