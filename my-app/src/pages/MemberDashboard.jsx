import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { memberAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const MemberDashboard = () => {
  const { member, isMemberLoggedIn } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (isMemberLoggedIn) {
        try {
          const response = await memberAPI.getProfile();
          setProfile(response.data);
          setFormData(response.data);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [isMemberLoggedIn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await memberAPI.updateProfile(formData);
      setProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">{t('dashboard.memberTitle')}</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">{t('dashboard.myProfile')}</h2>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('dashboard.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('dashboard.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('dashboard.phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('dashboard.address')}</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="submit" variant="primary">
                  {t('dashboard.saveChanges')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  {t('dashboard.cancel')}
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">{t('dashboard.name')}</p>
                  <p className="text-xl font-semibold">{profile?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{t('dashboard.email')}</p>
                  <p className="text-xl font-semibold">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{t('dashboard.phone')}</p>
                  <p className="text-xl font-semibold">{profile?.phone || t('dashboard.na')}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{t('dashboard.address')}</p>
                  <p className="text-xl font-semibold">{profile?.address || t('dashboard.na')}</p>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} variant="primary">
                {t('dashboard.editProfile')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
