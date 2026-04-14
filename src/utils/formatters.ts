import type { Currency, DealRating } from '../types'

export function formatPoints(points: number): string {
  if (points >= 100_000) return `${(points / 1000).toFixed(0)}K`
  if (points >= 10_000)  return `${(points / 1000).toFixed(1)}K`
  return points.toLocaleString('en-IN')
}

export function formatValue(inr: number, usd: number, currency: Currency): string {
  if (currency === 'INR') {
    return `₹${inr.toLocaleString('en-IN')}`
  }
  return `$${usd.toFixed(0)}`
}

export function formatVPP(vppInr: number, vppUsd: number, currency: Currency): string {
  if (currency === 'INR') return `₹${vppInr.toFixed(2)}/pt`
  return `$${vppUsd.toFixed(4)}/pt`
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })
}

export function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 1)  return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export const RATING_EMOJI: Record<DealRating, string> = {
  hot:  '🔥',
  good: '👍',
  skip: '❌',
}

export const RATING_LABEL: Record<DealRating, string> = {
  hot:  'Hot',
  good: 'Good',
  skip: 'Skip',
}
