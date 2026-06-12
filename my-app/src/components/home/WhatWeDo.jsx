import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

const WhatWeDo = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useTranslation();

  const categories = [
    { emoji: '💒', title: t('whatWeDo.categories.marriage.title'), desc: t('whatWeDo.categories.marriage.desc'), color: 'from-pink-50 to-rose-100 border-pink-200 hover:border-pink-400' },
    { emoji: '🏠', title: t('whatWeDo.categories.poorFamily.title'), desc: t('whatWeDo.categories.poorFamily.desc'), color: 'from-green-50 to-emerald-100 border-green-200 hover:border-green-400' },
    { emoji: '🏥', title: t('whatWeDo.categories.medical.title'), desc: t('whatWeDo.categories.medical.desc'), color: 'from-blue-50 to-sky-100 border-blue-200 hover:border-blue-400' },
    { emoji: '📚', title: t('whatWeDo.categories.education.title'), desc: t('whatWeDo.categories.education.desc'), color: 'from-purple-50 to-violet-100 border-purple-200 hover:border-purple-400' },
    { emoji: '🏫', title: t('whatWeDo.categories.schools.title'), desc: t('whatWeDo.categories.schools.desc'), color: 'from-teal-50 to-cyan-100 border-teal-200 hover:border-teal-400' },
    { emoji: '🚰', title: t('whatWeDo.categories.water.title'), desc: t('whatWeDo.categories.water.desc'), color: 'from-cyan-50 to-sky-100 border-cyan-200 hover:border-cyan-400' },
    { emoji: '❄️', title: t('whatWeDo.categories.freezer.title'), desc: t('whatWeDo.categories.freezer.desc'), color: 'from-indigo-50 to-blue-100 border-indigo-200 hover:border-indigo-400' },
    { emoji: '🌬️', title: t('whatWeDo.categories.ac.title'), desc: t('whatWeDo.categories.ac.desc'), color: 'from-emerald-50 to-teal-100 border-emerald-200 hover:border-emerald-400' },
    { emoji: '🧹', title: t('whatWeDo.categories.cleaning.title'), desc: t('whatWeDo.categories.cleaning.desc'), color: 'from-lime-50 to-green-100 border-lime-200 hover:border-lime-400' },
    { emoji: '🌊', title: t('whatWeDo.categories.disaster.title'), desc: t('whatWeDo.categories.disaster.desc'), color: 'from-orange-50 to-amber-100 border-orange-200 hover:border-orange-400' },
    { emoji: '🚨', title: t('whatWeDo.categories.emergency.title'), desc: t('whatWeDo.categories.emergency.desc'), color: 'from-red-50 to-rose-100 border-red-200 hover:border-red-400' },
  ];

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
            {t('whatWeDo.tag')}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {t('whatWeDo.headingStart')} <span className="text-green-600">{t('whatWeDo.headingHighlight')}</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t('whatWeDo.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`bg-gradient-to-br ${cat.color} border-2 rounded-2xl p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-default`}
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h3 className="font-bold text-gray-800 text-base mb-1">{cat.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{cat.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link to="/activities">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              {t('whatWeDo.cta')}
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeDo;
