import { motion } from 'framer-motion';
import SEO from '../components/seo/SEO';
import { CheckCircle, Target, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6 },
};

const About = () => {
  const { t } = useTranslation();

  const coreValues = [
    { key: 'integrity', emoji: '🤝' },
    { key: 'transparency', emoji: '📊' },
    { key: 'compassion', emoji: '💝' },
    { key: 'community', emoji: '🏘️' },
    { key: 'excellence', emoji: '⭐' },
    { key: 'accountability', emoji: '📋' },
  ];

  const missionItems = ['marriage', 'medical', 'madrasa', 'water'];
  const visionItems = [
    { key: 'communities', emoji: '🏘️' },
    { key: 'madrasa', emoji: '📚' },
    { key: 'food', emoji: '🚰' },
    { key: 'healthcare', emoji: '💊' },
  ];

  return (
    <div>
      <SEO 
        title={t('seo.aboutTitle')}
        description={t('seo.aboutDesc')}
        keywords="About Nek Kaam Foundation, NGO Uttar Pradesh, NGO mission, transparent charity Sitapur, core values, NGO vision"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgNDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] " />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div {...fadeIn} className="max-w-3xl">
            <span className="inline-block bg-white/15 text-white/90 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              {t('about.heroTag')}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
              {t('about.heroHeading')}
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              {t('about.heroSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeIn}>
            <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">{t('about.whoTag')}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              {t('about.whoHeading')}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{t('about.whoP1')}</p>
              <p>{t('about.whoP2')}</p>
              <p>{t('about.whoP3')}</p>
            </div>
          </motion.div>
          <motion.div
            {...fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { emoji: '📅', stat: '2025', label: t('about.founded') },
              { emoji: '👥', stat: '500+', label: t('about.members') },
              { emoji: '🏡', stat: '100+', label: t('about.familiesHelped') },
              { emoji: '₹', stat: '2L+', label: t('about.fundsManaged') },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">{item.emoji}</div>
                <div className="text-2xl font-extrabold text-green-700">{item.stat}</div>
                <div className="text-gray-600 text-sm font-medium">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why We Started */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeIn} className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">{t('about.storyTag')}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{t('about.storyHeading')}</h2>
          </motion.div>
          <motion.div {...fadeIn} className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-10 border border-gray-100">
            <div className="text-5xl mb-6 text-center">🌱</div>
            <p className="text-gray-700 text-lg leading-relaxed text-center mb-6">{t('about.storyP1')}</p>
            <p className="text-gray-700 leading-relaxed text-center">{t('about.storyP2')}</p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div {...fadeIn} className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Target size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-extrabold">{t('about.missionTitle')}</h2>
              </div>
              <p className="text-green-100 leading-relaxed text-lg">
                {t('about.missionDescription')}
              </p>
              <ul className="mt-6 space-y-3">
                {missionItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-green-100">
                    <CheckCircle size={16} className="text-yellow-300 flex-shrink-0" />
                    <span className="text-sm">{t(`about.missionList.${item}`)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fadeIn} transition={{ duration: 0.6, delay: 0.15 }} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Eye size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-extrabold">{t('about.visionTitle')}</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                {t('about.visionDescription')}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {visionItems.map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-xs font-medium text-gray-200">{t(`about.visionList.${item.key}`)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeIn} className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">{t('about.valuesTag')}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{t('about.valuesHeading')}</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-green-200 p-7 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{val.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                  {t(`about.values.${val.key}.title`)}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t(`about.values.${val.key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Promise */}
      <section className="py-20 bg-gradient-to-br from-green-900 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fadeIn}>
            <div className="text-5xl mb-6">🤲</div>
            <span className="inline-block bg-white/10 text-white font-semibold text-sm px-4 py-1.5 rounded-full mb-4">{t('about.promiseTag')}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">{t('about.promiseHeading')}</h2>
            <p className="text-green-100 text-lg leading-relaxed mb-8">
              {t('about.promiseBody')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/transparency" className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg">
                {t('about.viewTransparency')} <ArrowRight size={18} />
              </Link>
              <Link to="/member-register" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300">
                {t('about.joinFoundation')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;