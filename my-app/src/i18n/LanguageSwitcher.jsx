import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from './useTranslation';

const LanguageSwitcher = ({ variant = 'default' }) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  if (variant === 'simple') {
    return (
      <div className="inline-flex items-center gap-1 bg-gray-100 rounded-xl p-1 shadow-inner">
        <Globe size={14} className="text-gray-400 ml-1" />
        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-pressed={language === 'en'}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
            language === 'en'
              ? 'bg-green-600 text-white shadow-sm' 
              : 'text-gray-500 hover:text-green-600'
          }`}
        >
          {t('common.english')}
        </button>
        <button
          type="button"
          onClick={() => setLanguage('hi')}
          aria-pressed={language === 'hi'}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
            language === 'hi'
              ? 'bg-green-600 text-white shadow-sm' 
              : 'text-gray-500 hover:text-green-600'
          }`}
        >
          {t('common.hindi')}
        </button>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
      >
        <Globe size={16} />
        <span>{language === 'en' ? t('common.english') : t('common.hindi')}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
            language === 'en' 
              ? 'text-green-600 bg-green-50' 
              : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
          }`}
        >
            {t('common.english')}
        </button>
        <button
            type="button"
          onClick={() => setLanguage('hi')}
          className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
            language === 'hi' 
              ? 'text-green-600 bg-green-50' 
              : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
          }`}
        >
            {t('common.hindi')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;