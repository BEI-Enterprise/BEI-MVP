'use client'
import { useState, useEffect } from 'react'
import AskBEI from './AskBEI'
import { createClient } from '../../lib/supabase'

const gold = '#C8A24A'
const sidebar = '#0a0a0a'
const sidebarBorder = '#1a1a1a'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Executive Command Centre', icon: '⌂', href: '/dashboard' },
  { id: 'twin', label: 'Business Twin™ Centre', icon: '◉', href: '/connect' },
  { id: 'constraints', label: 'Constraint Intelligence™', icon: '◎', href: '/constraints' },
  { id: 'opportunities', label: 'Opportunity Centre™', icon: '◈', href: '/opportunities' },
  { id: 'risk', label: 'Risk Intelligence™', icon: '⊘', href: '/risk' },
  { id: 'performance', label: 'Performance Intelligence™', icon: '⟋', href: '/performance' },
  { id: 'industry', label: 'Industry Intelligence™', icon: '⊕', href: '/industry' },
  { id: 'deployment', label: 'Outcome & Deployment™', icon: '▹', href: '/deployments' },
  { id: 'operations', label: 'Intelligence Operations™', icon: '⊛', href: '/intelligence-ops', dividerBefore: true },
  { id: 'admin', label: 'Settings', icon: '⚙', href: '/settings' },
]

export default function DashboardShell({ children, activeId }: { children: React.ReactNode, activeId?: string }) {
  const [user, setUser] = useState<any>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{role:'user'|'assistant',text:string}[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [mriContext, setMriContext] = useState<any>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Executive'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* SIDEBAR */}
      <div style={{
        width: collapsed ? '60px' : '240px',
        minHeight: '100vh',
        backgroundColor: sidebar,
        borderRight: `1px solid ${sidebarBorder}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed' as const,
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        transition: 'width 0.2s ease',
        overflowX: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 0' : '20px 20px', borderBottom: `1px solid ${sidebarBorder}`, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', minHeight: '64px' }}>
          {!collapsed && (
            <div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: gold, letterSpacing: '0.15em' }}>BEI<sup style={{ fontSize: '9px', verticalAlign: 'super' }}>™</sup></div>
              <div style={{ fontSize: '9px', color: '#888', letterSpacing: '0.2em', marginTop: '2px' }}>BUSINESS EXECUTION INTELLIGENCE</div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px', padding: '4px', flexShrink: 0 }}>
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeId === item.id
            return (
              <>
              {(item as any).dividerBefore && <div style={{ height: '1px', backgroundColor: '#1a1a1a', margin: '6px 12px' }} />}
            <a key={item.id} href={item.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '10px 0' : '10px 16px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textDecoration: 'none',
                backgroundColor: isActive ? 'rgba(200,162,74,0.1)' : 'transparent',
                borderLeft: isActive ? `2px solid ${gold}` : '2px solid transparent',
                color: isActive ? gold : '#cccccc',
                fontSize: '13px',
                fontWeight: isActive ? '700' : '500',
                letterSpacing: '0.02em',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap' as const,
              }}
              onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = '#aaa'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.03)' }}}
              onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = '#cccccc'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}}
              >
                <span style={{ flexShrink: 0, width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.id === 'dashboard' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L1 7h2v7h4v-4h2v4h4V7h2L8 1z" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2" fill={isActive ? 'rgba(200,162,74,0.15)' : 'none'} strokeLinejoin="round"/></svg>}
                  {item.id === 'twin' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/><circle cx="8" cy="8" r="2.5" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2" fill={isActive ? 'rgba(200,162,74,0.2)' : 'none'}/><line x1="8" y1="1.5" x2="8" y2="5" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/><line x1="8" y1="11" x2="8" y2="14.5" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/><line x1="1.5" y1="8" x2="5" y2="8" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/><line x1="11" y1="8" x2="14.5" y2="8" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/></svg>}
                  {item.id === 'constraints' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/><circle cx="8" cy="8" r="3" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2" fill={isActive ? 'rgba(200,162,74,0.15)' : 'none'}/><line x1="8" y1="5" x2="8" y2="3" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/><line x1="11" y1="8" x2="13" y2="8" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/><line x1="8" y1="11" x2="8" y2="13" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/><line x1="5" y1="8" x2="3" y2="8" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/></svg>}
                  {item.id === 'opportunities' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L10 6h4.5L11 9l1.5 4.5L8 11l-4.5 2.5L5 9 1.5 6H6L8 1.5z" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2" fill={isActive ? 'rgba(200,162,74,0.15)' : 'none'} strokeLinejoin="round"/></svg>}
                  {item.id === 'risk' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2" fill={isActive ? 'rgba(200,162,74,0.1)' : 'none'} strokeLinejoin="round"/><line x1="8" y1="6" x2="8" y2="9.5" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.4"/><circle cx="8" cy="11.5" r="0.8" fill={isActive ? '#C8A24A' : '#555'}/></svg>}
                  {item.id === 'performance' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polyline points="1,12 5,7 8,9 11,4 15,6" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.4" fill="none" strokeLinejoin="round" strokeLinecap="round"/><polyline points="11,4 15,4 15,8" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2" fill="none" strokeLinejoin="round" strokeLinecap="round"/></svg>}
                  {item.id === 'industry' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/><ellipse cx="8" cy="8" rx="3" ry="6.5" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/><line x1="1.5" y1="5.5" x2="14.5" y2="5.5" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1"/><line x1="1.5" y1="10.5" x2="14.5" y2="10.5" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1"/></svg>}
                  {item.id === 'deployment' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C8 1.5 13 5 13 9a5 5 0 01-10 0c0-4 5-7.5 5-7.5z" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2" fill={isActive ? 'rgba(200,162,74,0.1)' : 'none'}/><line x1="8" y1="9" x2="8" y2="14" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/><line x1="5.5" y1="12" x2="10.5" y2="12" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2"/></svg>}
                  {item.id === 'operations' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2" fill={isActive ? 'rgba(200,162,74,0.15)' : 'none'}/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2" strokeLinecap="round"/></svg>}
                  {item.id === 'admin' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1.2" fill={isActive ? 'rgba(200,162,74,0.15)' : 'none'}/><path d="M8 1.5l1 1.8h2l-1.5 1.7.5 2-2-1-2 1 .5-2L5 3.3h2l1-1.8zM8 14.5l-1-1.8H5l1.5-1.7-.5-2 2 1 2-1-.5 2 1.5 1.7H9l-1 1.8zM1.5 8l1.8-1v-2l1.7 1.5 2-.5-1 2 1 2-2-.5-1.7 1.5v-2L1.5 8zM14.5 8l-1.8 1v2l-1.7-1.5-2 .5 1-2-1-2 2 .5 1.7-1.5v2l1.8 1z" stroke={isActive ? '#C8A24A' : '#555'} strokeWidth="1" fill="none" strokeLinejoin="round"/></svg>}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </a>
              </>
            )
          })}
        </nav>

        {/* Ask BEI button in sidebar */}
        {!collapsed && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #1a1a1a' }}>
            <button
              onClick={() => setChatOpen(o => !o)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '8px', color: '#C8A24A', fontSize: '12px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.05em' }}
            >
              <span style={{ fontSize: '16px' }}>✦</span>
              <div style={{ textAlign: 'left' as const }}>
                <div>Ask BEI</div>
                <div style={{ fontSize: '10px', color: '#888', fontWeight: '400', letterSpacing: '0.1em' }}>INTELLIGENCE ASSISTANT</div>
              </div>
            </button>
          </div>
        )}

        {/* Bottom status */}
        {!collapsed && (
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${sidebarBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.6)' }} />
              <span style={{ fontSize: '10px', color: '#4aaa4a', fontWeight: '600', letterSpacing: '0.1em' }}>INTELLIGENCE ACTIVE</span>
            </div>
            <div style={{ fontSize: '9px', color: '#333', letterSpacing: '0.05em' }}>All systems operational</div>
          </div>
        )}
      </div>

      {/* MAIN AREA */}
      <div style={{ marginLeft: collapsed ? '60px' : '240px', flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.2s ease', minWidth: 0 }}>

        {/* TOP COMMAND BAR */}
        <div style={{
          height: '56px',
          backgroundColor: 'rgba(5,5,5,0.95)',
          borderBottom: `1px solid ${sidebarBorder}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: '16px',
          position: 'sticky' as const,
          top: 0,
          zIndex: 40,
          backdropFilter: 'blur(12px)',
        }}>
          {/* Search */}
          <div style={{ flex: 1, maxWidth: '360px', position: 'relative' as const }}>
            <span style={{ position: 'absolute' as const, left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#444' }}>⌕</span>
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search BEI Intelligence..."
              style={{
                width: '100%',
                padding: '7px 12px 7px 30px',
                backgroundColor: '#0e0e0e',
                border: '1px solid #1e1e1e',
                borderRadius: '6px',
                color: '#aaa',
                fontSize: '12px',
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
            />
            <span style={{ position: 'absolute' as const, right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#333' }}>⌘K</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Ask BEI */}
          <a href="/dashboard#ask-bei" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px',
            backgroundColor: 'rgba(200,162,74,0.1)',
            border: `1px solid rgba(200,162,74,0.3)`,
            borderRadius: '6px',
            color: gold,
            fontSize: '12px',
            fontWeight: '600',
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }} onClick={() => setChatOpen(true)}>
            <span style={{ fontSize: \'14px\' }}>✦</span> Ask BEI
          </a>

          {/* Notifications */}
          <div style={{ position: 'relative' as const }}>
            <button onClick={() => setNotifOpen(!notifOpen)} style={{
              background: 'none', border: '1px solid #1e1e1e', borderRadius: '6px',
              color: '#aaaaaa', cursor: 'pointer', padding: '7px 10px', fontSize: '14px',
              position: 'relative' as const,
            }}>
              🔔
              <span style={{ position: 'absolute' as const, top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: '#cc4444', borderRadius: '50%', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>1</span>
            </button>
            {notifOpen && (
              <div style={{ position: 'absolute' as const, right: 0, top: '44px', width: '280px', backgroundColor: '#0e0e0e', border: '1px solid #1e1e1e', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 100, padding: '8px 0' }}>
                <div style={{ padding: '8px 16px', fontSize: '11px', color: '#999', letterSpacing: '0.1em', borderBottom: '1px solid #1a1a1a' }}>INTELLIGENCE ALERTS</div>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '12px', color: '#e0e0e0', marginBottom: '4px' }}>Primary constraint verified</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>New verification complete · Just now</div>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <a href="/dashboard" onClick={() => setNotifOpen(false)} style={{ fontSize: '11px', color: gold, textDecoration: 'none' }}>View all intelligence →</a>
                </div>
              </div>
            )}
          </div>

          {/* Book Session */}
          <a href="/book" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px',
            backgroundColor: 'transparent',
            border: '1px solid #2a2a2a',
            borderRadius: '6px',
            color: '#888',
            fontSize: '12px',
            textDecoration: 'none',
          }}>
            📅 Book Session
          </a>

          {/* User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', border: '1px solid #1e1e1e', borderRadius: '6px', cursor: 'pointer' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'rgba(200,162,74,0.2)', border: `1px solid rgba(200,162,74,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: gold }}>
              {userInitial}
            </div>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#e0e0e0' }}>{userName}</div>
              <div style={{ fontSize: '10px', color: '#888', letterSpacing: '0.05em' }}>Executive</div>
            </div>
            <span style={{ fontSize: '10px', color: '#444' }}>▾</span>
          </div>

          {/* Sign out */}
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '12px', padding: '4px 8px' }}>
            Sign out
          </button>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, padding: '24px', minWidth: 0 }}>
          {children}
        </div>

        <AskBEI />
        {/* BOTTOM STATUS BAR */}
        <div style={{ height: '32px', backgroundColor: '#080808', borderTop: `1px solid ${sidebarBorder}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4aaa4a' }} />
            <span style={{ fontSize: '10px', color: '#4aaa4a', letterSpacing: '0.08em' }}>BEI Intelligence Operations</span>
          </div>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#2a2a2a' }} />
          <span style={{ fontSize: '11px', color: '#888' }}>All systems operational</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '11px', color: '#666' }}>Last data sync: Just now ✓</span>
        </div>
      </div>
    </div>
  )
}
