'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { messages } from '../../../i18n';

export default function DashboardPage({ params }) {
  const { locale } = params;
  const router = useRouter();
  const t = messages[locale] || messages.en;
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load medicines from localStorage (in real app, this would be an API call)
    const storedMedicines = localStorage.getItem('medicines');
    if (storedMedicines) {
      setMedicines(JSON.parse(storedMedicines));
    }
    setLoading(false);
  }, [locale, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t.medicine.registeredMedicines}
          </h1>
          <Link
            href={`/${locale}/medicine/register`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            {t.medicine.title}
          </Link>
        </div>

        {medicines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {locale === 'ar' ? 'لا توجد أدوية مسجلة' : 'No medicines registered yet'}
            </p>
            <Link
              href={`/${locale}/medicine/register`}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {t.medicine.title}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {medicine.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {medicine.company}
                </p>
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    medicine.status === 'approved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : medicine.status === 'rejected'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {t.medicine[medicine.status] || medicine.status}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {t.medicine.progress}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${medicine.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {medicine.progress}%
                  </p>
                </div>
                <Link
                  href={`/${locale}/medicine/${medicine.id}`}
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 text-sm"
                >
                  {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

