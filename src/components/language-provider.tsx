'use client';

import { getLanguageForCountry, getLanguageFromBrowserLocale, LanguageCode } from '@/utils/country-language-map';
import { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
    language: LanguageCode;
}

const LanguageContext = createContext<LanguageContextType>({ language: 'en' });

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({
    children,
    initialLanguage = 'en',
}: {
    children: React.ReactNode;
    initialLanguage?: LanguageCode;
}) => {
    // Priority 1: Server-detected, Priority 2: Cached, Priority 3: Browser locale
    const [language, setLanguage] = useState<LanguageCode>(() => {
        if (initialLanguage !== 'en') return initialLanguage;
        
        if (typeof window !== 'undefined') {
            const cached = sessionStorage.getItem('detected_language');
            if (cached) return cached as LanguageCode;
            
            const browserLang = getLanguageFromBrowserLocale(
                navigator.language || 'en'
            );
            return browserLang;
        }
        return 'en';
    });

    useEffect(() => {
        // Cache the language for this session
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('detected_language', language);
        }

        // If server didn't detect, try geo-IP detection
        if (initialLanguage === 'en' && !sessionStorage.getItem('geo_country')) {
            const detectGeo = async () => {
                try {
                    const res = await fetch('/api/detect-country');
                    if (!res.ok) return;
                    const data = await res.json() as { countryCode: string };
                    const cc = (data.countryCode || '').toUpperCase();
                    if (cc && cc !== 'XX') {
                        sessionStorage.setItem('geo_country', cc);
                        const detected = getLanguageForCountry(cc.toLowerCase());
                        if (detected !== language) {
                            setLanguage(detected);
                        }
                    }
                } catch (err) {
                    console.error('[LanguageProvider] Geo-detection error:', err);
                }
            };
            detectGeo();
        }
    }, [initialLanguage, language]);

    return (
        <LanguageContext.Provider value={{ language }}>
            {children}
        </LanguageContext.Provider>
    );
};
