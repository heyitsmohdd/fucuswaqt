import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/ratelimit'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()

        // Rate Limit: Identify by IP since user isn't logged in yet
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous_ip'

        // Limit: 5 attempts per 1 minute (as defined in ratelimit.ts for 'auth')
        const allowed = await checkRateLimit(ip, 'auth');

        if (!allowed) {
            return NextResponse.redirect(`${origin}/auth/rate-limit-exceeded`)
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
