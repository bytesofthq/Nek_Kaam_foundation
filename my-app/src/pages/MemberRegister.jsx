import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { memberAPI } from '../services/api';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useLanguage } from '../context/LanguageContext';

const MemberRegister = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await memberAPI.register(formData);
      navigate('/member-login');
    } catch (err) {
      setError(err.response?.data?.message || t('register.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mt-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{t('register.title')}</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">{t('register.fullName')}</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder={t('register.placeholders.fullName')}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">{t('register.phoneNumber')}</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder={t('register.placeholders.phoneNumber')}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">{t('register.address')}</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder={t('register.placeholders.address')}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">{t('register.city')}</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder={t('register.placeholders.city')}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">{t('register.state')}</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder={t('register.placeholders.state')}
              disabled={loading}
            >
              <option value="">{t('register.stateSelect')}</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">{t('register.pinCode')}</label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              required
              pattern="[0-9]{6}"
              title="Please enter a valid 6-digit pin code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder={t('register.placeholders.pinCode')}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? t('register.registering') : t('common.register')}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {t('register.haveAccount')}{' '}
          <Link to="/member-login" className="text-green-600 hover:underline font-semibold">
            {t('register.loginHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default MemberRegister;
