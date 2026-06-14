import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Users, Download, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useEffect, useState } from 'react';

const Hero = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowDownloadBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true;
    
    if (isInstalled) {
      setShowDownloadBtn(false);
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowDownloadBtn(false);
      setShowSuccessMessage(true);
      
      // Auto hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleDownloadClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        // Note: 'appinstalled' event will fire after successful installation
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt variable
      setDeferredPrompt(null);
    }
  };

  const scrollToStats = () => {
    const el = document.getElementById('stats-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* Success Message Toast Notification */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-[90%] sm:max-w-md"
        >
          <CheckCircle size={20} className="sm:w-6 sm:h-6 text-yellow-300" />
          <div>
            <p className="font-bold text-sm sm:text-base">✅ App Installed Successfully!</p>
            <p className="text-xs sm:text-sm text-green-100">Nek Kaam Foundation is now on your device 🎉</p>
          </div>
        </motion.div>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 h-48 sm:w-64 sm:h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-60 h-60 sm:w-80 sm:h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgNDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 sm:px-5 sm:py-2 mb-6 sm:mb-8"
        >
          <span className="text-yellow-400 text-base sm:text-lg">✦</span>
          <span className="text-white/90 text-xs sm:text-sm font-medium">{t('hero.badge')}</span>
          <span className="text-yellow-400 text-base sm:text-lg">✦</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-tight"
        >
          Nek Kaam{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
            Foundation
          </span>
        </motion.h1>

        {/* Sub-heading - Hidden on mobile, visible on larger screens */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden sm:block text-base sm:text-lg md:text-xl text-green-100/90 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed font-light"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Professional CTA Buttons - Both Yellow Theme with smaller mobile padding */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 mb-10 sm:mb-16"
        >
          {/* Become a Member Button */}
          <Link to="/member-register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 text-base sm:text-lg w-full sm:w-auto"
            >
              <Users size={18} className="sm:w-[22px] sm:h-[22px]" />
              <span>{t('hero.ctaMember')}</span>
            </motion.button>
          </Link>
          
          {/* Download App Button - Same Yellow Theme */}
          {showDownloadBtn && (
            <motion.button
              onClick={handleDownloadClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="group relative flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 text-base sm:text-lg w-full sm:w-auto"
            >
              <Download size={18} className="sm:w-[22px] sm:h-[22px]" />
              <span>{t('hero.ctaDownload') || 'Download App'}</span>
            </motion.button>
          )}
        </motion.div>

        {/* Trust indicators - More compact on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-8 text-white/80 text-xs sm:text-sm"
        >
          {[
            { icon: '✅', text: t('hero.trustTransparent') },
            { icon: '🏡', text: t('hero.trustCommunity') },
            { icon: '💝', text: t('hero.trustFamily') },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg">{item.icon}</span>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator - Smaller on mobile */}
      <motion.button
        onClick={scrollToStats}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors cursor-pointer"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <ChevronDown size={24} className="sm:w-8 sm:h-8" />
      </motion.button>
    </section>
  );
};

export default Hero;