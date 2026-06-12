import { useEffect, useState } from 'react';
import { fundAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import Loader from '../components/common/Loader';
import { useTranslation } from '../i18n/useTranslation';

const Transparency = () => {
  const { t, language } = useTranslation();
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
        
        setCollections(Array.isArray(collectionsRes.data) ? collectionsRes.data : []);
        setUsage(Array.isArray(usageRes.data) ? usageRes.data : []);
      } catch (error) {
        console.error('Failed to fetch fund data:', error);
        setCollections([]);
        setUsage([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateTotal = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  };

  const totalCollections = calculateTotal(collections);
  const totalUsage = calculateTotal(usage);
  const availableBalance = totalCollections - totalUsage;

  const formatCurrency = (val) => {
    return `₹${Number(val).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}`;
  };

  return (
    <div>
      <Helmet>
        <title>{t('transparency.tag')} - Nek Kaam Foundation</title>
        <meta name="description" content="View the complete financial transparency report of Nek Kaam Foundation — all funds received and utilized, 100% public." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 to-emerald-800 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={28} className="text-yellow-400" />
              <span className="bg-white/15 font-semibold text-sm px-4 py-1.5 rounded-full">{t('transparency.tag')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('transparency.title')}</h1>
            <p className="text-green-100 text-lg md:text-xl max-w-3xl leading-relaxed">
              {t('transparency.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : (
            <>
              {/* Financial Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.4 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
                >
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{t('transparency.totalReceived')}</h3>
                    <p className="text-3xl font-black text-green-600">{formatCurrency(totalCollections)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                    <ArrowUpRight size={24} />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
                >
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{t('transparency.totalUsed')}</h3>
                    <p className="text-3xl font-black text-red-600">{formatCurrency(totalUsage)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                    <ArrowDownRight size={24} />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
                >
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{t('transparency.availableBalance')}</h3>
                    <p className="text-3xl font-black text-amber-600">{formatCurrency(availableBalance)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Wallet size={24} />
                  </div>
                </motion.div>
              </div>

              {/* Transactions list */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Collections */}
                <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-black text-gray-800 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                    {t('transparency.fundCollections')}
                  </h2>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {collections.length > 0 ? (
                      collections.map((item) => (
                        <div key={item._id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-green-200 transition-colors">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="font-bold text-gray-800 text-sm md:text-base">{item.source || t('transparency.unknownSource')}</h3>
                              <p className="text-xs text-gray-400 mt-1">
                                {item.date ? new Date(item.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : t('transparency.dateNotAvailable')}
                              </p>
                            </div>
                            <span className="text-green-600 font-extrabold text-sm md:text-base whitespace-nowrap bg-green-50 px-3 py-1 rounded-xl">
                              +{formatCurrency(item.amount || 0)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-2.5 bg-white p-2.5 rounded-xl border border-gray-50 leading-relaxed">{item.description}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-12 text-sm">{t('transparency.noCollections')}</p>
                    )}
                  </div>
                </div>

                {/* Usage */}
                <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-black text-gray-800 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                    {t('transparency.fundUsage')}
                  </h2>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {usage.length > 0 ? (
                      usage.map((item) => (
                        <div key={item._id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-red-200 transition-colors">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="font-bold text-gray-800 text-sm md:text-base">{item.purpose || t('transparency.unknownPurpose')}</h3>
                              <p className="text-xs text-gray-400 mt-1">
                                {item.date ? new Date(item.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : t('transparency.dateNotAvailable')}
                              </p>
                            </div>
                            <span className="text-red-600 font-extrabold text-sm md:text-base whitespace-nowrap bg-red-50 px-3 py-1 rounded-xl">
                              -{formatCurrency(item.amount || 0)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-2.5 bg-white p-2.5 rounded-xl border border-gray-50 leading-relaxed">{item.description}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-12 text-sm">{t('transparency.noUsage')}</p>
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