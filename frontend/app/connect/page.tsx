'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'

const gold = '#C8A24A'
const dark = '#080808'
const border = '#1a1a1a'

const CONNECTORS = [
  {
    id: 'google_business_profile',
    name: 'Google Business Profile',
    description: 'Reviews, rating and trust infrastructure. Replaces intake estimate with verified Google data.',
    twin_impact: 'Trust Infrastructure, Growth',
    confidence_boost: '+8%',
    fields: [
      { key: 'place_id', label: 'Google Place ID', placeholder: 'ChIJ...' },
      { key: 'api_key', label: 'Google API Key', placeholder: 'AIza...', secret: true },
    ],
  },
  {
    id: 'crm_webhook',
    name: 'CRM Data',
    description: 'Lead volume, conversion rate and response time. Replaces intake estimates with real CRM data.',
    twin_impact: 'Sales, Operations',
    confidence_boost: '+10%',
    fields: [
      { key: 'total_leads', label: 'Total Leads (last 90 days)', placeholder: '50', inputType: 'number' },
      { key: 'converted_leads', label: 'Converted to Clients', placeholder: '8', inputType: 'number' },
      { key: 'avg_response_time_hours', label: 'Avg Response Time (hours)', placeholder: '4', inputType: 'number' },
      { key: 'avg_deal_value', label: 'Average Deal Value (£)', placeholder: '3500', inputType: 'number' },
    ],
  },
  {
    id: 'website_scanner',
    name: 'Website',
    description: 'Offer clarity, trust signals and SEO health from your website.',
    twin_impact: 'Strategy, Growth',
    confidence_boost: '+5%',
    fields: [{ key: 'url', label: 'Website URL', placeholder: 'https://yourbusiness.com' }],
    coming_soon: true,
  },
  {
    id: 'financials',
    name: 'Financial Data',
    description: 'Revenue, margin and cash flow from Xero, QuickBooks or manual entry.',
    twin_impact: 'Growth, Risk',
    confidence_boost: '+7%',
    fields: [],
    coming_soon: true,
  },
  {
    id: 'staffing',
    name: 'Staffing & Capacity',
    description: 'Team structure and capacity utilisation for accurate operations intelligence.',
    twin_impact: 'Operations',
    confidence_boost: '+5%',
    fields: [],
    coming_soon: true,
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    description: 'Traffic, conversion and channel data to enrich your growth sub-twin.',
    twin_impact: 'Growth',
    confidence_boost: '+5%',
    fields: [],
    coming_soon: true,
  },
  {
    id: 'companies_house',
    name: 'Companies House',
    description: 'Filing history and structure for risk and context intelligence.',
    twin_impact: 'Risk, Context',
    confidence_boost: '+5%',
    fields: [],
    coming_soon: true,
  },
]

export default function ConnectPage() {
  const supabase = createClient()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [connectors, setConnectors] = useState<Record<string, any>>({})
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [twinCompleteness, setTwinCompleteness] = useState(60)
  const [businessName, setBusinessName] = useState('Your Business')

  useEffect(() => {
    const load = async () => {
      // Read identity from Supabase Auth — Supabase is single source of truth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get business record linked to this user
      const { data: business } = await supabase
        .from('businesses')
        .select('id, business_name')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (business) {
        setBusinessId(business.id)
        setBusinessName(business.business_name || 'Your Business')
        loadConnectors(business.id)
      }
    }
    load()
  }, [])

  const loadConnectors = async (bizId: string) => {
    const { data } = await supabase
      .from('connectors')
      .select('*')
      .eq('business_id', bizId)

    if (data) {
      const map: Record<string, any> = {}
      data.forEach((c: any) => { map[c.connector_type] = c })
      setConnectors(map)
      const activeCount = data.filter((c: any) => c.status === 'active').length
      setTwinCompleteness(Math.min(95, 60 + activeCount * 7))
    }
  }

  const saveAndSync = async (connectorId: string) => {
    if (!businessId) return
    setSaving(connectorId)

    const connector = CONNECTORS.find(c => c.id === connectorId)
    if (!connector) { setSaving(null); return }

    const credentials = formData[connectorId] || {}

    // Save credentials to Supabase connectors table
    const { error } = await supabase
      .from('connectors')
      .upsert({
        business_id: businessId,
        connector_type: connectorId,
        connector_name: connector.name,
        status: 'pending',
        credentials,
      }, { onConflict: 'business_id,connector_type' })

    if (error) {
      console.error('Failed to save connector:', error)
      setSaving(null)
      return
    }

    // Call Railway via Next.js API route to run the connector
    try {
      const res = await fetch('/api/connect/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: businessId, connector_type: connectorId, credentials }),
      })
      const result = await res.json()

      if (result.success) {
        await supabase
          .from('connectors')
          .update({
            status: 'active',
            data_snapshot: result.data,
            last_synced_at: new Date().toISOString(),
            error_message: null,
          })
          .eq('business_id', businessId)
          .eq('connector_type', connectorId)
      } else {
        await supabase
          .from('connectors')
          .update({ status: 'error', error_message: result.error || 'Sync failed' })
          .eq('business_id', businessId)
          .eq('connector_type', connectorId)
      }
    } catch (e) {
      await supabase
        .from('connectors')
        .update({ status: 'error', error_message: 'Connection failed' })
        .eq('business_id', businessId)
        .eq('connector_type', connectorId)
    }

    setSaving(null)
    loadConnectors(businessId)
  }

  const disconnect = async (connectorId: string) => {
    if (!businessId) return
    await supabase
      .from('connectors')
      .update({ status: 'disconnected' })
      .eq('business_id', businessId)
      .eq('connector_type', connectorId)
    loadConnectors(businessId)
  }

  const nav = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Health', href: '/health' },
    { label: 'Constraints', href: '/constraints' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Deployments', href: '/deployments' },
    { label: 'Outcomes', href: '/outcomes' },
    { label: 'Connect', href: '/connect', active: true },
  ]

  const completenessColor = twinCompleteness >= 80 ? '#4aaa4a' : twinCompleteness >= 65 ? gold : '#cc4444'

  return (
    <main style={{ backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>
      <nav style={{ padding: '0 48px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <span style={{ fontSize: '18px', fontWeight: '700', color: gold, letterSpacing: '0.1em' }}>BEI</span>
        <div style={{ display: 'flex' }}>
          {nav.map(n => (
            <a key={n.href} href={n.href} style={{ padding: '0 16px', height: '60px', display: 'flex', alignItems: 'center', fontSize: '13px', color: (n as any).active ? gold : '#555', borderBottom: (n as any).active ? `2px solid ${gold}` : '2px solid transparent', textDecoration: 'none' }}>{n.label}</a>
          ))}
        </div>
        <span style={{ fontSize: '12px', color: '#333' }}>{businessName}</span>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Connect Your Business</div>
        <div style={{ fontSize: '14px', color: '#555', marginBottom: '40px' }}>Connect real data sources to upgrade your Business Twin from intake-only to verified intelligence</div>

        {/* Twin completeness */}
        <div style={{ padding: '24px 32px', border: `1px solid ${border}`, borderRadius: '8px', backgroundColor: dark, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ textAlign: 'center' as const, minWidth: '80px' }}>
            <div style={{ fontSize: '40px', fontWeight: '700', color: completenessColor }}>{twinCompleteness}%</div>
            <div style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>Twin Completeness</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>Business Twin Confidence</span>
              <span style={{ fontSize: '12px', color: completenessColor }}>{twinCompleteness >= 80 ? 'High Confidence' : twinCompleteness >= 65 ? 'Medium Confidence' : 'Intake Only — 60% Confidence'}</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: twinCompleteness + '%', height: '100%', backgroundColor: completenessColor, borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: '12px', color: '#444', marginTop: '8px' }}>
              Each connector replaces intake form estimates with real verified data, improving intelligence accuracy.
            </div>
          </div>
        </div>

        {/* Connector list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CONNECTORS.map(connector => {
            const connected = connectors[connector.id]
            const isActive = connected?.status === 'active'
            const isError = connected?.status === 'error'
            const isExpanded = expanded === connector.id
            const isSaving = saving === connector.id

            return (
              <div key={connector.id} style={{ border: `1px solid ${isActive ? '#2a3a1a' : isError ? '#3a1a1a' : border}`, borderRadius: '8px', backgroundColor: isActive ? '#080f04' : isError ? '#0f0804' : dark, overflow: 'hidden' }}>
                <div
                  style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: connector.coming_soon ? 'default' : 'pointer' }}
                  onClick={() => !connector.coming_soon && setExpanded(isExpanded ? null : connector.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: isActive ? '#4aaa4a' : isError ? '#cc4444' : connector.coming_soon ? '#2a2a2a' : '#444', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {connector.name}
                        {connector.coming_soon && <span style={{ fontSize: '10px', color: '#333', border: '1px solid #222', padding: '2px 6px', borderRadius: '3px' }}>COMING SOON</span>}
                        {isActive && <span style={{ fontSize: '10px', color: '#4aaa4a', border: '1px solid #2a3a1a', padding: '2px 6px', borderRadius: '3px' }}>CONNECTED</span>}
                        {isError && <span style={{ fontSize: '10px', color: '#cc4444', border: '1px solid #3a1a1a', padding: '2px 6px', borderRadius: '3px' }}>ERROR</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: '#555' }}>{connector.description}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ textAlign: 'right' as const }}>
                      <div style={{ fontSize: '11px', color: '#333' }}>Twin Impact</div>
                      <div style={{ fontSize: '12px', color: '#555' }}>{connector.twin_impact}</div>
                    </div>
                    <div style={{ textAlign: 'center' as const }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: gold }}>{connector.confidence_boost}</div>
                      <div style={{ fontSize: '10px', color: '#333' }}>Confidence</div>
                    </div>
                    {!connector.coming_soon && (
                      <div style={{ fontSize: '16px', color: '#333', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</div>
                    )}
                  </div>
                </div>

                {isExpanded && !connector.coming_soon && (
                  <div style={{ borderTop: `1px solid ${border}`, padding: '24px' }}>
                    {connector.fields.length > 0 ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                          {connector.fields.map(field => (
                            <div key={field.key}>
                              <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>{field.label}</label>
                              <input
                                type={(field as any).secret ? 'password' : (field as any).inputType || 'text'}
                                placeholder={field.placeholder}
                                value={formData[connector.id]?.[field.key] || ''}
                                onChange={e => setFormData(prev => ({
                                  ...prev,
                                  [connector.id]: { ...prev[connector.id], [field.key]: e.target.value }
                                }))}
                                style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' as const }}
                              />
                            </div>
                          ))}
                        </div>
                        {isActive && connected?.last_synced_at && (
                          <div style={{ fontSize: '12px', color: '#444', marginBottom: '16px' }}>
                            Last synced: {new Date(connected.last_synced_at).toLocaleString()}
                          </div>
                        )}
                        {isError && connected?.error_message && (
                          <div style={{ fontSize: '12px', color: '#cc4444', marginBottom: '16px', padding: '8px 12px', border: '1px solid #3a1a1a', borderRadius: '4px' }}>
                            {connected.error_message}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button
                            onClick={() => saveAndSync(connector.id)}
                            disabled={isSaving}
                            style={{ padding: '10px 24px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', border: 'none', cursor: isSaving ? 'wait' : 'pointer', fontSize: '13px', opacity: isSaving ? 0.7 : 1 }}
                          >
                            {isSaving ? 'Connecting...' : isActive ? 'Re-sync' : 'Connect'}
                          </button>
                          {isActive && (
                            <button
                              onClick={() => disconnect(connector.id)}
                              style={{ padding: '10px 24px', backgroundColor: 'transparent', color: '#666', fontWeight: '600', borderRadius: '4px', border: '1px solid #2a2a2a', cursor: 'pointer', fontSize: '13px' }}
                            >
                              Disconnect
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: '13px', color: '#555' }}>Configuration not required for this connector.</div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '40px', padding: '20px', border: `1px solid #111`, borderRadius: '6px', backgroundColor: dark }}>
          <div style={{ fontSize: '12px', color: '#333', lineHeight: '1.8' }}>
            <strong style={{ color: '#444' }}>About connectors:</strong> Connector data replaces intake form estimates with real verified data in your Business Twin. Credentials are stored securely in Supabase and used only to pull intelligence data. No data leaves BEI.
          </div>
        </div>
      </div>
    </main>
  )
}
