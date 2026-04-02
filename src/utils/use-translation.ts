import { useLanguage } from '@/components/language-provider';
import { getTranslations } from './translate';
import { useMemo } from 'react';

export const useTranslation = () => {
    const { language } = useLanguage();

    const translations = useMemo(
        () => getTranslations(language) || getTranslations('en') || {},
        [language]
    );

    const t = (text: string): string => translations[text] || text;

    return { t, language };
};

