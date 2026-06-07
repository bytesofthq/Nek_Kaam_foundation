import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

const AboutPreview = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg h-96 shadow-lg" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('home.aboutTitle')}</h2>
            <p className="text-gray-600 mb-4">{t('home.aboutOne')}</p>
            <p className="text-gray-600 mb-6">{t('home.aboutTwo')}</p>
            <Link to="/about">
              <Button variant="primary" size="lg">
                {t('common.learnMore')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
