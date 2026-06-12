import { useEffect, useState, useRef } from 'react';
import { testimonialAPI } from '../../services/api';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star, User, MapPin, Award, Heart, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

const fallbackTestimonials = [
  {
    _id: 'fallback1',
    name: 'Mohammad Irfan',
    review: 'Nek Kaam Foundation ne hamare gaon mein bohot accha kaam kiya hai. Unki madad se hamare bachche ab school ja rahe hain. Allah unhe aur kamyabi de.',
    designation: 'Community Member',
    rating: 5,
    location: 'Uttar Pradesh',
  },
  {
    _id: 'fallback2',
    name: 'Fatima Begum',
    review: 'Main bohot shukrguzar hoon Nek Kaam Foundation ki. Unhone hamare madrasa ko kitaabein aur zaroorat ki cheezein di. Yeh sach mein nek kaam kar rahe hain.',
    designation: 'Teacher',
    rating: 5,
    location: 'Bihar',
  },
  {
    _id: 'fallback3',
    name: 'Abdul Rahman',
    review: 'Foundation ki transparency bohot acchi hai. Har paisa kahan kharch hota hai sab pata chalta hai. Aise NGO bohot kam hain jo itne transparent hain.',
    designation: 'Donor',
    rating: 5,
    location: 'Maharashtra',
  },
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await testimonialAPI.getAll();
        const data = res.data?.testimonials || res.data || [];
        if (data.length > 0) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        // Fallback testimonials are already set as default state
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const getInitials = (name) => {
    if (!name) return 'T';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const prev = () => {
    if (testimonials.length === 0) return;
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    if (testimonials.length === 0) return;
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
    exit: (direction) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <section ref={ref} className="py-10 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative">
      <div className="relative max-w-5xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full mb-3">
            {/* <Sparkles size={10} className="text-yellow-400" /> */}
            <span>{t('testimonials.tag') || 'TESTIMONIALS'}</span>
            {/* <Sparkles size={10} className="text-yellow-400" /> */}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            What Our{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Community Says
            </span>
          </h2>
          
          <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full mx-auto mt-2 mb-3" />
          
          <p className="text-green-200 text-sm max-w-md mx-auto">
            Real stories from transformed lives
          </p>
        </motion.div>


        <div className="relative">
          <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-5"
              >
                <div className="flex flex-col items-center text-center">

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative mb-3"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 p-0.5 shadow-lg">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center overflow-hidden">
                        {testimonials[current]?.avatar ? (
                          <img 
                            src={testimonials[current].avatar} 
                            alt={testimonials[current].name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-base font-bold text-white">
                            {getInitials(testimonials[current].name)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-0.5 shadow-md">
                      <Star size={8} className="text-white fill-white" />
                    </div>
                  </motion.div>


                  <div className="flex justify-center gap-0.5 mb-2">
                    {[...Array(testimonials[current]?.rating || 5)].map((_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>


                  <div className="relative mb-3">
                    <Quote size={14} className="text-yellow-400/30 absolute -top-1 -left-2" />
                    <p className="text-white/90 text-sm leading-relaxed max-w-lg mx-auto px-3 line-clamp-3">
                      "{(testimonials[current]?.review || '').length > 120
                        ? testimonials[current].review.substring(0, 120) + '...'
                        : testimonials[current]?.review || 'Great experience!'}"
                    </p>
                    <Quote size={14} className="text-yellow-400/30 absolute -bottom-1 -right-2 rotate-180" />
                  </div>


                  <div>
                    <p className="text-white font-bold text-base mb-0.5">
                      {testimonials[current].name}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-green-300 text-xs">
                      <User size={10} />
                      <span>{testimonials[current].designation || 'Community Member'}</span>
                    </div>
                    {testimonials[current].location && (
                      <div className="flex items-center justify-center gap-1 text-green-400/70 text-[10px] mt-0.5">
                        <MapPin size={8} />
                        <span>{testimonials[current].location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>


            <button
              onClick={prev}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition backdrop-blur-sm"
            >
              <ChevronLeft size={14} />
            </button>
            
            <button
              onClick={next}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition backdrop-blur-sm"
            >
              <ChevronRight size={14} />
            </button>
          </div>


          <div className="flex justify-center items-center gap-1.5 mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === current 
                    ? 'w-5 h-1.5 bg-gradient-to-r from-yellow-400 to-amber-400' 
                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>


        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-3 gap-2 mt-6"
        >
          {[
            { icon: Heart, value: '10k+', label: 'Beneficiaries', color: 'rose' },
            { icon: Award, value: '500+', label: 'Stories', color: 'amber' },
            { icon: Star, value: '100%', label: '5-Star', color: 'yellow' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10"
            >
              <stat.icon size={14} className={`text-${stat.color}-400 mx-auto mb-0.5`} />
              <p className="text-sm font-bold text-white">{stat.value}</p>
              <p className="text-green-300 text-[10px]">{stat.label}</p>
            </div>
          ))}
        </motion.div> */}
      </div>
    </section>
  );
};

export default Testimonials;