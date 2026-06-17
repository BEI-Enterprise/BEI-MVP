import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true, message: 'Admin access granted. Cookie set. Navigate to /dashboard.' })
  response.cookies.set('bei_admin', process.env.ADMIN_SECRET_TOKEN!, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })
  return response
}
