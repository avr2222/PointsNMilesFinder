import { useEffect } from 'react'
import { useDealsStore } from '../store/dealsStore'
import type { DealsData, PartnersData } from '../types'
import { DEALS_URL, PARTNERS_URL } from '../utils/constants'

export function useDeals() {
  const { setDeals, setLoading, setError, loading, error, lastUpdated } =
    useDealsStore()

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all([
      fetch(DEALS_URL).then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch deals.json: ${r.status}`)
        return r.json() as Promise<DealsData>
      }),
      fetch(PARTNERS_URL).then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch partners.json: ${r.status}`)
        return r.json() as Promise<PartnersData>
      }),
    ])
      .then(([dealsData, partnersData]) => {
        if (!cancelled) {
          setDeals(
            dealsData.deals,
            partnersData.partners,
            dealsData.generated_at,
            dealsData.exchange_rate_usd_inr,
          )
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { loading, error, lastUpdated }
}
