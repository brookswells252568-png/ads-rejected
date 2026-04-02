import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // 1st priority: Use Vercel's built-in geo headers (instant, no external API)
        const vercelCountry = request.headers.get('x-vercel-ip-country');
        if (vercelCountry && vercelCountry !== 'XX') {
            console.log('[detect-country] Using Vercel geo header:', vercelCountry);
            return NextResponse.json({ countryCode: vercelCountry.toUpperCase() });
        }

        // 2nd priority: Cloudflare header
        const cfCountry = request.headers.get('cf-ipcountry');
        if (cfCountry && cfCountry !== 'XX') {
            console.log('[detect-country] Using Cloudflare geo header:', cfCountry);
            return NextResponse.json({ countryCode: cfCountry.toUpperCase() });
        }

        // 3rd priority: Try IP-based detection from client IP
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                   request.headers.get('x-real-ip') ||
                   'unknown';

        if (ip && ip !== 'unknown' && ip !== '127.0.0.1' && ip !== '::1') {
            try {
                const response = await fetch(`https://ipapi.co/${ip}/country/`, {
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                });
                if (response.ok) {
                    const countryCode = (await response.text()).trim().toUpperCase();
                    if (countryCode && countryCode.length === 2) {
                        console.log('[detect-country] Using ipapi.co result:', countryCode);
                        return NextResponse.json({ countryCode });
                    }
                }
            } catch {
                // fallthrough to default
            }
        }

        // Default fallback
        console.log('[detect-country] No geo header detected, falling back to US');
        return NextResponse.json({ countryCode: 'US' });
    } catch (error) {
        console.error('[detect-country] Error:', error);
        return NextResponse.json({ countryCode: 'US' });
    }
}
