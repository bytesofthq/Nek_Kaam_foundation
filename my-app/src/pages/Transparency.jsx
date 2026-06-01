import { useEffect, useState } from 'react';
import { fundAPI } from '../services/api';
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Financial Transparency</h1>
          <p className="text-xl text-gray-100">Detailed breakdown of our finances</p>
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
