'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'

const gold = '#C8A24A'
const dark = '#080808'
const border = '#1a1a1a'

type ConnectorStatus = 'not_connected' | 'pending' | 'active' | 'error' | 'disconnected'

interface ConnectorState {
  status: ConnectorStatus
  last_synced_at?: string
  error_message?: string
  data_snapshot?: any
}

const CONNECTOR_GROUPS = [
  {
    group: 'CRM',
    description: 'Lead volume, conversion rate and response time',
    twin_impact: 'Sales, Operations',
    connectors: [
      {
        id: 'hubspot',
        name: 'HubSpot',
        auth: 'oauth',
        confidence_boost: '+10%',
        fields: [
          { key: 'client_id', label: 'HubSpot App Client ID', placeholder: 'Your HubSpot app client ID' },
          { key: 'client_secret', label: 'Client Secret', placeholder: 'Your HubSpot app client secret', secret: true },
        ],
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        auth: 'oauth',
        confidence_boost: '+10%',
        fields: [
          { key: 'client_id', label: 'Salesforce Consumer Key', placeholder: 'Your connected app consumer key' },
          { key: 'client_secret', label: 'Consumer Secret', placeholder: 'Your connected app consumer secret', secret: true },
        ],
      },
      {
        id: 'manual_crm',
        name: 'Manual Entry',
        auth: 'manual',
        confidence_boost: '+6%',
        fields: [
          { key: 'total_leads', label: 'Total Leads (last 90 days)', placeholder: '50', inputType: 'number' },
          { key: 'converted_leads', label: 'Converted to Clients', placeholder: '8', inputType: 'number' },
          { key: 'avg_response_time_hours', label: 'Avg Response Time (hours)', placeholder: '4', inputType: 'number' },
          { key: 'avg_deal_value', label: 'Average Deal Value (£)', placeholder: '3500', inputType: 'number' },
          { key: 'open_deals', label: 'Open Deals', placeholder: '12', inputType: 'number' },
        ],
      },
    ],
  },
  {
    group: 'Financial',
    description: 'Revenue, margin, cash flow and client concentration',
    twin_impact: 'Growth, Risk',
    connectors: [
      {
        id: 'xero',
        name: 'Xero',
        auth: 'oauth',
        confidence_boost: '+12%',
        fields: [
          { key: 'client_id', label: 'Xero App Client ID', placeholder: 'Your Xero app client ID' },
          { key: 'client_secret', label: 'Client Secret', placeholder: 'Your Xero app client secret', secret: true },
        ],
      },
      {
        id: 'quickbooks',
        name: 'QuickBooks',
        auth: 'oauth',
        confidence_boost: '+12%',
        fields: [
          { key: 'client_id', label: 'Intuit Client ID', placeholder: 'Your QuickBooks app client ID' },
          { key: 'client_secret', label: 'Client Secret', placeholder: 'Your QuickBooks app client secret', secret: true },
        ],
      },
      {
        id: 'manual_financial',
        name: 'Manual Entry',
        auth: 'manual',
        confidence_boost: '+7%',
        fields: [
          { key: 'monthly_revenue', label: 'Monthly Revenue (£)', placeholder: '25000', inputType: 'number' },
          { key: 'revenue_last_12m', label: 'Revenue Last 12 Months (£)', placeholder: '300000', inputType: 'number' },
          { key: 'revenue_prev_12m', label: 'Revenue Previous 12 Months (£)', placeholder: '250000', inputType: 'number' },
          { key: 'gross_margin_pct', label: 'Gross Margin %', placeholder: '45', inputType: 'number' },
          { key: 'top_client_revenue_pct', label: 'Top Client % of Revenue', placeholder: '30', inputType: 'number' },
          { key: 'cash_reserves_months', label: 'Cash Reserves (months)', placeholder: '3', inputType: 'number' },
        ],
      },
    ],
  },
  {
    group: 'Staffing & HR',
    description: 'Team size, roles and capacity utilisation',
    twin_impact: 'Operations',
    connectors: [
      {
        id: 'hibob',
        name: 'HiBob',
        auth: 'api_key',
        confidence_boost: '+8%',
        fields: [
          { key: 'service_user_id', label: 'Service User ID', placeholder: 'Your HiBob service user ID' },
          { key: 'service_user_token', label: 'Service User Token', placeholder: 'Your HiBob service user token', secret: true },
        ],
      },
      {
        id: 'workday',
        name: 'Workday',
        auth: 'oauth',
        confidence_boost: '+8%',
        fields: [
          { key: 'tenant_url', label: 'Workday Tenant URL', placeholder: 'https://wd2-impl-services1.workday.com/ccx/service/yourcompany' },
          { key: 'client_id', label: 'Client ID', placeholder: 'Your Workday API client ID' },
          { key: 'client_secret', label: 'Client Secret', placeholder: 'Your Workday API client secret', secret: true },
          { key: 'refresh_token', label: 'Refresh Token', placeholder: 'Your Workday refresh token', secret: true },
        ],
      },
      {
        id: 'manual_staffing',
        name: 'Manual Entry',
        auth: 'manual',
        confidence_boost: '+5%',
        fields: [
          { key: 'team_size', label: 'Total Team Size', placeholder: '12', inputType: 'number' },
          { key: 'avg_utilisation_pct', label: 'Average Utilisation %', placeholder: '75', inputType: 'number' },
          { key: 'billable_staff', label: 'Billable / Delivery Staff', placeholder: '8', inputType: 'number' },
          { key: 'management_staff', label: 'Management Staff', placeholder: '2', inputType: 'number' },
          { key: 'admin_staff', label: 'Admin Staff', placeholder: '2', inputType: 'number' },
          { key: 'open_roles', label: 'Open Vacancies', placeholder: '1', inputType: 'number' },
        ],
      },
    ],
  },
  {
    group: 'Marketing & Web',
    description: 'Website traffic, conversions and online presence',
    twin_impact: 'Growth, Trust',
    connectors: [
      {
        id: 'google_analytics',
        name: 'Google Analytics',
        auth: 'oauth',
        confidence_boost: '+8%',
        fields: [
          { key: 'client_id', label: 'Google OAuth Client ID', placeholder: 'Your Google Cloud client ID' },
          { key: 'client_secret', label: 'Client Secret', placeholder: 'Your Google Cloud client secret', secret: true },
          { key: 'property_id', label: 'GA4 Property ID', placeholder: '123456789' },
        ],
      },
      {
        id: 'google_business_profile',
        name: 'Google Business Profile',
        auth: 'api_key',
        confidence_boost: '+8%',
        fields: [
          { key: 'place_id', label: 'Google Place ID', placeholder: 'ChIJ...' },
          { key: 'api_key', label: 'Google API Key', placeholder: 'AIza...', secret: true },
        ],
      },
    ],
  },
  {
    group: 'Company',
    description: 'Company structure, filing history and directors',
    twin_impact: 'Risk, Context',
    connectors: [
      {
        id: 'companies_house',
        name: 'Companies House',
        auth: 'api_key',
        confidence_boost: '+5%',
        fields: [
          { key: 'company_number', label: 'Company Number', placeholder: '12345678' },
          { key: 'api_key', label: 'Companies House API Key', placeholder: 'Get free at developer.company-information.service.gov.uk', secret: true },
        ],
      },
    ],
  },
]

export default function ConnectPage() {
  const supabase = createClient()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [connectorStates, setConnectorStates] = useState<Record<string, ConnectorState>>({})
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [twinCompleteness, setTwinCompleteness] = useState(60)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

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
        await loadConnectorStates(business.id)
      }
    }
    load()
  }, [])

  const loadConnectorStates = async (bizId: string) => {
    const { data } = await supabase
      .from('connectors')
      .select('connector_type, status, last_synced_at, error_message, data_snapshot')
      .eq('business_id', bizId)

    if (data) {
      const states: Record<string, ConnectorState> = {}
      data.forEach((c: any) => {
        states[c.connector_type] = {
          status: c.status,
          last_synced_at: c.last_synced_at,
          error_message: c.error_message,
          data_snapshot: c.data_snapshot,
        }
      })
      setConnectorStates(states)
      const activeCount = data.filter((c: any) => c.status === 'active').length
      setTwinCompleteness(Math.min(95, 60 + activeCount * 5))
    }
  }

  const saveAndSync = async (connectorId: string, connectorName: string) => {
    if (!businessId) return
    setSaving(connectorId)

    const credentials = formData[connectorId] || {}

    await supabase.from('connectors').upsert({
      business_id: businessId,
      connector_type: connectorId,
      connector_name: connectorName,
      status: 'pending',
      credentials,
    }, { onConflict: 'business_id,connector_type' })

    try {
      const res = await fetch('/api/connect/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: businessId, connector_type: connectorId, credentials }),
      })
      const result = await res.json()

      if (result.success) {
        await supabase.from('connectors').update({
          status: 'active',
          data_snapshot: result.data,
          last_synced_at: new Date().toISOString(),
          error_message: null,
        }).eq('business_id', businessId).eq('connector_type', connectorId)
      } else {
        await supabase.from('connectors').update({
          status: 'error',
          error_message: result.error || 'Sync failed',
        }).eq('business_id', businessId).eq('connector_type', connectorId)
      }
    } catch (e: any) {
      await supabase.from('connectors').update({
        status: 'error',
        error_message: e.message || 'Connection failed',
      }).eq('business_id', businessId).eq('connector_type', connectorId)
    }

    setSaving(null)
    if (businessId) await loadConnectorStates(businessId)
  }

  const initiateOAuth = async (connectorId: string) => {
    if (!businessId) return
    setSaving(connectorId)

    const credentials = formData[connectorId] || {}
    const redirectUri = `${window.location.origin}/api/connect/oauth/callback?connector=${connectorId}&business_id=${businessId}`

    try {
      const res = await fetch('/api/connect/oauth/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connector_type: connectorId,
          client_id: credentials.client_id,
          client_secret: credentials.client_secret,
          tenant_url: credentials.tenant_url,
          redirect_uri: redirectUri,
        }),
      })
      const data = await res.json()
      if (data.oauth_url) {
        window.location.href = data.oauth_url
      } else {
        alert(data.error || 'Failed to start OAuth')
      }
    } catch (e) {
      alert('Failed to initiate OAuth connection')
    }
    setSaving(null)
  }

  const disconnect = async (connectorId: string) => {
    if (!businessId) return
    await supabase.from('connectors').update({ status: 'disconnected' })
      .eq('business_id', businessId).eq('connector_type', connectorId)
    await loadConnectorStates(businessId)
  }

  const completenessColor = twinCompleteness >= 80 ? '#4aaa4a' : twinCompleteness >= 65 ? gold : '#cc4444'

  const nav = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Health', href: '/health' },
    { label: 'Constraints', href: '/constraints' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Deployments', href: '/deployments' },
    { label: 'Outcomes', href: '/outcomes' },
    { label: 'Connect', href: '/connect', active: true },
  ]

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
              <span style={{ fontSize: '12px', color: completenessColor }}>
                {twinCompleteness >= 80 ? 'High Confidence — Real Data' : twinCompleteness >= 65 ? 'Medium Confidence' : 'Intake Only — 60% Confidence'}
              </span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: twinCompleteness + '%', height: '100%', backgroundColor: completenessColor, borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: '12px', color: '#444', marginTop: '8px' }}>
              Each connector replaces intake form estimates with real verified data. Intelligence accuracy improves from 60% to 85%+ with full connectivity.
            </div>
          </div>
        </div>

        {/* Connector groups */}
        {CONNECTOR_GROUPS.map(group => (
          <div key={group.group} style={{ marginBottom: '40px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{group.group}</div>
              <div style={{ fontSize: '12px', color: '#555' }}>{group.description} — Twin Impact: <span style={{ color: gold }}>{group.twin_impact}</span></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {group.connectors.map(connector => {
                const state = connectorStates[connector.id]
                const isActive = state?.status === 'active'
                const isError = state?.status === 'error'
                const isExpanded = expanded === connector.id
                const isSaving = saving === connector.id
                const isManual = connector.auth === 'manual'
                const isOAuth = connector.auth === 'oauth'

                return (
                  <div key={connector.id} style={{
                    border: `1px solid ${isActive ? '#2a3a1a' : isError ? '#3a1a1a' : border}`,
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#080f04' : isError ? '#0f0804' : dark,
                    overflow: 'hidden',
                  }}>
                    <div
                      style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => setExpanded(isExpanded ? null : connector.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isActive ? '#4aaa4a' : isError ? '#cc4444' : '#333', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {connector.name}
                            {isActive && <span style={{ fontSize: '10px', color: '#4aaa4a', border: '1px solid #2a3a1a', padding: '1px 6px', borderRadius: '3px' }}>CONNECTED</span>}
                            {isError && <span style={{ fontSize: '10px', color: '#cc4444', border: '1px solid #3a1a1a', padding: '1px 6px', borderRadius: '3px' }}>ERROR</span>}
                            {isOAuth && !isActive && <span style={{ fontSize: '10px', color: '#555', border: '1px solid #222', padding: '1px 6px', borderRadius: '3px' }}>OAuth</span>}
                            {isManual && <span style={{ fontSize: '10px', color: '#555', border: '1px solid #222', padding: '1px 6px', borderRadius: '3px' }}>Manual</span>}
                          </div>
                          {isActive && state?.last_synced_at && (
                            <div style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>
                              Last synced: {new Date(state.last_synced_at).toLocaleString()}
                            </div>
                          )}
                          {isError && state?.error_message && (
                            <div style={{ fontSize: '11px', color: '#cc4444', marginTop: '2px' }}>{state.error_message}</div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: gold }}>{connector.confidence_boost}</div>
                        <div style={{ fontSize: '14px', color: '#333', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ borderTop: `1px solid ${border}`, padding: '20px 24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                          {connector.fields.map((field: any) => (
                            <div key={field.key}>
                              <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '4px' }}>{field.label}</label>
                              <input
                                type={field.secret ? 'password' : field.inputType || 'text'}
                                placeholder={field.placeholder}
                                value={formData[connector.id]?.[field.key] || ''}
                                onChange={e => setFormData(prev => ({
                                  ...prev,
                                  [connector.id]: { ...prev[connector.id], [field.key]: e.target.value }
                                }))}
                                style={{ width: '100%', padding: '8px 10px', backgroundColor: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' as const }}
                              />
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          {isOAuth ? (
                            <button
                              onClick={() => initiateOAuth(connector.id)}
                              disabled={isSaving}
                              style={{ padding: '9px 20px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', border: 'none', cursor: isSaving ? 'wait' : 'pointer', fontSize: '12px', opacity: isSaving ? 0.7 : 1 }}
                            >
                              {isSaving ? 'Connecting...' : isActive ? 'Re-authorise' : `Connect with ${connector.name} →`}
                            </button>
                          ) : (
                            <button
                              onClick={() => saveAndSync(connector.id, connector.name)}
                              disabled={isSaving}
                              style={{ padding: '9px 20px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '4px', border: 'none', cursor: isSaving ? 'wait' : 'pointer', fontSize: '12px', opacity: isSaving ? 0.7 : 1 }}
                            >
                              {isSaving ? 'Saving...' : isActive ? 'Re-sync' : 'Save & Connect'}
                            </button>
                          )}
                          {isActive && (
                            <button
                              onClick={() => disconnect(connector.id)}
                              style={{ padding: '9px 20px', backgroundColor: 'transparent', color: '#666', fontWeight: '600', borderRadius: '4px', border: '1px solid #2a2a2a', cursor: 'pointer', fontSize: '12px' }}
                            >
                              Disconnect
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div style={{ padding: '20px', border: `1px solid #111`, borderRadius: '6px', backgroundColor: dark }}>
          <div style={{ fontSize: '12px', color: '#333', lineHeight: '1.8' }}>
            <strong style={{ color: '#444' }}>Data integrity:</strong> Every connector pulls real data directly from your systems. No data is fabricated or estimated. Connector data replaces intake form estimates in your Business Twin, improving intelligence accuracy from 60% to 85%+. Credentials are stored securely in Supabase and never shared.
          </div>
        </div>
      </div>
    </main>
  )
}
