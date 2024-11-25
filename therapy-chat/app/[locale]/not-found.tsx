'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-950 to-blue-950 text-white">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="mb-4">{t('description')}</p>
      <Link 
        href="/" 
        className="text-blue-400 hover:text-blue-300 underline"
      >
        {t('returnHome')}
      </Link>
    </div>
  );
} 