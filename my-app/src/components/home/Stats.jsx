import { useEffect, useState, useRef } from 'react';
import { publicAPI } from '../../services/api';
import { motion, useInView } from 'framer-motion';
import { Users, IndianRupee, FolderOpen, Heart, Home, Droplets } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

const useCountUp = (end, duration = 2000, inView) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, inView]);

  return count;
};

const StatCard = ({ stat, index, inView }) => {
  const count = useCountUp(stat.value, 2000 + index * 200, inView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 group overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} mb-4 mx-auto shadow-md`}>
        <stat.icon size={26} className="text-white" />
      </div>
      <div className={`text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
        {stat.prefix}{count.toLocaleString()}{stat.suffix}
      </div>
      <p className="text-gray-600 font-semibold text-sm">{stat.label}</p>
    </motion.div>
  );
};

const Stats = () => {
  const [apiStats, setApiStats] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await publicAPI.getStats();
        setApiStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      label: 'Registered Members',
      label: t('stats.members'),
      value: apiStats?.totalMembers || 500,
      icon: Users,
      color: 'from-green-500 to-green-700',
      prefix: '',
      suffix: '+',
    },
    {
      label: 'Total Funds Received',
      label: t('stats.fundsReceived'),
      value: apiStats?.totalFundsReceived || 500000,
      icon: IndianRupee,
      color: 'from-emerald-500 to-emerald-700',
      prefix: '₹',
      suffix: '',
    },
    {
      label: 'Total Funds Utilized',
      label: t('stats.fundsUsed'),
      value: apiStats?.totalFundsUsed || 420000,
      icon: Heart,
      color: 'from-yellow-500 to-yellow-700',
      prefix: '₹',
      suffix: '',
    },
    {
      label: 'Projects Completed',
      label: t('stats.projects'),
      value: apiStats?.totalProjects || 48,
      icon: FolderOpen,
      color: 'from-teal-500 to-teal-700',
      prefix: '',
      suffix: '+',
    },
    {
      label: 'Families Supported',
      label: t('stats.families'),
      value: apiStats?.familiesSupported || 200,
      icon: Home,
      color: 'from-green-600 to-emerald-600',
      prefix: '',
      suffix: '+',
    },
    {
      label: 'Villages Helped',
      label: t('stats.villages'),
      value: apiStats?.villagesHelped || 25,
      icon: Droplets,
      color: 'from-emerald-600 to-teal-700',
      prefix: '',
      suffix: '+',
    },
  ];

  return (
    <section id="stats-section" ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
            {t('stats.tag')}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {t('stats.headingStart')} <span className="text-green-600">{t('stats.headingHighlight')}</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t('stats.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
