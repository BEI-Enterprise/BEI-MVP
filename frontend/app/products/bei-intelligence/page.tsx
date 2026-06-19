'use client'

import { RevealSection } from '../../../components/BEIAnimations'
import Nav from '../../components/Nav'

const gold = '#C8A24A'
const dark = '#050505'
const card = '#0a0a0a'
const border = '#1e1e1e'

export default function BEIIntelligencePage() {
  return (
    <main style={{ backgroundColor: dark, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>

      <Nav active="products" />

      <section style={{ padding: '100px 48px 80px', borderBottom: '1px solid #111', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(200,162,74,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Products — BEI Intelligence</div>
            <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.08', letterSpacing: '-0.02em', marginBottom: '24px', maxWidth: '820px' }}>
              Human intelligence and AI,<br /><span style={{ color: gold }}>working in permanent unison.</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8', maxWidth: '640px', marginBottom: '40px' }}>
              BEI Intelligence is the continuous monitoring layer beneath every client engagement. Our intelligence team works alongside AI to track growth signals, operational risks, financial risks, and strategic risks across every client and every market sector — updated continuously to maintain complete accuracy.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href='/book' style={{ padding: '16px 36px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '15px', boxShadow: '0 0 40px rgba(200,162,74,0.2)' }}>Book Onboarding Call</a>
              <a href='/clients' style={{ padding: '16px 24px', border: '1px solid #2a2a2a', color: '#777', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>Our Clients</a>
            </div>
          </RevealSection>
          <RevealSection delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden', marginTop: '64px' }}>
              {[
                { n: '24/7', l: 'Continuous monitoring', s: 'No gaps, no blind spots' },
                { n: '4', l: 'Signal domains', s: 'Growth, Operational, Financial, Strategic' },
                { n: '16+', l: 'Risk signal types', s: 'Tracked across all client sectors' },
                { n: '48hr', l: 'Max alert response', s: 'From detection to client notification' },
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

      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>How It Works</div>
                <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '20px' }}>The BEI intelligence team never stops working.</h2>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8', marginBottom: '24px' }}>BEI intelligence team works in permanent unison with AI to monitor the signals that matter across every client market sector. This is not automated reporting. It is a continuous intelligence operation — where human judgement and machine speed combine to maintain accuracy that neither could achieve alone.</p>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>The AI layer scans continuously. The BEI team interprets, validates, and contextualises every signal before it reaches a client. No alert is sent without human verification. No recommendation is made without human oversight.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { step: '01', title: 'AI scans continuously', desc: 'Machine systems monitor growth signals, risk indicators, and sector data across all client market areas in real time — 24 hours a day, without gaps.' },
                  { step: '02', title: 'Signals are flagged and scored', desc: 'Every detected signal is scored for severity, relevance to the client Business Twin, and potential impact on their primary constraint status.' },
                  { step: '03', title: 'BEI team validates', desc: 'The intelligence team reviews every flagged signal. Human judgement determines whether it warrants a client alert, deployment plan update, or full MRI re-evaluation.' },
                  { step: '04', title: 'Client is notified', desc: 'If a signal crosses the alert threshold, the client is notified within 48 hours with context, explanation, and recommended action. Verified intelligence — not raw data.' },
                ].map(item => (
                  <div key={item.step} style={{ padding: '20px 24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', display: 'flex', gap: '16px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.2), transparent)' }} />
                    <div style={{ fontSize: '20px', fontWeight: '800', color: 'rgba(200,162,74,0.3)', flexShrink: 0, lineHeight: '1', paddingTop: '2px' }}>{item.step}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: gold, marginBottom: '6px' }}>{item.title}</div>
                      <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.7' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111', backgroundColor: '#030303' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Signal Domains</div>
              <h2 style={{ fontSize: '44px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>Four domains. Every signal that matters.</h2>
              <p style={{ fontSize: '16px', color: '#555', maxWidth: '580px', margin: '0 auto' }}>BEI Intelligence monitors sixteen signal types across four domains — continuously, across all client market sectors.</p>
            </div>
          </RevealSection>
          <RevealSection delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {[
                {
                  domain: 'Growth Signals',
                  color: '#4aaa4a',
                  bg: '#0a1a0a',
                  borderCol: '#1a3a1a',
                  icon: '↑',
                  desc: 'BEI monitors the signals that indicate whether your business is growing, stalling, or losing ground — before the numbers confirm it.',
                  signals: [
                    { name: 'Lead volume changes', detail: 'Shifts in inbound or outbound lead flow that signal market interest changes ahead of revenue impact.' },
                    { name: 'Conversion rate movement', detail: 'Changes in offer-to-close ratios that indicate positioning, pricing, or trust constraint emergence.' },
                    { name: 'Revenue trend shifts', detail: 'Early trajectory changes in revenue that precede formal period-end reporting by weeks.' },
                    { name: 'Market position changes', detail: 'Competitive and market share signals indicating whether your position is strengthening or eroding.' },
                  ],
                },
                {
                  domain: 'Operational Risks',
                  color: '#C8A24A',
                  bg: '#1a120a',
                  borderCol: '#3a2a1a',
                  icon: '⚙',
                  desc: 'Operational constraints are the most common class of primary constraint — and the most frequently overlooked until they become critical.',
                  signals: [
                    { name: 'Capacity threshold breaches', detail: 'When operational load approaches or exceeds sustainable capacity, signalling imminent delivery risk.' },
                    { name: 'Founder dependency increases', detail: 'Rising concentration of critical decisions or delivery in the founder — a primary constraint accelerant.' },
                    { name: 'Delivery bottleneck emergence', detail: 'Early signals of output constraint across delivery, fulfilment, or service execution systems.' },
                    { name: 'Key person concentration', detail: 'Single-point-of-failure risks emerging across team structure, knowledge, or client relationships.' },
                  ],
                },
                {
                  domain: 'Financial Risks',
                  color: '#cc4444',
                  bg: '#1a0a0a',
                  borderCol: '#3a1a1a',
                  icon: '£',
                  desc: 'Financial constraints destroy more businesses silently than any other class. BEI monitors the early signals — not the late ones.',
                  signals: [
                    { name: 'Revenue concentration spikes', detail: 'Increasing dependence on a single client or revenue source — the most common financial constraint trigger.' },
                    { name: 'Cash flow deterioration', detail: 'Early signals of cash conversion cycle lengthening or working capital pressure before liquidity is at risk.' },
                    { name: 'Margin compression signals', detail: 'Gradual margin erosion from pricing pressure, cost creep, or delivery inefficiency — detected early.' },
                    { name: 'Client retention decline', detail: 'Changes in renewal, repeat purchase, or engagement patterns that signal relationship constraint emergence.' },
                  ],
                },
                {
                  domain: 'Strategic Risks',
                  color: '#8888cc',
                  bg: '#0a0a1a',
                  borderCol: '#1a1a3a',
                  icon: '◈',
                  desc: 'Strategic constraints are the hardest to see from the inside. BEI monitors the signals that indicate strategic drift before it becomes structural.',
                  signals: [
                    { name: 'Offer clarity degradation', detail: 'Signals that the market understanding of your offer is blurring — a leading indicator of conversion and positioning constraint.' },
                    { name: 'Competitive intensity increase', detail: 'New entrant activity, incumbent pricing moves, or market consolidation signals affecting your competitive position.' },
                    { name: 'Pricing confidence erosion', detail: 'Increasing discounting, longer negotiation cycles, or resistance signals indicating pricing constraint emergence.' },
                    { name: 'Market growth slowdown', detail: 'Sector-level signals that the overall market is contracting or maturing — affecting growth trajectory assumptions.' },
                  ],
                },
              ].map(domain => (
                <div key={domain.domain} style={{ padding: '36px', backgroundColor: domain.bg, border: '1px solid ' + domain.borderCol, borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: domain.color, opacity: 0.4 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '20px', color: domain.color }}>{domain.icon}</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: domain.color }}>{domain.domain}</div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '24px' }}>{domain.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {domain.signals.map(signal => (
                      <div key={signal.name} style={{ padding: '14px 16px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#e0e0e0', marginBottom: '4px' }}>{signal.name}</div>
                        <div style={{ fontSize: '12px', color: '#444', lineHeight: '1.6' }}>{signal.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <section style={{ padding: '100px 48px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Why Human Plus AI</div>
              <h2 style={{ fontSize: '44px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>Neither alone is enough.</h2>
              <p style={{ fontSize: '16px', color: '#555', maxWidth: '560px', margin: '0 auto' }}>AI without human oversight produces noise. Human intelligence without AI scale misses signals. BEI combines both — permanently, not occasionally.</p>
            </div>
          </RevealSection>
          <RevealSection delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[
                { title: 'AI Provides Scale', desc: 'Machine systems monitor thousands of data points across dozens of market sectors simultaneously — at a speed and breadth no human team could match.', points: ['Continuous 24/7 monitoring', 'Cross-sector signal detection', 'Pattern recognition at scale', 'Real-time data processing'] },
                { title: 'Humans Provide Judgement', desc: 'The BEI intelligence team interprets every flagged signal against the client specific context, Business Twin, and market sector — context that AI cannot reliably provide alone.', points: ['Signal validation and verification', 'Client context interpretation', 'Sector-specific expertise', 'Recommendation quality control'] },
                { title: 'Together: Complete Accuracy', desc: 'The combination produces continuous, verified, contextualised intelligence that maintains complete accuracy across all client market areas without degradation.', points: ['No unverified alerts', 'No missed signals', 'No generic recommendations', 'No accuracy trade-offs'] },
              ].map(item => (
                <div key={item.title} style={{ padding: '32px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.25), transparent)' }} />
                  <div style={{ fontSize: '16px', fontWeight: '700', color: gold, marginBottom: '14px' }}>{item.title}</div>
                  <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '20px' }}>{item.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.points.map(p => (
                      <div key={p} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ color: gold, fontSize: '11px', flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: '13px', color: '#666' }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <section style={{ padding: '100px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(200,162,74,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '600' }}>Always On</div>
          <h2 style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '20px', lineHeight: '1.1' }}>
            Intelligence that never<br /><span style={{ color: gold }}>stops watching.</span>
          </h2>
          <p style={{ fontSize: '17px', color: '#555', marginBottom: '40px', lineHeight: '1.75' }}>Every BEI client has the full intelligence layer active from day one. Growth signals monitored. Operational risks tracked. Financial and strategic risks verified. Continuously.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href='/book' style={{ padding: '18px 48px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', boxShadow: '0 0 60px rgba(200,162,74,0.2)' }}>Book Onboarding Call</a>
            <a href='/pricing' style={{ padding: '18px 28px', border: '1px solid #2a2a2a', color: '#666', borderRadius: '8px', textDecoration: 'none', fontSize: '16px' }}>View Plans</a>
          </div>
        </div>
      </section>

    </main>
  )
}
