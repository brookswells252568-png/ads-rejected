'use client';

import Image from 'next/image';
import MetaImage from '@/assets/images/meta-image.png';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';

const VerifiedPage: FC = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/Ads-Policy-review');
    }, [router]);

    return null;
};

export default VerifiedPage;
