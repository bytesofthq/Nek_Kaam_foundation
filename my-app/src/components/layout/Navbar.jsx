import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

const navLinks = [
  { labelKey: 'navigation.home', to: '/' },
  { labelKey: 'navigation.about', to: '/about' },
  // { label: 'Activities', to: '/activities' },
  { labelKey: 'navigation.projects', to: '/projects' },
  {
    labelKey: 'navigation.explore',
    children: [
      // { label: 'Gallery', to: '/gallery' },
      { labelKey: 'navigation.impactStories', to: '/impact-stories' },
      { labelKey: 'navigation.committee', to: '/committee' },
      { labelKey: 'navigation.transparency', to: '/transparency' },
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

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isOpen ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-md group-hover:shadow-green-300 transition-shadow">
              <Heart size={18} className="text-white fill-white" />
            </div>
            <div>
              <div className="font-extrabold text-gray-900 text-base leading-none">Nek Kaam</div>
              <div className="text-green-600 text-[10px] font-semibold tracking-wider uppercase">Foundation</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.labelKey} className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${dropdownOpen ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-green-50'}`}
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
                        className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50"
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            className={`block px-4 py-2.5 text-sm font-medium transition-colors ${isActive(child.to) ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-green-50'}`}
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
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive(link.to) ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-green-50'}`}
                >
                  {t(link.labelKey)}
                </Link>
              )
            )}
          </div>

          {/* Auth Links + Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
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
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg px-4 py-4 space-y-2">
            {/* Language switcher mobile */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <LanguageSwitcher variant="simple" />
            </div>

            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition">
              {t('navigation.home')}
            </Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition">
              {t('navigation.about')}
            </Link>
            <Link to="/projects" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition">
              {t('navigation.projects')}
            </Link>
            <Link to="/activities" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition">
              {t('navigation.activities')}
            </Link>
            <Link to="/gallery" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition">
              {t('navigation.gallery')}
            </Link>
            <Link to="/impact-stories" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition">
              {t('navigation.impactStories')}
            </Link>
            <Link to="/committee" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition">
              {t('navigation.committee')}
            </Link>
            <Link to="/transparency" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition">
              {t('navigation.transparency')}
            </Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition">
              {t('navigation.contact')}
            </Link>

            {isAdminLoggedIn ? (
              <>
                <Link to="/admin-dashboard" className="block">
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
                <Link to="/member-dashboard" className="block">
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
                <Link to="/member-login" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    {t('common.login')}
                  </Button>
                </Link>
                <Link to="/member-register" className="block">
                  <Button variant="primary" size="sm" className="w-full">
                    {t('common.register')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
