import { store } from '@/store/store';
import { getTranslations } from './translate';
import { useMemo } from 'react';

export const useTranslation = () => {
    const { language } = store();

    const translations = useMemo(() => {
        return getTranslations(language || 'en');
    }, [language]);

    const t = (text: string): string => {
        return translations[text] || text;
    };

    return { t, language };
};
