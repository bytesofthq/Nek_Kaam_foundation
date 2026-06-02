import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import bytesoftlogo from '../../assets/image.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Nek Kaam Foundation</h3>
            <p className="text-sm text-gray-400">
              Dedicated to making a positive impact in our community through various initiatives and programs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-white transition">
                  Activities
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/impact-stories" className="hover:text-white transition">
                  Impact Stories
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/transparency" className="hover:text-white transition">
                  Transparency
                </Link>
              </li>
              <li>
                <Link to="/committee" className="hover:text-white transition">
                  Committee
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@nekkaam.org</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>123 Main Street, City, Country</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {currentYear} Nek Kaam Foundation. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="pt-4 flex justify-center text-sm text-gray-400">
          <p className="flex items-center gap-1.5">
            <span>Developed and Managed by</span>
            <a 
              href="https://www.bytesoft.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-85 transition-opacity"
            >
              <img src={bytesoftlogo} alt="Bytesoft" className="h-5 w-auto object-contain" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
