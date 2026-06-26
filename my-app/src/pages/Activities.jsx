import { useEffect, useState } from 'react';
import { activityAPI, projectAPI } from '../services/api';
import { motion } from 'framer-motion';
import SEO from '../components/seo/SEO';
import { Calendar, MapPin, Tag, Search, Filter, FolderGit2 } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

const Activities = () => {
  const { t, language } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('All');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  const [activeImageIndexes, setActiveImageIndexes] = useState({});
  const [activeMediaTab, setActiveMediaTab] = useState({});

  const getActiveImageIndex = (activityId) => activeImageIndexes[activityId] || 0;
  const setActiveImageIndex = (activityId, index) => {
    setActiveImageIndexes(prev => ({ ...prev, [activityId]: index }));
  };

  const getMediaTab = (activityId) => activeMediaTab[activityId] || 'photos';
  const setMediaTab = (activityId, tab) => {
    setActiveMediaTab(prev => ({ ...prev, [activityId]: tab }));
  };

  const CATEGORIES = [
    { key: 'All', label: t('activities.categories.all') },
    { key: 'Marriage Assistance', label: t('activities.categories.marriage') },
    { key: 'Family Support', label: t('activities.categories.family') },
    { key: 'Medical Help', label: t('activities.categories.medical') },
    { key: 'Educational Support', label: t('activities.categories.education') },
    { key: 'Schools Support', label: t('activities.categories.schools') },
    { key: 'Water Project', label: t('activities.categories.water') },
    { key: 'Community Cleaning', label: t('activities.categories.cleaning') },
    { key: 'Disaster Relief', label: t('activities.categories.disaster') },
    { key: 'Emergency Help', label: t('activities.categories.emergency') },
    { key: 'Other', label: t('activities.categories.other') },
  ];

  const categoryLabels = CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = cat.label;
    return acc;
  }, {});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await activityAPI.getAll();
        const data = res.data?.activities || res.data || [];
        setActivities(data);
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchProjects = async () => {
      try {
        const res = await projectAPI.getAll({ limit: 100 });
        const data = res.data?.projects || res.data || [];
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects for filter:', err);
      }
    };
    fetch();
    fetchProjects();
  }, []);

  const filtered = activities.filter(a => {
    if (category !== 'All' && a.category !== category) return false;
    if (search && !(a.title?.toLowerCase().includes(search.toLowerCase()) || a.description?.toLowerCase().includes(search.toLowerCase()))) return false;
    
    if (selectedProject !== 'All') {
      if (selectedProject === 'None') {
        if (a.project) return false;
      } else {
        const activityProjectId = a.project?._id || a.project;
        if (activityProjectId !== selectedProject) return false;
      }
    }
    return true;
  });
  const displayActivities = filtered;

  return (
    <div>
      <SEO 
        title="Activities & Community Work | Nek Kaam Foundation Sitapur Biswan UP"
        description="Nek Kaam Foundation activities in Akbapur, Biswan, Sitapur, UP: marriage assistance for poor families, medical camps, handpump installation, school support, tree plantation, community cleaning, disaster relief. View all activities."
        keywords="Nek Kaam Foundation activities, marriage assistance Sitapur, medical camp Biswan, handpump installation UP, school support Akbapur, community cleaning Sitapur, tree plantation UP, disaster relief Uttar Pradesh, nek kaam foundation work, NGO activities Sitapur Biswan, community NGO Uttar Pradesh"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Activities - Nek Kaam Foundation",
          "description": "All community activities and projects of Nek Kaam Foundation in Sitapur, Biswan, Akbapur, Uttar Pradesh.",
          "url": "https://nekkamfoundation.in/activities",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nekkamfoundation.in" },
              { "@type": "ListItem", "position": 2, "name": "Activities", "item": "https://nekkamfoundation.in/activities" }
            ]
          }
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,_white_0%,_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/15 text-white font-semibold text-sm px-4 py-1.5 rounded-full mb-4">{t('activities.tag')}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('activities.title')}</h1>
            <p className="text-green-100 text-xl max-w-2xl">{t('activities.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 py-6 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
            {/* Search Input */}
            <div className="relative flex-1 w-full max-w-lg">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder={t('activities.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 shadow-sm transition-all duration-200"
              />
            </div>

            {/* Project Filter Select */}
            <div className="relative w-full sm:w-72">
              <FolderGit2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white cursor-pointer shadow-sm transition-all duration-200 appearance-none font-semibold text-gray-700"
              >
                <option value="All">{language === 'hi' ? '📂 सभी प्रोजेक्ट्स' : '📂 All Projects'}</option>
                <option value="None">{language === 'hi' ? '👤 स्वतंत्र गतिविधियाँ (कोई प्रोजेक्ट नहीं)' : '👤 Independent (No Project)'}</option>
                {projects.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    📋 {proj.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Timeline */}
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayActivities.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-green-200 -translate-x-1/2 hidden md:block" />

              <div className="space-y-10">
                {displayActivities.map((activity, index) => (
                  <motion.div
                    key={activity._id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5 }}
                    className={`relative flex flex-col md:flex-row gap-6 items-start ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Timeline dot */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-green-600 border-4 border-white shadow-md z-10" />

                    {/* Card */}
                    <div className={`w-full md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 group">
                        {/* Media Container */}
                        <div className="relative overflow-hidden w-full h-44 bg-gray-900">
                          {/* Photos/Video selector overlay */}
                          {activity.video && activity.video.url && (
                            <div className="absolute top-2 right-2 flex gap-1.5 z-20">
                              <button
                                onClick={() => setMediaTab(activity._id, 'photos')}
                                className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md backdrop-blur-md transition-all cursor-pointer ${getMediaTab(activity._id) === 'photos' ? 'bg-green-600 text-white shadow' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
                              >
                                Photos
                              </button>
                              <button
                                onClick={() => setMediaTab(activity._id, 'video')}
                                className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md backdrop-blur-md transition-all cursor-pointer ${getMediaTab(activity._id) === 'video' ? 'bg-green-600 text-white shadow' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
                              >
                                Video
                              </button>
                            </div>
                          )}

                          {getMediaTab(activity._id) === 'video' && activity.video?.url ? (
                            <video src={activity.video.url} controls className="w-full h-full object-contain" />
                          ) : (
                            <>
                              {activity.images && activity.images.length > 0 && activity.images[getActiveImageIndex(activity._id)]?.url ? (
                                <img src={activity.images[getActiveImageIndex(activity._id)].url} alt={activity.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-4xl">
                                  {activity.category === 'Schools Support' ? '🏫' : activity.category === 'Medical Help' ? '🏥' : activity.category === 'Marriage Assistance' ? '💒' : activity.category === 'Water Project' ? '🚰' : activity.category === 'Disaster Relief' ? '🌊' : '🤝'}
                                </div>
                              )}

                              {/* Dot Pagination indicators */}
                              {activity.images && activity.images.length > 1 && (
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                                  {activity.images.map((_, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => setActiveImageIndex(activity._id, idx)}
                                      className={`w-2 h-2 rounded-full border border-white/50 transition-all cursor-pointer ${getActiveImageIndex(activity._id) === idx ? 'bg-green-600 scale-110 shadow' : 'bg-white/60 hover:bg-white'}`}
                                    />
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="p-6">
                          {activity.project && (
                            <div className="text-[10px] font-bold tracking-wide text-green-700 bg-green-50/70 border border-green-100 rounded-lg px-2.5 py-1 mb-3 inline-block">
                              Project: {activity.project.title || activity.project}
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                              <Tag size={10} />
                              {categoryLabels[activity.category] || activity.category}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(activity.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">{activity.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{activity.description}</p>
                          {activity.location && (
                            <div className="flex items-center gap-1 text-gray-400 text-xs mt-3">
                              <MapPin size={12} className="text-green-500" />
                              {activity.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Spacer for the other side */}
                    <div className="hidden md:block w-[calc(50%-2rem)]" />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-500 text-lg">{t('activities.noActivities')}</p>
              <button onClick={() => { setSearch(''); setCategory('All'); setSelectedProject('All'); }} className="mt-4 text-green-600 hover:underline font-semibold cursor-pointer">
                {t('activities.clearFilters')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Activities;
