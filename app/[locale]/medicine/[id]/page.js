'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { messages } from '../../../../i18n';

export default function MedicineDetailPage({ params }) {
  const { locale, id } = params;
  const router = useRouter();
  const t = messages[locale] || messages.en;
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const foundMedicine = storedMedicines.find((m) => m.id === id);
    
    if (foundMedicine) {
      setMedicine(foundMedicine);
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

  if (!medicine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {locale === 'ar' ? 'الدواء غير موجود' : 'Medicine not found'}
          </p>
          <Link
            href={`/${locale}/dashboard`}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {t.common.back}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/${locale}/dashboard`}
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 mb-4 inline-block"
        >
          ← {t.common.back}
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {medicine.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{medicine.company}</p>
            </div>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              medicine.status === 'approved'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : medicine.status === 'rejected'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {t.medicine[medicine.status] || medicine.status}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.medicine.description}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{medicine.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.medicine.progress}
            </h2>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${medicine.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {medicine.progress}% {locale === 'ar' ? 'مكتمل' : 'Complete'}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.medicine.approvals}
            </h2>
            <div className="space-y-3">
              {medicine.approvals.map((approval, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-gray-900 dark:text-white font-medium">
                    {approval.name}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    approval.status === 'approved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : approval.status === 'rejected'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {t.medicine[approval.status] || approval.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {medicine.files && medicine.files.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t.medicine.files}
              </h2>
              <div className="space-y-2">
                {medicine.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>
              {t.medicine.registrationDate}: {new Date(medicine.registrationDate).toLocaleDateString(locale === 'ar' ? 'ar-IQ' : 'en-US')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

