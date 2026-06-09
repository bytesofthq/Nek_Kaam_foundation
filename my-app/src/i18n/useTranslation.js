import { useLanguage } from '../context/LanguageContext';
import { translations } from './translations';

const getNestedValue = (source, path) => path.split('.').reduce((value, key) => value?.[key], source);

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key) => {
    const current = translations[language] || translations.en;
    return getNestedValue(current, key) ?? getNestedValue(translations.en, key) ?? key;
  };

  return { t, language };
};