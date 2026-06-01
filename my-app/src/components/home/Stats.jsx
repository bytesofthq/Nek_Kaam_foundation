import { useEffect, useState } from 'react';
import { publicAPI } from '../../services/api';
import Loader from '../common/Loader';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await publicAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const defaultStats = [
    { label: 'Active Projects', value: '15+' },
    { label: 'Members', value: '500+' },
    { label: 'Lives Impacted', value: '10K+' },
    { label: 'Funds Distributed', value: '$100K+' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {defaultStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <p className="text-gray-600 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
