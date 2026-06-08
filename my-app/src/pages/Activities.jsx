import { useEffect, useState } from 'react';
import { activityAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, MapPin, Tag, Search, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Marriage Assistance', 'Family Support', 'Medical Help', 'Educational Support', 'Madrasa Support', 'Mosque Support', 'Water Project', 'Community Cleaning', 'Disaster Relief', 'Emergency Help', 'Other'];

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

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
    fetch();
  }, []);

  const filtered = activities.filter(a => {
    if (category !== 'All' && a.category !== category) return false;
    if (search && !(a.title?.toLowerCase().includes(search.toLowerCase()) || a.description?.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const demoActivities = [
    { _id: '1', title: 'Marriage Assistance for 3 Families', category: 'Marriage Assistance', location: 'Patna, Bihar', date: '2024-11-15', description: 'We provided financial and logistical support for 3 underprivileged families in organizing their daughters\' weddings with dignity.' },
    { _id: '2', title: 'Al-Noor Mosque AC Installation', category: 'Mosque Support', location: 'Gaya, Bihar', date: '2024-10-20', description: 'Successfully installed 4 AC units in Al-Noor Mosque to provide comfortable environment for worshippers, especially during summer Ramadan.' },
    { _id: '3', title: 'Jamia Madrasa Renovation', category: 'Madrasa Support', location: 'Nalanda, Bihar', date: '2024-09-10', description: 'Complete renovation of Jamia Madrasa including roof repair, whitewash, and new furniture benefiting 150 students.' },
    { _id: '4', title: 'Village Water Pump Installation', category: 'Water Project', location: 'Muzaffarpur, Bihar', date: '2024-08-05', description: 'Installed 2 water pumps providing clean drinking water to approximately 300 families in remote villages.' },
    { _id: '5', title: 'Medical Camp & Medicine Distribution', category: 'Medical Help', location: 'Vaishali, Bihar', date: '2024-07-20', description: 'Organized a free medical camp with 3 doctors. 200+ patients received free consultation and medicines.' },
    { _id: '6', title: 'Flood Relief Distribution', category: 'Disaster Relief', location: 'Darbhanga, Bihar', date: '2024-08-25', description: 'Distributed food packets, blankets and essential supplies to 100+ flood-affected families during the monsoon disaster.' },
  ];

  const displayActivities = filtered.length > 0 || activities.length > 0 ? filtered : demoActivities;

  return (
    <div>
      <Helmet>
        <title>Activities - Nek Kaam Foundation</title>
        <meta name="description" content="Explore the activities and initiatives of Nek Kaam Foundation — from marriage assistance to mosque support and disaster relief." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,_white_0%,_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/15 text-white font-semibold text-sm px-4 py-1.5 rounded-full mb-4">Our Activities</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Foundation Activities</h1>
            <p className="text-green-100 text-xl max-w-2xl">Every activity represents a life changed, a family supported, and a community strengthened.</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 py-6 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto">
              <Filter size={16} className="text-gray-400 flex-shrink-0" />
              {CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${category === cat ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'}`}
                >
                  {cat}
                </button>
              ))}
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
                        {activity.images && activity.images.length > 0 && activity.images[0].url ? (
                          <img src={activity.images[0].url} alt={activity.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-44 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-4xl">
                            {activity.category === 'Mosque Support' ? '🕌' : activity.category === 'Madrasa Support' ? '📚' : activity.category === 'Medical Help' ? '🏥' : activity.category === 'Marriage Assistance' ? '💒' : activity.category === 'Water Project' ? '🚰' : activity.category === 'Disaster Relief' ? '🌊' : '🤝'}
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                              <Tag size={10} />
                              {activity.category}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(activity.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
              <p className="text-gray-500 text-lg">No activities match your search.</p>
              <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-4 text-green-600 hover:underline font-semibold">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Activities;
