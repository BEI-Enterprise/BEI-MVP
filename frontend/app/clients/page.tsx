'use client'
import { useCurrency, getCurrencySymbol } from '../../lib/currency'

import Nav from '../components/Nav'
import { useState } from 'react'
import { RevealSection } from '../../components/BEIAnimations'

const gold = '#C8A24A'
const dark = '#050505'
const card = '#0a0a0a'
const border = '#1e1e1e'

export default function ClientsPage() {
  const currency = useCurrency()
  const sym = getCurrencySymbol(currency)

  const nav = [
    { l: 'Home', h: '/' },
    { l: 'Platform', h: '/platform' },
    { l: 'Our Clients', h: '/clients', active: true },
    { l: 'Pricing', h: '/pricing' },
    { l: 'Example Report', h: '/example-report' },
  ]

  return (
    <main style={{ backgroundColor: dark, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>

      <Nav active="/clients" />

      {/* HERO */}
      <section style={{ padding: '100px 48px 80px', borderBottom: '1px solid #111', position: 'relative' as const, overflow: 'hidden' }}>
        <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(200,162,74,0.05) 0%, transparent 60%)', pointerEvents: 'none' as const }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' as const }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '20px', fontWeight: '600' }}>Client Intelligence Programme</div>
              <h1 style={{ fontSize: '52px', fontWeight: '800', lineHeight: '1.08', letterSpacing: '-0.02em', marginBottom: '24px' }}>
                Intelligence for the businesses<br />
                <span style={{ color: gold }}>that build the world.</span>
              </h1>
              <p style={{ fontSize: '18px', color: '#999', lineHeight: '1.75', marginBottom: '40px', maxWidth: '480px' }}>
                BEI serves serious businesses and enterprises with a dedicated intelligence programme. Monthly MRI reports, constraint tracking, risk alerts and continuous intelligence — built for organisations that cannot afford to miss what matters.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href='/book' style={{ padding: '16px 36px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '15px', boxShadow: '0 0 40px rgba(200,162,74,0.2)' }}>Book Onboarding Call →</a>
                <a href='/pricing' style={{ padding: '16px 24px', border: '1px solid #2a2a2a', color: '#aaa', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>View Plans</a>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
              {[
                { n: sym + '1.2M+', l: 'Constraints detected worldwide', s: 'Across all verified client engagements' },
                { n: '100/100', l: 'Maximum verification score achieved', s: 'On every confirmed primary constraint' },
                { n: 'Monthly', l: 'MRI refresh cycle for all clients', s: 'With full breakdown and risk alerts' },
                { n: '< 48hr', l: 'Risk alert response time', s: 'When intelligence detects new signals' },
              ].map(m => (
                <div key={m.l} style={{ padding: '20px 24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', display: 'flex', gap: '20px', alignItems: 'center', position: 'relative' as const, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.25), transparent)' }} />
                  <div style={{ fontSize: '28px', fontWeight: '800', color: gold, minWidth: '100px' }}>{m.n}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#e0e0e0', marginBottom: '3px' }}>{m.l}</div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>{m.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center' as const, marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Who We Serve</div>
              <h2 style={{ fontSize: '44px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>Built for businesses with ambition.</h2>
              <p style={{ fontSize: '16px', color: '#888', maxWidth: '560px', margin: '0 auto' }}>BEI is not for every business. It is for the ones that take growth seriously and need verified intelligence to make decisions that matter.</p>
            </div>
          </RevealSection>
          <RevealSection delay={50}>
            <div style={{ textAlign: 'center' as const, marginBottom: '64px' }}>
              <img src="/clients-page-image.png" alt="The BEI team" style={{ maxWidth: '100%', width: '700px', borderRadius: '12px', border: '1px solid #1e1e1e', display: 'block', margin: '0 auto' }} />
            </div>
          </RevealSection>
          <RevealSection delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[
                {
                  title: 'Scale-Up Businesses',
                  range: sym + '250k – ' + sym + '5M revenue',
                  desc: 'Growing businesses that have outgrown gut instinct and need verified intelligence to identify the single constraint limiting their next stage of growth.',
                  points: ['Primary constraint identification', 'Monthly health score tracking', 'Opportunity quantification', 'Risk monitoring'],
                },
                {
                  title: 'Mid-Market Enterprises',
                  range: sym + '5M – ' + sym + '50M revenue',
                  desc: 'Established businesses where one unresolved constraint can cost millions annually. BEI provides the intelligence layer between strategy and execution.',
                  points: ['Full constraint network analysis', 'Multi-pillar health tracking', 'Enterprise deployment engine', 'Board-level reporting'],
                  featured: true,
                },
                {
                  title: 'Corporate Groups',
                  range: sym + '50M+ revenue',
                  desc: 'Large organisations operating across multiple units that need consistent, verified intelligence applied across their portfolio of businesses.',
                  points: ['Portfolio-level intelligence', 'Comparative constraint analysis', 'Group risk dashboard', 'Executive briefings'],
                },
              ].map(c => (
                <div key={c.title} style={{ padding: '36px', backgroundColor: card, border: '1px solid ' + (c.featured ? 'rgba(200,162,74,0.3)' : border), borderRadius: '12px', position: 'relative' as const, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: c.featured ? 'linear-gradient(90deg, transparent, rgba(200,162,74,0.6), transparent)' : 'linear-gradient(90deg, transparent, rgba(200,162,74,0.2), transparent)' }} />
                  {c.featured && <div style={{ position: 'absolute' as const, top: '16px', right: '16px', padding: '3px 10px', backgroundColor: gold, color: '#050505', fontSize: '10px', fontWeight: '700', borderRadius: '20px' }}>MOST COMMON</div>}
                  <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.15em', marginBottom: '10px', fontWeight: '600' }}>{c.range}</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>{c.title}</div>
                  <div style={{ fontSize: '14px', color: '#999', lineHeight: '1.75', marginBottom: '24px' }}>{c.desc}</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                    {c.points.map(p => (
                      <div key={p} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px', color: '#888' }}>
                        <span style={{ color: gold, fontSize: '10px' }}>◈</span>{p}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ONBOARDING */}
      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111', backgroundColor: '#030303' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Step 1 — Onboarding</div>
                <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '20px' }}>Your dedicated onboarding session.</h2>
                <p style={{ fontSize: '16px', color: '#999', lineHeight: '1.8', marginBottom: '32px' }}>
                  Every new BEI client receives a dedicated onboarding session with the BEI intelligence team. This is not a product demo. It is a full strategic briefing — designed to ensure the intelligence system is calibrated correctly for your business from day one.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
                  {[
                    { title: 'System briefing', desc: 'Full walkthrough of how BEI intelligence works, what it detects and how it makes decisions.' },
                    { title: 'Business Twin construction', desc: 'We walk through your intake data, review your answers and ensure your Business Twin is accurate.' },
                    { title: 'First MRI review', desc: 'We review your first MRI report together — constraint by constraint, evidence by evidence.' },
                    { title: 'Dashboard orientation', desc: 'You leave knowing exactly how to read your health score, act on your constraints and track outcomes.' },
                  ].map((s, i) => (
                    <div key={s.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', color: gold, fontWeight: '700' }}>{i+1}</div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{s.title}</div>
                        <div style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '40px', backgroundColor: card, border: '1px solid rgba(200,162,74,0.2)', borderRadius: '16px', position: 'relative' as const, overflow: 'hidden' }}>
                <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.5), transparent)' }} />
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', marginBottom: '24px', fontWeight: '600' }}>ONBOARDING SESSION INCLUDES</div>
                {[
                  '90-minute dedicated session with BEI intelligence team',
                  'Full system walkthrough and methodology explanation',
                  'Business Twin calibration and validation',
                  'First MRI report review — live, constraint by constraint',
                  'Dashboard setup and navigation',
                  'Q&A on your specific business context',
                  'Action plan for first 90 days based on your primary constraint',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <span style={{ color: '#4aaa4a', fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '14px', color: '#999', lineHeight: '1.5' }}>{item}</span>
                  </div>
                ))}
                <div style={{ marginTop: '28px', padding: '16px', backgroundColor: 'rgba(200,162,74,0.06)', borderRadius: '8px', border: '1px solid rgba(200,162,74,0.15)' }}>
                  <div style={{ fontSize: '12px', color: '#999', lineHeight: '1.7' }}>
                    <span style={{ color: gold, fontWeight: '600' }}>Included with all plans.</span> Every BEI subscriber receives a full onboarding session. No additional cost.
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* MONTHLY MRI */}
      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div style={{ padding: '40px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '16px', position: 'relative' as const, overflow: 'hidden' }}>
                <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.4), transparent)' }} />
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', marginBottom: '20px', fontWeight: '600' }}>MONTHLY MRI REPORT</div>
                {[
                  { label: 'Health Score Movement', value: '47 → 54', change: '+7', up: true },
                  { label: 'Primary Constraint', value: 'Trust Infrastructure Deficit', change: 'Active', up: null },
                  { label: 'Verification Score', value: '94/100', change: 'Confirmed', up: null },
                  { label: 'Opportunity Range', value: sym + '18k – ' + sym + '45k', change: 'Annual', up: null },
                  { label: 'Secondary Constraints', value: '3 identified', change: '1 resolved', up: true },
                  { label: 'Risk Alerts', value: '0 active', change: 'All clear', up: true },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #111' }}>
                    <span style={{ fontSize: '13px', color: '#999' }}>{row.label}</span>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#e0e0e0' }}>{row.value}</span>
                      <span style={{ fontSize: '11px', color: row.up === true ? '#4aaa4a' : row.up === false ? '#cc4444' : gold, fontWeight: '600' }}>{row.change}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Step 2 — Monthly Intelligence</div>
                <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '20px' }}>Your MRI. Every month. Without fail.</h2>
                <p style={{ fontSize: '16px', color: '#999', lineHeight: '1.8', marginBottom: '32px' }}>
                  Every month your Business Twin is updated and a full MRI is run. Your constraints are re-verified. Your health scores are recalculated. Your opportunity map is refreshed. You see what has changed, what has improved and what still needs attention.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
                  {[
                    { title: 'Full constraint re-verification', desc: 'Every constraint is re-run through the 5-test verification framework monthly.' },
                    { title: 'Health score movement tracking', desc: 'See exactly how your 5 pillar scores have moved since last month and why.' },
                    { title: 'Opportunity map refresh', desc: 'Updated opportunity quantification based on any changes in your business data.' },
                    { title: 'Executive summary', desc: 'A clear, plain-English summary of what has changed and what to focus on.' },
                  ].map((s, i) => (
                    <div key={s.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: gold, flexShrink: 0, marginTop: '6px' }} />
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{s.title}</div>
                        <div style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* RISK ALERTS */}
      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111', backgroundColor: '#030303' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Step 3 — Risk Intelligence</div>
                <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '20px' }}>Know before it becomes a problem.</h2>
                <p style={{ fontSize: '16px', color: '#999', lineHeight: '1.8', marginBottom: '32px' }}>
                  BEI monitors your business twin continuously. When the intelligence engine detects a new risk signal — a constraint emerging, a pillar score declining, a concentration risk increasing — you are alerted within 48 hours. Not at your next monthly report. Now.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
                  {[
                    { type: 'CONSTRAINT ALERT', title: 'New constraint detected', desc: 'Capacity constraint signal identified across operations pillar. Verification in progress.', color: '#cc4444', bg: '#1a0a0a', borderColor: '#3a1a1a' },
                    { type: 'RISK ALERT', title: 'Revenue concentration increase', desc: 'Top client now represents 68% of revenue. Threshold exceeded. Review recommended.', color: '#C8A24A', bg: '#0f0a04', borderColor: '#3a2a04' },
                    { type: 'OPPORTUNITY ALERT', title: 'New opportunity quantified', desc: 'Trust infrastructure constraint resolution projected to unlock £12k additional revenue.', color: '#4aaa4a', bg: '#0a1a0a', borderColor: '#1a3a1a' },
                  ].map(alert => (
                    <div key={alert.title} style={{ padding: '20px', backgroundColor: alert.bg, border: '1px solid ' + alert.borderColor, borderRadius: '8px', borderLeft: '3px solid ' + alert.color }}>
                      <div style={{ fontSize: '10px', color: alert.color, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '700' }}>{alert.type}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{alert.title}</div>
                      <div style={{ fontSize: '12px', color: '#999', lineHeight: '1.6' }}>{alert.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '24px', fontWeight: '600' }}>WHAT WE MONITOR</div>
                {[
                  { category: 'Growth Signals', items: ['Lead volume changes', 'Conversion rate movement', 'Revenue trend shifts', 'Market position changes'] },
                  { category: 'Operational Risks', items: ['Capacity threshold breaches', 'Founder dependency increases', 'Delivery bottleneck emergence', 'Key person concentration'] },
                  { category: 'Financial Risks', items: ['Revenue concentration spikes', 'Cash flow deterioration', 'Margin compression signals', 'Client retention decline'] },
                  { category: 'Strategic Risks', items: ['Offer clarity degradation', 'Competitive intensity increase', 'Pricing confidence erosion', 'Market growth slowdown'] },
                ].map(cat => (
                  <div key={cat.category} style={{ marginBottom: '20px', padding: '16px', backgroundColor: card, borderRadius: '8px', border: '1px solid ' + border }}>
                    <div style={{ fontSize: '12px', color: gold, marginBottom: '10px', fontWeight: '600', letterSpacing: '0.1em' }}>{cat.category}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {cat.items.map(item => (
                        <div key={item} style={{ fontSize: '12px', color: '#888', display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ color: '#aaa', fontSize: '8px' }}>●</span>{item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* BEI VS CONSULTANCY */}
      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center' as const, marginBottom: '56px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Comparison</div>
              <h2 style={{ fontSize: '44px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '12px' }}>BEI vs Traditional Consultancy</h2>
              <p style={{ fontSize: '16px', color: '#888' }}>Traditional consultancy sells time. BEI delivers verified intelligence — continuously.</p>
            </div>
            <div style={{ border: '1px solid ' + border, borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: '1px solid ' + border, backgroundColor: '#080808' }}>
                <div style={{ padding: '16px 24px', fontSize: '11px', color: '#aaa', fontWeight: '600', letterSpacing: '0.1em', borderRight: '1px solid ' + border }}>CAPABILITY</div>
                <div style={{ padding: '16px 24px', fontSize: '11px', color: gold, fontWeight: '600', letterSpacing: '0.1em', borderRight: '1px solid ' + border }}>BEI</div>
                <div style={{ padding: '16px 24px', fontSize: '11px', color: '#aaa', fontWeight: '600', letterSpacing: '0.1em' }}>TRADITIONAL CONSULTANCY</div>
              </div>
              {[
                { feature: 'Constraint identification', bei: 'Automated, verified, continuous', them: 'Manual, periodic, expensive' },
                { feature: 'Delivery model', bei: 'Intelligence platform + human support', them: 'Consultant hours billed monthly', highlight: true },
                { feature: 'Time to first insight', bei: 'Under 8 minutes', them: '2–6 weeks discovery phase' },
                { feature: 'Verification framework', bei: '5-test automated verification', them: 'Consultant judgement', highlight: true },
                { feature: 'Monthly reporting', bei: 'Included — automated MRI', them: 'Additional billing required' },
                { feature: 'Risk monitoring', bei: 'Continuous — 48hr alert window', them: 'Not included as standard', highlight: true },
                { feature: 'Cost (SME)', bei: 'From ' + sym + '199/month', them: sym + '5,000–' + sym + '50,000/engagement' },
                { feature: 'Scalability', bei: 'Same intelligence for any size business', them: 'Cost scales with complexity', highlight: true },
              ].map(row => (
                <div key={row.feature} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: '1px solid ' + border, backgroundColor: row.highlight ? 'rgba(200,162,74,0.03)' : 'transparent' }}>
                  <div style={{ padding: '16px 24px', fontSize: '14px', color: '#999', borderRight: '1px solid ' + border }}>{row.feature}</div>
                  <div style={{ padding: '16px 24px', fontSize: '13px', color: '#4aaa4a', fontWeight: '600', borderRight: '1px solid ' + border, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px' }}>✓</span>{row.bei}
                  </div>
                  <div style={{ padding: '16px 24px', fontSize: '13px', color: '#aaa' }}>{row.them}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 48px', textAlign: 'center' as const, position: 'relative' as const, overflow: 'hidden' }}>
        <div style={{ position: 'absolute' as const, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(200,162,74,0.06) 0%, transparent 70%)', pointerEvents: 'none' as const }} />
        <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative' as const }}>
          <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '20px', fontWeight: '600' }}>Start Today</div>
          <h2 style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '20px', lineHeight: '1.1' }}>
            Ready for intelligence<br /><span style={{ color: gold }}>that never stops working?</span>
          </h2>
          <p style={{ fontSize: '17px', color: '#888', marginBottom: '40px', lineHeight: '1.75' }}>
            Book your onboarding call. Generate your first MRI. Start receiving monthly intelligence, risk alerts and verified constraint analysis — from day one.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' as const }}>
            <a href='/book' style={{ padding: '18px 48px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', boxShadow: '0 0 60px rgba(200,162,74,0.2)' }}>Book Onboarding Call →</a>
            <a href='/pricing' style={{ padding: '18px 28px', border: '1px solid #2a2a2a', color: '#999', borderRadius: '8px', textDecoration: 'none', fontSize: '16px' }}>View Plans</a>
          </div>
          <div style={{ marginTop: '24px', fontSize: '13px', color: '#aaa' }}>Onboarding included with all plans · No setup fee · Cancel anytime</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 48px', borderTop: '1px solid #161616', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: '800', color: gold, letterSpacing: '0.12em' }}>BEI</div>
        <div style={{ fontSize: '12px', color: '#aaa' }}>Business Execution Intelligence · Client Intelligence Programme</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['/', 'Home'], ['/platform', 'Platform'], ['/clients', 'Clients'], ['/pricing', 'Pricing'], ['/book', 'Free MRI']].map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: '12px', color: '#aaa', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>
      </footer>

    </main>
  )
}
