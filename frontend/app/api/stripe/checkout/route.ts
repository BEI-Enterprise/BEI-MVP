import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const PRICE_IDS: Record<string, string> = {
  analysis: 'price_1TjPZmQeUg2DxiBvqqAUmNv4',
  opportunity: 'price_1TjPaiQeUg2DxiBvFG5boRGQ',
  platform: 'price_1TjPblQeUg2DxiBvmlc5mcDw',
}

export async function POST(request: NextRequest) {
  try {
    const { plan, email } = await request.json()

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `https://officialbei.com/dashboard?subscribed=true`,
      cancel_url: `https://officialbei.com/pricing?cancelled=true`,
      metadata: { plan },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
