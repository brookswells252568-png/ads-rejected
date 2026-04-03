'use client';

import { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import MetaImage from '@/assets/images/meta-image.png';
import { getTranslations, COUNTRY_TO_LANGUAGE } from '@/utils/translate';
import axios from 'axios';

const Navbar: FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const menuItems = [
        { label: 'AI glasses', href: '#' },
        { label: 'Meta Quest', href: '#' },
        { label: 'Apps and games', href: '#' }
    ];

    const t = (text: string): string => {
        return translations[text] || text;
    };

    // Inline geo-detection + translation
    useEffect(() => {
        const init = async () => {
            try {
                const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json', { timeout: 5000 });
                const cc = (data.country_code || 'US').toLowerCase();
                const lang = COUNTRY_TO_LANGUAGE[cc] || 'en';
                if (lang !== 'en') {
                    setTranslations(getTranslations(lang) || {});
                }
            } catch {
                // fallback to English
            }
        };
        init();
    }, []);

    return (
        <nav className='w-full bg-white border-b border-gray-200 shadow-sm'>
            <div className='flex items-center px-4 md:px-6 py-3 md:py-4'>
                {/* Left spacing */}
                <div className='w-[200px]'></div>

                {/* Logo and Menu */}
                <div className='flex items-center gap-8'>
                    <Image 
                        src={MetaImage} 
                        alt='Meta' 
                        width={50} 
                        height={16}
                        className='h-4 w-auto'
                        priority
                    />
                    
                    <div className='hidden md:flex items-center gap-6'>
                        {menuItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className='text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium'
                            >
                                {t(item.label)}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className='md:hidden ml-auto'>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className='text-gray-600 hover:text-gray-900 transition-colors'
                    >
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isDropdownOpen && (
                <div className='absolute top-full left-0 right-0 bg-white border-b border-gray-200 md:hidden py-2'>
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                        >
                            {t(item.label)}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
