import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { QrCode, Copy, CheckCircle, Heart, Smartphone } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import donateQr from './AbudrQR.jpeg';

const Donate = () => {
  const { t, language } = useTranslation();
  const [copied, setCopied] = useState(false);

  const qrDetails = {
    upiId: '8810743304@ybl',
    name: 'Nek Kaam Foundation'
  };

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(qrDetails.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Scan Now button click - Direct UPI app open
  const handleScanNow = () => {
    // Open UPI app directly with pre-filled UPI ID
    window.location.href = `upi://pay?pa=${qrDetails.upiId}&pn=${qrDetails.name}&cu=INR`;
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: { duration: 2, repeat: Infinity }
  };

  return (
    <div>
      <Helmet>
        <title>{t('donate.title')} - Nek Kaam Foundation</title>
        <meta name="description" content={t('donate.subtitle')} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <motion.div {...fadeInUp} className="max-w-2xl text-center mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Heart size={22} className="text-pink-400" />
              </div>
              <span className="bg-white/10 backdrop-blur-sm font-semibold text-sm px-4 py-1.5 rounded-full">
                {t('donate.tag')}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('donate.title')}
            </h1>
            <p className="text-base md:text-lg text-emerald-100 leading-relaxed">
              {t('donate.subtitle')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">💝 100% Transparent</div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">🤝 50+ Families Helped</div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">📊 Real-time Updates</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-center">
              <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <QrCode size={22} />
                {t('donate.scanToPay')}
              </h2>
              <p className="text-green-100 text-sm mt-1">{t('donate.scanInstruction')}</p>
            </div>
            
            <div className="p-8 text-center">
              {/* QR Code Display */}
              <motion.div className="relative inline-block" animate={pulseAnimation}>
                <div className="w-64 h-64 mx-auto bg-white rounded-2xl shadow-md p-3 border-2 border-green-100">
                  <img src={donateQr} alt="UPI QR Code" className="w-full h-full object-contain" />
                </div>
              </motion.div>

              {/* Scan Now Button - Opens UPI App Directly */}
              <motion.button
                onClick={handleScanNow}
                className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto w-full md:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Smartphone size={20} />
                {t('donate.scanNow')}
              </motion.button>

              <p className="text-xs text-gray-500 mt-3">
                {t('donate.howItWorks')}
              </p>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-500">{t('donate.or')}</span></div>
              </div>

              {/* UPI ID Section - Copy Option */}
              <div>
                <p className="text-sm text-gray-500 mb-2">{t('donate.upiIdLabel')}</p>
                <div className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200 max-w-md mx-auto">
                  <code className="text-sm md:text-base font-mono text-gray-800 break-all">{qrDetails.upiId}</code>
                  <button onClick={handleCopyUpiId} className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-green-50 transition-all">
                    {copied ? <><CheckCircle size={16} />{t('donate.copied')}</> : <><Copy size={16} />{t('donate.copy')}</>}
                  </button>
                </div>
              </div>

              {/* Tax Benefit */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-amber-600 flex items-center justify-center gap-2"><span>💰</span>{t('donate.taxBenefit')}</p>
              </div>
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div {...fadeInUp} className="mt-8 text-center">
            <p className="text-gray-500 text-sm">{t('donate.thankYou')}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
