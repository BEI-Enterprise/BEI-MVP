'use client'

export default function ExampleReportPage() {
  const gold = '#C8A24A'

  const pillars = [
    { name: 'Growth', score: 58, band: 'Moderate', color: '#C8A24A' },
    { name: 'Operations', score: 38, band: 'Weak', color: '#cc4444' },
    { name: 'Strategy', score: 45, band: 'Moderate', color: '#C8A24A' },
    { name: 'Risk', score: 31, band: 'Critical', color: '#cc4444' },
    { name: 'Context', score: 67, band: 'Moderate', color: '#C8A24A' },
  ]

  const LockOverlay = ({ message = 'Unlock Full Access' }: { message?: string }) => (
    <div style={{ position: 'absolute' as const, inset: 0, backdropFilter: 'blur(6px)', backgroundColor: 'rgba(5,5,5,0.75)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', borderRadius: '8px', zIndex: 10, gap: '12px' }}>
      <div style={{ fontSize: '20px', color: gold }}>◈</div>
      <div style={{ fontSize: '13px', color: '#888', textAlign: 'center' as const, maxWidth: '200px', lineHeight: '1.6' }}>{message}</div>
      <a href="/register" style={{ padding: '10px 24px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', textDecoration: 'none', fontSize: '13px' }}>Unlock Full Report →</a>
    </div>
  )

  return (
    <main style={{ backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>
      <nav style={{ padding: '0 48px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px', backgroundColor: 'rgba(5,5,5,0.95)', position: 'sticky' as const, top: 0, zIndex: 100 }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: '800', color: gold, letterSpacing: '0.12em', textDecoration: 'none' }}>BEI</a>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#555' }}>Example MRI Report — Preview Only</span>
          <a href="/register" style={{ padding: '8px 20px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', textDecoration: 'none', fontSize: '13px' }}>Get Your Free MRI →</a>
        </div>
      </nav>

      {/* Preview banner */}
      <div style={{ padding: '14px 48px', backgroundColor: 'rgba(200,162,74,0.06)', borderBottom: '1px solid rgba(200,162,74,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: '#888' }}>
          <span style={{ color: gold, fontWeight: '600' }}>◈ Preview Mode</span> — This is an example report. Some sections are locked. Generate your free MRI to see your real results.
        </div>
        <a href="/book" style={{ fontSize: '13px', color: gold, textDecoration: 'none', fontWeight: '600' }}>Generate your free MRI →</a>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.2em', color: gold, marginBottom: '12px', textTransform: 'uppercase' as const }}>Business MRI Report</div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Example Business Ltd</h1>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '4px' }}>Generated: 17 June 2026 · Estate Agency · Under £250k revenue</p>
          <div style={{ marginTop: '16px', display: 'inline-block', padding: '6px 14px', border: '1px solid #4aaa4a', borderRadius: '4px', fontSize: '11px', color: '#4aaa4a', letterSpacing: '0.1em' }}>BEI MRI v1.1 — Verified Analysis</div>
        </div>

        {/* Health Overview — VISIBLE */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Business Health Overview</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px' }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: '64px', fontWeight: '700', color: gold, lineHeight: '1' }}>47</div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>Overall Score</div>
            </div>
            <div style={{ flex: 1, fontSize: '14px', color: '#888', lineHeight: '1.7' }}>
              Your business has solid foundations with clear areas needing attention. One primary constraint is limiting your growth — identifying and resolving it is the highest-value action available to you right now.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
            {pillars.map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '100px', fontSize: '13px', color: '#888' }}>{p.name}</div>
                <div style={{ flex: 1, height: '6px', backgroundColor: '#111', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: p.score + '%', height: '100%', backgroundColor: p.color, borderRadius: '3px' }} />
                </div>
                <div style={{ width: '40px', fontSize: '13px', color: '#666', textAlign: 'right' as const }}>{p.score}</div>
                <div style={{ width: '80px', fontSize: '12px', color: p.color }}>{p.band}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Constraint — PARTIALLY VISIBLE */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Primary Constraint</h2>
          <div style={{ padding: '32px', border: '1px solid #2a2a2a', borderRadius: '8px', backgroundColor: '#080808' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.2em', color: gold, marginBottom: '12px', textTransform: 'uppercase' as const }}>Verified Root Cause · 5/5 Tests Passed</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Trust Infrastructure Deficit</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <div style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', backgroundColor: '#2a0a0a', color: '#cc4444', border: '1px solid #cc4444' }}>HIGH PRIORITY</div>
              <div style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: '#555', border: '1px solid #1a1a1a' }}>Verification: 100/100</div>
            </div>
            <div style={{ fontSize: '14px', color: '#777', marginBottom: '20px', fontStyle: 'italic' }}>
              Insufficient social proof is limiting new client conversion and market credibility.
            </div>
            {/* Evidence — visible */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Supporting Evidence</div>
              {[
                'Business reported very little proof assets (reviews, case studies, testimonials).',
                'Risk pillar score: 31/100 — critical level.',
                'Low trust infrastructure is the primary conversion barrier for estate agencies.',
              ].map((e, i) => (
                <div key={i} style={{ fontSize: '14px', color: '#aaa', paddingLeft: '16px', borderLeft: '2px solid #2a2a2a', marginBottom: '8px', lineHeight: '1.6' }}>{e}</div>
              ))}
            </div>
            {/* Opportunity — visible */}
            <div style={{ padding: '16px', backgroundColor: '#0a0a0a', borderRadius: '4px', border: '1px solid #1a1a1a' }}>
              <div style={{ fontSize: '11px', color: '#444', marginBottom: '4px' }}>INDICATIVE OPPORTUNITY RANGE</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: gold }}>£9,000 — £22,000</div>
              <div style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>Annual revenue opportunity from resolving this constraint</div>
            </div>
          </div>
        </div>

        {/* Decision Intelligence — LOCKED */}
        <div style={{ marginBottom: '48px', position: 'relative' as const }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Decision Intelligence</h2>
          <div style={{ padding: '24px', border: '1px solid #1a1a1a', borderRadius: '8px', backgroundColor: '#080808', filter: 'blur(3px)', userSelect: 'none' as const }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>WHY THIS CONSTRAINT WAS SELECTED</div>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>Trust Infrastructure Deficit has been identified as the Primary Constraint for this business. It passed all 5 verification tests with a score of 100/100. Network dominance score: 80/100. This constraint cascades into Lead Response Deficit. Industry weighting for estate agencies confirms elevated importance...</div>
          </div>
          <LockOverlay message="Subscribe to see the full decision intelligence explanation" />
        </div>

        {/* Secondary Constraints — LOCKED */}
        <div style={{ marginBottom: '48px', position: 'relative' as const }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Secondary Constraints</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px', filter: 'blur(3px)', userSelect: 'none' as const }}>
            {['Founder Dependency', 'Revenue Concentration Risk', 'Offer Weakness'].map(c => (
              <div key={c} style={{ padding: '20px', border: '1px solid #1a1a1a', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>{c}</div>
                <div style={{ fontSize: '12px', color: '#555' }}>Verification: 80/100</div>
              </div>
            ))}
          </div>
          <LockOverlay message="Subscribe to see all verified constraints" />
        </div>

        {/* Opportunity Map — LOCKED */}
        <div style={{ marginBottom: '48px', position: 'relative' as const }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Full Opportunity Map</h2>
          <div style={{ padding: '24px', border: '1px solid #1a1a1a', borderRadius: '8px', backgroundColor: '#080808', filter: 'blur(3px)', userSelect: 'none' as const }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Revenue Opportunity', value: '£9k–£22k' },
                { label: 'Profit Opportunity', value: '£12k–£30k' },
                { label: 'Capacity Opportunity', value: '£8k–£18k' },
                { label: 'Enterprise Value', value: '£45k–£120k' },
              ].map(item => (
                <div key={item.label} style={{ padding: '16px', backgroundColor: '#0a0a0a', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#444', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: gold }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          <LockOverlay message="Analysis + Opportunity plan required" />
        </div>

        {/* Deployment Actions — LOCKED */}
        <div style={{ marginBottom: '48px', position: 'relative' as const }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Deployment Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', filter: 'blur(3px)', userSelect: 'none' as const }}>
            {[
              { tier: 'Tier 1 — Automatic', action: 'Activate Review Request System' },
              { tier: 'Tier 2 — Approval Required', action: 'Build Trust and Social Proof Page' },
              { tier: 'Tier 3 — Recommendation', action: 'Content and PR Trust Strategy' },
            ].map(item => (
              <div key={item.action} style={{ padding: '16px 20px', border: '1px solid #1a1a1a', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.action}</div>
                <div style={{ fontSize: '11px', color: '#555' }}>{item.tier}</div>
              </div>
            ))}
          </div>
          <LockOverlay message="Full Platform plan required" />
        </div>

        {/* CTA */}
        <div style={{ padding: '40px', border: '1px solid #2a2a2a', borderRadius: '12px', backgroundColor: '#080808', textAlign: 'center' as const }}>
          <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '16px' }}>Get Your Real MRI Report</div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>This was an example.<br />Your results will be specific to your business.</h2>
          <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px', lineHeight: '1.7', maxWidth: '480px', margin: '0 auto 32px' }}>Your Business MRI will analyse your actual growth, operations, strategy, risk and context — and identify the exact constraint limiting your performance right now.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <a href="/book" style={{ padding: '16px 40px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>Generate Free MRI →</a>
            <a href="/pricing" style={{ padding: '16px 40px', border: '1px solid #2a2a2a', color: '#888', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>View Pricing</a>
          </div>
        </div>

      </div>
    </main>
  )
}
