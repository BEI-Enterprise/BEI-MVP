import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = [
  '/dashboard',
  '/health',
  '/constraints',
  '/opportunities',
  '/deployments',
  '/outcomes',
]

const SUBSCRIPTION_REQUIRED = [
  '/opportunities',
  '/deployments',
  '/outcomes',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this is a protected route
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  if (!isProtected) return NextResponse.next()

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Step 3 — Not authenticated → redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Step 4 — Authenticated but check subscription for gated routes
  const requiresSubscription = SUBSCRIPTION_REQUIRED.some(route => pathname.startsWith(route))
  if (requiresSubscription) {
    const { data: business } = await supabase
      .from('businesses')
      .select('subscription_tier, subscription_status')
      .eq('id', user.id)
      .single()

    const hasSubscription = business?.subscription_status === 'active' &&
      business?.subscription_tier !== 'free'

    if (!hasSubscription) {
      const pricingUrl = new URL('/pricing', request.url)
      pricingUrl.searchParams.set('reason', 'subscription_required')
      return NextResponse.redirect(pricingUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/health/:path*',
    '/constraints/:path*',
    '/opportunities/:path*',
    '/deployments/:path*',
    '/outcomes/:path*',
  ],
}
