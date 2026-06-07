import { useEffect, useState } from 'react';
import { impactStoryAPI } from '../services/api';
import Loader from '../components/common/Loader';
import { Calendar, MapPin, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ImpactStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await impactStoryAPI.getAll();
        console.log(response.data.stories);
        setStories(response.data.stories || []);
      } catch (error) {
        console.error('Failed to fetch impact stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('impactStories.title')}</h1>
          <p className="text-xl text-gray-100">{t('impactStories.subtitle')}</p>
        </div>
      </section>

      {/* Stories List */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <Loader />
          ) : stories.length > 0 ? (
            <div className="space-y-8">
              {stories.map((story) => (
                <div key={story._id} className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition hover:shadow-xl duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 min-h-[300px]">
                    <div className="h-64 md:h-auto relative overflow-hidden bg-gray-100 flex items-center justify-center">
                      {story.images && story.images.length > 0 && story.images[0].url ? (
                        <img
                          src={story.images[0].url}
                          alt={story.title}
                          className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white p-6 font-bold text-center">
                          {story.title}
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">{story.title}</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-wrap">{story.story}</p>
                      </div>
                      
                      <div className="space-y-3 border-t border-gray-200/80 pt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User size={16} className="text-green-600" />
                          <span><strong>{t('impactStories.beneficiary')}:</strong> {story.personName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} className="text-green-600" />
                          <span><strong>{t('impactStories.location')}:</strong> {story.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-green-600" />
                          <span><strong>{t('impactStories.date')}:</strong> {new Date(story.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">{t('common.noStories')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ImpactStories;
