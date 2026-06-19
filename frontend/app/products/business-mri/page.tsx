'use client'

import { RevealSection } from '../../../components/BEIAnimations'
import Nav from '../../components/Nav'

const gold = '#C8A24A'
const dark = '#050505'
const card = '#0a0a0a'
const border = '#1e1e1e'

export default function BusinessMRIPage() {
  return (
    <main style={{ backgroundColor: dark, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>

      <Nav active="products" />

      {/* HERO */}
      <section style={{ padding: '100px 48px 80px', borderBottom: '1px solid #111', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(200,162,74,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Products — Business MRI™</div>
            <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.08', letterSpacing: '-0.02em', marginBottom: '24px', maxWidth: '800px' }}>
              The Business MRI™.<br /><span style={{ color: gold }}>Your constraint, identified and verified.</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8', maxWidth: '620px', marginBottom: '40px' }}>
              The Business MRI™ is BEI's core intelligence product. In approximately 8 minutes of structured intake, the BEI intelligence system builds a complete model of your business, detects every active constraint, verifies the primary one, and delivers a verified recommendation with a quantified opportunity — in under 60 seconds.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href='/book' style={{ padding: '16px 36px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '15px', boxShadow: '0 0 40px rgba(200,162,74,0.2)' }}>Generate Your Free MRI →</a>
              <a href='/example-report' style={{ padding: '16px 24px', border: '1px solid #2a2a2a', color: '#777', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>View Example Report</a>
            </div>
          </RevealSection>

          <RevealSection delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden', marginTop: '64px' }}>
              {[
                { n: '8 min', l: 'Intake duration', s: 'Structured, precise, complete' },
                { n: '< 60s', l: 'Report generation', s: 'Intelligence pipeline output' },
                { n: '100/100', l: 'Max verification score', s: 'Achieved on confirmed constraints' },
                { n: '10 types', l: 'Constraint categories', s: 'Every class detected and scored' },
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

      {/* WHAT IS IT */}
      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>What It Is</div>
                <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '20px' }}>Not a report. An intelligence output.</h2>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8', marginBottom: '24px' }}>
                  A traditional business report describes what has happened. The Business MRI™ identifies what is happening beneath the surface — the structural constraint that is silently limiting your growth, revenue, and operational performance right now.
                </p>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
                  It is built on a proprietary intelligence architecture: a Business Twin model, a 10-category constraint detection engine, a 5-test verification framework, and a decision intelligence layer that produces a single, verified, actionable output — your primary constraint and the quantified opportunity its resolution represents.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: 'Business Twin™', desc: 'A structural model of your business built from your intake data — covering all five health pillars and used as the foundation for every intelligence decision.' },
                  { title: 'Constraint Detection', desc: 'The intelligence engine scans all 10 constraint categories simultaneously, scoring each against your Business Twin to identify every active constraint.' },
                  { title: 'Constraint Verification', desc: 'The primary constraint is subjected to a 5-test verification framework before any recommendation is made. Nothing is recommended unverified.' },
                  { title: 'Decision Intelligence', desc: 'The verified constraint is explained in plain language — what it is, why it is primary, what it is costing you, and what resolving it is worth.' },
                ].map(item => (
                  <div key={item.title} style={{ padding: '20px 24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.25), transparent)' }} />
                    <div style={{ fontSize: '14px', fontWeight: '700', color: gold, marginBottom: '6px' }}>{item.title}</div>
                    <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.7' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* THE 6-STEP PROCESS */}
      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111', backgroundColor: '#030303' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>The Process</div>
              <h2 style={{ fontSize: '44px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>8 minutes in. Verified intelligence out.</h2>
              <p style={{ fontSize: '16px', color: '#555', maxWidth: '560px', margin: '0 auto' }}>The MRI intake is structured in six steps. Each step builds a layer of your Business Twin. Nothing is skipped. Nothing is estimated.</p>
            </div>
          </RevealSection>
          <RevealSection delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {[
                { step: '01', title: 'Business Profile', desc: 'Revenue, headcount, sector, stage, and operating model. This establishes the structural baseline against which all constraint signals are measured.' },
                { step: '02', title: 'Financial Health', desc: 'Revenue trend, margin structure, cash position, and financial concentration. BEI identifies financial constraints that are invisible in headline numbers.' },
                { step: '03', title: 'Operations & Capacity', desc: 'Delivery model, capacity utilisation, founder dependency, and key-person concentration. Where operational constraints hide in plain sight.' },
                { step: '04', title: 'Market & Offer', desc: 'Offer clarity, positioning precision, competitive context, and pricing confidence. Market constraints are the most misdiagnosed class of business problem.' },
                { step: '05', title: 'Team & Leadership', desc: 'Leadership bandwidth, decision-making structure, and execution capability. The constraint often lives here — and is rarely identified without a structured model.' },
                { step: '06', title: 'Growth & Strategy', desc: 'Growth trajectory, strategic clarity, and resource alignment. This final step completes the Business Twin and triggers the constraint detection pipeline.' },
              ].map(item => (
                <div key={item.step} style={{ padding: '32px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', display: 'flex', gap: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.2), transparent)' }} />
                  <div style={{ fontSize: '32px', fontWeight: '800', color: 'rgba(200,162,74,0.2)', lineHeight: '1', flexShrink: 0 }}>{item.step}</div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#e0e0e0', marginBottom: '8px' }}>{item.title}</div>
                    <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.7' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* FIVE HEALTH PILLARS */}
      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Business Health Score</div>
              <h2 style={{ fontSize: '44px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>Five pillars. One score. Complete picture.</h2>
              <p style={{ fontSize: '16px', color: '#555', maxWidth: '560px', margin: '0 auto' }}>Every MRI produces a Business Health Score across five pillars — giving you a precise, comparable measure of business health that updates with every monthly refresh.</p>
            </div>
          </RevealSection>
          <RevealSection delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              {[
                { pillar: 'Financial', score: '0–20', desc: 'Revenue trend, margin health, cash position, and financial concentration risk.' },
                { pillar: 'Operations', score: '0–20', desc: 'Capacity utilisation, delivery consistency, founder dependency, and process reliability.' },
                { pillar: 'Market', score: '0–20', desc: 'Offer clarity, market positioning, competitive standing, and pricing confidence.' },
                { pillar: 'Team', score: '0–20', desc: 'Leadership bandwidth, decision-making quality, and execution capability.' },
                { pillar: 'Strategy', score: '0–20', desc: 'Strategic clarity, growth trajectory, and resource alignment.' },
              ].map(item => (
                <div key={item.pillar} style={{ padding: '28px 20px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.3), transparent)' }} />
                  <div style={{ fontSize: '15px', fontWeight: '700', color: gold, marginBottom: '6px' }}>{item.pillar}</div>
                  <div style={{ fontSize: '12px', color: '#444', marginBottom: '12px' }}>{item.score} pts</div>
                  <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* VERIFICATION */}
      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111', backgroundColor: '#030303' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Constraint Verification</div>
                <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '20px' }}>Nothing is recommended unverified.</h2>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8', marginBottom: '24px' }}>
                  Every primary constraint identified by BEI is subjected to a 5-test verification framework before a recommendation is made. This is what separates BEI from every other intelligence tool — we do not surface insights, we verify them.
                </p>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
                  A constraint must pass all five tests to be confirmed as primary. Partial matches are classified as secondary constraints and tracked — but never presented as the primary recommendation.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { test: 'Test 1', title: 'Systemic Impact', desc: 'Does this constraint affect multiple pillars simultaneously? A true primary constraint touches more than one area of the business.' },
                  { test: 'Test 2', title: 'Root Cause Confirmation', desc: 'Is this a root cause or a symptom? BEI traces each candidate constraint back to its origin before classifying it.' },
                  { test: 'Test 3', title: 'Opportunity Quantification', desc: 'Can the opportunity from resolving this constraint be quantified? If not, it cannot be the primary.' },
                  { test: 'Test 4', title: 'Intervention Feasibility', desc: 'Is there a deployable intervention available within the client\'s current resource envelope?' },
                  { test: 'Test 5', title: 'Precedence Check', desc: 'Would resolving any other constraint produce a higher-value outcome? The primary constraint must be the highest-value target.' },
                ].map(item => (
                  <div key={item.test} style={{ padding: '16px 20px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', display: 'flex', gap: '16px' }}>
                    <div style={{ fontSize: '11px', color: gold, fontWeight: '700', flexShrink: 0, paddingTop: '2px' }}>{item.test}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#e0e0e0', marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>{item.desc}</div>
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
          <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '600' }}>Get Started</div>
          <h2 style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '20px', lineHeight: '1.1' }}>
            Your constraint is already there.<br /><span style={{ color: gold }}>Find it in 8 minutes.</span>
          </h2>
          <p style={{ fontSize: '17px', color: '#555', marginBottom: '40px', lineHeight: '1.75' }}>
            Generate your free Business MRI™. No commitment required. Your primary constraint identified, verified, and quantified — delivered in under 60 seconds.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href='/book' style={{ padding: '18px 48px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', boxShadow: '0 0 60px rgba(200,162,74,0.2)' }}>Generate Free MRI →</a>
            <a href='/products/outcome-deployment' style={{ padding: '18px 28px', border: '1px solid #2a2a2a', color: '#666', borderRadius: '8px', textDecoration: 'none', fontSize: '16px' }}>Outcome & Deployment Centre →</a>
          </div>
        </div>
      </section>

    </main>
  )
}
