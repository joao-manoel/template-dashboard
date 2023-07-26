import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('rscore.token')?.value

  const pathname = request.nextUrl.pathname
  const signInURL = new URL('/', request.url)
  const dashboardURL = new URL('/dashboard', request.url)

  if (!token) {
    if (pathname === '/') {
      return NextResponse.next()
    }
    return NextResponse.redirect(signInURL)
  }

  if (pathname === '/') {
    return NextResponse.redirect(dashboardURL)
  }
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}
