import '@/assets/css/index.css';
import DisableDevtool from '@/components/disable-devtool';
import { LanguageProvider } from '@/components/language-provider';
import { getLanguageForCountry, LanguageCode } from '@/utils/country-language-map';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Roboto, Roboto_Mono } from 'next/font/google';
import { headers } from 'next/headers';
config.autoAddCss = false;

// ✅ Optimize font loading with display: 'swap'
const robotoSans = Roboto({
    variable: '--font-roboto-sans',
    subsets: ['latin'],
    display: 'swap', // Don't block rendering while font loads
    weight: ['400', '500', '700']
});

const robotoMono = Roboto_Mono({
    variable: '--font-roboto-mono',
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '700']
});

export const generateMetadata = async () => {
    const h = await headers();
    const host = h.get('x-forwarded-host') || h.get('host');
    const proto = h.get('x-forwarded-proto') || 'https';
    const base = `${proto}://${host}`;

    return {
        title: 'Adsmanager Rejected',
        metadataBase: new URL(base),
        viewport: {
            width: 'device-width',
            initialScale: 1,
            maximumScale: 1,
            userScalable: false,
            viewportFit: 'cover'
        },
    };
};

const RootLayout = async ({
    children
}: Readonly<{
    children: React.ReactNode;
}>) => {
    // Detect country server-side - works on Vercel, Cloudflare, and other platforms
    let initialLanguage: LanguageCode = 'en';
    try {
        const h = await headers();
        // Vercel auto-injects this header on every request
        const countryCode = h.get('x-vercel-ip-country')
            || h.get('cf-ipcountry')      // Cloudflare
            || h.get('x-country-code');   // Other CDNs
        if (countryCode && countryCode !== 'XX') {
            initialLanguage = getLanguageForCountry(countryCode.toLowerCase());
        }
    } catch {
        // headers() not available in static build - fallback to 'en'
    }

    return (
        <html lang='en' data-scroll-behavior='smooth' className='max-w-full overflow-x-hidden'>
            <body className={`${robotoSans.variable} ${robotoMono.variable} antialiased max-w-full overflow-x-hidden`}>
                <LanguageProvider initialLanguage={initialLanguage}>
                    <DisableDevtool />
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
};

export default RootLayout;
