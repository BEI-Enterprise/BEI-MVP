'use client'
import { useCurrency, getCurrencySymbol, formatPrice } from '../../lib/currency'

import { colors, fontSize, fontWeight, cardStyle, pageWrapper } from '../../lib/design'
import Nav from '../components/Nav'

const gold = '#C8A24A'

const data = {
  business: 'Meridian Estate Agency',
  date: '19 June 2026',
  sector: 'Estate Agency',
  revenue: 'Under £250k',
  version: 'BEI MRI v1.1 — Verified Analysis',
  confidence: 'high',
  health: {
    overall: 47,
    band: 'Moderate',
    vs_benchmark: 'below',
    benchmark: 55,
    pillars: [
      { name: 'Growth', score: 58, band: 'Moderate', benchmark: 60, color: '#C8A24A' },
      { name: 'Operations', score: 38, band: 'Weak', benchmark: 55, color: '#cc4444' },
      { name: 'Strategy', score: 45, band: 'Moderate', benchmark: 52, color: '#C8A24A' },
      { name: 'Risk', score: 31, band: 'Critical', benchmark: 50, color: '#cc4444' },
      { name: 'Context', score: 67, band: 'Moderate', benchmark: 58, color: '#4aaa4a' },
    ]
  },
  primary: {
    name: 'Trust Infrastructure Deficit',
    hypothesis: 'Insufficient verified social proof is limiting new client conversion across all acquisition channels. Every lead that encounters this business faces an unresolved trust gap before committing.',
    severity: 'high',
    verification_score: 94,
    evidence: [
      'Conversion rate of 1-2 in 10 is below industry benchmark of 3-4 in 10 for this sector and revenue band.',
      'Trust infrastructure score of Very Little indicates insufficient review volume, testimonials or case studies.',
      'Average deal value of £3,500 suggests pricing is not the barrier — trust is the primary friction point.',
      'Lead response quality rated Good but conversion remains low, confirming the problem is post-contact not pre-contact.',
    ],
    opportunity: { low: 18000, high: 45000, dimension: 'Revenue' },
  },
  secondary: [
    { name: 'Founder Dependency Risk', score: 78, severity: 'high', hypothesis: 'Critical operational knowledge concentrated in the founder creates a growth ceiling and key person risk.' },
    { name: 'Pricing Confidence Gap', score: 65, severity: 'medium', hypothesis: 'Uncertainty in pricing strategy is limiting average deal value and margin expansion.' },
    { name: 'Lead Response Optimisation', score: 52, severity: 'medium', hypothesis: 'Response time improvements could yield conversion rate gains of 8-15%.' },
  ],
  total_opportunity: { low: 84000, high: 220000 },
  recommended_focus: 'The highest-value action available to this business is resolving the Trust Infrastructure Deficit. This single constraint is suppressing conversion across every acquisition channel. A 90-day focused effort on verified social proof — reviews, case studies, client testimonials — is projected to recover £18k-£45k in annual revenue.',
}

export default function ExampleReportPage() {
  const currency = useCurrency()
  const sym = getCurrencySymbol(currency)
  return (
    <main style={{ backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>

      {/* Nav */}
      <Nav active="/example-report" />

      {/* Preview banner */}
      <div style={{ padding: '14px 48px', backgroundColor: 'rgba(200,162,74,0.05)', borderBottom: '1px solid rgba(200,162,74,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: '#aaa' }}>
          <span style={{ color: gold, fontWeight: '600' }}>◈ Example Report</span> — Fictional data showing what your real BEI MRI looks like. Every number is illustrative.
        </div>
        <a href="/book" style={{ fontSize: '13px', color: gold, textDecoration: 'none', fontWeight: '600' }}>Generate your free MRI →</a>
      </div>

      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Report header */}
        <div style={{ marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.2em', color: gold, marginBottom: '10px', textTransform: 'uppercase' as const }}>Business MRI Report</div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.01em' }}>{data.business}</h1>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '12px' }}>Generated: {data.date} · {data.sector} · {data.revenue} revenue</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ display: 'inline-block', padding: '5px 14px', border: '1px solid rgba(74,170,74,0.4)', borderRadius: '4px', fontSize: '11px', color: '#4aaa4a', letterSpacing: '0.1em', fontWeight: '600' }}>✓ {data.version}</div>
              <div style={{ display: 'inline-block', padding: '5px 14px', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '4px', fontSize: '11px', color: gold, letterSpacing: '0.1em' }}>CONFIDENCE: HIGH</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '6px', letterSpacing: '0.1em' }}>TOTAL OPPORTUNITY</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: gold }}>{sym}{(data.total_opportunity.low/1000).toFixed(0)}k–{sym}{(data.total_opportunity.high/1000).toFixed(0)}k</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Annual value available</div>
          </div>
        </div>

        {/* Health score */}
        <div style={{ ...cardStyle, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '48px' }}>
          <div style={{ textAlign: 'center' as const, minWidth: '140px' }}>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>Overall Health</div>
            <div style={{ fontSize: '88px', fontWeight: '800', color: gold, lineHeight: '1' }}>{data.health.overall}</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#888', marginTop: '8px', textTransform: 'capitalize' as const }}>{data.health.band}</div>
            <div style={{ fontSize: '12px', color: '#cc4444', marginTop: '6px' }}>↓ Below industry benchmark ({data.health.benchmark})</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '20px', lineHeight: '1.7' }}>
              This business has solid foundations with clear areas requiring focused attention. One primary constraint is suppressing performance across multiple pillars.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              {data.health.pillars.map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '80px', fontSize: '13px', color: '#aaa' }}>{p.name}</div>
                  <div style={{ flex: 1, height: '8px', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: p.score + '%', height: '100%', backgroundColor: p.color, borderRadius: '4px' }} />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: p.color, width: '32px' }}>{p.score}</div>
                  <div style={{ fontSize: '11px', color: '#aaa', width: '60px' }}>bm: {p.benchmark}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Primary constraint */}
        <div style={{ ...cardStyle, borderColor: '#2a3a1a', backgroundColor: '#080f04', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '10px', fontWeight: '600' }}>Primary Constraint — Verified</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0f0', marginBottom: '8px', letterSpacing: '-0.01em' }}>{data.primary.name}</div>
              <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#1a0a0a', border: '1px solid #3a1a1a', borderRadius: '20px', fontSize: '11px', color: '#cc4444', fontWeight: '600' }}>HIGH SEVERITY</div>
            </div>
            <div style={{ textAlign: 'right' as const }}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>VERIFICATION SCORE</div>
              <div style={{ fontSize: '40px', fontWeight: '800', color: '#4aaa4a' }}>{data.primary.verification_score}</div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>out of 100</div>
            </div>
          </div>

          <div style={{ fontSize: '15px', color: '#ccc', lineHeight: '1.8', marginBottom: '24px' }}>{data.primary.hypothesis}</div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '14px', fontWeight: '600' }}>Evidence</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
              {data.primary.evidence.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: gold, flexShrink: 0, marginTop: '3px', fontSize: '12px' }}>◈</span>
                  <span style={{ fontSize: '14px', color: '#999', lineHeight: '1.6' }}>{e}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1a2a10', paddingTop: '20px', display: 'flex', gap: '40px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Opportunity Range</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: gold }}>{sym}{(data.primary.opportunity.low/1000).toFixed(0)}k – {sym}{(data.primary.opportunity.high/1000).toFixed(0)}k</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Annual revenue recovery</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Dimension</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#ccc' }}>{data.primary.opportunity.dimension}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Root Cause</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#4aaa4a' }}>Confirmed</div>
            </div>
          </div>
        </div>

        {/* Verification bar */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>5-Test Verification Framework</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
            {[
              { test: 'Multiple data points confirm constraint', pass: true },
              { test: 'Root cause identified (not symptom)', pass: true },
              { test: 'Constraint network impact verified', pass: true },
              { test: 'Opportunity quantification validated', pass: true },
              { test: 'Deployment pathway exists', pass: true },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', backgroundColor: '#080808', borderRadius: '6px', border: '1px solid #1a1a1a' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: t.pass ? 'rgba(74,170,74,0.15)' : 'rgba(204,68,68,0.15)', border: t.pass ? '1px solid #4aaa4a' : '1px solid #cc4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', color: t.pass ? '#4aaa4a' : '#cc4444' }}>{t.pass ? '✓' : '✗'}</span>
                </div>
                <span style={{ fontSize: '13px', color: '#888' }}>{t.test}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Executive summary */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '14px', fontWeight: '600' }}>Executive Summary</div>
          <div style={{ fontSize: '15px', color: '#ccc', lineHeight: '1.85' }}>{data.recommended_focus}</div>
        </div>

        {/* Secondary constraints — locked */}
        <div style={{ position: 'relative' as const, marginBottom: '24px' }}>
          <div style={{ ...cardStyle, filter: 'blur(4px)', opacity: 0.4, pointerEvents: 'none' as const }}>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Secondary Constraints</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              {data.secondary.map((c, i) => (
                <div key={i} style={{ padding: '16px', backgroundColor: '#080808', borderRadius: '6px', border: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>{c.name}</div>
                  <div style={{ fontSize: '13px', color: '#aaa' }}>{c.hypothesis}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(5,5,5,0.85)', borderRadius: '8px', backdropFilter: 'blur(2px)', gap: '12px' }}>
            <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontWeight: '600' }}>🔒 3 Secondary Constraints Identified</div>
            <div style={{ fontSize: '13px', color: '#999', textAlign: 'center' as const, maxWidth: '320px', lineHeight: '1.6' }}>Create your account to unlock constraint network analysis, opportunity map and deployment recommendations.</div>
            <a href="/book" style={{ padding: '12px 32px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}>Generate Your Free MRI →</a>
          </div>
        </div>

        {/* Deployment — locked */}
        <div style={{ position: 'relative' as const, marginBottom: '40px' }}>
          <div style={{ ...cardStyle, filter: 'blur(4px)', opacity: 0.4, pointerEvents: 'none' as const }}>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Deployment Recommendations</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              {['Implement review collection system across all client touchpoints', 'Create 3 detailed case studies from recent successful transactions', 'Build testimonial library with video content from top clients'].map((a, i) => (
                <div key={i} style={{ padding: '16px', backgroundColor: '#080808', borderRadius: '6px', border: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '14px', color: '#888' }}>{a}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(5,5,5,0.85)', borderRadius: '8px', backdropFilter: 'blur(2px)', gap: '12px' }}>
            <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontWeight: '600' }}>🔒 Deployment Engine Locked</div>
            <div style={{ fontSize: '13px', color: '#999', textAlign: 'center' as const, maxWidth: '320px', lineHeight: '1.6' }}>Upgrade to access 3-tier deployment recommendations with measurement plans and outcome tracking.</div>
            <a href="/pricing" style={{ padding: '12px 32px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}>View Plans →</a>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ padding: '40px', border: '2px solid rgba(200,162,74,0.2)', borderRadius: '12px', backgroundColor: 'rgba(200,162,74,0.04)', textAlign: 'center' as const }}>
          <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '12px', fontWeight: '600' }}>This is an example report</div>
          <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.01em' }}>See your real constraint in 8 minutes.</div>
          <div style={{ fontSize: '15px', color: '#999', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px', lineHeight: '1.7' }}>Generate your free Business MRI. Real data. Real constraints. Real opportunity. No subscription required.</div>
          <a href="/book" style={{ padding: '16px 48px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '16px', display: 'inline-block' }}>Generate Free MRI →</a>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#aaa' }}>No credit card required · Free · Takes 8 minutes</div>
        </div>

      </div>
    </main>
  )
}
