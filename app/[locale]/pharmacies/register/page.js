'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { messages } from '../../../../i18n';
import Link from 'next/link';

export default function RegisterPharmacyPage({ params }) {
  const { locale } = params;
  const router = useRouter();
  const t = messages[locale] || messages.en;
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    licenseNumber: '',
    address: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No authentication required
  }, [locale, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create pharmacy object
    const pharmacy = {
      id: Date.now().toString(),
      ...formData,
      registrationDate: new Date().toISOString(),
    };

    // Save to localStorage
    const existingPharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
    existingPharmacies.push(pharmacy);
    localStorage.setItem('pharmacies', JSON.stringify(existingPharmacies));

    setTimeout(() => {
      router.push(`/${locale}/pharmacies`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen px-4 py-8 gradient-bg">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/${locale}/pharmacies`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.common.back}
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            {t.pharmacy.addPharmacy}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {locale === 'ar' ? 'إضافة مكتب علمي جديد إلى النظام' : 'Add a new scientific office to the system'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 dark:border-gray-700">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.pharmacy.pharmacyName}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all"
              placeholder={t.pharmacy.pharmacyNamePlaceholder}
            />
          </div>

          <div>
            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.pharmacy.ownerName}
            </label>
            <input
              id="ownerName"
              name="ownerName"
              type="text"
              value={formData.ownerName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all"
              placeholder={t.pharmacy.ownerNamePlaceholder}
            />
          </div>

          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.pharmacy.licenseNumber}
            </label>
            <input
              id="licenseNumber"
              name="licenseNumber"
              type="text"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all"
              placeholder={t.pharmacy.licenseNumberPlaceholder}
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.pharmacy.address}
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all"
              placeholder={t.pharmacy.addressPlaceholder}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.pharmacy.phone}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all"
              placeholder={t.pharmacy.phonePlaceholder}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.pharmacy.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all"
              placeholder={t.pharmacy.emailPlaceholder}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? t.common.loading : t.common.submit}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 btn-secondary"
            >
              {t.common.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

