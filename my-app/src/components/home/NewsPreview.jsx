import { useEffect, useState, useRef } from 'react';
import { newsAPI } from '../../services/api';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

const NewsPreview = () => {
  const [news, setNews] = useState([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useTranslation();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsAPI.getAll();
        const items = response.data?.news || response.data || [];
        setNews(items.slice(0, 3));
      } catch {
        // use empty state
      }
    };
    fetchNews();
  }, []);

  const tagColors = {
    Notice: 'bg-blue-100 text-blue-700',
    Event: 'bg-green-100 text-green-700',
    Update: 'bg-yellow-100 text-yellow-700',
    Announcement: 'bg-purple-100 text-purple-700',
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
              {t('newsPreview.tag')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {t('newsPreview.headingStart')} <span className="text-green-600">{t('newsPreview.headingHighlight')}</span>
            </h2>
          </div>
          <Link to="/activities" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors">
            {t('newsPreview.cta')} <ArrowRight size={16} />
          </Link>
        </motion.div>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tagColors[item.type] || 'bg-gray-100 text-gray-600'}`}>
                    <Tag size={10} className="inline mr-1" />{item.type || t('newsPreview.fallbackType')}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.createdAt || item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{item.content}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm max-w-lg mx-auto">
            <p className="text-gray-500 text-sm font-medium">No recent news or updates available at this time.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsPreview;
