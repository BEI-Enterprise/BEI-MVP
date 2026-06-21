'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient as createSupabaseClient } from '../../../lib/supabase'
import { colors, fontSize, fontWeight, cardStyle, pageWrapper } from '../../../lib/design'

const gold = '#C8A24A'

export default function ReportPage() {
  const params = useParams()
  const businessId = params.business_id as string
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseClient()
      const { data } = await supabase
        .from('businesses')
        .select('business_name, mri_result')
        .eq('id', businessId)
        .single()
      if (data) {
        setBusinessName(data.business_name || 'Your Business')
        if (data.mri_result) setResult(data.mri_result)
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsLoggedIn(true)
        const { data: business } = await supabase
          .from('businesses')
          .select('subscription_status, subscription_tier')
          .eq('email', user.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        if (business?.subscription_status === 'active' && business?.subscription_tier !== 'free') {
          setHasSubscription(true)
        }
      }
      setLoading(false)
    }
    load()
  }, [businessId])

  if (loading) return <main style={pageWrapper}></main>

  if (!result) return (
    <main style={pageWrapper}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' as const }}>
        <p style={{ color: colors.textMuted, fontSize: fontSize.md, marginBottom: '24px' }}>No MRI report found.</p>
        <a href='/book' style={{ padding: '14px 32px', backgroundColor: gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '6px', textDecoration: 'none', fontSize: fontSize.base }}>Start Your Free MRI →</a>
      </div>
    </main>
  )

  const health = result.health || {}
  const overall = health.overall || 0
  const pillars = health.pillars || {}
  const primary = result.primary_constraint
  const secondary = result.secondary_constraints || []
  const unverifiedFlags = result.unverified_flags || []
  const confidence = result.confidence || 'low'
  const version = confidence === 'high' ? 'BEI MRI v1.1 — Verified Analysis' : 'BEI MRI v1.0 — Rules-Based Analysis'
  const healthColor = overall >= 70 ? '#4aaa4a' : overall >= 45 ? gold : '#cc4444'
  const totalOpp = result.total_opportunity || {}
  const twinCompleteness = result.twin_completeness
  const twinDataConfidence = result.twin_data_confidence
  const fullAccess = isLoggedIn && hasSubscription

  const LockOverlay = ({ message, cta, href }: { message: string, cta: string, href: string }) => (
    <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(5,5,5,0.88)', borderRadius: '8px', backdropFilter: 'blur(3px)', gap: '12px', zIndex: 10 }}>
      <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontWeight: '600' }}>🔒 {message}</div>
      <a href={href} style={{ padding: '12px 32px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}>{cta}</a>
    </div>
  )

  const GlowCard = ({ children, style, glow }: { children: React.ReactNode, style?: React.CSSProperties, glow?: string }) => (
    <div
      style={{ ...cardStyle, transition: 'all 0.25s cubic-bezier(0.2,0.8,0.2,1)', cursor: 'default', ...style }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px ' + (glow || 'rgba(200,162,74,0.18)') }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {children}
    </div>
  )

  const confidenceColor = (c: string) => c === 'high' || c === 'very_high' ? '#4aaa4a' : c === 'medium' ? gold : '#888'

  return (
    <main style={{ backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh', paddingBottom: '80px' }}>

      {/* Nav */}
      <nav style={{ padding: '0 48px', borderBottom: '1px solid #161616', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '68px', backgroundColor: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(12px)' }}>
        <a href='/' style={{ fontSize: '20px', fontWeight: '800', color: gold, letterSpacing: '0.1em', textDecoration: 'none' }}>BEI</a>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <a href='/dashboard' style={{ padding: '10px 20px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', textDecoration: 'none', fontSize: '15px' }}>Go to Dashboard →</a>
          ) : (
            <>
              <a href='/login' style={{ fontSize: '15px', color: '#aaa', textDecoration: 'none' }}>Sign in</a>
              <a href={'/register?business_id=' + businessId} style={{ padding: '10px 22px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>Unlock Full Report →</a>
            </>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Report header */}
        <div style={{ marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.2em', color: gold, marginBottom: '10px', textTransform: 'uppercase' as const }}>Business MRI Report</div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.01em' }}>{businessName}</h1>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' as const }}>
              <div style={{ display: 'inline-block', padding: '5px 14px', border: `1px solid ${confidence === 'high' ? 'rgba(74,170,74,0.4)' : '#2a2a2a'}`, borderRadius: '4px', fontSize: '11px', color: confidence === 'high' ? '#4aaa4a' : '#555', letterSpacing: '0.1em', fontWeight: '600' }}>
                {confidence === 'high' ? '✓ ' : ''}{version}
              </div>
              {fullAccess && twinDataConfidence != null && (
                <div style={{ display: 'inline-block', padding: '5px 14px', border: '1px solid #2a2a2a', borderRadius: '4px', fontSize: '11px', color: '#aaa', letterSpacing: '0.1em', fontWeight: '600' }}>
                  DATA CONFIDENCE: {Math.round(twinDataConfidence)}%
                </div>
              )}
            </div>
          </div>
          {totalOpp.total_high > 0 && (
            <div style={{ textAlign: 'right' as const }}>
              <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '6px', letterSpacing: '0.1em' }}>TOTAL OPPORTUNITY</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: gold }}>£{Math.round((totalOpp.total_low || 0)/1000)}k–£{Math.round((totalOpp.total_high || 0)/1000)}k</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Annual value available</div>
            </div>
          )}
        </div>

        {/* Health score */}
        <GlowCard style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' as const }} glow={'rgba(200,162,74,0.15)'}>
          <div style={{ textAlign: 'center' as const, minWidth: '140px' }}>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>Overall Health</div>
            <div style={{ fontSize: '88px', fontWeight: '800', color: healthColor, lineHeight: '1' }}>{overall}</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#888', marginTop: '8px', textTransform: 'capitalize' as const }}>{health.band || 'unknown'}</div>
            {health.vs_benchmark && (
              <div style={{ fontSize: '12px', color: health.vs_benchmark === 'above' ? '#4aaa4a' : '#cc4444', marginTop: '6px' }}>
                {health.vs_benchmark === 'above' ? '↑ Above' : '↓ Below'} industry benchmark
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              {Object.entries(pillars).map(([name, data]: [string, any]) => {
                const c = data.score >= 70 ? '#4aaa4a' : data.score >= 45 ? gold : '#cc4444'
                return (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '80px', fontSize: '13px', color: '#aaa', textTransform: 'capitalize' as const }}>{name}</div>
                    <div style={{ flex: 1, height: '8px', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: data.score + '%', height: '100%', backgroundColor: c, borderRadius: '4px' }} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: c, width: '32px' }}>{data.score}</div>
                    <div style={{ fontSize: '11px', color: '#aaa', width: '60px' }}>bm: {data.benchmark}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </GlowCard>

        {/* Decision Explanation */}
        {result.decision_explanation && (
          <GlowCard style={{ marginBottom: '24px', borderColor: 'rgba(200,162,74,0.2)' }} glow={'rgba(200,162,74,0.15)'}>
            <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '14px', fontWeight: '600' }}>Why This Is Your Primary Constraint</div>
            <div style={{ fontSize: '15px', color: '#ccc', lineHeight: '1.8' }}>{result.decision_explanation}</div>
            {result.decision_score != null && (
              <div style={{ display: 'flex', gap: '24px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1a1a1a', flexWrap: 'wrap' as const }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#888', letterSpacing: '0.1em', marginBottom: '4px' }}>DECISION SCORE</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: gold }}>{result.decision_score}</div>
                </div>
                {result.decision_version && (
                  <div>
                    <div style={{ fontSize: '10px', color: '#888', letterSpacing: '0.1em', marginBottom: '4px' }}>DECISION MODEL</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#999' }}>{result.decision_version}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '10px', color: '#888', letterSpacing: '0.1em', marginBottom: '4px' }}>CONSTRAINTS REVIEWED</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#999' }}>{result.detected_count || 0} detected · {result.verified_count || 0} verified</div>
                </div>
              </div>
            )}
          </GlowCard>
        )}

        {/* Primary constraint */}
        {primary && (
          <GlowCard style={{ borderColor: '#2a3a1a', backgroundColor: '#080f04', marginBottom: '24px' }} glow={'rgba(204,68,68,0.18)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap' as const, gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '10px', fontWeight: '600' }}>Primary Constraint — Verified</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0f0', marginBottom: '8px' }}>{primary.name}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                  <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: primary.severity === 'high' ? '#1a0a0a' : '#1a1200', border: `1px solid ${primary.severity === 'high' ? '#3a1a1a' : '#3a2a00'}`, borderRadius: '20px', fontSize: '11px', color: primary.severity === 'high' ? '#cc4444' : gold, fontWeight: '600' }}>
                    {(primary.severity || 'medium').toUpperCase()} SEVERITY
                  </div>
                  {primary.is_root_cause && (
                    <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: 'rgba(74,170,74,0.08)', border: '1px solid rgba(74,170,74,0.25)', borderRadius: '20px', fontSize: '11px', color: '#4aaa4a', fontWeight: '600' }}>
                      CONFIRMED ROOT CAUSE
                    </div>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right' as const }}>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>VERIFICATION</div>
                <div style={{ fontSize: '40px', fontWeight: '800', color: '#4aaa4a' }}>{primary.verification_score}</div>
                <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>out of 100</div>
              </div>
            </div>

            <div style={{ fontSize: '15px', color: '#ccc', lineHeight: '1.8', marginBottom: '24px' }}>{primary.hypothesis}</div>

            {primary.evidence && primary.evidence.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '14px', fontWeight: '600' }}>Evidence ({primary.evidence.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                  {primary.evidence.map((e: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ color: gold, flexShrink: 0, marginTop: '3px', fontSize: '12px' }}>◈</span>
                      <span style={{ fontSize: '14px', color: '#999', lineHeight: '1.6' }}>{e}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fullAccess && primary.sector_benchmark && (
              <div style={{ marginBottom: '24px', padding: '16px 20px', backgroundColor: 'rgba(200,162,74,0.04)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '8px', fontWeight: '600' }}>Sector Benchmark</div>
                <div style={{ fontSize: '15px', color: '#ccc', lineHeight: '1.6' }}>
                  <span style={{ color: gold, fontWeight: '700' }}>{primary.sector_benchmark.frequency_pct}%</span> of businesses in your sector show this same constraint
                </div>
                <div style={{ fontSize: '11px', color: confidenceColor(primary.sector_benchmark.confidence), marginTop: '6px', textTransform: 'capitalize' as const }}>Benchmark confidence: {primary.sector_benchmark.confidence}</div>
              </div>
            )}

            {primary.opportunity && (
              <div style={{ borderTop: '1px solid #1a2a10', paddingTop: '20px', display: 'flex', gap: '40px', flexWrap: 'wrap' as const }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Opportunity Range</div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: gold }}>£{((primary.opportunity.value_low || 0)/1000).toFixed(0)}k – £{((primary.opportunity.value_high || 0)/1000).toFixed(0)}k</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Dimension</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#ccc', textTransform: 'capitalize' as const }}>{(primary.opportunity.dimension || '').replace('_', ' ')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Root Cause</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: primary.is_root_cause ? '#4aaa4a' : '#888' }}>{primary.is_root_cause ? 'Confirmed' : 'Likely'}</div>
                </div>
              </div>
            )}

            {fullAccess && primary.opportunity?.explanation && (
              <div style={{ borderTop: '1px solid #1a2a10', paddingTop: '20px', marginTop: '20px' }}>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Opportunity Explanation</div>
                <div style={{ fontSize: '14px', color: '#999', lineHeight: '1.75' }}>{primary.opportunity.explanation}</div>
              </div>
            )}
          </GlowCard>
        )}

        {/* Executive summary */}
        {result.recommended_focus && (
          <GlowCard style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '14px', fontWeight: '600' }}>Executive Summary — What Should Happen Next</div>
            <div style={{ fontSize: '15px', color: '#ccc', lineHeight: '1.85' }}>{result.recommended_focus}</div>
          </GlowCard>
        )}

        {/* Locked or unlocked sections based on auth */}
        {!isLoggedIn && (
          <>
            <div style={{ padding: '36px', border: '2px solid rgba(200,162,74,0.25)', borderRadius: '12px', backgroundColor: 'rgba(200,162,74,0.04)', textAlign: 'center' as const, marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '12px', fontWeight: '600' }}>Your Report Is Ready</div>
              <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Create your account to unlock your full MRI</div>
              <div style={{ fontSize: '15px', color: '#999', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px', lineHeight: '1.7' }}>
                Your Health Score and Primary Constraint are visible above. Create a free account to save your results and unlock the full analysis.
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' as const, flexWrap: 'wrap' as const }}>
                <a href={'/register?business_id=' + businessId} style={{ padding: '14px 36px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>Create Account — Free →</a>
                <a href='/login' style={{ padding: '14px 24px', border: '1px solid #2a2a2a', color: '#aaa', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>Already have an account?</a>
              </div>
            </div>
            <div style={{ position: 'relative' as const, marginBottom: '24px' }}>
              <div style={{ ...cardStyle, filter: 'blur(4px)', opacity: 0.35, pointerEvents: 'none' as const, minHeight: '200px' }}>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '16px' }}>Secondary Constraints & Opportunity Map</div>
                <div style={{ height: '120px', backgroundColor: '#0a0a0a', borderRadius: '6px' }} />
              </div>
              <LockOverlay message="Full analysis requires account" cta="Create Free Account →" href={'/register?business_id=' + businessId} />
            </div>
          </>
        )}

        {isLoggedIn && !hasSubscription && (
          <>
            <div style={{ padding: '28px', border: '1px solid #2a3a1a', borderRadius: '10px', backgroundColor: '#080f04', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '8px', fontWeight: '600' }}>Partial Report Unlocked</div>
                <div style={{ fontSize: '17px', fontWeight: '600', marginBottom: '4px' }}>
                  {primary?.name} — £{((primary?.opportunity?.value_low || 0)/1000).toFixed(0)}k–£{((primary?.opportunity?.value_high || 0)/1000).toFixed(0)}k opportunity
                </div>
                <div style={{ fontSize: '14px', color: '#999' }}>Upgrade to access full constraint breakdown, sector benchmarks and deployment engine</div>
              </div>
              <a href='/pricing' style={{ padding: '12px 28px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', textDecoration: 'none', fontSize: '15px', whiteSpace: 'nowrap' as const }}>Upgrade to Full Access →</a>
            </div>
            <div style={{ position: 'relative' as const, marginBottom: '24px' }}>
              <div style={{ ...cardStyle, filter: 'blur(4px)', opacity: 0.35, pointerEvents: 'none' as const, minHeight: '200px' }}>
                <div style={{ height: '160px', backgroundColor: '#0a0a0a', borderRadius: '6px' }} />
              </div>
              <LockOverlay message="Full analysis requires subscription" cta="View Plans →" href="/pricing" />
            </div>
          </>
        )}

        {fullAccess && (
          <>
            {/* Secondary Constraints — full depth */}
            {secondary.length > 0 && (
              <GlowCard style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Secondary Constraints ({secondary.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
                  {secondary.map((c: any) => (
                    <div key={c.key} style={{ padding: '18px', backgroundColor: '#080808', borderRadius: '6px', border: '1px solid #1a1a1a' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap' as const, gap: '8px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#f0f0f0' }}>{c.name}</div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <div style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase' as const, fontWeight: '600' }}>{c.severity || 'medium'}</div>
                          <div style={{ fontSize: '13px', color: c.verification_score >= 80 ? '#4aaa4a' : gold, fontWeight: '700' }}>{c.verification_score}/100</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.6', marginBottom: '10px' }}>{c.hypothesis}</div>
                      {c.evidence && c.evidence.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', marginBottom: c.sector_benchmark || c.opportunity ? '10px' : '0' }}>
                          {c.evidence.map((e: string, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                              <span style={{ color: '#888', fontSize: '10px', marginTop: '3px', flexShrink: 0 }}>◈</span>
                              <span style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.6' }}>{e}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' as const, paddingTop: (c.sector_benchmark || c.opportunity) ? '10px' : '0', borderTop: (c.sector_benchmark || c.opportunity) ? '1px solid #161616' : 'none' }}>
                        {c.sector_benchmark && (
                          <div style={{ fontSize: '11px', color: gold }}>{c.sector_benchmark.frequency_pct}% of businesses in your sector show this constraint</div>
                        )}
                        {c.opportunity && (
                          <div style={{ fontSize: '11px', color: '#888' }}>
                            Opportunity: £{((c.opportunity.value_low || 0)/1000).toFixed(0)}k–£{((c.opportunity.value_high || 0)/1000).toFixed(0)}k
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            )}

            {/* Unverified Flags */}
            {unverifiedFlags.length > 0 && (
              <GlowCard style={{ marginBottom: '24px', borderColor: '#2a2a2a' }}>
                <div style={{ fontSize: '11px', color: '#aaa', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '10px', fontWeight: '600' }}>Detected, Not Verified ({unverifiedFlags.length})</div>
                <div style={{ fontSize: '13px', color: '#999', lineHeight: '1.7', marginBottom: '16px' }}>
                  These were flagged as possible constraints but did not pass BEI's verification challenge. They are not included in your opportunity total or recommendations.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                  {unverifiedFlags.map((f: any, i: number) => (
                    <div key={i} style={{ padding: '14px 16px', backgroundColor: '#0a0a0a', borderRadius: '6px', border: '1px solid #1a1a1a' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '4px' }}>{f.name || f.key || 'Unnamed flag'}</div>
                      {f.reason && (
                        <div style={{ fontSize: '12px', color: '#999', lineHeight: '1.6' }}>{f.reason}</div>
                      )}
                    </div>
                  ))}
                </div>
              </GlowCard>
            )}

            {/* Twin Confidence */}
            {(twinCompleteness != null || twinDataConfidence != null) && (
              <GlowCard style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Data Confidence</div>
                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' as const }}>
                  {twinCompleteness != null && (
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#aaa' }}>Profile Completeness</div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: gold }}>{Math.round(twinCompleteness)}%</div>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#111', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: Math.round(twinCompleteness) + '%', height: '100%', backgroundColor: gold, borderRadius: '3px' }} />
                      </div>
                    </div>
                  )}
                  {twinDataConfidence != null && (
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#aaa' }}>Data Confidence</div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#4aaa4a' }}>{Math.round(twinDataConfidence)}%</div>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#111', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: Math.round(twinDataConfidence) + '%', height: '100%', backgroundColor: '#4aaa4a', borderRadius: '3px' }} />
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '16px', lineHeight: '1.6' }}>
                  Connect more data sources from your dashboard to improve accuracy and unlock higher-confidence verification.
                </div>
              </GlowCard>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginTop: '32px' }}>
              <a href='/dashboard' style={{ padding: '14px 28px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', textDecoration: 'none', fontSize: '15px' }}>Full Dashboard →</a>
              <a href='/constraints' style={{ padding: '14px 24px', border: '1px solid #2a2a2a', color: '#aaa', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}>Constraint Intelligence</a>
              <a href='/opportunities' style={{ padding: '14px 24px', border: '1px solid #2a2a2a', color: '#aaa', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}>Opportunity Centre</a>
              <a href='/deployments' style={{ padding: '14px 24px', border: '1px solid #2a2a2a', color: '#aaa', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}>Deployments</a>
            </div>
          </>
        )}

        {/* Footer note */}
        <div style={{ marginTop: '48px', padding: '16px 20px', border: '1px solid #161616', borderRadius: '6px', backgroundColor: '#0a0a0a' }}>
          <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.8' }}>
            {version} — {confidence === 'high' ? 'All constraints verified against the BEI 5-test verification framework before recommendation.' : 'Rules-based analysis. Verification score reflects confidence level. Connect data sources to improve accuracy.'}
          </div>
        </div>
      </div>
    </main>
  )
}
