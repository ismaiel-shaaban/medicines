'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { messages } from '../../../i18n';

export default function PharmaciesPage({ params }) {
  const { locale } = params;
  const router = useRouter();
  const t = messages[locale] || messages.en;
  const [pharmacies, setPharmacies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load pharmacies from localStorage
    const storedPharmacies = localStorage.getItem('pharmacies');
    if (storedPharmacies) {
      setPharmacies(JSON.parse(storedPharmacies));
    } else {
      // Initialize with sample data
      const samplePharmacies = [
        {
          id: '1',
          name: 'المكتب العلمي للنور',
          ownerName: 'أحمد محمد',
          licenseNumber: 'PH-2024-001',
          address: 'شارع الرشيد، بغداد',
          phone: '07901234567',
          email: 'alnoor@pharma.iq',
          registrationDate: new Date('2024-01-15').toISOString(),
        },
        {
          id: '2',
          name: 'المكتب العلمي للشفاء',
          ownerName: 'فاطمة علي',
          licenseNumber: 'PH-2024-002',
          address: 'شارع الكرادة، بغداد',
          phone: '07901234568',
          email: 'alshifa@pharma.iq',
          registrationDate: new Date('2024-02-20').toISOString(),
        },
        {
          id: '3',
          name: 'المكتب العلمي للحياة',
          ownerName: 'خالد حسن',
          licenseNumber: 'PH-2024-003',
          address: 'شارع المتنبي، بغداد',
          phone: '07901234569',
          email: 'alhayat@pharma.iq',
          registrationDate: new Date('2024-03-10').toISOString(),
        },
      ];
      setPharmacies(samplePharmacies);
      localStorage.setItem('pharmacies', JSON.stringify(samplePharmacies));
    }
    setLoading(false);
  }, [locale, router]);

  const filteredPharmacies = pharmacies.filter((pharmacy) =>
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMedicineCount = (pharmacyId) => {
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    return medicines.filter((m) => m.pharmacyId === pharmacyId).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 gradient-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              {t.pharmacy.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {locale === 'ar' ? 'إدارة المكاتب العلمية' : 'Manage scientific offices'}
            </p>
          </div>
          <Link
            href={`/${locale}/pharmacies/register`}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t.pharmacy.addPharmacy}
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.pharmacy.searchPlaceholder}
              className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
            />
          </div>
        </div>

        {/* Pharmacies Grid */}
        {filteredPharmacies.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
              {locale === 'ar' ? 'لا توجد مكاتب علمية' : 'No scientific offices found'}
            </p>
            <Link
              href={`/${locale}/pharmacies/register`}
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.pharmacy.addPharmacy}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 card-hover border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {pharmacy.name.charAt(0)}
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold">
                    {getMedicineCount(pharmacy.id)} {locale === 'ar' ? 'دواء' : 'medicines'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {pharmacy.name}
                </h3>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{pharmacy.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{pharmacy.licenseNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{pharmacy.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{pharmacy.phone}</span>
                  </div>
                </div>
                <Link
                  href={`/${locale}/pharmacies/${pharmacy.id}`}
                  className="block w-full mt-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {t.pharmacy.viewDetails}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

