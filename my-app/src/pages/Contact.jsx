import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { QrCode, Copy, CheckCircle, Heart, ScanLine, Smartphone, Loader2, X, Camera } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { QrReader } from 'react-qr-reader';
import donateQr from './AbudrQR.jpeg';

const Donate = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);

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

  // Jab QR code scan ho jaye
  const handleScanResult = (result) => {
    if (result && result?.text) {
      const scannedData = result.text;
      console.log('QR Scanned:', scannedData);
      
      // Close scanner
      setShowScanner(false);
      setScanning(false);
      
      // Open UPI app directly
      if (scannedData.includes('pay') || scannedData.includes('upi')) {
        window.location.href = scannedData;
      } else {
        window.location.href = qrDetails.upiUrl;
      }
    }
  };

  const handleScanError = (err) => {
    console.error('Scan error:', err);
    alert('Camera access denied. Please allow camera permission.');
    setShowScanner(false);
    setScanning(false);
  };

  // "Scan Now" click karne par camera khulega
  const handleScanNow = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      setShowScanner(true);
      setScanning(true);
    } else {
      alert('Please use your mobile phone to scan the QR code');
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div>
      <Helmet>
        <title>{t('donate.title')} - Nek Kaam Foundation</title>
        <meta name="description" content={t('donate.subtitle')} />
      </Helmet>

      {/* QR Scanner Modal - Same phone se scan */}
      {showScanner && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 flex justify-between items-center">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Camera size={20} />
                Scan QR Code
              </h3>
              <button
                onClick={() => {
                  setShowScanner(false);
                  setScanning(false);
                }}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4">
              {/* Camera View */}
              <div className="relative aspect-square w-full bg-black rounded-lg overflow-hidden mb-4">
                <QrReader
                  onResult={handleScanResult}
                  constraints={{ 
                    facingMode: 'environment' 
                  }}
                  className="w-full h-full"
                  videoStyle={{ objectFit: 'cover' }}
                />
                {/* Scanning frame */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-500 animate-scan-line" />
                  <div className="absolute inset-0 border-2 border-green-500 m-8 rounded-lg" />
                </div>
              </div>
              
              <p className="text-center text-gray-700 text-sm font-medium">
                📱 Place the QR code inside the frame
              </p>
              <p className="text-center text-xs text-gray-500 mt-1">
                Camera will automatically detect and open UPI app
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <motion.div {...fadeInUp} className="max-w-2xl text-center mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Heart size={22} className="text-pink-400" />
              </div>
              <span className="bg-white/10 backdrop-blur-sm font-semibold text-sm px-4 py-1.5 rounded-full">
                Support Our Cause
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Donate to Help Others
            </h1>
            <p className="text-base md:text-lg text-emerald-100 leading-relaxed">
              Your contribution makes a real difference in people's lives
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            {...fadeInUp}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-center">
              <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <QrCode size={22} />
                Scan QR Code to Pay
              </h2>
              <p className="text-green-100 text-sm mt-1">
                Click "Scan Now" and point camera at this QR code
              </p>
            </div>
            
            <div className="p-8 text-center">
              {/* QR Code Image - Isko scan karna hai */}
              <motion.div 
                className="relative inline-block"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-64 h-64 mx-auto bg-white rounded-2xl shadow-md p-3 border-2 border-green-100">
                  <img 
                    src={donateQr} 
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>

              {/* Scan Now Button - Camera khulega isi QR ko scan karne ke liye */}
              <motion.button
                onClick={handleScanNow}
                className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={scanning}
              >
                {scanning ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Opening Camera...
                  </>
                ) : (
                  <>
                    <ScanLine size={20} />
                    Scan Now
                  </>
                )}
              </motion.button>

              {/* OR Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Manual UPI ID - Backup option */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Enter UPI ID manually</p>
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
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div 
            {...fadeInUp}
            className="mt-8 bg-blue-50 rounded-xl p-4"
          >
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Smartphone size={18} />
              How to Donate:
            </h3>
            <ol className="text-sm text-blue-700 space-y-1 ml-4">
              <li>1️⃣ Click <strong>"Scan Now"</strong> button above</li>
              <li>2️⃣ Allow camera permission when prompted</li>
              <li>3️⃣ Point your camera at the <strong>QR code shown above</strong></li>
              <li>4️⃣ UPI app will open automatically</li>
              <li>5️⃣ Complete your payment</li>
            </ol>
          </motion.div>
        </div>
      </section>

      {/* CSS Animation */}
      <style>{`
        @keyframes scan-line {
          0% {
            transform: translateY(-250%);
          }
          100% {
            transform: translateY(250%);
          }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Donate;
