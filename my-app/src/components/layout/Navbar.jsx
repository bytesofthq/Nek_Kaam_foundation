import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../common/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdminLoggedIn, isMemberLoggedIn, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group min-w-0">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 shadow-md flex items-center justify-center text-white font-extrabold">
              NK
            </div>
            <div className="min-w-0">
              <div className="text-lg md:text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-green-700 transition truncate">
                Nek Kaam
              </div>
              <div className="hidden sm:block text-xs md:text-sm text-gray-500 truncate">
                {t('home.title')}
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
              <Globe size={16} className="text-green-700" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                {t('nav.language')}
              </span>
              <div className="ml-1 inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-200">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  aria-pressed={language === 'en'}
                  className={`rounded-full px-3 py-1 text-sm font-semibold transition ${language === 'en' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:text-green-700'}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  aria-pressed={language === 'hi'}
                  className={`rounded-full px-3 py-1 text-sm font-semibold transition ${language === 'hi' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:text-green-700'}`}
                >
                  HI
                </button>
              </div>
            </div>

            {isAdminLoggedIn ? (
              <>
                <Link to="/admin-dashboard">
                  <Button variant="primary" size="sm">
                    {t('nav.adminDashboard')}
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm" className="px-3">
                  <LogOut size={16} />
                </Button>
              </>
            ) : isMemberLoggedIn ? (
              <>
                <Link to="/member-dashboard">
                  <Button variant="primary" size="sm">
                    {t('nav.memberDashboard')}
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm" className="px-3">
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <>
                <Link to="/member-login">
                  <Button variant="outline" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/member-register">
                  <Button variant="primary" size="sm">
                    {t('nav.register')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-3 text-gray-700 shadow-sm active:scale-95 transition-transform"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className="hidden md:flex items-center justify-center gap-2 lg:gap-4 pt-4">
          {[
            ['nav.home', '/'],
            ['nav.about', '/about'],
            ['nav.projects', '/projects'],
            ['nav.activities', '/activities'],
            ['nav.gallery', '/gallery'],
            ['nav.impactStories', '/impact-stories'],
            ['nav.committee', '/committee'],
            ['nav.transparency', '/transparency'],
            ['nav.contact', '/contact'],
          ].map(([labelKey, path]) => (
            <Link
              key={path}
              to={path}
              className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-green-50 hover:text-green-700"
            >
              {t(labelKey)}
            </Link>
          ))}
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                    {t('nav.language')}
                  </div>
                  <div className="mt-2 inline-flex rounded-full bg-gray-100 p-1">
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${language === 'en' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600'}`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('hi')}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${language === 'hi' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600'}`}
                    >
                      हिंदी
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdminLoggedIn ? (
                    <Link to="/admin-dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="primary" size="sm">
                        {t('nav.adminDashboard')}
                      </Button>
                    </Link>
                  ) : isMemberLoggedIn ? (
                    <Link to="/member-dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="primary" size="sm">
                        {t('nav.memberDashboard')}
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/member-login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm">
                        {t('nav.login')}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4">
              {[
                ['nav.home', '/'],
                ['nav.about', '/about'],
                ['nav.projects', '/projects'],
                ['nav.activities', '/activities'],
                ['nav.gallery', '/gallery'],
                ['nav.impactStories', '/impact-stories'],
                ['nav.committee', '/committee'],
                ['nav.transparency', '/transparency'],
                ['nav.contact', '/contact'],
              ].map(([labelKey, path]) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl bg-gray-50 px-4 py-4 text-sm font-semibold text-gray-700 transition hover:bg-green-50 hover:text-green-700 active:scale-[0.99]"
                >
                  {t(labelKey)}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 p-4">
              {isAdminLoggedIn ? (
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full py-3">
                  {t('nav.logout')}
                </Button>
              ) : isMemberLoggedIn ? (
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full py-3">
                  {t('nav.logout')}
                </Button>
              ) : (
                <Link to="/member-register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full py-3">
                    {t('nav.register')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
