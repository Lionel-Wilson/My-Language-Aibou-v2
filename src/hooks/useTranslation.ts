import { translations, TranslationKey, SupportedLanguage } from '../constants/translations';

export const useTranslation = (language: string) => {
  const supportedLanguage = language as SupportedLanguage;
  const currentTranslations = translations[supportedLanguage] || translations.English;

  const t = (key: TranslationKey): string => {
    return currentTranslations[key] || translations.English[key] || key;
  };

  return { t };
};