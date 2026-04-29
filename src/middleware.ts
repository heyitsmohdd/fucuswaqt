import { NextResponse, type NextRequest } from 'next/server'

// Supabase paused — middleware is a passthrough until re-enabled
export async function middleware(request: NextRequest) {
    return NextResponse.next({ request })
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
