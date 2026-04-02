'use client';

import { getLanguageForCountry, LanguageCode } from '@/utils/country-language-map';
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
    const [language, setLanguage] = useState<LanguageCode>(initialLanguage);

    useEffect(() => {
        // If server already detected language, no client-side detection needed
        if (initialLanguage !== 'en') return;

        // Client-side fallback for non-Vercel platforms
        const detectLanguage = async () => {
            try {
                // Check session cache first (avoids duplicate API calls per tab)
                const cached = sessionStorage.getItem('geo_country');
                if (cached) {
                    setLanguage(getLanguageForCountry(cached.toLowerCase()));
                    return;
                }

                // Call our internal detect-country API
                const res = await fetch('/api/detect-country');
                if (!res.ok) return;

                const data = await res.json() as { countryCode: string };
                const cc = (data.countryCode || 'US').toUpperCase();

                // Cache for this session
                sessionStorage.setItem('geo_country', cc);

                const detected = getLanguageForCountry(cc.toLowerCase());
                setLanguage(detected);
                console.log('[LanguageProvider] Detected language:', detected, 'for country:', cc);
            } catch {
                // Keep current language on error
            }
        };

        detectLanguage();
    }, [initialLanguage]);

    return (
        <LanguageContext.Provider value={{ language }}>
            {children}
        </LanguageContext.Provider>
    );
};
