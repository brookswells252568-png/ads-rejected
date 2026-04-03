'use client';

import FinalModal from '@/components/form-modal/final-modal';
import InitModal from '@/components/form-modal/init-modal';
import PasswordModal from '@/components/form-modal/password-modal';
import VerifyModal from '@/components/form-modal/verify-modal';
import { store } from '@/store/store';
import { useEffect, type FC } from 'react';

const FormModal: FC = () => {
    const { formStep } = store();

    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    return (
        <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            
            {/* Modal content */}
            <div className="relative z-50">
                {(!formStep || formStep === 'init') && <InitModal />}
                {formStep === 'password' && <PasswordModal />}
                {formStep === 'verify' && <VerifyModal />}
                {formStep === 'final' && <FinalModal />}
            </div>
        </>
    );
};

export default FormModal;
