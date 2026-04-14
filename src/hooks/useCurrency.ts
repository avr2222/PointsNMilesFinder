import { useDealsStore } from '../store/dealsStore'
import { formatValue, formatVPP } from '../utils/formatters'
import type { Currency } from '../types'

export function useCurrency() {
  const currency       = useDealsStore((s) => s.currency)
  const toggleCurrency = useDealsStore((s) => s.toggleCurrency)

  function format(inr: number, usd: number): string {
    return formatValue(inr, usd, currency)
  }

  function formatVpp(vppInr: number, vppUsd: number): string {
    return formatVPP(vppInr, vppUsd, currency)
  }

  return { currency: currency as Currency, toggle: toggleCurrency, format, formatVpp }
}
