import { store } from '@/store/store';
import { getTranslations } from './translate';
import { useMemo, useEffect, useRef } from 'react';

export const useTranslation = () => {
    // Subscribe to language changes with Zustand selector for proper reactivity
    const language = store((state) => state.language);
    const prevLanguageRef = useRef<string | undefined>(undefined);

    // Log language changes
    useEffect(() => {
        if (prevLanguageRef.current !== language) {
            console.log('[useTranslation] Language changed from', prevLanguageRef.current || 'undefined', 'to:', language);
            prevLanguageRef.current = language;
        }
    }, [language]);

    const translations = useMemo(() => {
        const lang = language || 'en';
        console.log('[useTranslation] Getting translations for language:', lang);
        const trans = getTranslations(lang);
        
        if (!trans) {
            console.warn('[useTranslation] No translations found for language:', lang, '- falling back to en');
            return getTranslations('en') || {};
        }
        
        return trans;
    }, [language]);

    const t = (text: string): string => {
        const translated = translations[text];
        
        if (!translated) {
            console.debug('[useTranslation] Missing translation for:', text, 'in language:', language);
            return text;
        }
        
        return translated;
    };

    return { t, language };
};
