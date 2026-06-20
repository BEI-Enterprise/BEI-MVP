'use client'
import { useState } from 'react'

export default function MeetingCentre({ gold, card, border, dark }: { gold: string, card: string, border: string, dark: string }) {
  const [meetingNote, setMeetingNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState('')

  const today = new Date()
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1
  const calDays = Array.from({length: daysInMonth}, (_, i) => i + 1)

  const meetingTypes = [
    { id: 'onboarding', label: 'Onboarding Session', desc: '90-min system briefing and first MRI review', duration: '90 min' },
    { id: 'monthly', label: 'Monthly MRI Review', desc: 'Constraint updates, progress and next 30-day priorities', duration: '45 min' },
    { id: 'strategy', label: 'Strategy Deep-Dive', desc: 'Constraint resolution planning and deployment review', duration: '60 min' },
    { id: 'deployment', label: 'Deployment Support', desc: 'Implementation support for active deployment packages', duration: '45 min' },
  ]

  return (
    <div>
      <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>BEI MEETING EXECUTION CENTRE</div>
      <div style={{ fontSize: '13px', color: '#777', marginBottom: '24px', lineHeight: '1.7' }}>Book sessions with your BEI Intelligence specialist. Add meeting notes so your account manager arrives fully prepared.</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Calendar */}
        <div style={{ padding: '24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>
            {monthNames[today.getMonth()].toUpperCase()} {today.getFullYear()}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '6px' }}>
            {['Mo','Tu','We','Th','Fr','Sa','Su'].map((d) => (
              <div key={d} style={{ fontSize: '10px', color: '#555', textAlign: 'center' as const, padding: '4px 0', fontWeight: '600' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {Array.from({length: adjustedFirstDay}, (_, i) => <div key={`e${i}`} />)}
            {calDays.map(day => (
              <div key={day} style={{
                padding: '6px 2px',
                textAlign: 'center' as const,
                fontSize: '12px',
                borderRadius: '4px',
                backgroundColor: day === today.getDate() ? gold : 'transparent',
                color: day === today.getDate() ? '#050505' : day < today.getDate() ? '#444' : '#ccc',
                fontWeight: day === today.getDate() ? '700' : '400',
                cursor: day >= today.getDate() ? 'pointer' : 'default'
              }}>
                {day}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #222', fontSize: '12px', color: '#555', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: gold }} />
            <span>Today — {today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Session types */}
        <div style={{ padding: '24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>AVAILABLE SESSIONS</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            {meetingTypes.map(m => (
              <button key={m.id} onClick={() => setSelectedMeeting(selectedMeeting === m.id ? '' : m.id)} style={{
                padding: '12px 14px',
                backgroundColor: selectedMeeting === m.id ? 'rgba(200,162,74,0.08)' : '#141414',
                border: `1px solid ${selectedMeeting === m.id ? 'rgba(200,162,74,0.3)' : '#2a2a2a'}`,
                borderRadius: '6px',
                textAlign: 'left' as const,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: selectedMeeting === m.id ? gold : '#ccc', marginBottom: '2px' }}>{m.label}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>{m.desc}</div>
                </div>
                <div style={{ fontSize: '10px', color: '#555', flexShrink: 0 }}>{m.duration}</div>
              </button>
            ))}
          </div>
          {selectedMeeting && (
            <a href='/book' style={{ display: 'block', marginTop: '14px', padding: '12px', backgroundColor: gold, color: '#050505', borderRadius: '6px', textDecoration: 'none', fontWeight: '700', fontSize: '13px', textAlign: 'center' as const }}>
              Book {meetingTypes.find(m => m.id === selectedMeeting)?.label} →
            </a>
          )}
        </div>
      </div>

      {/* Meeting notes */}
      <div style={{ padding: '24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>MEETING NOTES</div>
        <div style={{ fontSize: '13px', color: '#777', marginBottom: '16px', lineHeight: '1.6' }}>
          Add notes for your upcoming session. Your BEI account manager will review these before the meeting so they arrive fully prepared with context on what you want to discuss.
        </div>
        <textarea
          value={meetingNote}
          onChange={(e) => setMeetingNote(e.target.value)}
          placeholder={'What would you like to discuss?\n\nExamples:\n• Progress on primary constraint resolution\n• Questions about deployment recommendations\n• Review of this month\'s MRI changes\n• Strategic direction for next quarter'}
          style={{
            width: '100%',
            minHeight: '130px',
            backgroundColor: '#141414',
            border: '1px solid #2a2a2a',
            borderRadius: '6px',
            padding: '14px 16px',
            fontSize: '13px',
            color: '#ccc',
            lineHeight: '1.7',
            resize: 'vertical' as const,
            fontFamily: 'Inter,system-ui,sans-serif',
            outline: 'none',
            marginBottom: '12px',
            boxSizing: 'border-box' as const
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#555' }}>Notes are visible to your BEI account manager only.</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {noteSaved && <div style={{ fontSize: '12px', color: '#4aaa4a', fontWeight: '600' }}>✓ Notes saved</div>}
            <button onClick={() => { if (meetingNote.trim()) { setNoteSaved(true); setTimeout(() => setNoteSaved(false), 3000) } }} style={{ padding: '10px 20px', backgroundColor: meetingNote.trim() ? gold : '#1a1a1a', color: meetingNote.trim() ? '#050505' : '#444', fontWeight: '700', borderRadius: '4px', border: 'none', cursor: meetingNote.trim() ? 'pointer' : 'not-allowed', fontSize: '13px' }}>
              Save Notes
            </button>
          </div>
        </div>
      </div>

      {/* Account manager */}
      <div style={{ padding: '20px 24px', backgroundColor: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>◈</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#e0e0e0', marginBottom: '3px' }}>BEI Intelligence Team — Real Human Specialists</div>
          <div style={{ fontSize: '12px', color: '#666' }}>All sessions conducted by qualified BEI Intelligence specialists. Direct contact: <span style={{ color: gold }}>intelligence@officialbei.com</span> · Response within 24 hours.</div>
        </div>
      </div>
    </div>
  )
}
