'use client'

import dynamic from 'next/dynamic'
import { RevealSection, GlowCard, DetectionBarsSection } from '../../components/BEIAnimations'

const NetworkGraph = dynamic(() => import('../../components/BEIAnimations').then(m => ({ default: m.NetworkGraph })), { ssr: false })

import { useEffect, useState } from 'react'

const gold = '#C8A24A'
const goldDim = 'rgba(200,162,74,0.15)'
const goldGlow = 'rgba(200,162,74,0.08)'
const dark = '#050505'
const card = '#0a0a0a'
const border = '#1e1e1e'
const borderGold = 'rgba(200,162,74,0.3)'



const MetricCard = ({ value, label, sub }: { value: string, label: string, sub?: string }) => (
  <div style={{ padding: '28px 24px', border: `1px solid ${border}`, borderRadius: '10px', backgroundColor: card, position: 'relative' as const, overflow: 'hidden' }}>
    <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />
    <div style={{ fontSize: '40px', fontWeight: '800', color: gold, lineHeight: '1', marginBottom: '8px', letterSpacing: '-0.02em' }}>{value}</div>
    <div style={{ fontSize: '14px', fontWeight: '600', color: '#e0e0e0', marginBottom: '4px' }}>{label}</div>
    {sub && <div style={{ fontSize: '12px', color: '#555' }}>{sub}</div>}
  </div>
)

const ComparisonRow = ({ feature, bei, them, highlight }: { feature: string, bei: string, them: string, highlight?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0', borderBottom: `1px solid ${border}`, backgroundColor: highlight ? 'rgba(200,162,74,0.04)' : 'transparent' }}>
    <div style={{ padding: '16px 20px', fontSize: '14px', color: '#888', borderRight: `1px solid ${border}` }}>{feature}</div>
    <div style={{ padding: '16px 20px', fontSize: '13px', color: '#4aaa4a', fontWeight: '600', borderRight: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '10px' }}>✓</span>{bei}
    </div>
    <div style={{ padding: '16px 20px', fontSize: '13px', color: '#555' }}>{them}</div>
  </div>
)

export default function PlatformPage() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setActiveStep(s => (s + 1) % 5), 3000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    { n: '01', title: 'Business MRI', desc: 'Eight-minute deep diagnostic across Growth, Operations, Strategy, Risk and Context. The Business Twin is constructed from your intake data and any connected systems.', metric: '< 8 min', metricLabel: 'Intake time' },
    { n: '02', title: 'Constraint Detection', desc: 'Intelligence engines scan the Business Twin for all 10 constraint types. Every potential constraint is flagged with initial evidence before any recommendation is made.', metric: '10', metricLabel: 'Constraint types' },
    { n: '03', title: 'Verification Framework', desc: '5-test verification protocol. No constraint proceeds to recommendation without passing all verification checks. Detection is not proof — this is the rule BEI was built on.', metric: '100%', metricLabel: 'Verification required' },
    { n: '04', title: 'Opportunity Mapping', desc: 'Every verified constraint is quantified across five value dimensions: revenue, profit, capacity, risk reduction and enterprise value. The total opportunity range is calculated.', metric: '5', metricLabel: 'Value dimensions' },
    { n: '05', title: 'Deployment & Outcomes', desc: 'Three-tier deployment engine prepares interventions at the right level. Every deployment is measurable. Every outcome feeds the learning model. BEI improves with every business it serves.', metric: '3-tier', metricLabel: 'Deployment system' },
  ]

  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Platform', href: '/platform', active: true },
    { label: 'Our Clients', href: '/clients' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Example Report', href: '/example-report' },
  ]

  return (
    <main style={{ backgroundColor: dark, color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky' as const, top: 0, zIndex: 100, padding: '0 48px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #161616', backgroundColor: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(12px)' }}>
        <a href='/' style={{ fontSize: '20px', fontWeight: '800', color: gold, letterSpacing: '0.12em', textDecoration: 'none' }}>BEI</a>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {nav.map(n => (
            <a key={n.href} href={n.href} style={{ padding: '0 20px', height: '68px', display: 'flex', alignItems: 'center', fontSize: '15px', color: (n as any).active ? '#C8A24A' : '#777777', borderBottom: (n as any).active ? '2px solid #C8A24A' : '2px solid transparent', textDecoration: 'none', fontWeight: (n as any).active ? '600' : '400' }}>{n.label}</a>
          ))}
          <a href='/login' style={{ fontSize: '15px', color: '#777777', textDecoration: 'none', padding: '0 20px', height: '68px', display: 'flex', alignItems: 'center' }}>Sign in</a>
          <a href='/book' style={{ padding: '10px 22px', backgroundColor: '#C8A24A', color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>Free MRI →</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', padding: '80px 48px', position: 'relative' as const, overflow: 'hidden' }}>
        {/* Background glow + network */}
        <div style={{ position: 'absolute' as const, inset: 0, opacity: 0.35, pointerEvents: 'none' as const }}>
          <NetworkGraph width={1200} height={600} nodeCount={24} />
        </div>
        <div style={{ position: 'absolute' as const, top: '20%', left: '10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(200,162,74,0.04) 0%, transparent 70%)', pointerEvents: 'none' as const }} />
        <div style={{ position: 'absolute' as const, top: '40%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(200,162,74,0.03) 0%, transparent 70%)', pointerEvents: 'none' as const }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', width: '100%' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', border: `1px solid ${borderGold}`, borderRadius: '20px', backgroundColor: goldGlow, marginBottom: '28px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: gold, boxShadow: `0 0 8px ${gold}` }} />
              <span style={{ fontSize: '11px', color: gold, fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>Constraint Intelligence Platform</span>
            </div>
            <h1 style={{ fontSize: '58px', fontWeight: '800', lineHeight: '1.06', letterSpacing: '-0.03em', marginBottom: '24px' }}>
              The Intelligence Layer<br />
              <span style={{ color: gold }}>Your Business</span><br />
              Has Been Missing.
            </h1>
            <p style={{ fontSize: '18px', color: '#777', lineHeight: '1.75', marginBottom: '40px', maxWidth: '480px' }}>
              BEI identifies, verifies and quantifies the single highest-value constraint limiting your business. Not a dashboard. Not a report. An intelligence system that answers the question your advisors couldn't.
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '56px' }}>
              <a href='/book' style={{ padding: '16px 36px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '15px', boxShadow: `0 0 40px rgba(200,162,74,0.25)` }}>Generate Free MRI →</a>
              <a href='/example-report' style={{ padding: '16px 28px', border: `1px solid ${border}`, color: '#777', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>View Example Report</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
              {[{ n: '98%', l: 'Verification accuracy' }, { n: '< 3 min', l: 'Time to first insight' }, { n: '£2.4M', l: 'Avg opportunity identified' }].map(m => (
                <div key={m.l}>
                  <div style={{ fontSize: '26px', fontWeight: '700', color: gold, marginBottom: '4px' }}>{m.n}</div>
                  <div style={{ fontSize: '12px', color: '#444' }}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Product preview card */}
          <div style={{ position: 'relative' as const }}>
            <div style={{ position: 'absolute' as const, inset: '-20px', background: 'radial-gradient(ellipse at center, rgba(200,162,74,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' as const }} />
            <div style={{ border: `1px solid ${borderGold}`, borderRadius: '16px', backgroundColor: card, overflow: 'hidden', position: 'relative' as const, boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(200,162,74,0.05)' }}>
              {/* Card header */}
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(180deg, rgba(200,162,74,0.06) 0%, transparent 100%)' }}>
                <div>
                  <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '4px', fontWeight: '600' }}>BUSINESS MRI REPORT</div>
                  <div style={{ fontSize: '16px', fontWeight: '700' }}>Meridian Estate Agency</div>
                </div>
                <div style={{ padding: '4px 12px', border: '1px solid rgba(74,170,74,0.4)', borderRadius: '20px', fontSize: '10px', color: '#4aaa4a', fontWeight: '600', backgroundColor: 'rgba(74,170,74,0.08)' }}>
                  ✓ VERIFIED
                </div>
              </div>

              {/* Health score */}
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{ fontSize: '52px', fontWeight: '800', color: gold, lineHeight: '1' }}>67</div>
                  <div style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>Health Score</div>
                </div>
                <div style={{ flex: 1 }}>
                  {[{ n: 'Growth', v: 72, c: '#4aaa4a' }, { n: 'Operations', v: 58, c: gold }, { n: 'Strategy', v: 45, c: gold }, { n: 'Risk', v: 61, c: gold }, { n: 'Context', v: 70, c: '#4aaa4a' }].map(p => (
                    <div key={p.n} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '64px', fontSize: '11px', color: '#555' }}>{p.n}</div>
                      <div style={{ flex: 1, height: '4px', backgroundColor: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: p.v + '%', height: '100%', backgroundColor: p.c, borderRadius: '2px' }} />
                      </div>
                      <div style={{ fontSize: '11px', color: '#555', width: '20px' }}>{p.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary constraint */}
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${border}` }}>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.15em', marginBottom: '8px', fontWeight: '600' }}>PRIMARY CONSTRAINT</div>
                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Trust Infrastructure Deficit</div>
                <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6', marginBottom: '12px' }}>Insufficient social proof is limiting new client conversion. Every acquisition cycle is affected.</div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#444', marginBottom: '3px' }}>OPPORTUNITY</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: gold }}>£18k–£45k</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#444', marginBottom: '3px' }}>VERIFICATION</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#4aaa4a' }}>100/100</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#444', marginBottom: '3px' }}>SEVERITY</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#cc4444' }}>High</div>
                  </div>
                </div>
              </div>

              {/* Opportunity bar */}
              <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', color: '#444' }}>Total Opportunity Range</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: gold }}>£84k – £220k</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS BAND */}
      <section style={{ padding: '0 48px', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, backgroundColor: '#030303' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
          {[
            { n: '12', l: 'Golden Rules enforced on every analysis', s: 'No exceptions. Ever.' },
            { n: '5-test', l: 'Constraint verification framework', s: 'Before any recommendation.' },
            { n: '10', l: 'Constraint types detected', s: 'Across all five sub-twins.' },
            { n: '3-tier', l: 'Deployment engine', s: 'Automatic, approval-based, strategic.' },
          ].map((m, i) => (
            <div key={m.l} style={{ padding: '36px 28px', borderRight: i < 3 ? `1px solid ${border}` : 'none' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: gold, marginBottom: '8px' }}>{m.n}</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#ccc', marginBottom: '4px', lineHeight: '1.4' }}>{m.l}</div>
              <div style={{ fontSize: '11px', color: '#444' }}>{m.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5-STEP EXECUTION FRAMEWORK */}
      <section style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center' as const, marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Execution Framework</div>
              <h2 style={{ fontSize: '44px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>Five stages. One answer.</h2>
              <p style={{ fontSize: '16px', color: '#555', maxWidth: '560px', margin: '0 auto' }}>Every BEI analysis follows the same verified methodology. No shortcuts. No guesswork.</p>
            </div>
          </RevealSection>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
            {/* Step list */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
              {steps.map((step, i) => (
                <div
                  key={step.n}
                  onClick={() => setActiveStep(i)}
                  style={{ padding: '20px 24px', borderRadius: '10px', cursor: 'pointer', border: `1px solid ${activeStep === i ? borderGold : 'transparent'}`, backgroundColor: activeStep === i ? goldGlow : 'transparent', transition: 'all 0.2s ease' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '11px', color: activeStep === i ? gold : '#333', fontWeight: '700', letterSpacing: '0.1em', minWidth: '24px' }}>{step.n}</div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: activeStep === i ? '#fff' : '#666' }}>{step.title}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active step detail */}
            <div style={{ padding: '36px', border: `1px solid ${borderGold}`, borderRadius: '12px', backgroundColor: card, position: 'relative' as const, overflow: 'hidden', minHeight: '240px' }}>
              <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.15em', marginBottom: '8px', fontWeight: '600' }}>STAGE {steps[activeStep].n}</div>
              <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>{steps[activeStep].title}</div>
              <div style={{ fontSize: '15px', color: '#888', lineHeight: '1.75', marginBottom: '28px' }}>{steps[activeStep].desc}</div>
              <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: gold }}>{steps[activeStep].metric}</div>
                  <div style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>{steps[activeStep].metricLabel}</div>
                </div>
              </div>
            </div>
          </div>
          <RevealSection delay={300}>
          <div style={{ marginTop: '56px', padding: '32px', border: '1px solid #1e1e1e', borderRadius: '12px', backgroundColor: '#080808' }}>
            <div style={{ fontSize: '11px', color: '#333', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '20px', fontWeight: '600' }}>Intelligence Engine — Constraint Detection</div>
            <DetectionBarsSection constraints={[
              { name: 'Trust Infrastructure Deficit', score: 94, color: '#C8A24A' },
              { name: 'Lead Response Deficit', score: 87, color: '#C8A24A' },
              { name: 'Founder Dependency', score: 81, color: '#cc6644' },
              { name: 'Management Bottleneck', score: 73, color: '#888' },
              { name: 'Capacity Constraint', score: 65, color: '#555' },
            ]} />
          </div>
          </RevealSection>
        </div>
      </section>

      {/* INTELLIGENCE ENGINE BANNER */}
      <section style={{ padding: '0 48px', margin: '0', background: `linear-gradient(135deg, rgba(200,162,74,0.08) 0%, transparent 50%, rgba(200,162,74,0.04) 100%)`, borderTop: `1px solid ${borderGold}`, borderBottom: `1px solid ${borderGold}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 0' }}>
          <RevealSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Verified Intelligence</div>
                <h2 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>12 Golden Rules. No Exceptions.</h2>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.75' }}>
                  BEI enforces 12 inviolable intelligence rules on every single analysis. Detection is not proof. Verification comes before recommendation. Root causes are prioritised over symptoms. No constraint reaches a recommendation without passing the full verification framework.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  'Detection Is Not Proof',
                  'Verification Before Recommendation',
                  'Root Causes Over Symptoms',
                  'One Primary Constraint',
                  'Opportunity Before Deployment',
                  'Approval Before Execution',
                  'Learning From Outcomes',
                  'Accuracy Over Volume',
                  'Business Impact Over Activity',
                  'Every Decision Explainable',
                  'Every Constraint Verifiable',
                  'Every Deployment Measurable',
                ].map((rule, i) => (
                  <div key={rule} style={{ padding: '12px 16px', border: `1px solid ${border}`, borderRadius: '6px', backgroundColor: '#080808', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '10px', color: gold, fontWeight: '700', marginTop: '1px', minWidth: '16px' }}>{String(i + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.4' }}>{rule}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* VS CELONIS */}
      <section style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ marginBottom: '48px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Comparison</div>
              <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '12px' }}>BEI vs Process Mining</h2>
              <p style={{ fontSize: '16px', color: '#555' }}>Celonis finds inefficiencies in your processes. BEI finds the constraint limiting your business.</p>
            </div>

            <div style={{ border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0', borderBottom: `1px solid ${border}`, backgroundColor: '#080808' }}>
                <div style={{ padding: '16px 20px', fontSize: '11px', color: '#444', fontWeight: '600', letterSpacing: '0.1em', borderRight: `1px solid ${border}` }}>CAPABILITY</div>
                <div style={{ padding: '16px 20px', fontSize: '11px', color: gold, fontWeight: '600', letterSpacing: '0.1em', borderRight: `1px solid ${border}` }}>BEI</div>
                <div style={{ padding: '16px 20px', fontSize: '11px', color: '#444', fontWeight: '600', letterSpacing: '0.1em' }}>CELONIS</div>
              </div>
              <ComparisonRow feature="Target market" bei="SME — £250k–£5M revenue" them="Enterprise — £100M+ revenue" />
              <ComparisonRow feature="Setup time" bei="8 minutes" them="3–6 months implementation" highlight />
              <ComparisonRow feature="Primary output" bei="Verified root constraint + opportunity" them="Process inefficiency maps" />
              <ComparisonRow feature="Methodology" bei="12 Golden Rules enforcement" them="Event log analysis" highlight />
              <ComparisonRow feature="Pricing" bei="From £199/month" them="£100k+ annual contract" />
              <ComparisonRow feature="Constraint verification" bei="5-test verification framework" them="Not applicable" highlight />
              <ComparisonRow feature="Deployment engine" bei="3-tier automated deployment" them="Manual process redesign" />
              <ComparisonRow feature="Learning model" bei="Continuous — improves with every business" them="Static per implementation" highlight />
            </div>
          </RevealSection>
        </div>
      </section>

      {/* VS PALANTIR */}
      <section style={{ padding: '0 48px 100px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ marginBottom: '48px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Comparison</div>
              <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '12px' }}>BEI vs Data Intelligence</h2>
              <p style={{ fontSize: '16px', color: '#555' }}>Palantir makes your data queryable. BEI makes the answer to your growth constraint verifiable.</p>
            </div>

            <div style={{ border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0', borderBottom: `1px solid ${border}`, backgroundColor: '#080808' }}>
                <div style={{ padding: '16px 20px', fontSize: '11px', color: '#444', fontWeight: '600', letterSpacing: '0.1em', borderRight: `1px solid ${border}` }}>CAPABILITY</div>
                <div style={{ padding: '16px 20px', fontSize: '11px', color: gold, fontWeight: '600', letterSpacing: '0.1em', borderRight: `1px solid ${border}` }}>BEI</div>
                <div style={{ padding: '16px 20px', fontSize: '11px', color: '#444', fontWeight: '600', letterSpacing: '0.1em' }}>PALANTIR</div>
              </div>
              <ComparisonRow feature="Primary use case" bei="SME constraint intelligence" them="Large-scale data integration" />
              <ComparisonRow feature="Question answered" bei="What is my primary constraint?" them="What does my data show?" highlight />
              <ComparisonRow feature="Output type" bei="Verified recommendation with deployment" them="Data visualisation and dashboards" />
              <ComparisonRow feature="Time to insight" bei="Under 3 minutes" them="Weeks to months" highlight />
              <ComparisonRow feature="Required data" bei="8-minute intake + optional connectors" them="Full data infrastructure" />
              <ComparisonRow feature="Verification layer" bei="5-test constraint verification" them="None — user interprets data" highlight />
              <ComparisonRow feature="Action guidance" bei="3-tier deployment with measurement" them="Insight only — no deployment" />
              <ComparisonRow feature="Entry price" bei="£199/month" them="Multi-million annual contract" highlight />
            </div>
          </RevealSection>
        </div>
      </section>

      {/* BENEFIT PANELS */}
      <section style={{ padding: '0 48px 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center' as const, marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Why BEI</div>
              <h2 style={{ fontSize: '44px', fontWeight: '700', letterSpacing: '-0.02em' }}>Intelligence that earns its cost.</h2>
            </div>
          </RevealSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
            {[
              { icon: '◈', title: 'Constraint First', desc: 'BEI does not ask you to interpret data. It identifies the single constraint that — if resolved — creates the most value. One answer. Fully verified.' },
              { icon: '◈', title: 'Verification Before Everything', desc: 'No recommendation without evidence. No evidence without verification. Golden Rule 2 is enforced on every single analysis. This is not negotiable.' },
              { icon: '◈', title: 'Actionable By Design', desc: 'Every constraint is paired with a deployment recommendation. Every deployment has a measurement plan. BEI is not an insight tool. It is an execution system.' },
            ].map(b => (
              <div key={b.title} style={{ padding: '32px', border: `1px solid ${border}`, borderRadius: '12px', backgroundColor: card, position: 'relative' as const, overflow: 'hidden' }}>
                <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, rgba(200,162,74,0.3), transparent)` }} />
                <div style={{ fontSize: '24px', color: gold, marginBottom: '16px' }}>{b.icon}</div>
                <div style={{ fontSize: '17px', fontWeight: '700', marginBottom: '12px' }}>{b.title}</div>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.75' }}>{b.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { n: '£199', l: 'Starting price', s: 'Per month. No setup fee.' },
              { n: '8 min', l: 'MRI intake time', s: 'Full diagnostic in minutes.' },
              { n: '100/100', l: 'Max verification score', s: 'Achieved on verified constraints.' },
              { n: '12', l: 'Golden Rules', s: 'Enforced on every analysis.' },
            ].map(m => (
              <MetricCard key={m.l} value={m.n} label={m.l} sub={m.s} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 48px', borderTop: `1px solid ${border}`, textAlign: 'center' as const, position: 'relative' as const, overflow: 'hidden' }}>
        <div style={{ position: 'absolute' as const, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(200,162,74,0.06) 0%, transparent 70%)', pointerEvents: 'none' as const }} />
        <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative' as const }}>
          <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '24px', fontWeight: '600' }}>Start Today</div>
          <h2 style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '20px', lineHeight: '1.1' }}>
            Find your constraint.<br />
            <span style={{ color: gold }}>In under 10 minutes.</span>
          </h2>
          <p style={{ fontSize: '17px', color: '#555', marginBottom: '40px', lineHeight: '1.75' }}>
            Generate your free Business MRI. No subscription required. See your primary constraint, health score and opportunity estimate before you commit to anything.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' as const }}>
            <a href='/book' style={{ padding: '18px 48px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', boxShadow: `0 0 60px rgba(200,162,74,0.2)` }}>Generate Free MRI →</a>
            <a href='/pricing' style={{ padding: '18px 28px', border: `1px solid ${border}`, color: '#666', borderRadius: '8px', textDecoration: 'none', fontSize: '16px' }}>View Pricing</a>
          </div>
          <div style={{ marginTop: '24px', fontSize: '13px', color: '#333' }}>No credit card required · Free MRI included · Cancel anytime</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 48px', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: '800', color: gold, letterSpacing: '0.12em' }}>BEI</div>
        <div style={{ fontSize: '12px', color: '#333' }}>Business Execution Intelligence · Constraint Intelligence Platform · MVP 1</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['/', 'Home'], ['/platform', 'Platform'], ['/pricing', 'Pricing'], ['/login', 'Sign in'], ['/book', 'Free MRI']].map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: '12px', color: '#444', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>
      </footer>

    </main>
  )
}
