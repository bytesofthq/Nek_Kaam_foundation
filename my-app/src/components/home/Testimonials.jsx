import { useEffect, useState, useRef } from 'react';
import { testimonialAPI } from '../../services/api';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

const defaultTestimonials = [
  {
    _id: '1',
    name: 'Mohammed Arif',
    review: 'Nek Kaam Foundation helped us during the most difficult time of our life. Their support for my daughter\'s marriage was truly a blessing from Allah.',
    designation: 'Beneficiary,UP',
    rating: 5,
  },
  {
    _id: '2',
    name: 'Mohd Shuaib',
    review: 'The foundation installed a water pump in our village. Now our children don\'t have to walk miles to get water . We are forever grateful.',
    designation: 'Village Resident, Delhi',
    rating: 5,
  },
  {
    _id: '3',
    name: 'Abdur Rahman',
    review: 'The madrasa renovation and AC installation has improved our students\' learning environment significantly. May Allah reward everyone involved.',
    designation: 'Village Resident, UP',
    rating: 5,
  },
  {
    _id: '4',
    name: 'Kamil khan',
    review: 'What impresses me most is their transparency. They show exactly where every rupee goes. That\'s why I became a member and actively contribute.',
    designation: 'Foundation Member',
    rating: 5,
  },
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { t } = useTranslation();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await testimonialAPI.getAll();
        const data = res.data?.testimonials || res.data || [];
        if (data.length > 0) setTestimonials(data);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-white/10 text-white font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
            {t('testimonials.tag')}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {t('testimonials.headingStart')} <span className="text-yellow-400">{t('testimonials.headingHighlight')}</span>
          </h2>
          <p className="text-green-200 max-w-xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 text-center"
            >
              <Quote size={48} className="text-yellow-400 mx-auto mb-6 opacity-60" />
              <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 font-light italic">
                "{testimonials[current].review}"
              </p>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimonials[current].rating || 5)].map((_, i) => (
                  <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{testimonials[current].name}</p>
                <p className="text-green-300 text-sm">{testimonials[current].designation || t('testimonials.defaultDesignation')}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-yellow-400' : 'w-2 h-2 bg-white/30'}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
