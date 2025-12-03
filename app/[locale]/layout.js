import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { locales } from '../../i18n';
import Navbar from '../components/Navbar';
import { ThemeProvider } from '../components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params }) {
  const { locale } = params;
  
  if (!locales.includes(locale)) {
    notFound();
  }

  const isArabic = locale === 'ar';

  return (
    <html lang={locale} dir={isArabic ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={`${isArabic ? 'font-arabic' : inter.className} min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

