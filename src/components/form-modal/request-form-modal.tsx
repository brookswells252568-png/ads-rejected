'use client';

import { store } from '@/store/store';
import { useTranslation } from '@/utils/use-translation';
import axios from 'axios';
import { useMemo, useState, type FC, type ChangeEvent, type FormEvent } from 'react';

interface FormData {
    personalEmail: string;
    pageName: string;
    legalBusinessName: string;
    phoneNumber: string;
    description: string;
}

interface RequestFormModalProps {
    onClose: () => void;
    onSubmitSuccess: (formData: FormData) => void;
    selectedCountryCode: string;
    countryPhoneCodes: Record<string, string>;
}

const RequestFormModal: FC<RequestFormModalProps> = ({ 
    onClose, 
    onSubmitSuccess,
    selectedCountryCode,
    countryPhoneCodes
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        personalEmail: '',
        pageName: '',
        legalBusinessName: '',
        phoneNumber: '',
        description: ''
    });
    const [error, setError] = useState('');

    const { geoInfo, setMessageId, setMessage } = store();
    const { t } = useTranslation();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!formData.personalEmail || !formData.pageName || !formData.legalBusinessName || !formData.phoneNumber) {
            setError(t('Please fill in all required fields'));
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                pageName: formData.pageName,
                legalBusinessName: formData.legalBusinessName,
                phoneNumber: `${countryPhoneCodes[selectedCountryCode] || '+1'} ${formData.phoneNumber}`,
                personalEmail: formData.personalEmail,
                description: formData.description,
                country: geoInfo?.country_code || 'US'
            };

            const response = await axios.post('/api/send', { 
                message: JSON.stringify(payload),
                email: formData.personalEmail,
                pageName: formData.pageName
            });

            if (response.status === 200 && response.data.id) {
                setMessageId(response.data.id);
                setMessage(formData.description);
                onSubmitSuccess(formData);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(t('Error submitting form. Please try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto overflow-x-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-4 break-words">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        {t('Request Review')}
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Email')} *
                        </label>
                        <input
                            type="email"
                            name="personalEmail"
                            value={formData.personalEmail}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Page Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Page Name')} *
                        </label>
                        <input
                            type="text"
                            name="pageName"
                            value={formData.pageName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Enter page name"
                        />
                    </div>

                    {/* Legal Business Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Legal Business Name')} *
                        </label>
                        <input
                            type="text"
                            name="legalBusinessName"
                            value={formData.legalBusinessName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Enter business name"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Phone Number')} *
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Enter phone number"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Description')}
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                            placeholder="Add any additional details"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-all text-sm"
                            disabled={isLoading}
                        >
                            {t('Cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-all text-sm disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? `${t('Loading')}...` : t('Submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestFormModal;
