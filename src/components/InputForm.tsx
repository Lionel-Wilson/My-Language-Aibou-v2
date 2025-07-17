import React from 'react';
import { Send, X } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';

interface InputFormProps {
  type: 'word' | 'sentence';
  onSubmit: (input: string, language: string) => void;
  loading: boolean;
  placeholder: string;
  label: string;
  value: string;
  language: string;
  onInputChange: (value: string) => void;
  onLanguageChange: (language: string) => void;
  t: ReturnType<typeof useTranslation>['t'];
}

export const InputForm: React.FC<InputFormProps> = ({ 
  type, 
  onSubmit, 
  loading, 
  placeholder,
  label,
  value,
  language,
  onInputChange,
  onLanguageChange,
  t
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim(), language);
    }
  };

  const clearInput = () => {
    onInputChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (type === 'word') {
        // For single-line input, always submit on Enter
        e.preventDefault();
        handleSubmit(e);
      } else if (type === 'sentence' && !e.shiftKey) {
        // For textarea, submit on Enter but allow Shift+Enter for new lines
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor={type} className="block text-sm font-medium text-slate-300 mb-2">
            {label}
          </label>
          <div className="relative">
            {type === 'word' ? (
              <input
                id={type}
                type="text"
                value={value}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 pr-10 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white placeholder-slate-400"
                disabled={loading}
              />
            ) : (
              <textarea
                id={type}
                value={value}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full px-4 py-3 pr-10 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-white placeholder-slate-400"
                disabled={loading}
                onKeyDown={handleKeyDown}
              />
            )}
            {value && (
              <button
                type="button"
                onClick={clearInput}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-300 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-2">
            {t('nativeLanguage')}
          </label>
          <LanguageSelector value={language} onChange={onLanguageChange} t={t} />
        </div>

        <button
          type="submit"
          disabled={!value.trim() || loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Send size={16} />
          {loading ? t('processing') : t('submit')}
        </button>
      </div>
    </form>
  );
};