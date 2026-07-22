"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { ChangeEvent, useTransition } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative flex items-center gap-1 group">
      <Globe className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      <select
        value={locale}
        onChange={handleLanguageChange}
        disabled={isPending}
        className="appearance-none bg-transparent text-sm font-semibold text-foreground focus:outline-none cursor-pointer pl-1 pr-4 py-1 hover:text-primary transition-colors"
      >
        <option value="uz">UZ</option>
        <option value="ru">RU</option>
        <option value="en">EN</option>
      </select>
      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-muted-foreground group-hover:text-primary transition-colors">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  );
}
