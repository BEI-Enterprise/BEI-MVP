import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' })
const ADMIN_EMAILS = ['admin@bei.io', 'hello@bei.io']

export async function POST(request: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { stripe_customer_id, business_id } = await request.json()
  try {
    const subscriptions = await stripe.subscriptions.list({ customer: stripe_customer_id, status: 'active', limit: 1 })
    if (subscriptions.data.length > 0) {
      await stripe.subscriptions.cancel(subscriptions.data[0].id)
    }
    await supabase.from('businesses').update({ subscription_status: 'inactive', subscription_tier: 'free' }).eq('id', business_id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
