import { useState } from 'react';
import { Link } from 'react-router-dom';
import { memberAPI } from '../services/api';
import Button from '../components/common/Button';
import { CheckCircle, MapPin, Loader2 } from 'lucide-react';

const MemberRegister = () => {
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
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`,
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
          const address = data.address || {};
          const city = address.city || address.town || address.village || address.county || '';
          const state = address.state || address.region || '';
          const country = address.country || formData.country || 'India';
          const addressLine = data.display_name || `${city}, ${state}, ${country}`.replace(/^[,\s]+|[,\s]+$/g, '');

          setFormData((prev) => ({
            ...prev,
            country,
            state: state || prev.state,
            city: city || prev.city,
            address: addressLine || prev.address,
          }));
        } catch (locationError) {
          setError(locationError.message || 'Unable to use live location.');
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setError('Location permission was denied.');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
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
      <div className="min-h-screen bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mt-10 text-center border border-white/20 transition-all transform duration-300 hover:scale-[1.01]">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full text-green-700 mb-6 shadow-inner animate-bounce">
            <CheckCircle size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Registration Successful!</h1>
          <p className="text-gray-500 mb-6 text-sm">Welcome to Nek Kaam Foundation. Your registration has been saved in our database.</p>

          <div className="bg-green-50/80 border border-green-100 rounded-xl p-5 mb-8 text-left space-y-3">
            <div>
              <p className="text-xs text-green-700 font-semibold uppercase tracking-wider">Member ID</p>
              <p className="text-xl font-mono font-bold text-green-900 tracking-wide">{successData.memberId}</p>
            </div>
            <div className="border-t border-green-100/50 pt-2">
              <p className="text-xs text-green-700 font-semibold uppercase tracking-wider">Full Name</p>
              <p className="text-base font-semibold text-gray-800">{successData.fullName}</p>
            </div>
            <div className="border-t border-green-100/50 pt-2">
              <p className="text-xs text-green-700 font-semibold uppercase tracking-wider">Phone Number</p>
              <p className="text-sm font-semibold text-gray-800">{successData.phoneNumber}</p>
            </div>
            <div className="border-t border-green-100/50 pt-2">
              <p className="text-xs text-green-700 font-semibold uppercase tracking-wider">Country</p>
              <p className="text-sm font-semibold text-gray-800">{successData.country || 'India'}</p>
            </div>
            <div className="border-t border-green-100/50 pt-2">
              <p className="text-xs text-green-700 font-semibold uppercase tracking-wider">Registration Date</p>
              <p className="text-sm font-semibold text-gray-800">{new Date(successData.joinDate).toLocaleDateString()}</p>
            </div>
          </div>

          <Link to="/">
            <Button variant="primary" size="lg" className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-xl shadow-md transition transform active:scale-95">
              Go to Home Page
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mt-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Member Registration</h1>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleUseLiveLocation}
          disabled={loading || locationLoading}
          className="w-full mb-4 flex items-center justify-center gap-2"
        >
          {locationLoading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
          {locationLoading ? 'Fetching live location...' : 'Use Live Location'}
        </Button>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder="Your full name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder="10 digit phone number"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder="Your country"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder="Your address"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder="Your city"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              disabled={loading}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Pin Code</label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              required
              pattern="[0-9]{6}"
              title="Please enter a valid 6-digit pin code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder="6 digit pin code"
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
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MemberRegister;

