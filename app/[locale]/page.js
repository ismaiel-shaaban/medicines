'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home({ params }) {
  const { locale } = params;
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      router.push(`/${locale}/admin`);
    } else {
      router.push(`/${locale}/login`);
    }
  }, [locale, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

