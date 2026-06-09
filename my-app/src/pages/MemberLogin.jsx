import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { Shield, User } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

const MemberLogin = () => {
  const [role, setRole] = useState('member'); // 'member' or 'admin'
  
  // Member fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Admin fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { memberLogin, adminLogin } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (role === 'member') {
        await memberLogin(fullName, phoneNumber);
        navigate('/member-dashboard');
      } else {
        await adminLogin(email, password);
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || t('login.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-75" />

      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20 transition-all duration-300 transform hover:scale-[1.01] z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">{t('login.title')}</h1>
          <p className="text-gray-500 mt-2">{t('login.subtitle')}</p>
        </div>

        {/* Unified/Segmented Tabs */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6 relative">
          <button
            type="button"
            onClick={() => {
              setRole('member');
              setError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              role === 'member'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <User size={16} />
            {t('login.memberLogin')}
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('admin');
              setError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              role === 'admin'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Shield size={16} />
            {t('login.adminLogin')}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {role === 'member' ? (
            <>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">{t('login.memberName')}</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                  placeholder={t('login.memberNamePlaceholder')}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">{t('login.phoneNumber')}</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                  placeholder={t('login.phonePlaceholder')}
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">{t('login.adminEmail')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                  placeholder={t('login.adminEmailPlaceholder')}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">{t('login.password')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                  placeholder={t('login.passwordPlaceholder')}
                  disabled={loading}
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader size="sm" /> {t('common.loading')}
              </span>
            ) : (
              t('common.login')
            )}
          </Button>
        </form>

        {role === 'member' && (
          <p className="text-center text-gray-500 mt-6 text-sm">
            {t('login.noAccount')}{' '}
            <a href="/member-register" className="text-green-600 hover:underline font-bold transition-all duration-200">
              {t('login.registerHere')}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default MemberLogin;
