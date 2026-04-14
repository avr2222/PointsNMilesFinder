import type { DealRating } from '../types'
import { RATING_THRESHOLDS } from './constants'

export function classifyRating(valuePerPointInr: number): DealRating {
  if (valuePerPointInr >= RATING_THRESHOLDS.HOT_MIN_INR)  return 'hot'
  if (valuePerPointInr >= RATING_THRESHOLDS.GOOD_MIN_INR) return 'good'
  return 'skip'
}

export function calcVPP(cashValueInr: number, pointsRequired: number): number {
  if (pointsRequired === 0) return 0
  return parseFloat((cashValueInr / pointsRequired).toFixed(4))
}

export function inrToUsd(inr: number, exchangeRate: number): number {
  if (exchangeRate === 0) return 0
  return parseFloat((inr / exchangeRate).toFixed(2))
}
