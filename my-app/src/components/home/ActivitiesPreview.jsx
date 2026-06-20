import { useEffect, useState, useRef } from 'react';
import { activityAPI } from '../../services/api';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Tag, FolderGit2 } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

const ActivitiesPreview = () => {
  const [activities, setActivities] = useState([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await activityAPI.getAll({ limit: 3 });
        const data = res.data?.activities || res.data || [];
        setActivities(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch preview activities:', error);
      }
    };
    fetchActivities();
  }, []);

  // Category fallback emojis matching Activities.jsx
  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'Schools Support': return '🏫';
      case 'Medical Help': return '🏥';
      case 'Marriage Assistance': return '💒';
      case 'Water Project': return '🚰';
      case 'Disaster Relief': return '🌊';
      default: return '🤝';
    }
  };

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
        >
          <div>
            <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-3">
              {t('activitiesPreview.tag')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {t('activitiesPreview.headingStart')}{' '}
              <span className="text-green-600">{t('activitiesPreview.headingHighlight')}</span>
            </h2>
          </div>
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors group cursor-pointer"
          >
            {t('activitiesPreview.cta')}{' '}
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <motion.div
                key={activity._id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 overflow-hidden flex flex-col h-full group"
              >
                {/* Media/Image preview */}
                <div className="relative overflow-hidden w-full h-48 bg-gray-900 flex-shrink-0">
                  {activity.images && activity.images.length > 0 && activity.images[0]?.url ? (
                    <img
                      src={activity.images[0].url}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-5xl select-none">
                      {getCategoryEmoji(activity.category)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {activity.project && (
                    <div className="flex items-center gap-1 text-[10px] font-bold tracking-wide text-green-700 bg-green-50/70 border border-green-100 rounded-lg px-2.5 py-1 mb-3 self-start max-w-full">
                      <FolderGit2 size={12} className="flex-shrink-0" />
                      <span className="truncate">
                        Project: {activity.project.title || activity.project}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                      <Tag size={10} />
                      {activity.category}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(activity.date).toLocaleDateString(
                        language === 'hi' ? 'hi-IN' : 'en-IN',
                        { day: 'numeric', month: 'short', year: 'numeric' }
                      )}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-green-700 transition-colors line-clamp-1">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                    {activity.description}
                  </p>

                  {activity.location && (
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-auto pt-2 border-t border-gray-100">
                      <MapPin size={12} className="text-green-500 flex-shrink-0" />
                      <span className="truncate">{activity.location}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm max-w-lg mx-auto">
            <p className="text-gray-500 text-sm font-medium">No recent activities to display at this time.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivitiesPreview;
