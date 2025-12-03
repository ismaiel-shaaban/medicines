'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const lang = pathname.split('/')[1];
    if (lang === 'ar' || lang === 'en') {
      setCurrentLang(lang);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const switchLanguage = (lang) => {
    const pathWithoutLang = pathname.replace(/^\/(en|ar)/, '') || '/';
    router.push(`/${lang}${pathWithoutLang}`);
    setIsOpen(false);
  };

  const FlagIcon = ({ countryCode, className = "w-5 h-5" }) => {
    if (countryCode === 'GB') {
      return (
        <svg className={className} viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
          <rect width="3" height="2" fill="#012169"/>
          <path d="M0 0l3 2M3 0L0 2" stroke="#fff" strokeWidth="0.2"/>
          <path d="M0 0l3 2M3 0L0 2" stroke="#C8102E" strokeWidth="0.13"/>
          <path d="M1.5 0v2M0 1h3" stroke="#fff" strokeWidth="0.2"/>
          <path d="M1.5 0v2M0 1h3" stroke="#C8102E" strokeWidth="0.13"/>
        </svg>
      );
    }
    if (countryCode === 'IQ') {
      return (
        <svg className={className} viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
          <rect width="3" height="0.67" fill="#ce1126"/>
          <rect y="0.67" width="3" height="0.67" fill="#fff"/>
          <rect y="1.33" width="3" height="0.67" fill="#000"/>
        </svg>
      );
    }
    return null;
  };

  const languages = [
    { code: 'en', name: 'English', flag: 'GB' },
    { code: 'ar', name: 'العربية', flag: 'IQ' },
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
      >
        <FlagIcon countryCode={currentLanguage.flag} className="w-5 h-5" />
        <span className="hidden sm:inline text-gray-700 dark:text-gray-300">
          {currentLanguage.code.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors ${
                currentLang === lang.code
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <FlagIcon countryCode={lang.flag} className="w-6 h-6" />
              <span className="flex-1 font-medium">{lang.name}</span>
              {currentLang === lang.code && (
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

