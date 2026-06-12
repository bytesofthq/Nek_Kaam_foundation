import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { User, Phone, LogIn } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

const MemberLogin = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { memberLogin } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await memberLogin(fullName, phoneNumber);
      navigate('/member-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t('login.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-green-800 via-emerald-900 to-teal-950 flex items-center justify-center py-16 px-4 relative overflow-hidden">
      {/* Decorative background blobs for rich premium aesthetics */}
      <div className="absolute top-[-25%] left-[-20%] w-[500px] h-[500px] bg-green-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-[-25%] right-[-20%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgNDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] pointer-events-none" />

      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full border border-white/20 transition-all duration-300 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl text-green-700 mb-5 shadow-inner border border-green-100">
            <LogIn size={28} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('memberLogin.title')}</h1>
          <p className="text-gray-500 mt-2.5 text-sm md:text-base leading-relaxed">{t('memberLogin.subtitle')}</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-2xl mb-6 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-gray-700 font-bold mb-1.5 text-sm">{t('login.memberName')}</label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 text-sm placeholder:text-gray-400 font-medium"
                placeholder={t('login.memberNamePlaceholder')}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1.5 text-sm">{t('login.phoneNumber')}</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 text-sm placeholder:text-gray-400 font-mono font-medium"
                placeholder={t('login.phonePlaceholder')}
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-98 flex items-center justify-center gap-2 mt-8 text-base border-none cursor-pointer"
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

        <p className="text-center text-gray-500 mt-8 text-sm">
          {t('login.noAccount')}{' '}
          <Link to="/member-register" className="text-green-600 hover:underline font-bold transition-all duration-200">
            {t('login.registerHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default MemberLogin;
