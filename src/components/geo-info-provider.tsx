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
    const { geoInfo, setGeoInfo, setLanguage } = store();

    useEffect(() => {
        const fetchGeoInfo = async () => {
            try {
                // Try to get cached data first
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const cachedData = JSON.parse(cached) as CachedGeoInfo;
                    if (Date.now() - cachedData.timestamp < CACHE_TTL) {
                        // Cache is still valid
                        const geoData = cachedData.data;
                        setGeoInfo(geoData);
                        const detectedLanguage = getLanguageForCountry(geoData.country_code);
                        setLanguage(detectedLanguage);
                        return;
                    }
                }

                // Create abort controller for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

                try {
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
                    
                    // Cache the result
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        data: geoData,
                        timestamp: Date.now()
                    }));

                    setGeoInfo(geoData);
                    
                    // Automatically detect and set language based on country code using comprehensive mapping
                    const countryCode = data.country_code || 'us';
                    const detectedLanguage = getLanguageForCountry(countryCode);
                    setLanguage(detectedLanguage);
                } catch (timeoutOrError) {
                    clearTimeout(timeoutId);
                    // If timeout or error, keep the default values but don't block UI
                    if (axios.isAxiosError(timeoutOrError)) {
                        console.error('Timeout or error fetching geo info:', timeoutOrError.message);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch geo info:', error);
                // Default values already set in store
            }
        };

        fetchGeoInfo();
    }, [setGeoInfo, setLanguage]);

    return null;
};
