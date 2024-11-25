import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' }
  ];

  const switchLanguage = (locale: string) => {
    const newPathname = pathname.replace(`/${currentLocale}`, `/${locale}`);
    window.location.href = newPathname;
  };

  return (
    <Select defaultValue={currentLocale} onValueChange={switchLanguage}>
      <SelectTrigger className="w-[120px] h-[36px] rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-200">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="min-w-[120px] rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/10">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="focus:bg-white/10 cursor-pointer text-white"
          >
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 