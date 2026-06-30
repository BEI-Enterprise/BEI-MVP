'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'

const supabase = createClient()

export function useLiveIntelligence(businessId: string | null | undefined, industry: string | null | undefined) {
  const [loading, setLoading] = useState(true)
  const [intelligence, setIntelligence] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!businessId) { setLoading(false); return }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: connData } = await supabase
          .from('connectors')
          .select('connector_type, status, data_snapshot')
          .eq('business_id', businessId)

        const active = (connData || []).filter((c: any) => c.status === 'active')
        const merged: Record<string, any> = {}
        active.forEach((c: any) => { if (c.data_snapshot) Object.assign(merged, c.data_snapshot) })

        if (Object.keys(merged).length === 0) {
          if (!cancelled) { setIntelligence(null); setLoading(false) }
          return
        }

        const res = await fetch('https://mindful-reverence-production-e010.up.railway.app/analyse-connector-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_id: businessId,
            industry: industry || 'default',
            connector_data: merged,
          }),
        })

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}))
          throw new Error(errBody.error || 'Intelligence engine request failed (' + res.status + ')')
        }

        const data = await res.json()
        if (!cancelled) {
          setIntelligence(data.result || null)
          setLoading(false)
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load live intelligence')
          setIntelligence(null)
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [businessId, industry])

  return { loading, intelligence, error }
}
