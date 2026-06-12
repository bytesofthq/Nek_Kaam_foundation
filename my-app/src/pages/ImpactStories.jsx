import { useEffect, useState } from 'react';
import { impactStoryAPI } from '../services/api';
import Loader from '../components/common/Loader';
import { Calendar, MapPin, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../i18n/useTranslation';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.215, 0.610, 0.355, 1.000],
    },
  }),
};

const ImpactStories = () => {
  const { t, language } = useTranslation();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await impactStoryAPI.getAll();
        setStories(response.data.stories || []);
      } catch (error) {
        console.error('Failed to fetch impact stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const demoStories = [
    {
      _id: 'd1',
      title: "Clean Water Changes Zahid's Family Life",
      personName: 'Zahid Ansari',
      story: 'For years, my family had to fetch drinking water from a dirty canal or walk over a kilometer to get clean water. After Nek Kaam Foundation installed the water hand pump in our ward, our life has changed. We have clean water right outside our house. My children no longer fall sick from water-borne diseases.',
      location: 'Patna, Bihar',
      date: '2024-03-12',
      images: [{ url: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?auto=format&fit=crop&q=80&w=600' }]
    },
    {
      _id: 'd2',
      title: 'Eid Prayers in a Beautiful & Clean Eid Gah',
      personName: 'Maulana Aslam',
      story: "Our Eid Gah was in very bad shape with broken walls and debris. Nek Kaam Foundation stepped in and did a complete renovation. The community was overjoyed to see the clean, beautiful prayer ground on Eid morning. We thank all the members of the foundation for their contribution.",
      location: 'Bihar Sharif, Bihar',
      date: '2024-06-15',
      images: [{ url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600' }]
    }
  ];

  const displayStories = stories.length > 0 ? stories : demoStories;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>{t('impactStories.tag')} - Nek Kaam Foundation</title>
        <meta name="description" content="Read real stories of transformation and impact created by Nek Kaam Foundation in Bihar communities." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-900 text-white py-20 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-1 bg-white/15 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              <Sparkles size={14} className="text-yellow-300" /> {t('impactStories.tag')}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('impactStories.title')}</h1>
            <p className="text-green-100 text-xl max-w-2xl">
              {t('impactStories.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stories List */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : displayStories.length > 0 ? (
            <div className="space-y-10">
              {displayStories.map((story, index) => (
                <motion.div
                  key={story._id}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={cardVariants}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[350px]">
                    {/* Image side */}
                    <div className="lg:col-span-5 h-64 lg:h-auto relative overflow-hidden bg-gray-100">
                      {story.images && story.images.length > 0 && story.images[0].url ? (
                        <img
                          src={story.images[0].url}
                          alt={story.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : story.image ? (
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-700 flex flex-col items-center justify-center text-white p-8 text-center">
                          <Heart size={48} className="mb-3 animate-pulse text-yellow-300" />
                          <h4 className="font-extrabold text-lg">{story.title}</h4>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        📍 {story.location}
                      </div>
                    </div>

                    {/* Content side */}
                    <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-extrabold mb-4 text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                          {story.title}
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                          "{story.story}"
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                            {story.personName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium">{t('impactStories.beneficiary')}</p>
                            <p className="text-sm font-bold text-gray-800">{story.personName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} className="text-green-600" /> {story.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} className="text-green-600" /> {new Date(story.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <span className="text-5xl">❤️</span>
              <p className="text-gray-500 text-lg mt-4 font-semibold">{t('impactStories.noStories')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ImpactStories;
