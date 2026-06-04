import { useEffect, useState } from 'react';
import { projectAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MapPin, IndianRupee, Search, CheckCircle, Clock, Calendar } from 'lucide-react';

const STATUS_CONFIG = {
  Completed: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500', icon: CheckCircle },
  Ongoing: { label: 'Ongoing', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', icon: Clock },
  Planned: { label: 'Planned', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-400', icon: Calendar },
};

const demoProjects = [
  { _id: '1', title: 'Al-Noor Mosque Renovation & AC Installation', objective: 'Complete renovation and climate control for 500+ worshippers', location: 'Patna, Bihar', status: 'Completed', budget: 150000, description: 'Full renovation of Al-Noor Mosque including structural repair, whitewash, 4 AC units, and carpet installation for 500 worshippers.' },
  { _id: '2', title: 'Rural Village Water Access Project', objective: 'Provide clean drinking water to 5 remote villages', location: 'Nalanda, Bihar', status: 'Ongoing', budget: 85000, description: 'Installation of water pumps and storage tanks across 5 villages, providing clean drinking water to approximately 1000 families.' },
  { _id: '3', title: 'Jamia Islamia Madrasa Development', objective: 'Build a fully equipped madrasa for 300 students', location: 'Gaya, Bihar', status: 'Planned', budget: 500000, description: 'Establishing a fully equipped madrasa with digital library, modern classrooms, and accommodation for 300 students.' },
  { _id: '4', title: 'Marriage Assistance Annual Program', objective: 'Support 20 underprivileged families with marriage costs', location: 'Multiple Districts, Bihar', status: 'Ongoing', budget: 200000, description: 'Annual program providing financial assistance and logistical support for 20 underprivileged families for their children\'s weddings.' },
  { _id: '5', title: 'Free Medical Camp Initiative', objective: 'Provide free healthcare to 500+ patients quarterly', location: 'Vaishali, Bihar', status: 'Completed', budget: 60000, description: 'Quarterly medical camps with specialized doctors providing free consultation, medicines, and basic health checkups.' },
  { _id: '6', title: 'Freezer Installation for Meat Distribution', objective: 'Enable proper meat storage for community programs', location: 'Muzaffarpur, Bihar', status: 'Completed', budget: 45000, description: 'Installation of commercial freezers to enable proper storage and distribution of meat during Eid and community events.' },
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await projectAPI.getAll();
        const data = res.data?.projects || res.data || [];
        setProjects(data);
        setFiltered(data);
      } catch {
        setProjects([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    let result = projects;
    if (status !== 'All') result = result.filter(p => p.status === status);
    if (search) result = result.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [projects, status, search]);

  const displayProjects = filtered.length > 0 || projects.length > 0 ? filtered : demoProjects;

  const counts = {
    All: (projects.length || demoProjects.length),
    Completed: (projects.length > 0 ? projects : demoProjects).filter(p => p.status === 'Completed').length,
    Ongoing: (projects.length > 0 ? projects : demoProjects).filter(p => p.status === 'Ongoing').length,
    Planned: (projects.length > 0 ? projects : demoProjects).filter(p => p.status === 'Planned').length,
  };

  return (
    <div>
      <Helmet>
        <title>Projects - Nek Kaam Foundation</title>
        <meta name="description" content="Explore all the projects undertaken by Nek Kaam Foundation — from mosque renovation to village water access and madrasa development." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,_white_0%,_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/15 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">Our Projects</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Foundation Projects</h1>
            <p className="text-green-100 text-xl max-w-2xl">Each project is a testament to our commitment — planned with purpose, executed with accountability.</p>
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
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Completed', 'Ongoing', 'Planned'].map((s) => {
                const sc = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${status === s ? (s === 'All' ? 'bg-green-600 text-white' : `${sc?.color} border font-bold`) : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {sc && <span className={`w-2 h-2 rounded-full ${sc.dot}`} />}
                    {s} ({counts[s]})
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
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 group flex flex-col"
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
                          <span className="flex items-center gap-1 text-sm font-bold text-green-700">
                            <IndianRupee size={13} />
                            {Number(project.budget).toLocaleString()}
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
              <p className="text-gray-500 text-lg">No projects match your search.</p>
              <button onClick={() => { setSearch(''); setStatus('All'); }} className="mt-4 text-green-600 hover:underline font-semibold">Clear filters</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
