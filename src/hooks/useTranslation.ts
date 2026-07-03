'use client';

import { store } from '@/store/store';
import { getLanguageFromCountry, getTranslations } from '@/utils/translate';

/**
 * Shared translation hook - centralizes country detection → language → translation logic.
 * 
 * @param textsToTranslate - Optional list of texts that need translation.
 *   Kept for backward compatibility with current call sites.
 * 
 * Usage:
 *   const { t } = useTranslation(['Request Review', 'Submit']);
 *   return <h1>{t('Request Review')}</h1>;
 */
export function useTranslation(textsToTranslate?: string[]) {
    const { geoInfo } = store();
    void textsToTranslate;

    const translations: Record<string, string> = (() => {
        if (!geoInfo) return {};
        const lang = getLanguageFromCountry(geoInfo.country_code);
        if (lang === 'en') return {};
        return getTranslations(lang) || {};
    })();

    const t = (text: string): string => translations[text] || text;

    return { t, translations };
}
