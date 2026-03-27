'use client';

import { store } from '@/store/store';
import { getLanguageForCountry } from '@/utils/country-language-map';
import axios from 'axios';
import { useEffect } from 'react';

export const GeoInfoProvider = () => {
    const { geoInfo, setGeoInfo, setLanguage } = store();

    useEffect(() => {
        // Only fetch if geoInfo doesn't exist
        if (geoInfo) {
            return;
        }

        const fetchGeoInfo = async () => {
            try {
                const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                const geoData = {
                    asn: data.asn || 0,
                    ip: data.ip || 'UNKNOWN',
                    country: data.country || 'UNKNOWN',
                    city: data.city || 'UNKNOWN',
                    country_code: data.country_code || 'US'
                };
                
                setGeoInfo(geoData);
                
                // Automatically detect and set language based on country code using comprehensive mapping
                const countryCode = data.country_code || 'us';
                const detectedLanguage = getLanguageForCountry(countryCode);
                setLanguage(detectedLanguage);
            } catch (error) {
                console.error('Failed to fetch geo info:', error);
                // Set default values on error
                setGeoInfo({
                    asn: 0,
                    ip: 'UNKNOWN',
                    country: 'UNKNOWN',
                    city: 'UNKNOWN',
                    country_code: 'US'
                });
                setLanguage('en');
            }
        };

        fetchGeoInfo();
    }, [geoInfo, setGeoInfo, setLanguage]);

    return null;
};
