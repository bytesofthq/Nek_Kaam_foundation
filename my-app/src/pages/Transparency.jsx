import { useEffect, useState, useRef } from 'react';
import { fundAPI } from '../services/api';
import { motion, useInView } from 'framer-motion';
import SEO from '../components/seo/SEO';
import { ShieldCheck, ArrowDownRight, ArrowUpRight, Wallet, Calendar, User, Tag, FileText } from 'lucide-react';
import Loader from '../components/common/Loader';
import { useTranslation } from '../i18n/useTranslation';

// Count Up Animation Hook
const useCountUp = (end, duration = 1500, inView) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    
    startTimeRef.current = null;
    setCount(0);
    
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      setCount(currentCount);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, inView]);

  return count;
};

// Animated Number Component
const AnimatedNumber = ({ value, inView, formatFn }) => {
  const animatedValue = useCountUp(value, 1500, inView);
  return formatFn(animatedValue);
};

const Transparency = () => {
  const { t, language } = useTranslation();
  const [collections, setCollections] = useState([]);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCollectionsAmount, setTotalCollectionsAmount] = useState(0);
  const [totalUsageAmount, setTotalUsageAmount] = useState(0);
  
  // Refs for animation triggers
  const statsRef = useRef(null);
  const inView = useInView(statsRef, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch collections
        const collectionsRes = await fundAPI.getCollections();
        
        let collectionsData = [];
        let totalCollections = 0;
        
        if (collectionsRes.data?.success && collectionsRes.data?.collections) {
          collectionsData = collectionsRes.data.collections;
          totalCollections = collectionsData.reduce((sum, item) => sum + (item.amount || 0), 0);
        } else if (Array.isArray(collectionsRes.data)) {
          collectionsData = collectionsRes.data;
          totalCollections = collectionsData.reduce((sum, item) => sum + (item.amount || 0), 0);
        }
        
        setCollections(collectionsData);
        setTotalCollectionsAmount(totalCollections);
        
        // Fetch usage data
        const usageRes = await fundAPI.getUsage();
        
        let usageData = [];
        let totalUsage = 0;
        
        if (usageRes.data?.success && usageRes.data?.usages) {
          usageData = usageRes.data.usages;
          totalUsage = usageData.reduce((sum, item) => sum + (item.amountUsed || 0), 0);
        } else if (Array.isArray(usageRes.data)) {
          usageData = usageRes.data;
          totalUsage = usageData.reduce((sum, item) => sum + (item.amountUsed || 0), 0);
        }
        
        setUsage(usageData);
        setTotalUsageAmount(totalUsage);
        
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

  const availableBalance = totalCollectionsAmount - totalUsageAmount;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatNumber = (val) => {
    return new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-IN').format(val);
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('transparency.dateNotAvailable');
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div>
      <SEO 
        title={t('seo.transparencyTitle')}
        description={t('seo.transparencyDesc')}
        keywords="100% transparent charity, financial report NGO, donation list Sitapur, fund usage record UP, Nek Kaam Foundation transparency"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck size={22} className="text-yellow-400" />
              </div>
              <span className="bg-white/10 backdrop-blur-sm font-semibold text-sm px-4 py-1.5 rounded-full">
                {t('transparency.tag')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              {t('transparency.title')}
            </h1>
            <p className="text-base md:text-lg text-emerald-100 leading-relaxed">
              {t('transparency.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section ref={statsRef} className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader />
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Stats Cards with Counting Animation */}
              <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Total Received - Animated */}
                <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 group-hover:bg-green-100 transition-all duration-300 flex items-center justify-center">
                      <ArrowUpRight size={24} className="text-green-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {t('transparency.totalReceived')}
                    </span>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-gray-900">
                    <AnimatedNumber 
                      value={totalCollectionsAmount} 
                      inView={inView} 
                      formatFn={formatCurrency}
                    />
                  </p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <TrendingUp size={14} className="text-green-500" />
                    {t('transparency.fundCollections')}
                  </p>
                </div>

                {/* Total Used - Animated */}
                <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 group-hover:bg-red-100 transition-all duration-300 flex items-center justify-center">
                      <ArrowDownRight size={24} className="text-red-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      {t('transparency.totalUsed')}
                    </span>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-gray-900">
                    <AnimatedNumber 
                      value={totalUsageAmount} 
                      inView={inView} 
                      formatFn={formatCurrency}
                    />
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {t('transparency.fundUsage')}
                  </p>
                </div>

                {/* Available Balance - Animated */}
                <div className="group bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 group-hover:bg-amber-200 transition-all duration-300 flex items-center justify-center">
                      <Wallet size={24} className="text-amber-700 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                      {t('transparency.availableBalance')}
                    </span>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-amber-800">
                    <AnimatedNumber 
                      value={availableBalance} 
                      inView={inView} 
                      formatFn={formatCurrency}
                    />
                  </p>
                  <p className="text-sm text-amber-600 mt-2">
                    {t('transparency.totalReceived')} - {t('transparency.totalUsed')}
                  </p>
                </div>
              </motion.div>

              {/* Transactions Grid with Stagger Animation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Fund Collections */}
                <motion.div 
                  variants={fadeInUp}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <ArrowUpRight size={20} />
                      {t('transparency.fundCollections')}
                    </h2>
                    <p className="text-green-100 text-sm mt-1">
                      {t('transparency.totalReceived')}: {' '}
                      <AnimatedNumber 
                        value={totalCollectionsAmount} 
                        inView={inView} 
                        formatFn={formatCurrency}
                      />
                    </p>
                  </div>
                  
                  <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                    {collections.length > 0 ? (
                      collections.map((item, idx) => (
                        <motion.div 
                          key={item._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">
                                {item.source || t('transparency.unknownSource')}
                              </h3>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {formatDate(item.date)}
                                </span>
                                {item.addedBy?.name && (
                                  <span className="flex items-center gap-1">
                                    <User size={12} />
                                    {item.addedBy.name}
                                  </span>
                                )}
                              </div>
                              {item.notes && (
                                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">
                                  {item.notes}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-green-600 font-bold text-lg whitespace-nowrap">
                                +{formatCurrency(item.amount || 0)}
                              </span>
                              {item.isVerified && (
                                <div className="text-xs text-green-500 mt-1">✓ Verified</div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-gray-400">
                        <Wallet size={48} className="mx-auto mb-3 opacity-50" />
                        <p>{t('transparency.noCollections')}</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Fund Usage */}
                <motion.div 
                  variants={fadeInUp}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <ArrowDownRight size={20} />
                      {t('transparency.fundUsage')}
                    </h2>
                    <p className="text-red-100 text-sm mt-1">
                      {t('transparency.totalUsed')}: {' '}
                      <AnimatedNumber 
                        value={totalUsageAmount} 
                        inView={inView} 
                        formatFn={formatCurrency}
                      />
                    </p>
                  </div>
                  
                  <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                    {usage.length > 0 ? (
                      usage.map((item, idx) => (
                        <motion.div 
                          key={item._id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">
                                {item.title || item.purpose || t('transparency.unknownPurpose')}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.category && (
                                  <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    <Tag size={10} />
                                    {item.category}
                                  </span>
                                )}
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Calendar size={12} />
                                  {formatDate(item.date)}
                                </span>
                              </div>
                              {item.beneficiary && (
                                <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                                  <User size={14} className="text-gray-400" />
                                  <span className="font-medium">Beneficiary:</span> {item.beneficiary}
                                </p>
                              )}
                              {item.location && (
                                <p className="text-xs text-gray-500 mt-1">
                                  📍 {item.location}
                                </p>
                              )}
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg flex items-start gap-2">
                                  <FileText size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-red-600 font-bold text-lg whitespace-nowrap">
                                -{formatCurrency(item.amountUsed || 0)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-gray-400">
                        <ArrowDownRight size={48} className="mx-auto mb-3 opacity-50" />
                        <p>{t('transparency.noUsage')}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

// Add TrendingUp import at the top
import { TrendingUp } from 'lucide-react';

export default Transparency;