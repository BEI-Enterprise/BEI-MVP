'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import { colors, fontSize, fontWeight, navHeight, cardStyle, pageWrapper, contentWrapper } from '../../lib/design'
import Nav from '../components/Nav'

const supabase = createClient()

import DashboardShell from '../components/DashboardShell'
import { useLiveIntelligence } from '../hooks/useLiveIntelligence'
function CompletenessGate({ completeness, businessName }: { completeness: number, businessName: string }) {
  const gold = '#C8A24A'
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column' as const, gap: '16px' }}>
      <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em' }}>DATA REQUIRED</div>
      <div style={{ fontSize: '15px', fontWeight: '600' }}>{businessName}</div>
      <div style={{ fontSize: '13px', color: '#666', textAlign: 'center' as const, maxWidth: '360px' }}>Connect your business data to unlock this intelligence module.</div>
      <a href="/connect" style={{ padding: '12px 24px', border: '1px solid ' + gold, color: gold, borderRadius: '6px', textDecoration: 'none', fontSize: '13px', marginTop: '8px' }}>Connect Data →</a>
    </div>
  )
}

export default function HealthPage() {
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [loading, setLoading] = useState(true)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [industry, setIndustry] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('businesses')
          .select('id, business_name, mri_result, industry')
          .eq('status', 'mri_complete')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()
        if (data) {
          setBusinessName(data.business_name || 'Your Business')
          setBusinessId(data.id)
          setIndustry(data.industry || null)
          if (data.mri_result) setResult(data.mri_result)
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  const { intelligence: liveIntelligence } = useLiveIntelligence(businessId, industry)
  useEffect(() => {
    if (liveIntelligence) setResult(liveIntelligence)
  }, [liveIntelligence])

  const nav = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Health', href: '/health', active: true },
    { label: 'Constraints', href: '/constraints' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Deployments', href: '/deployments' },
    { label: 'Outcomes', href: '/outcomes' },
    { label: 'Connect', href: '/connect' },
  ]

  const pillarDescriptions: Record<string, string> = {
    growth: 'Revenue trend, lead volume and conversion rate. How well the business is growing.',
    operations: 'Team capacity, founder dependency and operational maturity. How well the business runs.',
    strategy: 'Pricing confidence, offer clarity and market position. How well the business is positioned.',
    risk: 'Revenue concentration, trust infrastructure, cash flow and key person risk. How exposed the business is.',
    context: 'Market growth, competition intensity and client retention. The environment the business operates in.',
  }

  if (loading) return <main style={pageWrapper}></main>

  if (!result) return (
    <DashboardShell activeId="health">
      <CompletenessGate completeness={0} businessName={businessName} />
    </DashboardShell>
  )

  const health = result.health || {}
  const overall = health.overall || 0
  const band = health.band || 'unknown'
  const pillars = health.pillars || {}
  const industryBenchmark = health.industry_benchmark || 55
  const vsBenchmark = health.vs_benchmark || 'unknown'
  const healthColor = overall >= 70 ? colors.success : (overall >= 45 ? colors.gold : colors.error)

  return (
    <DashboardShell activeId="health"><main style={pageWrapper}>
      <Nav />

      <div style={contentWrapper}>
        <div style={{ fontSize: '28px', fontWeight: fontWeight.bold, marginBottom: '6px' }}>Business Health</div>
        <div style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: '36px' }}>Five pillar assessment benchmarked against your industry</div>

        {/* Overall score */}
        <div style={{ ...cardStyle, marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '48px' }}>
          <div style={{ textAlign: 'center' as const, minWidth: '120px' }}>
            <div style={{ fontSize: '80px', fontWeight: fontWeight.extrabold, color: healthColor, lineHeight: '1' }}>{overall}</div>
            <div style={{ fontSize: fontSize.sm, color: colors.textMuted, marginTop: '8px' }}>Overall Score</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: fontSize.xl, fontWeight: fontWeight.semibold, textTransform: 'capitalize' as const }}>{band}</div>
              <div style={{ padding: '4px 12px', borderRadius: '4px', fontSize: fontSize.sm, fontWeight: fontWeight.semibold,
                color: vsBenchmark === 'above' ? colors.success : vsBenchmark === 'below' ? colors.error : colors.gold,
                backgroundColor: vsBenchmark === 'above' ? colors.successBg : vsBenchmark === 'below' ? colors.errorBg : '#1a1200',
                border: `1px solid ${vsBenchmark === 'above' ? colors.successBorder : vsBenchmark === 'below' ? colors.errorBorder : '#3a2a00'}`
              }}>
                {vsBenchmark === 'above' ? '↑ Above' : vsBenchmark === 'below' ? '↓ Below' : '→ At'} Industry Benchmark ({industryBenchmark})
              </div>
            </div>
            <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.75' }}>
              {overall >= 70
                ? 'Your business is in strong health. Focus on maintaining this position while addressing any remaining constraints.'
                : overall >= 50
                ? 'Your business has solid foundations with clear areas for improvement. Addressing the primary constraint will have the most impact.'
                : overall >= 30
                ? 'Several areas of your business need focused attention. Prioritise the primary constraint before spreading effort.'
                : 'Your business health requires immediate attention. Focus on the primary constraint as the highest priority action.'}
            </div>
          </div>
        </div>

        {/* Pillar breakdown */}
        <div style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginBottom: '20px', color: colors.textPrimary }}>Pillar Breakdown</div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
          {Object.entries(pillars).map(([name, data]: [string, any]) => {
            const pillarColor = data.score >= 70 ? colors.success : data.score >= 45 ? colors.gold : colors.error
            const diff = Math.abs(data.score - data.benchmark)
            const vsText = data.vs_benchmark === 'above' ? `↑ ${diff} above` : data.vs_benchmark === 'below' ? `↓ ${diff} below` : '→ at'
            return (
              <div key={name} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, textTransform: 'capitalize' as const, marginBottom: '6px' }}>{name}</div>
                    <div style={{ fontSize: fontSize.base, color: colors.textSecondary, lineHeight: '1.6' }}>{pillarDescriptions[name] || ''}</div>
                  </div>
                  <div style={{ textAlign: 'right' as const, marginLeft: '24px' }}>
                    <div style={{ fontSize: '36px', fontWeight: fontWeight.extrabold, color: pillarColor }}>{data.score}</div>
                    <div style={{ fontSize: fontSize.sm, color: colors.textMuted, marginTop: '2px' }}>benchmark: {data.benchmark}</div>
                  </div>
                </div>
                <div style={{ height: '8px', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                  <div style={{ width: data.score + '%', height: '100%', backgroundColor: pillarColor, borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: fontSize.sm, color: pillarColor, fontWeight: fontWeight.semibold, textTransform: 'capitalize' as const }}>{data.band}</div>
                  <div style={{ fontSize: fontSize.sm, color: data.vs_benchmark === 'above' ? colors.success : data.vs_benchmark === 'below' ? colors.error : colors.textMuted }}>
                    {vsText} industry benchmark
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '32px', ...cardStyle }}>
          <div style={{ fontSize: fontSize.sm, color: colors.textMuted, lineHeight: '1.8' }}>
            <strong style={{ color: colors.textSecondary }}>About this assessment:</strong> Health scores are calculated using BEI Intelligence v1.0 and benchmarked against industry averages for your sector. Scores reflect your intake responses and will improve in accuracy as connector data is added.
          </div>
        </div>
      </div>
    </main>
  </DashboardShell>
  )
}
