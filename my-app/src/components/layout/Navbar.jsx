import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdminLoggedIn, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-green-600">
            Nek Kaam
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition">
              About
            </Link>
            <Link to="/projects" className="text-gray-700 hover:text-green-600 transition">
              Projects
            </Link>
            <Link to="/activities" className="text-gray-700 hover:text-green-600 transition">
              Activities
            </Link>
            <Link to="/gallery" className="text-gray-700 hover:text-green-600 transition">
              Gallery
            </Link>
            <Link to="/impact-stories" className="text-gray-700 hover:text-green-600 transition">
              Impact Stories
            </Link>
            <Link to="/committee" className="text-gray-700 hover:text-green-600 transition">
              Committee
            </Link>
            <Link to="/transparency" className="text-gray-700 hover:text-green-600 transition">
              Transparency
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 transition">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAdminLoggedIn ? (
              <>
                <Link to="/admin-dashboard">
                  <Button variant="primary" size="sm">
                    Admin Dashboard
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/member-register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
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
            ) : (
              <>
                <Link to="/login" className="block">
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
      </div>
    </nav>
  );
};

export default Navbar;
