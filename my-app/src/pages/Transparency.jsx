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
        setCollections(collectionsRes.data.collections || []);
        setUsage(usageRes.data.usages || []);
      } catch (error) {
        console.error('Failed to fetch fund data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalCollections = collections.reduce((a, c) => a + Number(c.amount || 0), 0);
  const totalUsage = usage.reduce((a, c) => a + Number(c.amountUsed || 0), 0);
  const balance = totalCollections - totalUsage;

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
                  <p className="text-3xl font-bold text-green-600">₹{totalCollections.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500 text-center">
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Total Funds Used</h3>
                  <p className="text-3xl font-bold text-red-600">₹{totalUsage.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500 text-center">
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Available Balance</h3>
                  <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{balance.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Collections */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Fund Collections</h2>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {collections.length > 0 ? (
                      collections.map((item) => (
                        <div key={item._id} className="bg-gray-50 rounded-xl p-4 border-l-4 border-green-600 shadow-sm transition hover:shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-800">{item.source}</h3>
                              {item.notes && <p className="text-sm text-gray-600 mt-1">{item.notes}</p>}
                            </div>
                            <span className="text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded-lg text-sm whitespace-nowrap">
                              + ₹{item.amount.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-3 font-semibold">
                            Date: {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-550 italic">No collection data available</p>
                    )}
                  </div>
                </div>

                {/* Usage */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Fund Usage (Expenses)</h2>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {usage.length > 0 ? (
                      usage.map((item) => (
                        <div key={item._id} className="bg-gray-50 rounded-xl p-4 border-l-4 border-red-600 shadow-sm transition hover:shadow">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="font-bold text-gray-800">{item.title}</h3>
                              <span className="inline-block text-[10px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full mt-1">
                                {item.category}
                              </span>
                              <div className="text-sm text-gray-600 mt-2">
                                <span className="font-semibold text-gray-700">Beneficiary:</span> {item.beneficiary}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              {item.location && (
                                <p className="text-xs text-gray-500 mt-2">
                                  <span className="font-semibold">Location:</span> {item.location}
                                </p>
                              )}
                            </div>
                            <span className="text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg text-sm whitespace-nowrap">
                              - ₹{item.amountUsed.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-3 font-semibold">
                            Date: {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-550 italic">No usage data available</p>
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
