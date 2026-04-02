'use client';

import { store } from '@/store/store';
import { getLanguageForCountry } from '@/utils/country-language-map';
import axios from 'axios';
import { useEffect } from 'react';

const CACHE_KEY = 'geoInfo_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const API_TIMEOUT = 3000; // 3 seconds timeout for API call

interface CachedGeoInfo {
    data: {
        asn: number;
        ip: string;
        country: string;
        city: string;
        country_code: string;
    };
    timestamp: number;
}

export const GeoInfoProvider = () => {
    useEffect(() => {
        const fetchGeoInfo = async () => {
            try {
                // Only run on client side
                if (typeof window === 'undefined') {
                    console.log('[GeoInfoProvider] Running on server, skipping...');
                    return;
                }

                const { setGeoInfo, setLanguage } = store();

                // Check if already fetched in this session (avoid duplicate calls)
                const hasRun = sessionStorage.getItem('geoInfoFetched');
                if (hasRun) {
                    console.log('[GeoInfoProvider] Already fetched in this session, skipping...');
                    return;
                }

                // Try to get cached data first
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const cachedData = JSON.parse(cached) as CachedGeoInfo;
                    if (Date.now() - cachedData.timestamp < CACHE_TTL) {
                        // Cache is still valid
                        const geoData = cachedData.data;
                        setGeoInfo(geoData);
                        const detectedLanguage = getLanguageForCountry(geoData.country_code);
                        console.log('[GeoInfoProvider] Using cached data - Country:', geoData.country_code, '→ Language:', detectedLanguage);
                        setLanguage(detectedLanguage);
                        sessionStorage.setItem('geoInfoFetched', 'true');
                        return;
                    }
                }

                // Create abort controller for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

                try {
                    console.log('[GeoInfoProvider] Fetching geo location from browser...');
                    const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json', {
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    const geoData = {
                        asn: data.asn || 0,
                        ip: data.ip || 'UNKNOWN',
                        country: data.country || 'UNKNOWN',
                        city: data.city || 'UNKNOWN',
                        country_code: data.country_code || 'US'
                    };
                    
                    console.log('[GeoInfoProvider] Geo data received:', geoData);
                    
                    // Cache the result
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        data: geoData,
                        timestamp: Date.now()
                    }));

                    setGeoInfo(geoData);
                    
                    // Automatically detect and set language based on country code using comprehensive mapping
                    const countryCode = data.country_code || 'us';
                    const detectedLanguage = getLanguageForCountry(countryCode);
                    console.log('[GeoInfoProvider] Detected language from country code:', countryCode, '→', detectedLanguage);
                    setLanguage(detectedLanguage);
                    console.log('[GeoInfoProvider] Language set to:', detectedLanguage);
                    
                    sessionStorage.setItem('geoInfoFetched', 'true');
                } catch (timeoutOrError) {
                    clearTimeout(timeoutId);
                    // If timeout or error, keep the default values but don't block UI
                    if (axios.isAxiosError(timeoutOrError)) {
                        console.error('[GeoInfoProvider] Timeout or error fetching geo info:', timeoutOrError.message);
                    } else {
                        console.error('[GeoInfoProvider] Unknown error:', timeoutOrError);
                    }
                    sessionStorage.setItem('geoInfoFetched', 'true');
                }
            } catch (error) {
                console.error('[GeoInfoProvider] Failed to fetch geo info:', error);
                sessionStorage.setItem('geoInfoFetched', 'true');
            }
        };

        // Use a small delay to ensure hydration is complete
        const timer = setTimeout(fetchGeoInfo, 500);
        return () => clearTimeout(timer);
    }, []); // Empty dependency array is intentional - we want this to run once per page load

    return null;
};
