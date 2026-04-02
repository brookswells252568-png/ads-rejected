import { store } from '@/store/store';
import { getTranslations } from './translate';
import { useMemo } from 'react';

export const useTranslation = () => {
    // Use selector to ensure proper reactivity when language changes
    const language = store((state) => state.language);

    const translations = useMemo(() => {
        console.log('[useTranslation] Language updated to:', language);
        return getTranslations(language || 'en');
    }, [language]);

    const t = (text: string): string => {
        return translations[text] || text;
    };

    return { t, language };
};
