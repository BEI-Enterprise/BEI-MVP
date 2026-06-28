'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '../../lib/supabase'

const gold = '#C8A24A'
const supabase = createClient()

interface Message { role: 'user' | 'assistant'; content: string; time?: string }
interface Conversation { id: string; title: string; messages: Message[]; date: string }

export default function AskBEI() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'chat'|'history'>('chat')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello. I'm BEI Intelligence. Ask me anything about your business — constraints, health score, opportunities, or what to focus on next.", time: 'now' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [biz, setBiz] = useState<any>(null)
  const [history, setHistory] = useState<Conversation[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setOpen(o => !o)
    window.addEventListener('open-ask-bei', handler)
    return () => window.removeEventListener('open-ask-bei', handler)
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase.from('businesses').select('business_name, mri_result, industry').eq('email', user.email).order('updated_at', { ascending: false }).limit(1).single()
        if (data) setBiz(data)
      } catch (e) {}
    }
    load()
    try { const s = localStorage.getItem('bei_chat_history'); if (s) setHistory(JSON.parse(s)) } catch(e) {}
  }, [])

  const saveToHistory = (msgs: Message[]) => {
    if (msgs.filter(m => m.role === 'user').length === 0) return
    const conv: Conversation = { id: Date.now().toString(), title: msgs.filter(m=>m.role==='user')[0].content.slice(0,50), messages: msgs, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }
    const nh = [conv, ...history].slice(0, 20)
    setHistory(nh)
    try { localStorage.setItem('bei_chat_history', JSON.stringify(nh)) } catch(e) {}
  }

  const deleteConv = (id: string) => {
    const u = history.filter(c => c.id !== id)
    setHistory(u)
    try { localStorage.setItem('bei_chat_history', JSON.stringify(u)) } catch(e) {}
  }

  const newChat = () => {
    if (messages.filter(m=>m.role==='user').length > 0) saveToHistory(messages)
    setMessages([{ role: 'assistant', content: "Hello. I'm BEI Intelligence. Ask me anything about your business.", time: 'now' }])
    setView('chat')
  }

  const send = async (question?: string) => {
    const q = (question || input).trim()
    if (!q || loading) return
    setInput('')
    const t = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    const nm = [...messages, { role: 'user' as const, content: q, time: t }]
    setMessages(nm)
    setLoading(true)
    try {
      const r = biz?.mri_result || {}
      const primary = r.primary_constraint || null
      const totalOpp = r.total_opportunity || {}
      const res = await fetch('/api/agents/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primary: primary ? { name: primary.name || primary.key, verification_score: primary.verification_score || 70, severity: primary.severity || 'high', is_root_cause: primary.is_root_cause !== false, hypothesis: primary.hypothesis || '', opportunity: { value_low: totalOpp.total_low || 0, value_high: totalOpp.total_high || 0 } } : null,
          secondary: (r.secondary_constraints || []).map((c: any) => ({ name: c.name || c.key, verification_score: c.verification_score || 60, severity: c.severity || 'medium' })),
          pillars: r.health?.pillars || [],
          confidence: r.confidence || 'medium',
          industry: biz?.industry || '',
          businessName: biz?.business_name || 'Your Business',
          question: q,
        }),
      })
      const data = await res.json()
      const reply = data.response || data.error || 'No response.'
      const t2 = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      setMessages([...nm, { role: 'assistant', content: reply, time: t2 }])
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + (e?.message || 'unknown'), time: '' }])
    }
    setLoading(false)
  }

  const suggestions = ['Why was this my primary constraint?', 'What should I focus on first?', 'How much revenue am I losing?', 'What are my secondary constraints?', 'Explain my health score']

  if (!open) return null

  return (
    <div style={{ position: 'fixed' as const, bottom: '20px', right: '24px', width: '420px', height: '580px', backgroundColor: '#080808', border: '1px solid rgba(200,162,74,0.28)', borderRadius: '16px', zIndex: 1000, display: 'flex', flexDirection: 'column' as const, boxShadow: '0 16px 60px rgba(0,0,0,0.85)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '13px 15px', borderBottom: '1px solid #141414', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#0a0a0a', flexShrink: 0 }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: gold, flexShrink: 0 }}>✦</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: gold }}>Ask BEI</div>
          <div style={{ fontSize: '9px', color: '#444', letterSpacing: '0.1em' }}>INTELLIGENCE ASSISTANT{biz ? ' · ' + biz.business_name : ''}</div>
        </div>
        <button onClick={newChat} title="New chat" style={{ background: 'none', border: '1px solid #1e1e1e', borderRadius: '6px', color: '#555', cursor: 'pointer', fontSize: '12px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✎</button>
        <button onClick={() => setView(v => v === 'history' ? 'chat' : 'history')} title="History" style={{ background: 'none', border: '1px solid #1e1e1e', borderRadius: '6px', color: view === 'history' ? gold : '#555', cursor: 'pointer', fontSize: '13px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>☰</button>
        <button onClick={() => { if (messages.filter(m=>m.role==='user').length>0) saveToHistory(messages); setOpen(false) }} style={{ background: 'none', border: '1px solid #1e1e1e', borderRadius: '6px', color: '#555', cursor: 'pointer', fontSize: '13px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>

      {view === 'history' ? (
        <div style={{ flex: 1, overflowY: 'auto' as const, padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.1em', fontWeight: '600' }}>CHAT HISTORY</div>
            <button onClick={() => setView('chat')} style={{ background: 'none', border: 'none', color: gold, cursor: 'pointer', fontSize: '11px' }}>← Back</button>
          </div>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center' as const, padding: '40px 20px', color: '#333', fontSize: '13px' }}>No previous conversations</div>
          ) : history.map(conv => (
            <div key={conv.id} style={{ backgroundColor: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '11px 13px', marginBottom: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }} onClick={() => { setMessages(conv.messages); setView('chat') }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', color: '#ccc', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{conv.title}</div>
                <div style={{ fontSize: '10px', color: '#444', marginTop: '3px' }}>{conv.date} · {conv.messages.filter(m=>m.role==='user').length} message{conv.messages.filter(m=>m.role==='user').length!==1?'s':''}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); deleteConv(conv.id) }} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '12px', padding: '0 2px', flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto' as const, padding: '14px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role==='user'?'flex-end':'flex-start', alignItems: 'flex-start', gap: '7px' }}>
                {m.role==='assistant' && <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: gold, flexShrink: 0, marginTop: '2px' }}>✦</div>}
                <div>
                  <div style={{ maxWidth: '300px', padding: '9px 13px', backgroundColor: m.role==='user'?'rgba(200,162,74,0.07)':'#0e0e0e', border: '1px solid '+(m.role==='user'?'rgba(200,162,74,0.15)':'#1a1a1a'), borderRadius: m.role==='user'?'10px 10px 2px 10px':'10px 10px 10px 2px', fontSize: '13px', color: '#e0e0e0', lineHeight: '1.65', whiteSpace: 'pre-wrap' as const }}>{m.content}</div>
                  {m.time && <div style={{ fontSize: '10px', color: '#2a2a2a', marginTop: '3px', textAlign: m.role==='user'?'right' as const:'left' as const }}>{m.time}</div>}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: gold }}>✦</div>
                <div style={{ padding: '9px 13px', backgroundColor: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '10px 10px 10px 2px', fontSize: '13px', color: '#444' }}>Analysing your intelligence...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          {messages.filter(m=>m.role==='user').length===0 && (
            <div style={{ padding: '0 14px 8px', display: 'flex', flexWrap: 'wrap' as const, gap: '5px' }}>
              {suggestions.map((s,i) => <button key={i} onClick={() => send(s)} style={{ padding: '5px 10px', backgroundColor: 'rgba(200,162,74,0.04)', border: '1px solid rgba(200,162,74,0.1)', borderRadius: '5px', color: '#666', fontSize: '11px', cursor: 'pointer', textAlign: 'left' as const }}>{s}</button>)}
            </div>
          )}
          <div style={{ padding: '12px 14px', borderTop: '1px solid #141414', display: 'flex', gap: '8px', flexShrink: 0 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()} placeholder="Ask BEI anything..." style={{ flex: 1, padding: '9px 13px', backgroundColor: '#0e0e0e', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#e0e0e0', fontSize: '13px', outline: 'none' }} />
            <button onClick={() => send()} disabled={loading||!input.trim()} style={{ padding: '9px 16px', backgroundColor: input.trim()?gold:'#111', color: input.trim()?'#050505':'#333', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: input.trim()?'pointer':'default' }}>→</button>
          </div>
        </>
      )}
    </div>
  )
}
