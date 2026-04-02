'use client';

import { store } from '@/store/store';
import { getLanguageForCountry } from '@/utils/country-language-map';
import axios from 'axios';
import { useEffect } from 'react';

const CACHE_KEY = 'geoInfo_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const API_TIMEOUT = 5000; // 5 seconds timeout for API call

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
        // Only run on browser - essential check for Vercel/Next.js
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            console.log('[GeoInfoProvider] Running on server or no localStorage, skipping...');
            return;
        }

        let isComponentMounted = true;

        const fetchGeoInfo = async () => {
            try {
                const { setGeoInfo, setLanguage } = store();

                console.log('[GeoInfoProvider] Starting geo detection...');

                // Try cache first
                try {
                    const cached = localStorage.getItem(CACHE_KEY);
                    if (cached) {
                        const cachedData = JSON.parse(cached) as CachedGeoInfo;
                        const cacheAge = Date.now() - cachedData.timestamp;
                        
                        if (cacheAge < CACHE_TTL) {
                            console.log('[GeoInfoProvider] Cache valid, using cached data');
                            const geoData = cachedData.data;
                            
                            if (isComponentMounted) {
                                setGeoInfo(geoData);
                                const detectedLanguage = getLanguageForCountry(geoData.country_code);
                                console.log('[GeoInfoProvider] Setting language from cache:', detectedLanguage, 'Country:', geoData.country_code);
                                setLanguage(detectedLanguage);
                            }
                            return;
                        }
                    }
                } catch (e) {
                    console.warn('[GeoInfoProvider] Cache read error:', e instanceof Error ? e.message : String(e));
                }

                // Fetch fresh geo data
                console.log('[GeoInfoProvider] Fetching fresh geo data from API...');
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

                try {
                    const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json', {
                        signal: controller.signal,
                        timeout: API_TIMEOUT
                    });

                    clearTimeout(timeoutId);

                    const geoData = {
                        asn: data.asn || 0,
                        ip: data.ip || 'UNKNOWN',
                        country: data.country || 'UNKNOWN',
                        city: data.city || 'UNKNOWN',
                        country_code: (data.country_code || 'US').toUpperCase()
                    };

                    console.log('[GeoInfoProvider] API Response:', geoData);

                    // Cache the result
                    try {
                        localStorage.setItem(CACHE_KEY, JSON.stringify({
                            data: geoData,
                            timestamp: Date.now()
                        }));
                    } catch (e) {
                        console.warn('[GeoInfoProvider] Cache write error:', e instanceof Error ? e.message : String(e));
                    }

                    if (isComponentMounted) {
                        setGeoInfo(geoData);

                        // Detect language from country code
                        const detectedLanguage = getLanguageForCountry(geoData.country_code.toLowerCase());
                        console.log('[GeoInfoProvider] Detected language:', detectedLanguage, 'From country:', geoData.country_code);
                        
                        // Set language in store
                        setLanguage(detectedLanguage);
                        console.log('[GeoInfoProvider] Language set successfully to:', detectedLanguage);
                    }
                } catch (apiError) {
                    clearTimeout(timeoutId);
                    
                    if (axios.isAxiosError(apiError)) {
                        if (apiError.code === 'EABORT') {
                            console.error('[GeoInfoProvider] API timeout after', API_TIMEOUT, 'ms');
                        } else {
                            console.error('[GeoInfoProvider] API error:', apiError.message);
                        }
                    } else if (apiError instanceof Error) {
                        console.error('[GeoInfoProvider] Error:', apiError.message);
                    } else {
                        console.error('[GeoInfoProvider] Unknown error:', apiError);
                    }

                    // Set default values on error but don't fail
                    if (isComponentMounted) {
                        console.log('[GeoInfoProvider] Using fallback: English for US');
                        setGeoInfo({
                            asn: 0,
                            ip: 'UNKNOWN',
                            country: 'UNKNOWN',
                            city: 'UNKNOWN',
                            country_code: 'US'
                        });
                        setLanguage('en');
                    }
                }
            } catch (error) {
                console.error('[GeoInfoProvider] Unexpected error:', error instanceof Error ? error.message : String(error));
            }
        };

        // Start immediately - no delay for better UX on Vercel
        fetchGeoInfo();

        return () => {
            isComponentMounted = false;
        };
    }, []);

    // Silently return - no rendering needed
    return null;
};
