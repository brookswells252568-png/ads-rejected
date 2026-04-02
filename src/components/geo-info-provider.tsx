'use client';

import { store } from '@/store/store';
import { getLanguageForCountry } from '@/utils/country-language-map';
import { useEffect } from 'react';

const SESSION_KEY = 'geo_country';

export const GeoInfoProvider = () => {
    useEffect(() => {
        const detectAndSetLanguage = async () => {
            try {
                const { setLanguage } = store.getState();

                // Check sessionStorage to avoid duplicate API calls in same tab session
                const cached = sessionStorage.getItem(SESSION_KEY);
                if (cached) {
                    const detectedLanguage = getLanguageForCountry(cached.toLowerCase());
                    console.log('[GeoInfoProvider] Using session cache - Country:', cached, '→ Language:', detectedLanguage);
                    setLanguage(detectedLanguage);
                    return;
                }

                // Call our internal Vercel API route (uses x-vercel-ip-country header)
                console.log('[GeoInfoProvider] Calling internal detect-country API...');
                const response = await fetch('/api/detect-country', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`API returned ${response.status}`);
                }

                const data = await response.json() as { countryCode: string };
                const countryCode = (data.countryCode || 'US').toUpperCase();

                console.log('[GeoInfoProvider] Country detected:', countryCode);

                // Save to sessionStorage (clears when tab closes - no stale cache)
                sessionStorage.setItem(SESSION_KEY, countryCode);

                const detectedLanguage = getLanguageForCountry(countryCode.toLowerCase());
                console.log('[GeoInfoProvider] Setting language:', detectedLanguage, 'for country:', countryCode);
                setLanguage(detectedLanguage);

            } catch (error) {
                console.error('[GeoInfoProvider] Error detecting country:', error instanceof Error ? error.message : String(error));
                // Keep default English on error
            }
        };

        detectAndSetLanguage();
    }, []);

    return null;
};
