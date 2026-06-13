import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { QrCode, Copy, CheckCircle, Heart, ScanLine, Smartphone, Loader2 } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import donateQr from './AbudrQR.jpeg';

const Donate = () => {
  const { t, language } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const qrDetails = {
    upiId: '9794820273@ptsbi',
    name: 'Nek Kaam Foundation',
    upiUrl: `paytmmp://pay?pa=9794820273@ptsbi&pn=Nek Kaam Foundation&cu=INR`
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

  // Function to simulate scanning QR code and open UPI app
  const handleScanNow = () => {
    setIsScanning(true);
    
    // Animation effect for scanning
    setTimeout(() => {
      // Check if on mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Open UPI app directly
        window.location.href = qrDetails.upiUrl;
      } else {
        // On desktop, show alert with UPI ID
        alert(`Please use your mobile phone to scan the QR code or use UPI ID: ${qrDetails.upiId}`);
      }
      
      setIsScanning(false);
    }, 1500);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
  };

  return (
    <div>
      <Helmet>
        <title>{t('donate.title')} - Nek Kaam Foundation</title>
        <meta name="description" content={t('donate.subtitle')} />
      </Helmet>

      {/* Hero Section with Description */}
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
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                💝 100% Transparent
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                🤝 50+ Families Helped
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                📊 Real-time Updates
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content - QR Code Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            {...fadeInUp}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-center">
              <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <QrCode size={22} />
                {t('donate.scanToPay')}
              </h2>
              <p className="text-green-100 text-sm mt-1">
                {t('donate.scanInstruction')}
              </p>
            </div>
            
            <div className="p-8 text-center">
              {/* QR Code with Scan Animation */}
              <motion.div 
                className="relative inline-block cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={handleScanNow}
              >
                <motion.div 
                  className="w-64 h-64 mx-auto bg-white rounded-2xl shadow-md p-3 border-2 border-green-100 relative overflow-hidden"
                  animate={isScanning ? { boxShadow: ['0 0 0 0 rgba(34,197,94,0.4)', '0 0 0 20px rgba(34,197,94,0)'] } : {}}
                  transition={{ duration: 1, repeat: isScanning ? 1 : 0 }}
                >
                  <img 
                    src={donateQr} 
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Scanning Line Animation */}
                  {isScanning && (
                    <motion.div 
                      className="absolute inset-0 overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div 
                        className="absolute left-0 right-0 h-1 bg-green-500 shadow-lg shadow-green-500"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 1, repeat: 1, ease: 'linear' }}
                      />
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Scan Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ScanLine size={40} className="text-white" />
                </div>
              </motion.div>

              {/* Scan Now Button with Animation */}
              <motion.button
                onClick={handleScanNow}
                className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isScanning}
              >
                {isScanning ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {t('donate.scanning')}
                  </>
                ) : (
                  <>
                    <Smartphone size={20} />
                    {t('donate.scanNow')}
                  </>
                )}
              </motion.button>

              {/* OR Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">{t('donate.or')}</span>
                </div>
              </div>

              {/* UPI ID Section */}
              <div>
                <p className="text-sm text-gray-500 mb-2">{t('donate.upiIdLabel')}</p>
                <div className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200 max-w-md mx-auto">
                  <code className="text-sm md:text-base font-mono text-gray-800 break-all">
                    {qrDetails.upiId}
                  </code>
                  <motion.button
                    onClick={handleCopyUpiId}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-green-50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={16} />
                        {t('donate.copied')}
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        {t('donate.copy')}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Instruction Note */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                  <ScanLine size={12} />
                  {t('donate.scanInstructionNote')}
                </p>
              </div>

              {/* Tax Benefit Note */}
              <div className="mt-4">
                <p className="text-sm text-amber-600 flex items-center justify-center gap-2">
                  <span>💰</span>
                  {t('donate.taxBenefit')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div 
            {...fadeInUp}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              {t('donate.thankYou')}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
