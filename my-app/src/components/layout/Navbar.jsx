import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import logoImg from './nek_kaam.png'; 

const navLinks = [
  { labelKey: 'navigation.home', to: '/' },
  { labelKey: 'navigation.about', to: '/about' },
  { labelKey: 'navigation.projects', to: '/projects' },
  { labelKey: 'navigation.donate', to: '/donate' }, // ✅ Added donate link
  {
    labelKey: 'navigation.explore',
    children: [
      { labelKey: 'navigation.impactStories', to: '/impact-stories' },
      { labelKey: 'navigation.committee', to: '/committee' },
      { labelKey: 'navigation.transparency', to: '/transparency' },
      { labelKey: 'navigation.activities', to: '/activities' }, // ✅ Added activities
      { labelKey: 'navigation.gallery', to: '/gallery' }, // ✅ Added gallery
    ],
  },
  { labelKey: 'navigation.contact', to: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAdminLoggedIn, isMemberLoggedIn, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const isActive = (to) => location.pathname === to;

  // Close dropdown when clicking outside or navigating
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-green-100/80 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(16,185,129,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 min-h-20 py-3">
          {/* Logo with Image */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-21 h-19 rounded-full bg-gradient-to-br  justify-center shadow-lg shadow-green-200 group-hover:shadow-green-300 transition-shadow overflow-hidden">
              {logoImg ? (
                <img src={logoImg} alt="Nek Kaam Foundation" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">NK</span>
                </div>
              )}
            </div>
            <div>
              <div className="font-black text-gray-900 text-lg leading-none tracking-tight">Nek Kaam</div>
              <div className="text-green-600 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">Foundation</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-1 rounded-full border border-green-100 bg-green-50/70 px-2 py-1 shadow-sm">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.labelKey} className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      dropdownOpen ? 'text-green-700 bg-white shadow-sm' : 'text-gray-700 hover:text-green-700 hover:bg-white/70'
                    }`}
                  >
                    {t(link.labelKey)}
                    <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                        onMouseLeave={closeDropdown}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={closeDropdown}
                            className={`block px-4 py-3 text-sm font-medium transition-colors ${
                              isActive(child.to) ? 'text-green-700 bg-green-50' : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                            }`}
                          >
                            {t(child.labelKey)}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive(link.to) ? 'text-green-700 bg-white shadow-sm' : 'text-gray-700 hover:text-green-700 hover:bg-white/70'
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              )
            )}
          </div>

          {/* Auth Links + Language Switcher */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <LanguageSwitcher variant="simple" />

            {isAdminLoggedIn ? (
              <>
                <Link to="/admin-dashboard" className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                  {t('common.adminDashboard')}
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200" title="Logout">
                  <LogOut size={18} />
                </button>
              </>
            ) : isMemberLoggedIn ? (
              <>
                <Link to="/member-dashboard">
                  <Button variant="primary" size="sm">
                    {t('common.dashboard')}
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <>
                <Link to="/member-login">
                  <Button variant="outline" size="sm">
                    {t('common.login')}
                  </Button>
                </Link>
                <Link to="/member-register" className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  {t('common.joinUs')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="xl:hidden p-2.5 rounded-xl text-gray-700 hover:bg-green-50 transition border border-transparent hover:border-green-100"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden bg-white border-t border-gray-100 shadow-lg px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto"
          >
            {/* Language switcher mobile */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 overflow-x-auto">
              <LanguageSwitcher variant="simple" />
            </div>

            {navLinks.map((link) =>
              link.children ? (
                <div key={link.labelKey} className="space-y-1">
                  <div className="px-3 py-2.5 text-gray-700 font-semibold">
                    {t(link.labelKey)}
                  </div>
                  <div className="pl-4 space-y-1 border-l-2 border-green-200 ml-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={() => setIsOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition ${
                          isActive(child.to) ? 'text-green-700 bg-green-50 font-medium' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {t(child.labelKey)}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg transition ${
                    isActive(link.to) ? 'text-green-700 bg-green-50 font-semibold' : 'text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium'
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              )
            )}

            <div className="pt-3 border-t border-gray-100 space-y-2">
              {isAdminLoggedIn ? (
                <>
                  <Link to="/admin-dashboard" onClick={() => setIsOpen(false)} className="block">
                    <Button variant="primary" size="sm" className="w-full">
                      {t('common.adminDashboard')}
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                    {t('common.logout')}
                  </Button>
                </>
              ) : isMemberLoggedIn ? (
                <>
                  <Link to="/member-dashboard" onClick={() => setIsOpen(false)} className="block">
                    <Button variant="primary" size="sm" className="w-full">
                      {t('common.dashboard')}
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                    {t('common.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/member-login" onClick={() => setIsOpen(false)} className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      {t('common.login')}
                    </Button>
                  </Link>
                  <Link to="/member-register" onClick={() => setIsOpen(false)} className="block">
                    <Button variant="primary" size="sm" className="w-full">
                      {t('common.register')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;