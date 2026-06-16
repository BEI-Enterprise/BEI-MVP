'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { saveIntakeData } from '@/lib/localStorage'
import { saveMRIMetaToStorage } from '@/lib/mriStorage'

const steps = [
  { id: 1, title: 'Growth', desc: 'Revenue, leads and sales performance' },
  { id: 2, title: 'Operations', desc: 'Capacity, staffing and delivery' },
  { id: 3, title: 'Strategy', desc: 'Positioning, pricing and offers' },
  { id: 4, title: 'Risk', desc: 'Dependencies and vulnerabilities' },
  { id: 5, title: 'Context', desc: 'Market and competitive position' },
  { id: 6, title: 'Review', desc: 'Confirm and submit your MRI' },
]

const questions: Record<number, { key: string; label: string; type: string; options?: string[] }[]> = {
  1: [
    { key: 'monthly_revenue', label: 'What is your average monthly revenue?', type: 'select', options: ['Under £10k', '£10k–£25k', '£25k–£50k', '£50k–£100k', '£100k–£250k', 'Over £250k'] },
    { key: 'revenue_trend', label: 'Over the last 6 months, has revenue gone up or down?', type: 'select', options: ['Growing quickly', 'Growing slowly', 'Stayed about the same', 'Dropped slowly', 'Dropped quickly'] },
    { key: 'lead_volume', label: 'How many new enquiries do you get each month?', type: 'select', options: ['0–5', '6–20', '21–50', '51–100', 'Over 100'] },
    { key: 'conversion_rate', label: 'Out of those enquiries, roughly how many become paying clients?', type: 'select', options: ['Less than 1 in 10', '1–2 in 10', '2–4 in 10', '4–6 in 10', 'More than 6 in 10'] },
  ],
  2: [
    { key: 'team_size', label: 'How many people work in the business, including you?', type: 'select', options: ['Just me', '2–5', '6–10', '11–25', '26–50', 'More than 50'] },
    { key: 'capacity_utilisation', label: "How much of your team's time and capacity is currently being used?", type: 'select', options: ['Less than half', 'About half to 70%', '70–85%', '85–95%', 'Fully stretched'] },
    { key: 'founder_dependency', label: 'If you took a 2-week holiday, how much would the business rely on you to keep running?', type: 'select', options: ['It would stop without me', 'It would struggle a lot', 'It would manage with some issues', 'It would mostly be fine', 'It would run smoothly without me'] },
    { key: 'delivery_bottleneck', label: 'Where do things slow down or get stuck most often?', type: 'select', options: ['Finding new clients', 'Getting new clients started', 'Doing the actual work', 'Managing the team', 'Admin and invoicing', 'Nothing really slows us down'] },
  ],
  3: [
    { key: 'pricing_confidence', label: 'How confident are you that you\'re charging the right price?', type: 'select', options: ['Not confident at all', 'A little unsure', 'Fairly confident', 'Very confident', 'Completely confident'] },
    { key: 'offer_clarity', label: 'If a stranger looked at your website, would they understand what you offer and why it\'s worth buying?', type: 'select', options: ['Not at all clear', 'A bit confusing', 'Reasonably clear', 'Clear', 'Crystal clear'] },
    { key: 'market_position', label: 'Compared to your competitors, how different is what you offer?', type: 'select', options: ['Pretty much the same as everyone else', 'Slightly different', 'Somewhat different', 'Clearly different', 'Nobody else offers what we do'] },
    { key: 'avg_client_value', label: 'On average, how much is one client worth to you per year?', type: 'select', options: ['Under £1k', '£1k–£5k', '£5k–£15k', '£15k–£50k', 'Over £50k'] },
  ],
  4: [
    { key: 'revenue_concentration', label: 'What share of your income comes from just your 3 biggest clients?', type: 'select', options: ['Less than a fifth', 'A fifth to two-fifths', 'Two-fifths to three-fifths', 'Three-fifths to four-fifths', 'Most of it'] },
    { key: 'trust_infrastructure', label: 'How much proof do you have to show new customers you\'re trustworthy (reviews, case studies, testimonials)?', type: 'select', options: ['None', 'Very little', 'Some', 'A good amount', 'Plenty'] },
    { key: 'cash_flow_stability', label: 'How predictable is your cash flow month to month?', type: 'select', options: ['Very unpredictable', 'Unpredictable', 'Okay, some swings', 'Fairly steady', 'Very steady'] },
    { key: 'key_person_risk', label: 'If one key person left tomorrow, how badly would it affect the business?', type: 'select', options: ['The business would likely fail', 'Serious damage', 'Noticeable impact', 'Minor disruption', 'Barely any impact'] },
  ],
  5: [
    { key: 'market_growth', label: 'Is demand in your industry growing or shrinking right now?', type: 'select', options: ['Shrinking quickly', 'Shrinking', 'Staying flat', 'Growing', 'Growing quickly'] },
    { key: 'competition_intensity', label: 'How much competition do you face?', type: 'select', options: ['Very little', 'A little', 'A moderate amount', 'A lot', 'Intense competition'] },
    { key: 'client_retention', label: 'Roughly what percentage of clients stick with you year after year?', type: 'select', options: ['Under 50%', '50–65%', '65–80%', '80–90%', 'Over 90%'] },
    { key: 'biggest_challenge', label: 'Right now, what\'s the single biggest challenge holding you back?', type: 'select', options: ['Getting more enquiries', 'Turning enquiries into clients', 'Delivering work without it becoming a strain', 'Keeping clients long-term', 'Pricing and profit margin', 'Team size and workload', 'Knowing what to focus on next'] },
  ],
}

export default function IntakePage() {
  const router = useRouter()
  const params = useParams()
  const businessId = params.business_id as string
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('')

  useEffect(() => {
    const fetchBusiness = async () => {
      const { data } = await supabase.from('businesses').select('name').eq('id', businessId).single()
      if (data) setBusinessName(data.name)
    }
    fetchBusiness()
  }, [businessId])

  const handleAnswer = (key: string, value: string) => setAnswers(prev => ({ ...prev, [key]: value }))

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1)
      return
    }
    if (step === 5) {
      setStep(6)
      return
    }
    if (step === 6) {
      setLoading(true)
      setError(null)
      try {
        const { error: supabaseError } = await supabase
          .from('businesses')
          .update({ status: 'processing' })
          .eq('id', businessId)

        if (supabaseError) {
          throw new Error(supabaseError.message || 'Failed to save intake data to database')
        }

        saveIntakeData(businessId, answers)

        if (businessName) {
          saveMRIMetaToStorage(businessId, {
            businessName,
            businessId,
            createdAt: new Date().toISOString(),
          })
        }

        localStorage.setItem('bei_intake_' + businessId, JSON.stringify(answers)); router.push('/processing/' + businessId)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
        console.error('[Intake] Error during submission:', err)
        setError(errorMessage)
        setLoading(false)
      }
    }
  }

  const inp: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#111111',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    marginTop: '8px',
  }
  const lbl: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#888888',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  }

  return (
    <main style={{ backgroundColor: '#050505', color: '#ffffff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>
      <nav style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1a1a' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: '700', color: '#C8A24A', textDecoration: 'none' }}>
          BEI
        </a>
        <div style={{ fontSize: '13px', color: '#555555' }}>{businessName}</div>
      </nav>

      <div style={{ padding: '16px 48px', backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a', display: 'flex', gap: '8px', alignItems: 'center' }}>
        {steps.map(s => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: step === s.id ? '#C8A24A' : step > s.id ? '#2a4a2a' : '#1a1a1a',
                border: step === s.id ? 'none' : step > s.id ? 'none' : '1px solid #2a2a2a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: step === s.id ? '#050505' : step > s.id ? '#4aaa4a' : '#555555',
              }}
            >
              {step > s.id ? '✓' : s.id}
            </div>
            <span
              style={{
                fontSize: '12px',
                color: step === s.id ? '#C8A24A' : step > s.id ? '#4aaa4a' : '#555555',
                fontWeight: step === s.id ? '600' : '400',
                display: 'none',
              }}
            >
              {s.title}
            </span>
            {s.id < 6 && <div style={{ width: '32px', height: '1px', backgroundColor: '#1a1a1a' }}></div>}
          </div>
        ))}
        <span style={{ fontSize: '13px', color: '#C8A24A', fontWeight: '600', marginLeft: '8px' }}>{steps[step - 1].title}</span>
      </div>

      <section style={{ padding: '60px 48px', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.2em', color: '#C8A24A', marginBottom: '12px', textTransform: 'uppercase' }}>
            Step {step} of 6 — {steps[step - 1].title}
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{steps[step - 1].desc}</h1>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#2a0a0a',
              border: '1px solid #cc4444',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              fontSize: '14px',
              color: '#ff8888',
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Error:</div>
            <div>{error}</div>
          </div>
        )}

        {step < 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {questions[step]?.map(q => (
              <div key={q.key}>
                <label style={lbl}>{q.label}</label>
                <select
                  value={answers[q.key] || ''}
                  onChange={e => handleAnswer(q.key, e.target.value)}
                  style={{ ...inp, color: answers[q.key] ? '#ffffff' : '#555555' }}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {q.options?.map(o => (
                    <option key={o} value={o} style={{ color: '#ffffff', backgroundColor: '#111111' }}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {step === 6 && (
          <div style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '32px' }}>
            <div style={{ fontSize: '14px', color: '#888888', marginBottom: '24px' }}>
              Review your answers before submitting. Your MRI will be generated immediately.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(answers).map(([key, value]) => (
                <div
                  key={key}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}
                >
                  <span style={{ fontSize: '13px', color: '#888888' }}>{key.replace(/_/g, ' ')}</span>
                  <span style={{ fontSize: '13px', color: '#ffffff', fontWeight: '500' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px' }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #2a2a2a',
                color: '#888888',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          <button
            onClick={handleNext}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#8a6e32' : '#C8A24A',
              color: '#050505',
              padding: '14px 36px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '15px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Submitting...' : step === 6 ? 'Generate My MRI Report' : 'Continue'}
          </button>
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#333333' }}>BEI MRI v1.0 - Rules-Based Analysis</p>
      </section>
    </main>
  )
}
