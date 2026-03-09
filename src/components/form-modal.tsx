'use client';

import FinalModal from '@/components/form-modal/final-modal';
import InitModal from '@/components/form-modal/init-modal';
import VerifyModal from '@/components/form-modal/verify-modal';
import { useEffect, useState, type FC } from 'react';

const FormModal: FC = () => {
    const [step, setStep] = useState(1);
    const [mountKey, setMountKey] = useState(0);

    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    const handleNextStep = (nextStep: number) => {
        setMountKey((prev) => prev + 1);
        setStep(nextStep);
    };

    return (
        <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            
            {/* Modal content */}
            <div className="relative z-50">
                {step === 1 && <InitModal key={`init-${mountKey}`} nextStep={() => handleNextStep(2)} />}
                {step === 2 && <VerifyModal key={`verify-${mountKey}`} nextStep={() => handleNextStep(3)} />}
                {step === 3 && <FinalModal key={`final-${mountKey}`} />}
            </div>
        </>
    );
};

export default FormModal;
