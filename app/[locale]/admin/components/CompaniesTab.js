'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { messages } from '../../../../i18n';

export default function CompaniesTab({ params }) {
  const { locale } = params;
  const router = useRouter();
  const t = messages[locale] || messages.en;
  const [pharmacies, setPharmacies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPharmacies = localStorage.getItem('pharmacies');
    if (storedPharmacies) {
      setPharmacies(JSON.parse(storedPharmacies));
    } else {
      // Initialize with sample data
      const samplePharmacies = [
        {
          id: '1',
          name: 'شركة النور للأدوية',
          ownerName: 'أحمد محمد',
          licenseNumber: 'PH-2024-001',
          address: 'شارع الرشيد، بغداد',
          phone: '07901234567',
          email: 'alnoor@pharma.iq',
          registrationDate: new Date('2024-01-15').toISOString(),
        },
        {
          id: '2',
          name: 'شركة الشفاء للأدوية',
          ownerName: 'فاطمة علي',
          licenseNumber: 'PH-2024-002',
          address: 'شارع الكرادة، بغداد',
          phone: '07901234568',
          email: 'alshifa@pharma.iq',
          registrationDate: new Date('2024-02-20').toISOString(),
        },
        {
          id: '3',
          name: 'شركة الحياة للأدوية',
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
  }, []);

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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.pharmacy.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {locale === 'ar' ? 'إدارة شركات الأدوية' : 'Manage pharmaceutical companies'}
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
      <div>
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

      {/* Companies Grid */}
      {filteredPharmacies.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-16 text-center border border-gray-100 dark:border-gray-700">
          <div className="mb-4">
            <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            {locale === 'ar' ? 'لا توجد شركات' : 'No companies found'}
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
            <Link
              key={pharmacy.id}
              href={`/${locale}/admin/companies/${pharmacy.id}`}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 card-hover border border-gray-100 dark:border-gray-700 block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {pharmacy.name.charAt(0)}
                </div>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold">
                  {getMedicineCount(pharmacy.id)} {locale === 'ar' ? 'دواء' : 'medicines'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {pharmacy.name}
              </h3>
              <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{pharmacy.ownerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{pharmacy.licenseNumber}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm">
                <span>{locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

