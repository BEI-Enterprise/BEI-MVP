'use client'
import { useState, useRef, useEffect } from 'react'

const gold = '#C8A24A'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AskBEI({ context }: { context?: any }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello. I\'m BEI Intelligence. I can explain your constraint analysis, health scores, opportunities and strategic recommendations. What would you like to understand?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-ask-bei', handler)
    return () => window.removeEventListener('open-ask-bei', handler)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const systemPrompt = `You are BEI Intelligence — the AI assistant for the Business Execution Intelligence platform. You are an expert business strategist and analyst.

You help executives understand their BEI intelligence reports. You are concise, precise and executive-grade in your responses. Never use generic advice. Always refer to the specific business context provided.

${context ? `Current business context:
- Business: ${context.businessName || 'Unknown'}
- Industry: ${context.industry || 'Unknown'}
- Health Score: ${context.healthScore || 'Unknown'}/100
- Primary Constraint: ${context.primaryConstraint || 'Unknown'}
- Verification Score: ${context.verificationScore || 'Unknown'}/100
- Confidence: ${context.confidence || 'Unknown'}
- Annual Opportunity: ${context.opportunity || 'Unknown'}
- Subscription: ${context.tier || 'Unknown'}
` : ''}

Keep responses under 150 words. Be direct, intelligent and actionable. Always answer the specific question asked. Do not pad with generic business advice.`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMsg }
          ]
        })
      })

      const data = await response.json()
      const reply = data.content?.[0]?.text || 'I apologise — I was unable to process that request. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  const suggestions = [
    'Why was this constraint detected?',
    'What should I prioritise first?',
    'Explain my health score',
    'How do I resolve this constraint?',
    'What is the opportunity value based on?',
  ]

  return (
    <>


      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed' as const,
          bottom: '20px',
          left: '196px',
          width: '380px',
          height: '520px',
          backgroundColor: '#080808',
          border: '1px solid rgba(200,162,74,0.3)',
          borderRadius: '12px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column' as const,
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 40px rgba(200,162,74,0.08)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, #0a0800, #080808)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', color: gold }}>✦</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: gold, letterSpacing: '0.05em' }}>Ask BEI</div>
                <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.1em' }}>INTELLIGENCE ASSISTANT</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                  backgroundColor: m.role === 'user' ? 'rgba(200,162,74,0.12)' : '#0e0e0e',
                  border: m.role === 'user' ? '1px solid rgba(200,162,74,0.2)' : '1px solid #1a1a1a',
                  fontSize: '12px',
                  color: m.role === 'user' ? '#e0e0e0' : '#ccc',
                  lineHeight: '1.6',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '4px', padding: '8px 14px' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: gold, opacity: 0.6, animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 16px 8px', display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => { setInput(s); }} style={{ padding: '4px 10px', backgroundColor: 'rgba(200,162,74,0.06)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '4px', color: '#888', fontSize: '10px', cursor: 'pointer', textAlign: 'left' as const }}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask BEI anything..."
              style={{ flex: 1, padding: '9px 12px', backgroundColor: '#0e0e0e', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#e0e0e0', fontSize: '12px', outline: 'none' }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{ padding: '9px 14px', backgroundColor: input.trim() ? gold : '#1a1a1a', color: input.trim() ? '#050505' : '#444', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s' }}>
              →
            </button>
          </div>

          <style>{`@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
        </div>
      )}
    </>
  )
}
