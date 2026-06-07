import { useState } from 'react';
import { messageAPI } from '../services/api';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await messageAPI.sendMessage(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-xl text-gray-100">{t('contact.subtitle')}</p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-8">{t('contact.getInTouch')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">{t('contact.address')}</h3>
                  <p className="text-gray-600">123 Main Street, City, Country 12345</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{t('contact.phone')}</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{t('contact.email')}</h3>
                  <p className="text-gray-600">info@nekkaam.org</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{t('contact.hours')}</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-8">{t('contact.sendMessage')}</h2>
              {success && (
                <div className="bg-green-100 text-green-600 p-4 rounded-lg mb-4">
                  {t('contact.success')}
                </div>
              )}
              {error && (
                <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('contact.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                    placeholder={t('contact.placeholders.name')}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('contact.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                    placeholder={t('contact.placeholders.email')}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('contact.phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                    placeholder={t('contact.placeholders.phone')}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('contact.subject')}</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                    placeholder={t('contact.placeholders.subject')}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('contact.message')}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                    placeholder={t('contact.placeholders.message')}
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? t('common.sending') : t('contact.sendMessage')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
