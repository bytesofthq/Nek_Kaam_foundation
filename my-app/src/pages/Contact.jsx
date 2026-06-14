import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, MessageSquare, PhoneCall, MailOpen } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { messageAPI } from '../services/api';

const Contact = () => {
  const { t, language } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '', loading: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '', loading: true });

    try {
      await messageAPI.sendMessage(formData);
      setStatus({
        type: 'success',
        message: t('contact.success'),
        loading: false
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setStatus({ type: '', message: '', loading: false }), 5000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: t('contact.failure'),
        loading: false
      });
      setTimeout(() => setStatus({ type: '', message: '', loading: false }), 5000);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const contactInfo = [
    {
      icon: PhoneCall,
      title: t('contact.phone'),
      details: ['+91 97948 20273', '+91 70077 65521'],
      color: 'green',
      link: 'tel:+919794820273'
    },
    {
      icon: MailOpen,
      title: t('contact.email'),
      details: ['abdurrahman.mohdusman@gmail.com'],
      color: 'emerald',
      link: 'mailto:abdurrahman.mohdusman@gmail.com'
    },
    {
      icon: MapPin,
      title: t('contact.address'),
      details: ['Akbapur, Biswan, Sitapur', 'Uttar Pradesh - 261201', 'India'],
      color: 'teal',
      link: null
    }
  ];

  return (
    <div>
      <Helmet>
        <title>{t('contact.title')} - Nek Kaam Foundation</title>
        <meta name="description" content={t('contact.subtitle')} />
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
                <MessageSquare size={22} className="text-pink-400" />
              </div>
              <span className="bg-white/10 backdrop-blur-sm font-semibold text-sm px-4 py-1.5 rounded-full">
                {t('contact.tag') || 'Get in Touch'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-base md:text-lg text-emerald-100 leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${info.color}-50 flex items-center justify-center mb-4`}>
                    <info.icon size={22} className={`text-${info.color}-600`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{info.title}</h3>
                  <div className="space-y-2">
                    {info.details.map((detail, i) => (
                      info.link ? (
                        <a
                          key={i}
                          href={info.link}
                          className="text-gray-600 hover:text-green-600 transition-colors block text-sm"
                        >
                          {detail}
                        </a>
                      ) : (
                        <p key={i} className="text-gray-600 text-sm">{detail}</p>
                      )
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Send size={20} />
                  {t('contact.sendMessage')}
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  {t('contact.subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      placeholder={t('contact.name')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.emailLabel')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      placeholder={t('contact.emailLabel')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.phoneLabel')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      placeholder={t('contact.phoneLabel')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.subject')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      placeholder={t('contact.subject')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.message')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                    placeholder={t('contact.message')}
                  />
                </div>

                {/* Status Messages */}
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-center gap-3 ${
                      status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle size={18} className="text-green-600" />
                    ) : (
                      <AlertCircle size={18} className="text-red-600" />
                    )}
                    <p className="text-sm">{status.message}</p>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={status.loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status.loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('contact.sending')}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {t('contact.send')}
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Map Section - Akbapur Location */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="rounded-2xl overflow-hidden shadow-lg border border-gray-100"
          >
            <iframe
              title="Nek Kaam Foundation - Akbapur, Biswan, Sitapur"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3552.5!2d80.9876!3d27.1235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399e5a1234567891%3A0x1234567890abcdef!2sAkbapur%2C%20Biswan%2C%20Sitapur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 
