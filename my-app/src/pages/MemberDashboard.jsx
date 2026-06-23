import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { memberAPI, newsAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/seo/SEO';
import { 
  User, Phone, MapPin, Calendar, Edit3, Save, X, Hash, Bell, 
  Camera, LogOut, CheckCircle, AlertCircle, Award, Heart, 
  Clock, Mail, MapPinned, Building2, Loader2, UserCircle,
  MessageSquare, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';

const MemberDashboard = () => {
  const { member, isMemberLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [news, setNews] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const fileInputRef = useRef(null);

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
      } catch (error) {
        console.error('Failed to fetch news updates:', error);
      }
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
      const response = await memberAPI.updateProfile(formData);
      const updatedProfile = response.data?.member || response.data;
      setProfile(updatedProfile);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file');
      setTimeout(() => setAvatarError(null), 3000);
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image size should be less than 2MB');
      setTimeout(() => setAvatarError(null), 3000);
      return;
    }
    
    setUploadingAvatar(true);
    setAvatarError(null);
    
    try {
      // Create FormData for avatar upload
      const avatarFormData = new FormData();
      avatarFormData.append('avatar', file);
      
      // Use memberAPI if it has an updateAvatar method, otherwise use a generic approach
      let updatedProfile;
      if (typeof memberAPI.updateAvatar === 'function') {
        const response = await memberAPI.updateAvatar(avatarFormData);
        updatedProfile = response.data?.member || response.data;
      } else {
        // Fallback: Try to update profile with avatar URL (you'll need to adjust based on your backend)
        console.warn('updateAvatar method not found in memberAPI');
        // If your backend doesn't support avatar upload, you might need to add this endpoint
        setAvatarError('Avatar upload feature is not available yet');
        setTimeout(() => setAvatarError(null), 3000);
        setUploadingAvatar(false);
        return;
      }
      
      setProfile(updatedProfile);
      setFormData(updatedProfile);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      setAvatarError('Failed to upload avatar. Please try again.');
      setTimeout(() => setAvatarError(null), 3000);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/member-login');
  };

  const getInitials = (name) => {
    if (!name) return 'M';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getMemberSince = () => {
    const date = profile?.createdAt || profile?.memberSince;
    if (!date) return 'Recent';
    return new Date(date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  // const stats = [
  //   { icon: Heart, label: 'Total Donations', value: profile?.totalDonations || 0, color: 'rose' },
  //   { icon: Award, label: 'Campaigns Joined', value: profile?.campaignsJoined || 0, color: 'amber' },
  //   { icon: Clock, label: 'Member Since', value: getMemberSince(), color: 'blue' },
  // ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isMemberLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <SEO 
        title={t('memberDashboard.myProfile')}
        robots="noindex, nofollow"
      />

      {/* Animated Success Toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <CheckCircle size={18} />
            <span className="text-sm font-semibold">{t('memberDashboard.successAlert')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {avatarError && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 right-4 z-50 bg-red-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <AlertCircle size={18} />
            <span className="text-sm font-semibold">{avatarError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section with Avatar */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-emerald-700 to-teal-800 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Avatar with Upload */}
            <div className="relative group">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border-2 border-white/30 shadow-xl flex items-center justify-center overflow-hidden">
                {profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile?.fullName || 'Member'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {getInitials(profile?.fullName || profile?.name || member?.fullName)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Upload Button Overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {uploadingAvatar ? (
                  <Loader2 size={16} className="text-green-600 animate-spin" />
                ) : (
                  <Camera size={16} className="text-green-600" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            
            {/* Welcome Text */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {t('memberDashboard.welcome')}, 
                </h1>
                <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-yellow-200 to-amber-100 bg-clip-text text-transparent">
                  {profile?.fullName || profile?.name || member?.fullName}!
                </h1>
              </div>
              <p className="text-green-100 mt-1 flex items-center justify-center md:justify-start gap-1">
                <Sparkles size={14} />
                We're grateful to have you as part of our family
              </p>
              
              {/* Badges Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                {profile?.memberId && (
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                    <Hash size={12} />
                    ID: {profile.memberId}
                  </span>
                )}
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                  <Calendar size={12} />
                  Joined {getMemberSince()}
                </span>
                {profile?.membershipTier && (
                  <span className="flex items-center gap-1.5 bg-amber-500/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                    <Award size={12} />
                    {profile.membershipTier} Member
                  </span>
                )}
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border border-white/20"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                <stat.icon size={18} className={`text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div> */}

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 mb-8 flex flex-wrap gap-1">
          {[
            { id: 'profile', label: t('memberDashboard.myProfile'), icon: UserCircle },
            { id: 'updates', label: t('memberDashboard.updates'), icon: Bell },
            { id: 'activity', label: 'Recent Activity', icon: MessageSquare },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                    <UserCircle size={22} className="text-green-600" />
                    {t('memberDashboard.myProfile')}
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <Edit3 size={15} /> {t('memberDashboard.editProfile')}
                    </button>
                  ) : (
                    <button
                      onClick={() => { setIsEditing(false); setFormData(profile); }}
                      className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <X size={15} /> {t('memberDashboard.cancel')}
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { icon: User, label: t('memberDashboard.fullName'), value: profile?.fullName || profile?.name, gradient: 'from-blue-50 to-blue-100', iconColor: 'text-blue-600' },
                        { icon: Phone, label: t('memberDashboard.phoneNumber'), value: profile?.phoneNumber || profile?.phone, gradient: 'from-green-50 to-green-100', iconColor: 'text-green-600' },
                        { icon: Mail, label: 'Email Address', value: profile?.email || 'Not provided', gradient: 'from-purple-50 to-purple-100', iconColor: 'text-purple-600' },
                        { icon: MapPin, label: t('memberDashboard.address'), value: profile?.address, gradient: 'from-orange-50 to-orange-100', iconColor: 'text-orange-600' },
                        { icon: Building2, label: t('memberDashboard.city'), value: profile?.city, gradient: 'from-teal-50 to-teal-100', iconColor: 'text-teal-600' },
                        { icon: MapPinned, label: t('memberDashboard.state'), value: profile?.state, gradient: 'from-indigo-50 to-indigo-100', iconColor: 'text-indigo-600' },
                        { icon: Hash, label: t('memberDashboard.pinCode'), value: profile?.pinCode, gradient: 'from-pink-50 to-pink-100', iconColor: 'text-pink-600' },
                      ].map((field, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className={`flex items-start gap-3 bg-gradient-to-br ${field.gradient} rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-200`}
                        >
                          <div className="w-9 h-9 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <field.icon size={16} className={field.iconColor} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-0.5">{field.label}</p>
                            <p className="font-semibold text-gray-800">{field.value || '—'}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        { name: 'fullName', label: t('memberDashboard.fullName'), type: 'text', disabled: true, placeholder: 'Your full name' },
                        { name: 'phoneNumber', label: t('memberDashboard.phoneNumber'), type: 'tel', disabled: true, placeholder: 'Phone number' },
                        { name: 'email', label: 'Email Address', type: 'email', disabled: true, placeholder: 'Email address' },
                        { name: 'address', label: t('memberDashboard.address'), type: 'text', placeholder: 'Street address' },
                        { name: 'city', label: t('memberDashboard.city'), type: 'text', placeholder: 'City' },
                        { name: 'state', label: t('memberDashboard.state'), type: 'text', placeholder: 'State' },
                        { name: 'pinCode', label: t('memberDashboard.pinCode'), type: 'text', placeholder: 'Postal code' },
                      ].map(field => (
                        <div key={field.name}>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label}</label>
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            disabled={field.disabled}
                            placeholder={field.placeholder}
                            className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition ${
                              field.disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); setFormData(profile); }}
                        className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                      >
                        {t('memberDashboard.cancel')}
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 cursor-pointer"
                      >
                        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                        {saving ? t('memberDashboard.saving') : t('memberDashboard.saveChanges')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}

          {/* Updates Tab */}
          {activeTab === 'updates' && (
            <motion.div
              key="updates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                  <Bell size={20} className="text-green-600" />
                  {t('memberDashboard.updates')}
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">Latest</span>
                </h2>
                {news.length > 0 ? (
                  <div className="space-y-4">
                    {news.map((item, idx) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Sparkles size={10} />
                            {t('memberDashboard.updateTag')}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(item.createdAt || item.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell size={32} className="text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">{t('memberDashboard.noUpdates')}</p>
                    <p className="text-gray-400 text-sm mt-1">Check back later for news and announcements</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                  <MessageSquare size={20} className="text-green-600" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {profile?.recentActivities?.length > 0 ? (
                    profile.recentActivities.map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Heart size={14} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart size={32} className="text-gray-300" />
                      </div>
                      <p className="text-gray-500 font-medium">No recent activities</p>
                      <p className="text-gray-400 text-sm mt-1">Your donations and contributions will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="h-12" />
    </div>
  );
};

export default MemberDashboard;