'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const stages = [
  'Reading business profile',
  'Analysing Growth indicators',
  'Analysing Operations indicators',
  'Analysing Strategy indicators',
  'Analysing Risk indicators',
  'Analysing Context indicators',
  'Running constraint detection',
  'Calculating business health scores',
  'Identifying primary constraint',
  'Generating MRI report',
]

export default function ProcessingPage() {
  const params = useParams()
  const router = useRouter()
  const businessId = params.business_id as string
  const [stage, setStage] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        // Advance through visual stages
        for (let i = 0; i < stages.length - 1; i++) {
          setStage(i)
          await new Promise(r => setTimeout(r, 500))
        }

        // Load intake answers from localStorage
        const stored = localStorage.getItem('bei_intake_' + businessId)
        const meta = localStorage.getItem('bei_meta_' + businessId)
        const answers = stored ? JSON.parse(stored) : {}
        const industry = meta ? JSON.parse(meta).industry || '' : ''
        const revenueBand = answers.monthly_revenue || 'Under 250k'

        // Call the intelligence API
        const response = await fetch('/api/analyse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_id: businessId,
            answers,
            industry,
            revenue_band: revenueBand,
            source: 'platform',
          }),
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'Analysis failed')
        }

        const data = await response.json()

        setStage(stages.length - 1)
        await new Promise(r => setTimeout(r, 500))
        router.push('/report/' + businessId)

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Processing failed')
      }
    }
    run()
  }, [businessId, router])

  const s = {
    page: { backgroundColor: '#050505', color: '#ffffff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    box: { maxWidth: '480px', width: '100%', padding: '0 24px' },
    label: { fontSize: '12px', fontWeight: '600', letterSpacing: '0.2em', color: '#C8A24A', marginBottom: '24px', textTransform: 'uppercase' as const },
    title: { fontSize: '28px', fontWeight: '700', marginBottom: '40px' },
    stageRow: (active: boolean, done: boolean) => ({
      display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
      opacity: done || active ? 1 : 0.3,
    }),
    dot: (active: boolean, done: boolean) => ({
      width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
      backgroundColor: done ? '#4aaa4a' : active ? '#C8A24A' : '#1a1a1a',
      border: active ? '2px solid #C8A24A' : done ? '2px solid #4aaa4a' : '2px solid #2a2a2a',
    }),
    stageText: (active: boolean, done: boolean) => ({
      fontSize: '14px',
      color: done ? '#4aaa4a' : active ? '#ffffff' : '#444',
    }),
    footer: { fontSize: '11px', color: '#aaa', marginTop: '40px', letterSpacing: '0.1em' },
    error: { color: '#cc4444', fontSize: '14px', marginTop: '24px', padding: '16px', border: '1px solid #cc4444', borderRadius: '6px' },
  }

  return (
    <main style={s.page}>
      <div style={s.box}>
        <div style={s.label}>BEI MRI v1.0 — Processing</div>
        <h1 style={s.title}>Analysing your business</h1>
        {stages.map((name, i) => (
          <div key={i} style={s.stageRow(i === stage, i < stage)}>
            <div style={s.dot(i === stage, i < stage)} />
            <span style={s.stageText(i === stage, i < stage)}>{name}</span>
          </div>
        ))}
        {error && <div style={s.error}>Error: {error}</div>}
        <div style={s.footer}>BEI MRI v1.0 — Rules-Based Analysis</div>
      </div>
    </main>
  )
}
