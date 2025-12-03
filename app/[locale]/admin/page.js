'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { messages } from '../../../i18n';
import StatisticsTab from './components/StatisticsTab';
import CompaniesTab from './components/CompaniesTab';

function AdminPageContent({ params }) {
  const { locale } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = messages[locale] || messages.en;
  const [activeTab, setActiveTab] = useState('statistics');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push(`/${locale}/login`);
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [locale, router]);

  useEffect(() => {
    // Check URL for tab parameter and update active tab
    const tab = searchParams?.get('tab');
    if (tab === 'companies') {
      setActiveTab('companies');
    } else {
      setActiveTab('statistics');
    }
  }, [searchParams]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {t.admin.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {locale === 'ar' ? 'إدارة النظام والموافقات' : 'System Management & Approvals'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'statistics' && <StatisticsTab params={params} />}
        {activeTab === 'companies' && <CompaniesTab params={params} />}
      </div>
    </div>
  );
}

export default function AdminPage({ params }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AdminPageContent params={params} />
    </Suspense>
  );
}
