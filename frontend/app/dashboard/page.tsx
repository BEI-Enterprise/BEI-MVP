'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import { colors, fontSize, fontWeight, navHeight, cardStyle, pageWrapper, contentWrapper } from '../../lib/design'

const supabase = createClient()

export default function DashboardPage() {
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('businesses')
          .select('id, business_name, mri_result')
          .eq('status', 'mri_complete')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()
        if (data) {
          setBusinessName(data.business_name || 'Your Business')
          if (data.mri_result) setResult(data.mri_result)
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  const nav = [
    { label: 'Dashboard', href: '/dashboard', active: true },
    { label: 'Health', href: '/health' },
    { label: 'Constraints', href: '/constraints' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Deployments', href: '/deployments' },
    { label: 'Outcomes', href: '/outcomes' },
    { label: 'Connect', href: '/connect' },
  ]

  if (loading) return <main style={pageWrapper}></main>

  if (!result) return (
    <main style={pageWrapper}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column' as const, gap: '24px' }}>
        <p style={{ color: colors.textSecondary, fontSize: fontSize.md }}>No MRI data found.</p>
        <a href='/book' style={{ padding: '14px 32px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '4px', textDecoration: 'none', fontSize: fontSize.base }}>Start Your MRI</a>
      </div>
    </main>
  )

  const health = result.health || {}
  const overall = health.overall || 0
  const band = health.band || 'unknown'
  const pillars = health.pillars || {}
  const primary = result.primary_constraint
  const secondary = result.secondary_constraints || []
  const totalOpp = result.total_opportunity || {}
  const vsBenchmark = health.vs_benchmark || 'unknown'
  const healthColor = overall >= 70 ? colors.success : overall >= 45 ? colors.gold : colors.error

  return (
    <main style={pageWrapper}>
      <nav style={{ padding: '0 48px', borderBottom: `1px solid ${colors.borderSubtle}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: navHeight, backgroundColor: colors.bgBase }}>
        <span style={{ fontSize: fontSize.xl, fontWeight: fontWeight.extrabold, color: colors.gold, letterSpacing: '0.1em' }}>BEI</span>
        <div style={{ display: 'flex' }}>
          {nav.map(n => (
            <a key={n.href} href={n.href} style={{ padding: '0 18px', height: navHeight, display: 'flex', alignItems: 'center', fontSize: fontSize.base, color: n.active ? colors.gold : colors.textMuted, borderBottom: n.active ? `2px solid ${colors.gold}` : '2px solid transparent', textDecoration: 'none', fontWeight: n.active ? fontWeight.semibold : fontWeight.normal }}>{n.label}</a>
          ))}
        </div>
        <span style={{ fontSize: fontSize.sm, color: colors.textDisabled }}>{businessName}</span>
      </nav>

      <div style={contentWrapper}>
        <div style={{ fontSize: fontSize['3xl'], fontWeight: fontWeight.bold, marginBottom: '6px' }}>Executive Dashboard</div>
        <div style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: '36px', lineHeight: '1.6' }}>Your business intelligence summary</div>

        {/* Health + Primary constraint */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '24px' }}>
          {/* Health score */}
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', textAlign: 'center' as const }}>
            <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: fontWeight.semibold }}>Business Health</div>
            <div style={{ fontSize: '80px', fontWeight: fontWeight.extrabold, color: healthColor, lineHeight: '1', marginBottom: '12px' }}>{overall}</div>
            <div style={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, textTransform: 'capitalize' as const, marginBottom: '8px' }}>{band}</div>
            <div style={{ fontSize: fontSize.sm, color: vsBenchmark === 'above' ? colors.success : vsBenchmark === 'below' ? colors.error : colors.gold, fontWeight: fontWeight.medium }}>
              {vsBenchmark === 'above' ? '↑ Above' : vsBenchmark === 'below' ? '↓ Below' : '→ At'} industry benchmark
            </div>
          </div>

          {/* Primary constraint */}
          <div style={cardStyle}>
            <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: fontWeight.semibold }}>Primary Constraint</div>
            {primary ? (
              <>
                <div style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, marginBottom: '12px', color: colors.textPrimary }}>{primary.name}</div>
                <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.7', marginBottom: '24px' }}>{primary.hypothesis}</div>
                <div style={{ display: 'flex', gap: '32px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Opportunity</div>
                    <div style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.gold }}>
                      £{((primary.opportunity?.value_low || 0) / 1000).toFixed(0)}k – £{((primary.opportunity?.value_high || 0) / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Verification</div>
                    <div style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.success }}>{primary.verification_score}/100</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Severity</div>
                    <div style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: primary.severity === 'high' ? colors.error : colors.gold, textTransform: 'capitalize' as const }}>{primary.severity}</div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ fontSize: fontSize.base, color: colors.textSecondary, lineHeight: '1.7' }}>No primary constraint identified. Run a full MRI to generate intelligence.</div>
            )}
          </div>
        </div>

        {/* Health pillars */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginBottom: '24px', color: colors.textPrimary }}>Health Pillars</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {Object.entries(pillars).map(([name, data]: [string, any]) => {
              const pillarColor = data.score >= 70 ? colors.success : data.score >= 45 ? colors.gold : colors.error
              return (
                <div key={name} style={{ textAlign: 'center' as const }}>
                  <div style={{ fontSize: fontSize.sm, color: colors.textMuted, textTransform: 'capitalize' as const, marginBottom: '10px', fontWeight: fontWeight.medium }}>{name}</div>
                  <div style={{ fontSize: fontSize['2xl'], fontWeight: fontWeight.bold, color: pillarColor, marginBottom: '8px' }}>{data.score}</div>
                  <div style={{ height: '6px', backgroundColor: '#111', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: data.score + '%', height: '100%', backgroundColor: pillarColor, borderRadius: '3px' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: colors.textDisabled, marginTop: '6px' }}>vs {data.benchmark}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Total opportunity + secondary constraints */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div style={cardStyle}>
            <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: fontWeight.semibold }}>Total Opportunity</div>
            <div style={{ fontSize: fontSize['4xl'], fontWeight: fontWeight.extrabold, color: colors.gold, marginBottom: '8px' }}>
              £{Math.round((totalOpp.total_low || 0) / 1000)}k – £{Math.round((totalOpp.total_high || 0) / 1000)}k
            </div>
            <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: '1.7' }}>Annual value available across all verified constraints</div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <a href='/opportunities' style={{ padding: '10px 20px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '4px', textDecoration: 'none', fontSize: fontSize.sm }}>View Opportunities</a>
              <a href='/deployments' style={{ padding: '10px 20px', border: `1px solid ${colors.borderStrong}`, color: colors.textSecondary, borderRadius: '4px', textDecoration: 'none', fontSize: fontSize.sm }}>View Deployments</a>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: fontWeight.semibold }}>Secondary Constraints</div>
            {secondary.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
                {secondary.slice(0, 3).map((c: any) => (
                  <div key={c.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#0d0d0d', borderRadius: '6px', border: `1px solid ${colors.borderBase}` }}>
                    <div>
                      <div style={{ fontSize: fontSize.base, fontWeight: fontWeight.medium, color: colors.textBody, marginBottom: '2px' }}>{c.name}</div>
                      <div style={{ fontSize: fontSize.sm, color: colors.textMuted }}>Verification: {c.verification_score}/100</div>
                    </div>
                    <div style={{ fontSize: fontSize.sm, color: c.severity === 'high' ? colors.error : colors.gold, fontWeight: fontWeight.semibold, textTransform: 'capitalize' as const }}>{c.severity}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: fontSize.base, color: colors.textSecondary }}>No secondary constraints detected.</div>
            )}
          </div>
        </div>

        {/* Recommended focus */}
        {result.recommended_focus && (
          <div style={{ ...cardStyle, borderColor: colors.borderActive, backgroundColor: '#080f04' }}>
            <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '12px', fontWeight: fontWeight.semibold }}>Recommended Focus</div>
            <div style={{ fontSize: fontSize.md, color: colors.textBody, lineHeight: '1.75' }}>{result.recommended_focus}</div>
          </div>
        )}
      </div>
    </main>
  )
}
