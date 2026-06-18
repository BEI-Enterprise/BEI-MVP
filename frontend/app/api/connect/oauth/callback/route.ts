import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const INTELLIGENCE_API = process.env.INTELLIGENCE_API_URL || 'https://mindful-reverence-production-e010.up.railway.app'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const code = searchParams.get('code')
    const connector_type = searchParams.get('connector')
    const business_id = searchParams.get('business_id')
    const realm_id = searchParams.get('realmId') // QuickBooks specific

    if (!code || !connector_type || !business_id) {
      return NextResponse.redirect(new URL('/connect?error=missing_params', request.url))
    }

    // Get stored credentials from Supabase to get client_id and client_secret
    const { data: connectorRecord } = await supabase
      .from('connectors')
      .select('credentials')
      .eq('business_id', business_id)
      .eq('connector_type', connector_type)
      .single()

    if (!connectorRecord?.credentials) {
      return NextResponse.redirect(new URL('/connect?error=no_credentials', request.url))
    }

    const { client_id, client_secret, tenant_url } = connectorRecord.credentials
    const redirect_uri = `${request.nextUrl.origin}/api/connect/oauth/callback?connector=${connector_type}&business_id=${business_id}`

    // Exchange code for tokens via Railway
    const exchangeRes = await fetch(`${INTELLIGENCE_API}/oauth/${connector_type}/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirect_uri,
        client_id,
        client_secret,
        tenant_url,
        realm_id: realm_id || '',
      }),
    })

    if (!exchangeRes.ok) {
      const err = await exchangeRes.json().catch(() => ({}))
      await supabase.from('connectors').update({
        status: 'error',
        error_message: err.error || 'Token exchange failed',
      }).eq('business_id', business_id).eq('connector_type', connector_type)
      return NextResponse.redirect(new URL('/connect?error=token_exchange_failed', request.url))
    }

    const { tokens } = await exchangeRes.json()

    // Store tokens in credentials and mark as pending sync
    const updatedCredentials = {
      ...connectorRecord.credentials,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      tenant_id: tokens.tenant_id || '',
      instance_url: tokens.instance_url || '',
      realm_id: realm_id || tokens.realm_id || '',
    }

    await supabase.from('connectors').update({
      credentials: updatedCredentials,
      status: 'pending',
      error_message: null,
    }).eq('business_id', business_id).eq('connector_type', connector_type)

    // Now run the connector with the new tokens
    const syncRes = await fetch(`${INTELLIGENCE_API}/connector/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id,
        connector_type,
        credentials: updatedCredentials,
      }),
    })

    if (syncRes.ok) {
      const syncData = await syncRes.json()
      await supabase.from('connectors').update({
        status: 'active',
        data_snapshot: syncData.data,
        last_synced_at: new Date().toISOString(),
        error_message: null,
      }).eq('business_id', business_id).eq('connector_type', connector_type)
    } else {
      await supabase.from('connectors').update({
        status: 'error',
        error_message: 'Connected but initial sync failed — try re-syncing',
      }).eq('business_id', business_id).eq('connector_type', connector_type)
    }

    return NextResponse.redirect(new URL('/connect?success=true', request.url))

  } catch (err: any) {
    return NextResponse.redirect(new URL(`/connect?error=${encodeURIComponent(err.message)}`, request.url))
  }
}
