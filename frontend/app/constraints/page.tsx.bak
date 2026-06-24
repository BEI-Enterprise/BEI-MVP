'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import { colors, fontSize, fontWeight, navHeight, cardStyle, pageWrapper, contentWrapper } from '../../lib/design'

const supabase = createClient()

import DashboardShell from '../components/DashboardShell'
export default function ConstraintsPage() {
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
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Health', href: '/health' },
    { label: 'Constraints', href: '/constraints', active: true },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Deployments', href: '/deployments' },
    { label: 'Outcomes', href: '/outcomes' },
    { label: 'Connect', href: '/connect' },
  ]

  if (loading) return <main style={pageWrapper}></main>

  if (!result) return (
    <main style={pageWrapper}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <a href='/book' style={{ padding: '14px 32px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '4px', textDecoration: 'none' }}>Start Your MRI</a>
      </div>
    </main>
  )

  const primary = result.primary_constraint
  const secondary = result.secondary_constraints || []
  const unverified = result.unverified_flags || []
  const explanation = result.decision_explanation || ''

  const VerificationBar = ({ score }: { score: number }) => {
    const color = score >= 80 ? colors.success : score >= 60 ? colors.gold : colors.error
    return (
      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: fontSize.sm, color: colors.textMuted }}>Verification Score</span>
          <span style={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color }}>{score}/100</span>
        </div>
        <div style={{ height: '6px', backgroundColor: '#111', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: score + '%', height: '100%', backgroundColor: color, borderRadius: '3px' }} />
        </div>
      </div>
    )
  }

  return (
    <DashboardShell activeId="constraints"><main style={pageWrapper}>
      <nav style={{ padding: '0 48px', borderBottom: `1px solid ${colors.borderSubtle}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: navHeight, backgroundColor: colors.bgBase }}>
        <span style={{ fontSize: '20px', fontWeight: fontWeight.extrabold, color: colors.gold, letterSpacing: '0.1em' }}>BEI</span>
        <div style={{ display: 'flex' }}>
          {nav.map(n => (
            <a key={n.href} href={n.href} style={{ padding: '0 18px', height: navHeight, display: 'flex', alignItems: 'center', fontSize: fontSize.base, color: (n as any).active ? colors.gold : colors.textMuted, borderBottom: (n as any).active ? `2px solid ${colors.gold}` : '2px solid transparent', textDecoration: 'none', fontWeight: (n as any).active ? fontWeight.semibold : fontWeight.normal }}>{n.label}</a>
          ))}
        </div>
        <span style={{ fontSize: fontSize.sm, color: colors.textDisabled }}>{businessName}</span>
      </nav>

      <div style={contentWrapper}>
        <div style={{ fontSize: '28px', fontWeight: fontWeight.bold, marginBottom: '6px' }}>Constraint Intelligence</div>
        <div style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: '36px' }}>Verified constraints ranked by network influence and business impact</div>

        {/* Primary constraint */}
        {primary && (
          <div style={{ ...cardStyle, borderColor: colors.borderActive, backgroundColor: '#080f04', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '10px', fontWeight: fontWeight.semibold }}>Primary Constraint</div>
                <div style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: '8px' }}>{primary.name}</div>
                <div style={{ display: 'inline-block', padding: '3px 10px', backgroundColor: primary.severity === 'high' ? colors.errorBg : '#1a1200', border: `1px solid ${primary.severity === 'high' ? colors.errorBorder : '#3a2a00'}`, borderRadius: '20px', fontSize: '11px', color: primary.severity === 'high' ? colors.error : colors.gold, fontWeight: fontWeight.semibold }}>{primary.severity?.toUpperCase()} SEVERITY</div>
              </div>
              <div style={{ textAlign: 'right' as const }}>
                <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px' }}>Verification</div>
                <div style={{ fontSize: '36px', fontWeight: fontWeight.extrabold, color: colors.success }}>{primary.verification_score}/100</div>
              </div>
            </div>
            <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.75', marginBottom: '20px' }}>{primary.hypothesis}</div>
            <div style={{ borderTop: `1px solid ${colors.borderBase}`, paddingTop: '20px' }}>
              <div style={{ fontSize: fontSize.sm, color: colors.textMuted, marginBottom: '12px', fontWeight: fontWeight.medium }}>Evidence</div>
              {(primary.evidence || []).map((e: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: colors.gold, flexShrink: 0, marginTop: '2px' }}>◈</span>
                  <span style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.6' }}>{e}</span>
                </div>
              ))}
            </div>
            {primary.opportunity && (
              <div style={{ borderTop: `1px solid ${colors.borderBase}`, paddingTop: '20px', marginTop: '4px', display: 'flex', gap: '40px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Opportunity</div>
                  <div style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.gold }}>£{(primary.opportunity.value_low / 1000).toFixed(0)}k – £{(primary.opportunity.value_high / 1000).toFixed(0)}k</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Dimension</div>
                  <div style={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: colors.textBody, textTransform: 'capitalize' as const }}>{primary.opportunity.dimension?.replace('_', ' ')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Root Cause</div>
                  <div style={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: primary.is_root_cause ? colors.success : colors.textSecondary }}>{primary.is_root_cause ? 'Confirmed' : 'Symptom'}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Decision explanation */}
        {explanation && (
          <div style={{ ...cardStyle, marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '14px', fontWeight: fontWeight.semibold }}>Decision Explanation</div>
            <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.8' }}>{explanation}</div>
          </div>
        )}

        {/* Secondary constraints */}
        {secondary.length > 0 && (
          <>
            <div style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginBottom: '16px', color: colors.textPrimary }}>Secondary Constraints</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px', marginBottom: '24px' }}>
              {secondary.map((c: any) => (
                <div key={c.key} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.textPrimary, marginBottom: '6px' }}>{c.name}</div>
                      <div style={{ fontSize: fontSize.base, color: colors.textSecondary, lineHeight: '1.6' }}>{c.hypothesis}</div>
                    </div>
                    <div style={{ textAlign: 'right' as const, marginLeft: '24px' }}>
                      <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px' }}>Verification</div>
                      <div style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: c.verification_score >= 80 ? colors.success : c.verification_score >= 60 ? colors.gold : colors.error }}>{c.verification_score}/100</div>
                    </div>
                  </div>
                  <VerificationBar score={c.verification_score} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Unverified flags */}
        {unverified.length > 0 && (
          <>
            <div style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginBottom: '14px', color: colors.textPrimary }}>Unverified Signals</div>
            <div style={{ ...cardStyle, borderColor: colors.borderError, backgroundColor: '#0a0505' }}>
              <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: '16px', lineHeight: '1.6' }}>
                These signals were detected but did not pass verification. Golden Rule 2: Verification Before Recommendation — these will not influence any recommendation.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '10px' }}>
                {unverified.map((c: any) => (
                  <div key={c.key} style={{ padding: '6px 14px', backgroundColor: '#0f0808', border: `1px solid ${colors.borderError}`, borderRadius: '4px', fontSize: fontSize.sm, color: colors.textMuted }}>{c.name}</div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  </DashboardShell>
  )
}
