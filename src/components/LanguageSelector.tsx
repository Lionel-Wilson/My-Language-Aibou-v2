import React from 'react';
import { ChevronDown } from 'lucide-react';
import { LANGUAGES } from '../constants/languages';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
  t: ReturnType<typeof useTranslation>['t'];
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange, t }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
    </div>
  );
};