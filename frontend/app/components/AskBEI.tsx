'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '../../lib/supabase'

const gold = '#C8A24A'
const supabase = createClient()
interface Message { role: 'user' | 'assistant'; content: string }

export default function AskBEI() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello. I'm BEI Intelligence. Ask me anything about your business — your constraints, health score, opportunities, or what to focus on next." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [biz, setBiz] = useState<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setOpen(o => !o)
    window.addEventListener('open-ask-bei', handler)
    return () => window.removeEventListener('open-ask-bei', handler)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
          .from('businesses')
          .select('business_name, mri_result, industry')
          .eq('email', user.email)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()
        if (data) setBiz(data)
      } catch (e) {}
    }
    load()
  }, [])

  const send = async (question?: string) => {
    const q = (question || input).trim()
    if (!q || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)
    try {
      const r = biz?.mri_result || {}
      const primary = r.primary_constraint || null
      const totalOpp = r.total_opportunity || {}
      const body = {
        primary: primary ? {
          name: primary.name || primary.key,
          verification_score: primary.verification_score || 70,
          severity: primary.severity || 'high',
          is_root_cause: primary.is_root_cause !== false,
          hypothesis: primary.hypothesis || primary.evidence?.[0] || '',
          opportunity: { value_low: totalOpp.total_low || 0, value_high: totalOpp.total_high || 0 },
        } : null,
        secondary: (r.secondary_constraints || []).map((c: any) => ({
          name: c.name || c.key,
          verification_score: c.verification_score || 60,
          severity: c.severity || 'medium',
        })),
        pillars: r.health?.pillars || [],
        confidence: r.confidence || 'medium',
        industry: biz?.industry || '',
        businessName: biz?.business_name || 'Your Business',
        question: q,
      }
      const res = await fetch('/api/agents/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.error || 'No response received.' }])
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + (e?.message || 'unknown') }])
    }
    setLoading(false)
  }

  const suggestions = [
    'Why was this my primary constraint?',
    'What should I focus on first?',
    'How much revenue am I losing?',
    'What are my secondary constraints?',
    'Explain my health score',
  ]

  return (
    <>
      {open && (
        <div style={{ position: 'fixed' as const, bottom: '20px', right: '24px', width: '400px', height: '560px', backgroundColor: '#080808', border: '1px solid rgba(200,162,74,0.35)', borderRadius: '14px', zIndex: 1000, display: 'flex', flexDirection: 'column' as const, boxShadow: '0 8px 60px rgba(0,0,0,0.7)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a0a0a', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', backgroundColor: 'rgba(200,162,74,0.15)', border: '1px solid rgba(200,162,74,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: gold }}>✦</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: gold }}>Ask BEI</div>
                <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.1em' }}>INTELLIGENCE ASSISTANT{biz ? ' · ' + biz.business_name : ''}</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '5px', color: '#666', cursor: 'pointer', fontSize: '13px', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' as const, padding: '14px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: '7px' }}>
                {m.role === 'assistant' && <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: 'rgba(200,162,74,0.12)', border: '1px solid rgba(200,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: gold, flexShrink: 0, marginTop: '2px' }}>✦</div>}
                <div style={{ maxWidth: '84%', padding: '9px 13px', backgroundColor: m.role === 'user' ? 'rgba(200,162,74,0.1)' : '#0e0e0e', border: '1px solid ' + (m.role === 'user' ? 'rgba(200,162,74,0.2)' : '#1e1e1e'), borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px', fontSize: '13px', color: '#e0e0e0', lineHeight: '1.65', whiteSpace: 'pre-wrap' as const }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: 'rgba(200,162,74,0.12)', border: '1px solid rgba(200,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: gold }}>✦</div>
                <div style={{ padding: '9px 13px', backgroundColor: '#0e0e0e', border: '1px solid #1e1e1e', borderRadius: '10px 10px 10px 2px', fontSize: '13px', color: '#555' }}>Analysing your intelligence...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          {messages.filter(m => m.role === 'user').length === 0 && (
            <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap' as const, gap: '5px' }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{ padding: '5px 10px', backgroundColor: 'rgba(200,162,74,0.06)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '5px', color: '#aaa', fontSize: '11px', cursor: 'pointer', textAlign: 'left' as const }}>{s}</button>
              ))}
            </div>
          )}
          <div style={{ padding: '12px 14px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '8px', flexShrink: 0 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask BEI anything..." style={{ flex: 1, padding: '9px 13px', backgroundColor: '#111', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#e0e0e0', fontSize: '13px', outline: 'none' }} />
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{ padding: '9px 16px', backgroundColor: input.trim() ? gold : '#1a1a1a', color: input.trim() ? '#050505' : '#444', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: input.trim() ? 'pointer' : 'default' }}>→</button>
          </div>
        </div>
      )}
    </>
  )
}
