import { useEffect, useState } from 'react';
import { projectAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MapPin, IndianRupee, Search, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

const Projects = () => {
  const { t, language } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const STATUS_CONFIG = {
    Completed: { label: t('projects.completed'), color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500', icon: CheckCircle },
    Ongoing: { label: t('projects.ongoing'), color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', icon: Clock },
    Planned: { label: t('projects.planned'), color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-400', icon: Calendar },
  };
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await projectAPI.getAll();
        const data = res.data?.projects || res.data || [];
        setProjects(data);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = projects.filter(p => {
    if (status !== 'All' && p.status !== status) return false;
    if (search && !(p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const displayProjects = filtered;

  const counts = {
    All: projects.length,
    Completed: projects.filter(p => p.status === 'Completed').length,
    Ongoing: projects.filter(p => p.status === 'Ongoing').length,
    Planned: projects.filter(p => p.status === 'Planned').length,
  };

  return (
    <div>
      <Helmet>
        <title>{t('projects.tag')} - Nek Kaam Foundation</title>
        <meta name="description" content="Explore all the projects undertaken by Nek Kaam Foundation — from mosque renovation to village water access and madrasa development." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,_white_0%,_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/15 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">{t('projects.tag')}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('projects.title')}</h1>
            <p className="text-green-100 text-xl max-w-2xl">{t('projects.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 py-5 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('projects.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Completed', 'Ongoing', 'Planned'].map((s) => {
                const sc = STATUS_CONFIG[s] || { label: t('projects.all'), color: 'bg-green-600 text-white', dot: 'bg-green-500' };
                const isSelected = status === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${isSelected ? (s === 'All' ? 'bg-green-600 text-white shadow-sm' : `${sc.color} border border-transparent font-bold`) : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {s !== 'All' && <span className={`w-2 h-2 rounded-full ${sc.dot}`} />}
                    {s === 'All' ? t('projects.all') : sc.label} ({counts[s]})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProjects.map((project, index) => {
                const sc = STATUS_CONFIG[project.status] || STATUS_CONFIG.Planned;
                return (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 group flex flex-col overflow-hidden"
                  >
                    {/* Status bar */}
                    <div className={`h-1.5 ${sc.dot === 'bg-green-500' ? 'bg-gradient-to-r from-green-400 to-green-600' : sc.dot === 'bg-yellow-500' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`} />
                    <div className="p-7 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${sc.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                        {project.budget && (
                          <span className="flex items-center gap-1 text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-xl">
                            <IndianRupee size={12} />
                            {Number(project.budget).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-extrabold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">{project.title}</h3>
                      {project.objective && (
                        <p className="text-green-600 text-sm font-medium mb-3 italic">"{project.objective}"</p>
                      )}
                      <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3">{project.description}</p>
                      {project.location && (
                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-4 pt-4 border-t border-gray-100">
                          <MapPin size={12} className="text-green-500" />
                          {project.location}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg">{t('projects.noProjects')}</p>
              <button onClick={() => { setSearch(''); setStatus('All'); }} className="mt-4 text-green-600 hover:underline font-semibold cursor-pointer">
                {t('projects.clearFilters')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
