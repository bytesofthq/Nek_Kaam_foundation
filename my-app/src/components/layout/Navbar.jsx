import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  // { label: 'Activities', to: '/activities' },
  { label: 'Projects', to: '/projects' },
  {
    label: 'Explore',
    children: [
      // { label: 'Gallery', to: '/gallery' },
      { label: 'Impact Stories', to: '/impact-stories' },
      { label: 'Committee', to: '/committee' },
      { label: 'Transparency', to: '/transparency' },
    ],
  },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAdminLoggedIn, isMemberLoggedIn, logout } = useAuth();
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
                <div key={link.label} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${dropdownOpen ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-green-50'}`}
                  >
                    {link.label}
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
                            {child.label}
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
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Auth Links */}
          <div className="hidden md:flex items-center gap-4">
            {isAdminLoggedIn ? (
              <>
                <Link to="/admin-dashboard" className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                  Admin Dashboard
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200" title="Logout">
                  <LogOut size={18} />
                </button>
              </>
            ) : isMemberLoggedIn ? (
              <>
                <Link to="/member-dashboard">
                  <Button variant="primary" size="sm">
                    Dashboard
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
                    Login
                  </Button>
                </Link>
                <Link to="/member-register" className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  Join Us
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
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link to="/" className="block text-gray-700 hover:text-green-600">
              Home
            </Link>
            <Link to="/about" className="block text-gray-700 hover:text-green-600">
              About
            </Link>
            <Link to="/projects" className="block text-gray-700 hover:text-green-600">
              Projects
            </Link>
            <Link to="/activities" className="block text-gray-700 hover:text-green-600">
              Activities
            </Link>
            <Link to="/gallery" className="block text-gray-700 hover:text-green-600">
              Gallery
            </Link>
            <Link to="/impact-stories" className="block text-gray-700 hover:text-green-600">
              Impact Stories
            </Link>
            <Link to="/committee" className="block text-gray-700 hover:text-green-600">
              Committee
            </Link>
            <Link to="/transparency" className="block text-gray-700 hover:text-green-600">
              Transparency
            </Link>
            <Link to="/contact" className="block text-gray-700 hover:text-green-600">
              Contact
            </Link>

            {isAdminLoggedIn ? (
              <>
                <Link to="/admin-dashboard" className="block">
                  <Button variant="primary" size="sm" className="w-full">
                    Admin Dashboard
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                  Logout
                </Button>
              </>
            ) : isMemberLoggedIn ? (
              <>
                <Link to="/member-dashboard" className="block">
                  <Button variant="primary" size="sm" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/member-login" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/member-register" className="block">
                  <Button variant="primary" size="sm" className="w-full">
                    Register
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
