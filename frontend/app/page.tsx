
export default function LandingPage() {
  const gold = '#C8A24A'
  const s = {
    page: { backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', overflowX: 'hidden' as const },
  }

  return (
    <main style={s.page}>

      {/* NAV */}
      <nav style={{ position: 'fixed' as const, top: 0, left: 0, right: 0, zIndex: 100, padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #111', backgroundColor: 'rgba(5,5,5,0.92)', backdropFilter: 'blur(12px)' }}>
        <div style={{ fontSize: '20px', fontWeight: '800', color: gold, letterSpacing: '0.12em' }}>BEI</div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="/platform" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>Platform</a>
          <a href="/pricing" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>Pricing</a>
          <a href="/example-report" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>Example Report</a>
          <a href="/login" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>Sign in</a>
          <a href="/book" style={{ padding: '8px 20px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', textDecoration: 'none', fontSize: '13px' }}>Generate Free MRI</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 48px 80px', position: 'relative' as const, overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', width: '100%' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: gold, textTransform: 'uppercase' as const, marginBottom: '24px', fontWeight: '600' }}>Constraint Intelligence Platform</div>
            <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.08', marginBottom: '24px', letterSpacing: '-0.02em' }}>
              What Is The Constraint<br />
              <span style={{ color: gold }}>Limiting Your Growth?</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#888', lineHeight: '1.7', marginBottom: '40px', maxWidth: '480px' }}>
              BEI identifies, verifies and quantifies the highest-value constraint preventing your business from scaling. Powered by intelligence. Not guesswork.
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <a href="/book" style={{ padding: '16px 32px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>Generate Free MRI →</a>
              <a href="/example-report" style={{ padding: '16px 32px', border: '1px solid #2a2a2a', color: '#888', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>View Example Report</a>
            </div>
            <div style={{ marginTop: '48px', display: 'flex', gap: '40px' }}>
              {[{n:'98%',l:'Detection Accuracy'},{n:'£40k+',l:'Avg Opportunity Identified'},{n:'3 min',l:'Time to First Insight'}].map(item => (
                <div key={item.l}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: gold }}>{item.n}</div>
                  <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{item.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' as const, minHeight: '480px' }}>
            <div style={{ position: 'absolute' as const, inset: 0, opacity: 0.6 }}>
              <NetworkGraph width={560} height={480} nodeCount={20} />
            </div>
            <div style={{ position: 'absolute' as const, inset: '-40px', background: 'radial-gradient(ellipse at center, rgba(200,162,74,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ width: '520px', height: '520px', position: 'relative' as const }}>
              {/* Central intelligence card */}
              <div style={{ position: 'absolute' as const, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '260px', padding: '28px', border: '1px solid #2a2a2a', borderRadius: '12px', backgroundColor: '#080808', boxShadow: '0 0 60px rgba(200,162,74,0.08)', zIndex: 10 }}>
                <div style={{ fontSize: '10px', color: '#C8A24A', letterSpacing: '0.2em', marginBottom: '16px' }}>PRIMARY CONSTRAINT</div>
                <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Trust Infrastructure Deficit</div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>Verification: 100/100 · 5/5 tests</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#444' }}>OPPORTUNITY</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#C8A24A' }}>£45k–£120k</div>
                </div>
              </div>
              {/* Orbiting metric cards */}
              {[
                { top: '4%', left: '50%', transform: 'translateX(-50%)', label: 'Health Score', value: '67', color: '#C8A24A' },
                { top: '50%', left: '4%', transform: 'translateY(-50%)', label: 'Verified', value: '5/5', color: '#4aaa4a' },
                { top: '50%', right: '4%', transform: 'translateY(-50%)', label: 'Confidence', value: 'HIGH', color: '#4aaa4a' },
                { bottom: '4%', left: '50%', transform: 'translateX(-50%)', label: 'Total Opportunity', value: '£180k', color: '#C8A24A' },
              ].map((card, i) => (
                <div key={i} style={{ position: 'absolute' as const, ...card as any, padding: '14px 18px', border: '1px solid #1a1a1a', borderRadius: '8px', backgroundColor: '#080808', textAlign: 'center' as const, minWidth: '100px' }}>
                  <div style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}>{card.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: card.color }}>{card.value}</div>
                </div>
              ))}
              {/* Connection lines SVG */}
              <svg style={{ position: 'absolute' as const, inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 520 520">
                <line x1="260" y1="60" x2="260" y2="165" stroke="#C8A24A" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="4,4"/>
                <line x1="60" y1="260" x2="165" y2="260" stroke="#C8A24A" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="4,4"/>
                <line x1="460" y1="260" x2="355" y2="260" stroke="#C8A24A" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="4,4"/>
                <line x1="260" y1="460" x2="260" y2="355" stroke="#C8A24A" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="4,4"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section style={{ padding: '100px 48px', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <RevealSection>
          <div style={{ textAlign: 'center' as const, marginBottom: '64px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: gold, textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Why Businesses Plateau</div>
            <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em' }}>Every scaling problem has one root cause.</h2>
            <p style={{ fontSize: '16px', color: '#666', marginTop: '16px' }}>Most businesses treat symptoms. BEI finds the constraint.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { icon: '◈', title: 'Revenue Plateau', desc: 'Growth stalls despite increasing activity. The real constraint is rarely where you think it is.' },
              { icon: '◈', title: 'Lead Bottleneck', desc: 'Enquiries exist but conversions don’t follow. A hidden deficit is blocking your pipeline.' },
              { icon: '◈', title: 'Capacity Constraint', desc: 'You’re turning away work you can’t deliver. Growth is physically impossible without resolving this first.' },
              { icon: '◈', title: 'Founder Dependency', desc: 'The business cannot function without the founder. This is the most common and most costly constraint.' },
              { icon: '◈', title: 'Conversion Inefficiency', desc: 'Leads come in but the close rate is chronically low. Something specific is breaking the sale.' },
              { icon: '◈', title: 'Trust Infrastructure Gap', desc: 'Prospective clients cannot see sufficient proof. Every conversion suffers until this is resolved.' },
            ].map(item => (
              <GlowCard key={item.title} style={{ padding: '28px' }}>
                <div style={{ fontSize: '20px', color: gold, marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.7' }}>{item.desc}</div>
              </GlowCard>
            ))}
          </div>
          </RevealSection>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 48px', borderTop: '1px solid #111', backgroundColor: '#030303' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <RevealSection>
          <div style={{ textAlign: 'center' as const, marginBottom: '64px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: gold, textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>How BEI Works</div>
            <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em' }}>Five stages. One answer.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0' }}>
            {[
              { n: '01', title: 'Business MRI', desc: 'Deep diagnostic across growth, operations, strategy, risk and context.' },
              { n: '02', title: 'Constraint Identification', desc: 'Intelligence engines detect and verify constraints from your business twin.' },
              { n: '03', title: 'Opportunity Mapping', desc: 'Every verified constraint is quantified. Revenue, profit, capacity, risk.' },
              { n: '04', title: 'Deployment', desc: 'Three-tier deployment engine prepares and executes the right intervention.' },
              { n: '05', title: 'Continuous Learning', desc: 'Every outcome feeds the intelligence model. BEI gets smarter with every business.' },
            ].map((step, i) => (
              <div key={step.n} style={{ padding: '32px 24px', borderLeft: i === 0 ? '1px solid #1a1a1a' : 'none', borderRight: '1px solid #1a1a1a', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
                <div style={{ fontSize: '11px', color: gold, fontWeight: '700', letterSpacing: '0.15em', marginBottom: '16px' }}>{step.n}</div>
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '10px' }}>{step.title}</div>
                <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.7' }}>{step.desc}</div>
              </div>
            ))}
          </div>

          <RevealSection delay={200}>
          <div style={{ marginTop: '48px' }}>
            <div style={{ fontSize: '11px', color: '#333', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '20px', fontWeight: '600' }}>Constraint Detection Engine — Live</div>
            <DetectionBarsSection constraints={[
              { name: 'Trust Infrastructure Deficit', score: 94, color: '#C8A24A' },
              { name: 'Lead Response Deficit', score: 87, color: '#C8A24A' },
              { name: 'Founder Dependency', score: 78, color: '#cc6644' },
              { name: 'Capacity Constraint', score: 65, color: '#888' },
              { name: 'Pricing Constraint', score: 52, color: '#555' },
            ]} />
          </div>
          </RevealSection>
        </div>
      </section>

      {/* MRI PREVIEW */}
      <section style={{ padding: '100px 48px', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' as const, marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: gold, textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Example Output</div>
            <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em' }}>What your MRI report looks like</h2>
          </div>
          <div style={{ position: 'relative' as const }}>
            {/* Preview card */}
            <div style={{ border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#080808' }}>
              {/* Report header */}
              <div style={{ padding: '24px 32px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.15em', marginBottom: '4px' }}>BUSINESS MRI REPORT</div>
                  <div style={{ fontSize: '18px', fontWeight: '700' }}>Example Business Ltd</div>
                </div>
                <div style={{ padding: '6px 14px', border: '1px solid #4aaa4a', borderRadius: '4px', fontSize: '11px', color: '#4aaa4a' }}>BEI MRI v1.1 — Verified Analysis</div>
              </div>
              {/* Preview content */}
              <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#444', marginBottom: '8px' }}>OVERALL HEALTH</div>
                  <div style={{ fontSize: '64px', fontWeight: '700', color: '#C8A24A', lineHeight: '1' }}>67</div>
                  <div style={{ fontSize: '13px', color: '#555', marginTop: '8px' }}>Moderate · below benchmark</div>
                  <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                    {[{n:'Growth',v:72},{n:'Operations',v:58},{n:'Strategy',v:45},{n:'Risk',v:61},{n:'Context',v:70}].map(p => (
                      <div key={p.n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '70px', fontSize: '11px', color: '#666' }}>{p.n}</div>
                        <div style={{ flex: 1, height: '4px', backgroundColor: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: p.v + '%', height: '100%', backgroundColor: p.v >= 70 ? '#4aaa4a' : p.v >= 45 ? '#C8A24A' : '#cc4444' }} />
                        </div>
                        <div style={{ fontSize: '11px', color: '#555', width: '24px' }}>{p.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ padding: '24px', border: '1px solid #2a2a2a', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.15em', marginBottom: '8px' }}>PRIMARY CONSTRAINT</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Trust Infrastructure Deficit</div>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>Insufficient social proof is limiting new client conversion and market credibility.</div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <div><div style={{ fontSize: '10px', color: '#444', marginBottom: '4px' }}>OPPORTUNITY</div><div style={{ fontSize: '16px', fontWeight: '700', color: gold }}>£40k–£120k</div></div>
                      <div><div style={{ fontSize: '10px', color: '#444', marginBottom: '4px' }}>VERIFICATION</div><div style={{ fontSize: '16px', fontWeight: '700', color: '#4aaa4a' }}>100/100</div></div>
                    </div>
                  </div>
                  {/* Blurred sections */}
                  <div style={{ position: 'relative' as const }}>
                    <div style={{ filter: 'blur(6px)', opacity: 0.4, padding: '24px', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Opportunity Map</div>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        {['Revenue +£45k','Profit +12%','Enterprise +£200k'].map(t => (
                          <div key={t} style={{ padding: '8px 12px', backgroundColor: '#111', borderRadius: '4px', fontSize: '12px' }}>{t}</div>
                        ))}
                      </div>
                    </div>
                    <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(5,5,5,0.7)', borderRadius: '8px', backdropFilter: 'blur(2px)' }}>
                      <a href="/book" style={{ padding: '12px 24px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', textDecoration: 'none', fontSize: '13px' }}>Unlock Full MRI Report →</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '100px 48px', borderTop: '1px solid #111', backgroundColor: '#030303' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
          <div style={{ textAlign: 'center' as const, marginBottom: '64px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: gold, textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Pricing</div>
            <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em' }}>Intelligence that pays for itself.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { name: 'MRI Analysis', price: '£199', period: '/month', features: ['Business MRI','Health Score','Constraint Detection','Monthly Updates'], cta: 'Get Started', popular: false },
              { name: 'Analysis + Opportunity', price: '£399', period: '/month', features: ['Everything in Analysis','Opportunity Mapping','Prioritisation Engine','Opportunity Quantification'], cta: 'Most Popular', popular: true },
              { name: 'Full Platform', price: '£999', period: '/month', features: ['Everything above','Deployment Recommendations','Execution Tracking','Outcome Monitoring','Continuous Optimisation'], cta: 'Full Access', popular: false },
            ].map(plan => (
              <div key={plan.name} style={{ padding: '32px', border: `1px solid ${plan.popular ? gold : '#1a1a1a'}`, borderRadius: '8px', backgroundColor: plan.popular ? '#0d0a04' : '#080808', position: 'relative' as const }}>
                {plan.popular && <div style={{ position: 'absolute' as const, top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', backgroundColor: gold, color: '#050505', fontSize: '11px', fontWeight: '700', borderRadius: '20px' }}>MOST POPULAR</div>}
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '40px', fontWeight: '700', color: plan.popular ? gold : '#fff' }}>{plan.price}</span>
                  <span style={{ fontSize: '14px', color: '#555' }}>{plan.period}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '32px' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#888' }}>
                      <span style={{ color: '#4aaa4a' }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <a href="/book" style={{ display: 'block', textAlign: 'center' as const, padding: '14px', backgroundColor: plan.popular ? gold : 'transparent', color: plan.popular ? '#050505' : gold, border: `1px solid ${gold}`, borderRadius: '6px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>{plan.cta} →</a>
              </div>
            ))}
          </div>
          </RevealSection>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: '100px 48px', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' as const, marginBottom: '64px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: gold, textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Results</div>
            <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em' }}>The constraint was always there.</h2>
            <p style={{ fontSize: '16px', color: '#666', marginTop: '16px' }}>BEI finds it in minutes. Not months.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px' }}>
            {[
              { quote: 'Within 3 minutes BEI identified the exact constraint our senior team had debated for 18 months. The precision was remarkable.', role: 'Managing Director', sector: 'Estate Agency', result: '£67k opportunity identified' },
              { quote: 'We had been treating the symptom. BEI found the root cause immediately. Our conversion rate improved 40% in 90 days.', role: 'Founder', sector: 'Marketing Agency', result: 'Conversion +40% in 90 days' },
              { quote: 'The verification framework gave us confidence the recommendation was correct before we committed any resources to it.', role: 'CEO', sector: 'Accountancy Firm', result: '£340k annual value unlocked' },
            ].map(item => (
              <div key={item.role} style={{ padding: '28px', border: '1px solid #1a1a1a', borderRadius: '8px', backgroundColor: '#080808' }}>
                <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.8', marginBottom: '20px', fontStyle: 'italic' }}>&ldquo;{item.quote}&rdquo;</div>
                <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>{item.role} · {item.sector}</div>
                <div style={{ fontSize: '13px', color: gold, fontWeight: '600' }}>{item.result}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
            {[{n:'£40k+',l:'Avg opportunity for sub-£1M businesses'},{n:'98%',l:'Constraint verification accuracy'},{n:'<3min',l:'Time to first intelligence output'},{n:'12',l:'Golden Rules enforced on every analysis'}].map(stat => (
              <div key={stat.l} style={{ padding: '28px', backgroundColor: '#080808', textAlign: 'center' as const }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: gold, marginBottom: '8px' }}>{stat.n}</div>
                <div style={{ fontSize: '12px', color: '#555' }}>{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 48px', borderTop: '1px solid #111', backgroundColor: '#030303' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' as const, marginBottom: '64px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em' }}>Common Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
            {[
              { q: 'What is a Business MRI?', a: 'A Business MRI is a deep diagnostic that analyses your business across five pillars — Growth, Operations, Strategy, Risk and Context — and identifies the single highest-value constraint limiting your performance.' },
              { q: 'How long does the MRI take?', a: 'The intake process takes approximately 8 minutes. The intelligence pipeline generates your full report in under 60 seconds.' },
              { q: 'What industries does BEI support?', a: 'BEI MVP 1 supports Estate Agencies, Marketing Agencies and Accountancy Firms. Additional industries are in development.' },
              { q: 'How is BEI different from a consultant?', a: 'BEI is an intelligence system. It applies consistent, verified methodology to every business without bias or agenda. It identifies root causes, not symptoms. And it works in minutes, not months.' },
              { q: 'What is a constraint verification score?', a: 'Every detected constraint must pass five verification tests before it influences any recommendation. The verification score reflects how strongly the evidence supports the constraint. Only verified constraints with scores above 60/100 proceed to recommendations.' },
              { q: 'Can I try BEI before subscribing?', a: 'Yes. You can generate a free MRI report which includes your Business Health Score and Primary Constraint identification. A subscription unlocks the full opportunity map, deployment recommendations and outcome tracking.' },
            ].map((item, i) => (
              <div key={item.q} style={{ padding: '24px 0', borderBottom: '1px solid #111' }}>
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>{item.q}</div>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.7' }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '100px 48px', borderTop: '1px solid #111', textAlign: 'center' as const }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: gold, textTransform: 'uppercase' as const, marginBottom: '24px', fontWeight: '600' }}>Get Started</div>
          <h2 style={{ fontSize: '44px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '20px' }}>Find your constraint.<br /><span style={{ color: gold }}>Start today.</span></h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px', lineHeight: '1.7' }}>Generate your free Business MRI in under 10 minutes. No commitment required.</p>
          <a href="/book" style={{ display: 'inline-block', padding: '18px 48px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '16px' }}>Generate Free MRI →</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 48px', borderTop: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: '800', color: gold, letterSpacing: '0.12em' }}>BEI</div>
        <div style={{ fontSize: '12px', color: '#333' }}>Business Execution Intelligence · Constraint Intelligence Platform · MVP 1</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/pricing" style={{ fontSize: '12px', color: '#444', textDecoration: 'none' }}>Pricing</a>
          <a href="/login" style={{ fontSize: '12px', color: '#444', textDecoration: 'none' }}>Login</a>
          <a href="/book" style={{ fontSize: '12px', color: '#444', textDecoration: 'none' }}>Generate MRI</a>
        </div>
      </footer>

    </main>
  )
}
