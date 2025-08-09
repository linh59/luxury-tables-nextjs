'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from '@/i18n/routing';
import { Languages } from 'lucide-react';


import { useLocale } from 'next-intl';
import { Locale, locales } from '../../config';

export const LanguageSelector: React.FC = () => {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const handleChange = (code: Locale) => {
    router.replace(pathname, {
      locale: code as Locale
    });
    
    router.refresh()
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Change language">
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {locales.map((lang) => {
          const isActive = locale === lang;
          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleChange(lang)}
              className={`flex items-center gap-2 ${isActive ? 'bg-accent' : ''}`}
              aria-current={isActive ? 'true' : 'false'}
            >
              <span>{lang}</span>

            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
