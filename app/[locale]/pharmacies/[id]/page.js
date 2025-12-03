'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { messages } from '../../../../i18n';

export default function PharmacyDetailPage({ params }) {
  const { locale, id } = params;
  const router = useRouter();
  const t = messages[locale] || messages.en;
  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load pharmacy
    const storedPharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
    const foundPharmacy = storedPharmacies.find((p) => p.id === id);
    
    if (foundPharmacy) {
      setPharmacy(foundPharmacy);
      
      // Load medicines for this pharmacy
      const storedMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
      const pharmacyMedicines = storedMedicines.filter((m) => m.pharmacyId === id);
      setMedicines(pharmacyMedicines);
    }
    setLoading(false);
  }, [id, locale, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">{t.common.loading}</p>
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {locale === 'ar' ? 'المكتب العلمي غير موجود' : 'Scientific Office not found'}
          </p>
          <Link
            href={`/${locale}/pharmacies`}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {t.common.back}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 gradient-bg">
      <div className="max-w-7xl mx-auto">
        <Link
          href={`/${locale}/pharmacies`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-6 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.common.back}
        </Link>

        {/* Pharmacy Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {pharmacy.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {pharmacy.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {pharmacy.address}
                </p>
              </div>
            </div>
            <Link
              href={`/${locale}/medicine/register?pharmacyId=${pharmacy.id}`}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.pharmacy.addMedicine}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t.pharmacy.ownerName}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pharmacy.ownerName}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t.pharmacy.licenseNumber}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pharmacy.licenseNumber}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t.pharmacy.totalMedicines}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{medicines.length}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t.pharmacy.phone}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pharmacy.phone}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t.pharmacy.email}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white break-all">{pharmacy.email}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t.pharmacy.registrationDate}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(pharmacy.registrationDate).toLocaleDateString(locale === 'ar' ? 'ar-IQ' : 'en-US')}
              </p>
            </div>
          </div>
        </div>

        {/* Medicines List */}
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-6">
            {t.pharmacy.medicines}
          </h2>

          {medicines.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-16 text-center border border-gray-100 dark:border-gray-700">
              <div className="mb-4">
                <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                {t.pharmacy.noMedicines}
              </p>
              <Link
                href={`/${locale}/medicine/register?pharmacyId=${pharmacy.id}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.pharmacy.addMedicine}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 card-hover border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
                      {medicine.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      medicine.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : medicine.status === 'rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {t.medicine[medicine.status] || medicine.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {medicine.company}
                  </p>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t.medicine.progress}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {medicine.progress}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${medicine.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link
                    href={`/${locale}/medicine/${medicine.id}`}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

