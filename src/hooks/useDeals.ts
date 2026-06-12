import { useEffect } from 'react'
import { useDealsStore } from '../store/dealsStore'
import type { DealsData, PartnersData } from '../types'
import { DEALS_URL, PARTNERS_URL } from '../utils/constants'

const FETCH_TIMEOUT_MS = 10_000

export function useDeals() {
  const { setDeals, setLoading, setError, loading, error, lastUpdated } =
    useDealsStore()

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    setLoading(true)

    Promise.all([
      fetch(DEALS_URL, { signal: controller.signal }).then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch deals.json: ${r.status}`)
        return r.json() as Promise<DealsData>
      }),
      fetch(PARTNERS_URL, { signal: controller.signal }).then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch partners.json: ${r.status}`)
        return r.json() as Promise<PartnersData>
      }),
    ])
      .then(([dealsData, partnersData]) => {
        if (!cancelled) {
          if (!Array.isArray(dealsData?.deals))
            throw new Error('deals.json is missing the "deals" array')
          if (!Array.isArray(partnersData?.partners))
            throw new Error('partners.json is missing the "partners" array')
          setDeals(
            dealsData.deals,
            partnersData.partners,
            dealsData.generated_at,
            dealsData.exchange_rate_usd_inr,
          )
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          const msg = err.name === 'AbortError'
            ? 'Request timed out. Please try refreshing the page.'
            : err.message
          setError(msg)
        }
      })
      .finally(() => clearTimeout(timeoutId))

    return () => {
      cancelled = true
      controller.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { loading, error, lastUpdated }
}
