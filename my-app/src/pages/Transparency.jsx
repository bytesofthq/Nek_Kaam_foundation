import { useEffect, useState } from 'react';
import { fundAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck } from 'lucide-react';
import Loader from '../components/common/Loader';

const Transparency = () => {
  const [collections, setCollections] = useState([]);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectionsRes, usageRes] = await Promise.all([
          fundAPI.getCollections(),
          fundAPI.getUsage(),
        ]);
        setCollections(collectionsRes.data);
        setUsage(usageRes.data);
      } catch (error) {
        console.error('Failed to fetch fund data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Transparency Center - Nek Kaam Foundation</title>
        <meta name="description" content="View the complete financial transparency report of Nek Kaam Foundation — all funds received and utilized, 100% public." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 to-emerald-800 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={28} className="text-yellow-400" />
              <span className="bg-white/15 font-semibold text-sm px-4 py-1.5 rounded-full">Transparency Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">100% Financial Transparency</h1>
            <p className="text-green-100 text-xl max-w-3xl">
              We believe every person who contributes to our foundation has the right to know exactly where their money goes. Here is our complete, unedited financial record.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500 text-center">
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Total Funds Received</h3>
                  <p className="text-3xl font-bold text-green-600">${collections.reduce((a, c) => a + Number(c.amount), 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500 text-center">
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Total Funds Used</h3>
                  <p className="text-3xl font-bold text-red-600">${usage.reduce((a, c) => a + Number(c.amount), 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500 text-center">
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Available Balance</h3>
                  <p className="text-3xl font-bold text-yellow-600">${(collections.reduce((a, c) => a + Number(c.amount), 0) - usage.reduce((a, c) => a + Number(c.amount), 0)).toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Collections */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Fund Collections</h2>
                <div className="space-y-4">
                  {collections.length > 0 ? (
                    collections.map((item) => (
                      <div key={item._id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-600">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{item.source}</h3>
                          <span className="text-green-600 font-bold">${item.amount}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No collection data available</p>
                  )}
                </div>
              </div>

              {/* Usage */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Fund Usage</h2>
                <div className="space-y-4">
                  {usage.length > 0 ? (
                    usage.map((item) => (
                      <div key={item._id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-600">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{item.purpose}</h3>
                          <span className="text-red-600 font-bold">${item.amount}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No usage data available</p>
                  )}
                </div>
              </div>
            </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Transparency;
