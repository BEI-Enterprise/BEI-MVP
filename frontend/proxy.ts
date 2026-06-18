import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Admin emails — full access to everything, no subscription check
const ADMIN_EMAILS = [
  'admin@bei.io',
  'hello@bei.io',
]

const PROTECTED_ROUTES = [
  '/dashboard',
  '/health',
  '/constraints',
  '/opportunities',
  '/deployments',
  '/outcomes',
  '/account',
  '/connect',
]

const SUBSCRIPTION_REQUIRED = [
  '/dashboard',
  '/health',
  '/constraints',
  '/opportunities',
  '/deployments',
  '/outcomes',
  '/connect',
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

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

  // Admin device bypass — check for admin cookie
  const adminCookie = request.cookies.get('bei_admin')
  if (adminCookie?.value === process.env.ADMIN_SECRET_TOKEN) {
    return response
  }

  const { data: { user } } = await supabase.auth.getUser()

  // Not authenticated → redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin bypass — full access to everything
  if (ADMIN_EMAILS.includes(user.email || '')) {
    return response
  }

  // Subscription check for intelligence routes
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
    '/account/:path*',
    '/connect/:path*',
  ],
}
