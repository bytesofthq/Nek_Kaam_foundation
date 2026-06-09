import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

const getNestedValue = (source, path) => path.split('.').reduce((value, key) => value?.[key], source);
const supportedLanguages = new Set(['en', 'hi']);

const normalizeLanguage = (value) => (supportedLanguages.has(value) ? value : 'en');

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => normalizeLanguage(localStorage.getItem('siteLanguage')));

  useEffect(() => {
    localStorage.setItem('siteLanguage', language);
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';
  }, [language]);

  const updateLanguage = (nextLanguage) => {
    setLanguage(normalizeLanguage(nextLanguage));
  };

  const toggleLanguage = () => {
    setLanguage((currentLanguage) => (currentLanguage === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    const current = translations[language] || translations.en;
    return getNestedValue(current, key) ?? getNestedValue(translations.en, key) ?? key;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: updateLanguage,
      toggleLanguage,
      t,
      isHindi: language === 'hi',
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
