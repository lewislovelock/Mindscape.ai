import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import '../globals.css';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const validLocales = ['en', 'zh'];
  const { locale: paramLocale } = await params;
  const locale = validLocales.includes(paramLocale) ? paramLocale : 'en';

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}