import { useState } from 'react';
import { Link } from 'react-router-dom';
import { memberAPI } from '../services/api';
import SEO from '../components/seo/SEO';
import Button from '../components/common/Button';
import { CheckCircle, MapPin, Loader2, User, Phone, Globe, Home, Compass, LocateFixed } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

const MemberRegister = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    country: 'India',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationFilled, setLocationFilled] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUseLiveLocation = async () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support live location.');
      return;
    }

    setError(null);
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`,
            {
              headers: {
                Accept: 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error('Unable to resolve your live location right now.');
          }

          const data = await response.json();
          const addr = data.address || {};

          const village = addr.village || addr.hamlet || '';
          const town = addr.town || addr.suburb || '';
          const city = addr.city || town || addr.county || '';
          const district = addr.state_district || addr.county || '';
          const state = addr.state || addr.region || '';
          const country = addr.country || formData.country || 'India';
          const pinCode = addr.postcode || '';

          // Build a clean, specific address line
          const parts = [village, town, district].filter((p) => p && p !== city);
          const uniqueParts = [...new Set(parts)];
          const addressLine = uniqueParts.length > 0
            ? uniqueParts.join(', ')
            : data.display_name?.split(',').slice(0, 3).join(',').trim() || '';

          setFormData((prev) => ({
            ...prev,
            country: country || prev.country,
            state: state || prev.state,
            city: city || prev.city,
            address: addressLine || prev.address,
            pinCode: pinCode || prev.pinCode,
          }));
          setLocationFilled(true);
        } catch (locationError) {
          setError(locationError.message || 'Unable to use live location.');
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        if (err.code === 1) {
          setError('Location permission denied. Please allow location access or enter details manually.');
        } else if (err.code === 2) {
          setError('Location unavailable. Please enter details manually.');
        } else {
          setError('Location request timed out. Please try again or enter details manually.');
        }
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await memberAPI.register(formData);
      if (response.data && response.data.member) {
        setSuccessData(response.data.member);
      } else {
        throw new Error('Registration succeeded, but member details were not returned.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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

  if (successData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-800 via-emerald-900 to-teal-950 flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20 transition-all transform duration-300 hover:scale-[1.01]">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full text-green-700 mb-6 shadow-inner animate-bounce">
            <CheckCircle size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{t('memberRegister.successTitle')}</h1>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">{t('memberRegister.successSubtitle')}</p>

          <div className="bg-green-50/80 border border-green-100 rounded-2xl p-5 mb-8 text-left space-y-3 shadow-sm">
            <div>
              <p className="text-xs text-green-700 font-bold uppercase tracking-wider">{t('memberRegister.memberId')}</p>
              <p className="text-xl font-mono font-black text-green-950 tracking-wide mt-0.5">{successData.memberId}</p>
            </div>
            <div className="border-t border-green-100/50 pt-2.5">
              <p className="text-xs text-green-700 font-bold uppercase tracking-wider">{t('memberRegister.fullName')}</p>
              <p className="text-base font-semibold text-gray-800 mt-0.5">{successData.fullName}</p>
            </div>
            <div className="border-t border-green-100/50 pt-2.5">
              <p className="text-xs text-green-700 font-bold uppercase tracking-wider">{t('memberRegister.phoneNumber')}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{successData.phoneNumber}</p>
            </div>
            <div className="border-t border-green-100/50 pt-2.5">
              <p className="text-xs text-green-700 font-bold uppercase tracking-wider">{t('memberRegister.country')}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{successData.country || 'India'}</p>
            </div>
            <div className="border-t border-green-100/50 pt-2.5">
              <p className="text-xs text-green-700 font-bold uppercase tracking-wider">{t('memberRegister.registrationDate')}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{new Date(successData.joinDate).toLocaleDateString()}</p>
            </div>
          </div>

          <Link to="/">
            <Button variant="primary" size="lg" className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3.5 rounded-2xl shadow-md transition transform active:scale-98 border-none cursor-pointer">
              {t('memberRegister.goHome')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-emerald-900 to-teal-950 flex items-center justify-center py-16 px-4 relative overflow-hidden">
      <SEO 
        title={t('memberRegister.title')}
        description={t('memberRegister.subtitle')}
        robots="noindex, nofollow"
      />
      {/* Background blobs for rich aesthetics */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-green-500/20 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl opacity-30 animate-pulse" />

      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-xl w-full border border-white/20 transition-all duration-300 z-10">
        <h1 className="text-3xl font-black text-center mb-2 text-gray-900 tracking-tight">{t('memberRegister.title')}</h1>
        <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">{t('memberRegister.subtitle')}</p>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleUseLiveLocation}
          disabled={loading || locationLoading}
          className={`w-full mb-4 flex items-center justify-center gap-2 rounded-2xl font-bold transition duration-200 cursor-pointer ${
            locationFilled
              ? 'border-2 border-green-400 bg-green-50/80 text-green-700'
              : 'border border-green-200 hover:border-green-300 hover:bg-green-50/50 text-green-700'
          }`}
        >
          {locationLoading ? (
            <Loader2 size={18} className="animate-spin text-green-600" />
          ) : locationFilled ? (
            <LocateFixed size={18} className="text-green-600" />
          ) : (
            <MapPin size={18} className="text-green-600" />
          )}
          {locationLoading
            ? t('memberRegister.fetchingLocation')
            : locationFilled
            ? '✓ Location detected — you can edit fields below'
            : t('memberRegister.liveLocation')}
        </Button>

        {locationFilled && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl mb-5 text-xs font-medium flex items-center gap-2">
            <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
            <span>Fields auto-filled from your location. You can edit any field manually.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-2xl mb-6 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">{t('memberRegister.fullName')}</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition duration-200 text-sm font-medium placeholder:text-gray-400"
                  placeholder={t('memberRegister.fullNamePlaceholder')}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">{t('memberRegister.phoneNumber')}</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition duration-200 text-sm font-mono font-medium placeholder:text-gray-400"
                  placeholder={t('memberRegister.phoneNumberPlaceholder')}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">
                {t('memberRegister.country')}
                {locationFilled && formData.country && <span className="ml-1.5 text-[10px] text-green-500 font-semibold bg-green-50 px-1.5 py-0.5 rounded-full">📍 auto</span>}
              </label>
              <div className="relative">
                <Globe size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${locationFilled && formData.country ? 'text-green-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition duration-200 text-sm font-medium placeholder:text-gray-400 ${
                    locationFilled && formData.country ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
                  }`}
                  placeholder={t('memberRegister.countryPlaceholder')}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">
                {t('memberRegister.address')}
                {locationFilled && formData.address && <span className="ml-1.5 text-[10px] text-green-500 font-semibold bg-green-50 px-1.5 py-0.5 rounded-full">📍 auto</span>}
              </label>
              <div className="relative">
                <Home size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${locationFilled && formData.address ? 'text-green-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition duration-200 text-sm font-medium placeholder:text-gray-400 ${
                    locationFilled && formData.address ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
                  }`}
                  placeholder={t('memberRegister.addressPlaceholder')}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">
                {t('memberRegister.city')}
                {locationFilled && formData.city && <span className="ml-1.5 text-[10px] text-green-500 font-semibold bg-green-50 px-1.5 py-0.5 rounded-full">📍 auto</span>}
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition duration-200 text-sm font-medium placeholder:text-gray-400 ${
                  locationFilled && formData.city ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
                }`}
                placeholder={t('memberRegister.cityPlaceholder')}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">
                {t('memberRegister.state')}
                {locationFilled && formData.state && <span className="ml-1.5 text-[10px] text-green-500 font-semibold bg-green-50 px-1.5 py-0.5 rounded-full">📍 auto</span>}
              </label>
              <div className="relative">
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition duration-200 text-sm font-medium bg-white appearance-none cursor-pointer ${
                    locationFilled && formData.state ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
                  }`}
                  disabled={loading}
                >
                  <option value="">{t('memberRegister.selectState')}</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">▼</div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">
                {t('memberRegister.pinCode')}
                {locationFilled && formData.pinCode && <span className="ml-1.5 text-[10px] text-green-500 font-semibold bg-green-50 px-1.5 py-0.5 rounded-full">📍 auto</span>}
              </label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                required
                pattern="[0-9]{6}"
                title="Please enter a valid 6-digit pin code"
                className={`w-full px-4 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition duration-200 text-sm font-mono font-medium placeholder:text-gray-400 ${
                  locationFilled && formData.pinCode ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
                }`}
                placeholder={t('memberRegister.pinCodePlaceholder')}
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-black py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 mt-6 border-none cursor-pointer"
          >
            {loading ? t('memberRegister.registering') : t('memberRegister.register')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MemberRegister;
