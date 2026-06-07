import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-xl text-gray-100">{t('about.subtitle')}</p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-green-600 mb-4">{t('about.mission')}</h3>
              <p className="text-gray-700">{t('about.missionText')}</p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-green-600 mb-4">{t('about.vision')}</h3>
              <p className="text-gray-700">{t('about.visionText')}</p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-green-600 mb-4">{t('about.values')}</h3>
              <p className="text-gray-700">{t('about.valuesText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">{t('about.historyTitle')}</h2>
          <p className="text-gray-700 mb-4 text-lg">{t('about.historyOne')}</p>
          <p className="text-gray-700 mb-4 text-lg">{t('about.historyTwo')}</p>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('about.teamTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {t('about.team').map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow-md overflow-hidden text-center">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-40" />
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
