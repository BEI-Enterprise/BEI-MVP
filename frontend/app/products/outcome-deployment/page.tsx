'use client'

import { RevealSection } from '../../../components/BEIAnimations'
import Nav from '../../components/Nav'

const gold = '#C8A24A'
const dark = '#050505'
const card = '#0a0a0a'
const border = '#1e1e1e'

export default function OutcomeDeploymentPage() {
  return (
    <main style={{ backgroundColor: dark, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>

      <Nav active="products" />

      {/* HERO */}
      <section style={{ padding: '100px 48px 80px', borderBottom: '1px solid #111', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 80% 50%, rgba(200,162,74,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Products — Outcome & Deployment Centre™</div>
            <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.08', letterSpacing: '-0.02em', marginBottom: '24px', maxWidth: '820px' }}>
              Intelligence is only valuable<br /><span style={{ color: gold }}>when it becomes action.</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8', maxWidth: '620px', marginBottom: '40px' }}>
              The Outcome & Deployment Centre™ is where BEI intelligence becomes business transformation. Once your primary constraint is identified and verified, BEI delivers a structured deployment plan — tiered by resource, sequenced by impact, and tracked against measurable outcomes.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href='/book' style={{ padding: '16px 36px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '15px', boxShadow: '0 0 40px rgba(200,162,74,0.2)' }}>Book Onboarding Call →</a>
              <a href='/pricing' style={{ padding: '16px 24px', border: '1px solid #2a2a2a', color: '#777', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>View Plans</a>
            </div>
          </RevealSection>

          <RevealSection delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden', marginTop: '64px' }}>
              {[
                { n: '3 Tiers', l: 'Deployment structure', s: 'Sequenced by resource and impact' },
                { n: 'Monthly', l: 'Intelligence refresh', s: 'MRI updated every 30 days' },
                { n: '< 48hr', l: 'Risk alert response', s: 'When new signals are detected' },
                { n: '£40k+', l: 'Avg opportunity identified', s: 'For sub-£1M revenue businesses' },
              ].map(m => (
                <div key={m.l} style={{ padding: '28px', backgroundColor: card, textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: gold, marginBottom: '8px' }}>{m.n}</div>
                  <div style={{ fontSize: '13px', color: '#e0e0e0', fontWeight: '600', marginBottom: '4px' }}>{m.l}</div>
                  <div style={{ fontSize: '12px', color: '#444' }}>{m.s}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>
      <section style={{ padding: '60px 48px', borderBottom: '1px solid #1e1e1e' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(200,162,74,0.2)', boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}>
          <img src='/BEI EYE.png' alt='BEI Outcome' style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '700px', objectFit: 'cover', objectPosition: 'center' }} />
        </div>
      </section>

      {/* THREE DEPLOYMENT TIERS */}
      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Deployment Tiers</div>
              <h2 style={{ fontSize: '44px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>Three tiers. One sequenced path to resolution.</h2>
              <p style={{ fontSize: '16px', color: '#555', maxWidth: '600px', margin: '0 auto' }}>BEI does not deliver a report and leave. Every verified constraint comes with a three-tier deployment plan — structured around your resources, your timeline, and your risk tolerance.</p>
            </div>
          </RevealSection>
          <RevealSection delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[
                {
                  tier: 'Tier 1',
                  title: 'Immediate Actions',
                  timeline: 'Days 1–30',
                  color: '#4aaa4a',
                  desc: 'Zero or near-zero cost interventions that can be implemented immediately using existing resources. These are the highest-leverage, lowest-friction actions available.',
                  items: ['Internal process adjustments', 'Communication and positioning changes', 'Resource reallocation within current capacity', 'Quick-win revenue or margin improvements'],
                },
                {
                  tier: 'Tier 2',
                  title: 'Structural Changes',
                  timeline: 'Days 30–90',
                  color: gold,
                  desc: 'Deeper interventions that address the structural root of the constraint. These require investment of time, resource, or capital — but deliver sustained, measurable improvement.',
                  items: ['Operational system or process redesign', 'Team structure or capability changes', 'Offer or pricing model adjustments', 'Market positioning or channel shifts'],
                },
                {
                  tier: 'Tier 3',
                  title: 'Strategic Transformation',
                  timeline: 'Days 90–180',
                  color: '#C8A24A',
                  desc: 'Long-horizon interventions that permanently resolve the constraint class. These are the highest-value actions — requiring the most resource but delivering the most durable outcome.',
                  items: ['Business model evolution', 'Leadership or ownership structure changes', 'Market expansion or repositioning', 'Technology or infrastructure investment'],
                },
              ].map(item => (
                <div key={item.tier} style={{ padding: '36px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: item.color, opacity: 0.4 }} />
                  <div style={{ fontSize: '11px', color: item.color, letterSpacing: '0.2em', fontWeight: '600', marginBottom: '8px' }}>{item.tier} · {item.timeline}</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#e0e0e0', marginBottom: '16px' }}>{item.title}</div>
                  <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '24px' }}>{item.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.items.map(i => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ color: item.color, fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: '13px', color: '#666' }}>{i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* WHAT BEI DELIVERS */}
      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111', backgroundColor: '#030303' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>What BEI Delivers</div>
              <h2 style={{ fontSize: '44px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>Everything you need. Nothing you don't.</h2>
              <p style={{ fontSize: '16px', color: '#555', maxWidth: '560px', margin: '0 auto' }}>BEI is not a suite of tools. It is a complete intelligence programme — delivering verified analysis, structured deployment, and continuous monitoring in one integrated system.</p>
            </div>
          </RevealSection>
          <RevealSection delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {[
                { title: 'Business MRI™ Report', desc: 'Your full constraint intelligence report — primary constraint identified, verified, and quantified. Delivered in under 60 seconds after your 8-minute intake. Refreshed monthly.' },
                { title: 'Business Health Score', desc: 'A scored assessment across all five business health pillars — Financial, Operations, Market, Team, and Strategy — updated with every monthly MRI refresh.' },
                { title: 'Decision Intelligence Brief', desc: 'A plain-language explanation of your primary constraint: what it is, why it is primary, what it is costing you, and the exact opportunity its resolution represents.' },
                { title: 'Three-Tier Deployment Plan', desc: 'A sequenced action plan across Tiers 1, 2, and 3 — immediate actions, structural changes, and strategic transformation — calibrated to your resource envelope.' },
                { title: 'Opportunity Quantification', desc: 'Every primary constraint comes with a quantified opportunity range — the estimated annual value available if the constraint is resolved within the deployment window.' },
                { title: 'Monthly MRI Refresh', desc: 'Your Business Twin is updated monthly. Your health score, constraint status, and opportunity tracking are refreshed automatically — no additional intake required.' },
                { title: 'Risk Alert System', desc: 'When the intelligence engine detects a new risk signal — a constraint emerging, a pillar score declining — you are alerted within 48 hours. Not at your next monthly report.' },
                { title: 'Secondary Constraint Tracking', desc: 'Constraints that do not meet the primary threshold are tracked as secondary. When a secondary constraint escalates, you are notified and it is re-evaluated for primacy.' },
              ].map(item => (
                <div key={item.title} style={{ padding: '28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.25), transparent)' }} />
                  <div style={{ fontSize: '15px', fontWeight: '700', color: gold, marginBottom: '10px' }}>{item.title}</div>
                  <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.7' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* OUTCOME TRACKING */}
      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Outcome Tracking</div>
                <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '20px' }}>Intelligence that measures its own impact.</h2>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8', marginBottom: '24px' }}>
                  BEI does not deliver a recommendation and move on. Every deployment plan comes with defined outcome metrics — specific, measurable indicators that confirm whether the constraint is resolving as expected.
                </p>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
                  Your monthly MRI refresh tracks these metrics directly. If resolution is stalling, the intelligence engine flags it and re-evaluates the deployment plan. If a new constraint emerges as primary, you are notified before it costs you.
                </p>
              </div>
              <div style={{ padding: '40px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.4), transparent)' }} />
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', marginBottom: '24px', fontWeight: '600' }}>OUTCOME DASHBOARD</div>
                {[
                  { label: 'Primary Constraint', value: 'Trust Infrastructure Deficit', status: 'Resolving', up: true },
                  { label: 'Health Score', value: '54 / 100', status: '+7 this month', up: true },
                  { label: 'Tier 1 Actions', value: '4 of 4', status: 'Complete', up: true },
                  { label: 'Tier 2 Actions', value: '2 of 5', status: 'In progress', up: null },
                  { label: 'Opportunity Tracked', value: '£18k – £45k', status: 'Annual', up: null },
                  { label: 'Next MRI Refresh', value: '12 days', status: 'Scheduled', up: null },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #111' }}>
                    <div style={{ fontSize: '13px', color: '#555' }}>{row.label}</div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#e0e0e0' }}>{row.value}</div>
                      <div style={{ fontSize: '11px', color: row.up ? '#4aaa4a' : '#444', marginTop: '2px' }}>{row.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(200,162,74,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '600' }}>Start Today</div>
          <h2 style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '20px', lineHeight: '1.1' }}>
            Identify the constraint.<br /><span style={{ color: gold }}>Then deploy against it.</span>
          </h2>
          <p style={{ fontSize: '17px', color: '#555', marginBottom: '40px', lineHeight: '1.75' }}>
            Book your onboarding call. Generate your first MRI. Receive your deployment plan, your outcome metrics, and your first monthly refresh — from day one.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href='/book' style={{ padding: '18px 48px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', boxShadow: '0 0 60px rgba(200,162,74,0.2)' }}>Book Onboarding Call →</a>
            <a href='/products/bei-intelligence' style={{ padding: '18px 28px', border: '1px solid #2a2a2a', color: '#666', borderRadius: '8px', textDecoration: 'none', fontSize: '16px' }}>BEI Intelligence™ →</a>
          </div>
        </div>
      </section>

    </main>
  )
}
