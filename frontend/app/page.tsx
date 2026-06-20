'use client'
import { CurrencyProvider, useCurrencyContext } from './context/CurrencyContext'
import CurrencyToggle from './components/CurrencyToggle'
import { CurrencyProvider, useCurrencyContext } from './context/CurrencyContext'
import CurrencyToggle from './components/CurrencyToggle'
import { useCurrency, formatPrice } from '../lib/currency'

import dynamic from 'next/dynamic'
import Nav from './components/Nav'
import { RevealSection, GlowCard, DetectionBarsSection } from '../components/BEIAnimations'

const NetworkGraph = dynamic<{ width: number, height: number, nodeCount: number }>(
  () => import('../components/BEIAnimations').then(m => ({ default: m.NetworkGraph })),
  { ssr: false }
)


export default function LandingPage() {
  const currency = useCurrency()
  const gold = '#C8A24A'
  const s = {
    page: { backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', overflowX: 'hidden' as const },
  }

  return (
    <main style={s.page}>

      <Nav />

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 48px 80px', position: 'relative' as const, overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '48px', alignItems: 'center', width: '100%' }}>
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
              {[{n:sym + '1.2M+',l:'Constraints Detected'},{n:'100/100',l:'Max Verification Score'},{n:'8 min',l:'Time to First Insight'}].map(item => (
                <div key={item.l}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: gold }}>{item.n}</div>
                  <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{item.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' as const, minHeight: '480px', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute' as const, inset: 0, opacity: 0.12, pointerEvents: 'none' as const }}>
              <NetworkGraph width={720} height={600} nodeCount={32} />
            </div>
            <div style={{ position: 'relative' as const, width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 0 80px rgba(0,0,0,0.6), 0 0 40px rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)' }}>
              <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.5), transparent)' }} />
              <img src='/bei-hero.png' alt='BEI Business Intelligence' style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '1200px', objectFit: 'cover' }} />
              <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(135deg, transparent 60%, rgba(5,5,5,0.4) 100%)', pointerEvents: 'none' as const }} />
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
                { icon: '◈', title: 'Lead Bottleneck', desc: "Enquiries exist but conversions don't follow. A hidden deficit is blocking your pipeline." },
                { icon: '◈', title: 'Capacity Constraint', desc: "You're turning away work you can't deliver. Growth is physically impossible without resolving this first." },
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
          </RevealSection>
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
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
            {[
              { name: 'MRI Analysis', price: 199, desc: 'Full constraint intelligence for businesses under £1M.', features: ['Business MRI — full 6-step intake','Health Score — 5 pillars','Constraint Detection — all 10 types','Primary Constraint identification','Monthly MRI refresh'], cta: 'Get Started', popular: false },
              { name: 'Analysis + Opportunity', price: 399, desc: 'Full intelligence with quantified opportunity mapping.', features: ['Everything in MRI Analysis','Opportunity Engine — 5 dimensions','Revenue & profit mapping','Risk reduction quantification','Prioritisation Engine'], cta: 'Most Popular', popular: true },
              { name: 'Full Platform', price: 999, desc: 'Complete intelligence, deployment and outcome tracking.', features: ['Everything in Analysis + Opportunity','Deployment Engine — 3-tier system','Automatic deployment execution','Outcome measurement tracking','Learning Engine'], cta: 'Full Access', popular: false },
            ].map((plan: any) => (
              <div key={plan.name} style={{ padding: '32px', border: `1px solid ${plan.popular ? gold : '#1a1a1a'}`, borderRadius: '12px', backgroundColor: plan.popular ? '#0d0a04' : '#080808', position: 'relative' as const, display: 'flex', flexDirection: 'column' as const }}>
                <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: plan.popular ? `linear-gradient(90deg, transparent, ${gold}, transparent)` : 'linear-gradient(90deg, transparent, rgba(200,162,74,0.15), transparent)' }} />
                {plan.popular && <div style={{ position: 'absolute' as const, top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', backgroundColor: gold, color: '#050505', fontSize: '11px', fontWeight: '700', borderRadius: '20px' }}>MOST POPULAR</div>}
                <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>{plan.name}</div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', marginBottom: '16px' }}>{plan.desc}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '44px', fontWeight: '800', color: plan.popular ? gold : '#f0f0f0', letterSpacing: '-0.02em' }}>{fmt(plan.price as number)}</span>
                  <span style={{ fontSize: '14px', color: '#555' }}>/month</span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '24px' }}>
                  {plan.features.map((f: string) => (
                    <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: '#888' }}>
                      <span style={{ color: '#4aaa4a', flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <a href='/register' style={{ display: 'block', textAlign: 'center' as const, padding: '14px', backgroundColor: plan.popular ? gold : 'transparent', color: plan.popular ? '#050505' : gold, border: `1px solid ${gold}`, borderRadius: '6px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>{plan.cta} →</a>
              </div>
            ))}
          </div>
          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
            {[
              { name: 'Corporate Group', price: 1599, desc: 'Full platform across up to 3 businesses simultaneously.', features: ['Everything in Full Platform','Up to 3 connected businesses','Portfolio health dashboard','Group risk overview & alerts','Executive briefing pack monthly'], cta: 'Corporate Access', badge: 'MULTI-BUSINESS' },
              { name: 'Enterprise', price: null, desc: 'Custom intelligence for enterprises valued £100M–£5B.', features: ['Everything in Corporate Group','Custom enterprise benchmark system','Unlimited connected businesses','Dedicated intelligence team','Board-level reporting suite'], cta: 'Enquire Now', badge: 'ENTERPRISE', enquire: true },
            ].map((plan: any) => (
              <div key={plan.name} style={{ padding: '32px', border: `1px solid ${plan.enquire ? 'rgba(200,162,74,0.35)' : 'rgba(200,162,74,0.2)'}`, borderRadius: '12px', backgroundColor: plan.enquire ? '#0d0a04' : '#09080a', position: 'relative' as const, display: 'flex', flexDirection: 'column' as const }}>
                <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.4), transparent)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>{plan.name}</div>
                  <div style={{ fontSize: '10px', color: gold, backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.25)', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>{plan.badge}</div>
                </div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', marginBottom: '16px' }}>{plan.desc}</div>
                {plan.enquire ? (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: gold }}>Custom Pricing</div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>£2,500–£25,000/month · Scope dependent</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '44px', fontWeight: '800', color: gold, letterSpacing: '-0.02em' }}>{formatPrice(plan.price as number, currency)}</span>
                    <span style={{ fontSize: '14px', color: '#555' }}>/month</span>
                  </div>
                )}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '24px' }}>
                  {plan.features.map((f: string) => (
                    <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: '#888' }}>
                      <span style={{ color: '#4aaa4a', flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <a href={plan.enquire ? '/book' : '/register'} style={{ display: 'block', textAlign: 'center' as const, padding: '14px', backgroundColor: gold, color: '#050505', borderRadius: '6px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>{plan.cta} →</a>
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
            {[{n:sym + '40k+',l:'Avg opportunity for sub-£1M businesses'},{n:'98%',l:'Constraint verification accuracy'},{n:'8 min',l:'Time to first intelligence output'},{n:'12',l:'Golden Rules enforced on every analysis'}].map(stat => (
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
              <div key={item.q} style={{ padding: '24px 0', borderBottom: '1px solid #161616' }}>
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

export default function Home() { return <CurrencyProvider><HomeInner /></CurrencyProvider> }
