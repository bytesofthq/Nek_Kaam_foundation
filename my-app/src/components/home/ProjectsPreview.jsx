import { useEffect, useState, useRef } from 'react';
import { projectAPI } from '../../services/api';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, IndianRupee } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

const statusConfig = {
  Completed: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  Ongoing: { color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  Planned: { color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
};

const ProjectsPreview = () => {
  const [projects, setProjects] = useState([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useTranslation();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await projectAPI.getAll();
        const data = res.data?.projects || res.data || [];
        setProjects(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch preview projects:', error);
      }
    };
    fetch();
  }, []);

  const displayProjects = projects;

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
        >
          <div>
            <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-3">
              {t('projectsPreview.tag')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {t('projectsPreview.headingStart')} <span className="text-green-600">{t('projectsPreview.headingHighlight')}</span>
            </h2>
          </div>
          <Link to="/projects" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors">
            {t('projectsPreview.cta')} <ArrowRight size={16} />
          </Link>
        </motion.div>

        {displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayProjects.map((project, index) => {
              const sc = statusConfig[project.status] || statusConfig.Planned;
              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 flex flex-col h-full group"
                >
                  <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-600 flex-shrink-0" />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${sc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {project.status}
                      </span>
                      {project.budget && (
                        <span className="flex items-center gap-1 text-sm font-bold text-green-700">
                          <IndianRupee size={14} />
                          {Number(project.budget).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-green-700 transition-colors line-clamp-1">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{project.description || project.objective}</p>
                    {project.location && (
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-auto pt-2 border-t border-gray-50">
                        <MapPin size={12} className="text-green-500 flex-shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg mx-auto">
            <p className="text-gray-500 text-sm font-medium">No active projects to display at this time.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsPreview;
