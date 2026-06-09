import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

const AboutPreview = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useTranslation();

  const values = [
    t('aboutPreview.values.transparency'),
    t('aboutPreview.values.community'),
    t('aboutPreview.values.families'),
    t('aboutPreview.values.relief'),
    t('aboutPreview.values.youth'),
  ];

  return (
    <section ref={ref} className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              {t('aboutPreview.tag')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {t('aboutPreview.headingStart')}{' '}
              <span className="text-green-600">{t('aboutPreview.headingHighlight')}</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {t('aboutPreview.paragraphOne')}
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              {t('aboutPreview.paragraphTwo')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {values.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{val}</span>
                </motion.div>
              ))}
            </div>

            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-7 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {t('aboutPreview.cta')}
                <ArrowRight size={18} />
              </motion.button>
            </Link>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
               
                { emoji: '💒', title: t('aboutPreview.cards.marriage.title'), desc: t('aboutPreview.cards.marriage.desc'), bg: 'from-emerald-50 to-teal-100 border-emerald-200' },
                { emoji: '🚰', title: t('aboutPreview.cards.water.title'), desc: t('aboutPreview.cards.water.desc'), bg: 'from-teal-50 to-cyan-100 border-teal-200' },
                { emoji: '🏥', title: t('aboutPreview.cards.medical.title'), desc: t('aboutPreview.cards.medical.desc'), bg: 'from-green-50 to-green-100 border-green-200' },
                { emoji: '🏡', title: t('aboutPreview.cards.family.title'), desc: t('aboutPreview.cards.family.desc'), bg: 'from-amber-50 to-yellow-100 border-amber-200' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className={`bg-gradient-to-br ${item.bg} border rounded-2xl p-4 hover:shadow-md transition-shadow duration-300`}
                >
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h4>
                  <p className="text-gray-600 text-xs">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
