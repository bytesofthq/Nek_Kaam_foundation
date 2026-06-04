import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { memberAPI, newsAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { User, Phone, MapPin, Calendar, Edit3, Save, X, Hash, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MemberDashboard = () => {
  const { member, isMemberLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [news, setNews] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isMemberLoggedIn) {
      navigate('/member-login');
    }
  }, [isMemberLoggedIn, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isMemberLoggedIn) {
        try {
          const response = await memberAPI.getProfile();
          const data = response.data?.member || response.data;
          setProfile(data);
          setFormData(data);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [isMemberLoggedIn]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await newsAPI.getAll();
        const data = res.data?.news || res.data || [];
        setNews(data.slice(0, 5));
      } catch {}
    };
    fetchNews();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await memberAPI.updateProfile(formData);
      setProfile(formData);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isMemberLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Member Dashboard - Nek Kaam Foundation</title>
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-800 text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold mb-1">
                Welcome, {profile?.fullName || profile?.name || member?.name || 'Member'}!
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-green-100 text-sm">
                {profile?.memberId && (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                    <Hash size={13} />
                    Member ID: {profile.memberId}
                  </span>
                )}
                {profile?.createdAt && (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                    <Calendar size={13} />
                    Joined: {new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="flex gap-2 bg-white rounded-xl shadow-sm border border-gray-100 p-1.5 mb-8 w-fit">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'updates', label: 'Foundation Updates', icon: Bell },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:text-green-600'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl mb-4 flex items-center gap-2 text-sm font-semibold">
                ✅ Profile updated successfully!
              </div>
            )}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                <h2 className="text-xl font-extrabold text-gray-800">My Profile</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <Edit3 size={15} /> Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => { setIsEditing(false); setFormData(profile); }}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    <X size={15} /> Cancel
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="p-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { icon: User, label: 'Full Name', value: profile?.fullName || profile?.name },
                      { icon: Phone, label: 'Phone Number', value: profile?.phoneNumber || profile?.phone },
                      { icon: MapPin, label: 'Address', value: profile?.address },
                      { icon: MapPin, label: 'City', value: profile?.city },
                      { icon: MapPin, label: 'State', value: profile?.state },
                      { icon: Hash, label: 'Pin Code', value: profile?.pinCode },
                    ].map((field, i) => (
                      <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <field.icon size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-0.5">{field.label}</p>
                          <p className="font-bold text-gray-800">{field.value || '—'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { name: 'fullName', label: 'Full Name', type: 'text' },
                      { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
                      { name: 'address', label: 'Address', type: 'text' },
                      { name: 'city', label: 'City', type: 'text' },
                      { name: 'state', label: 'State', type: 'text' },
                      { name: 'pinCode', label: 'Pin Code', type: 'text' },
                    ].map(field => (
                      <div key={field.name}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label}</label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setFormData(profile); }}
                      className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:opacity-50"
                    >
                      <Save size={15} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'updates' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7">
              <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                <Bell size={20} className="text-green-600" />
                Foundation Updates
              </h2>
              {news.length > 0 ? (
                <div className="space-y-4">
                  {news.map((item) => (
                    <div key={item._id} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-green-200 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">{item.type || 'Update'}</span>
                        <span className="text-xs text-gray-400">{new Date(item.createdAt || item.date).toLocaleDateString('en-IN')}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No updates available yet. Check back soon!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      <div className="h-12" />
    </div>
  );
};

export default MemberDashboard;
