import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'better-auth.session_token'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname === '/') {
        const hasSession = request.cookies.has(SESSION_COOKIE)
        if (hasSession) {
            return NextResponse.redirect(new URL('/app', request.url))
        }
    }

    return NextResponse.next({ request })
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
