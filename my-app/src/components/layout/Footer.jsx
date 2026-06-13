import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import bytesoftlogo from '../../assets/image.png';
import { useTranslation } from '../../i18n/useTranslation';
import logoImg from './nek_kaam.png';

// Social links hidden for now - empty array
const socialLinks = [];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top CTA Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-white text-2xl md:text-3xl font-extrabold mb-3">
            {t('footer.ctaTitle')}
          </h3>
          <p className="text-green-100 mb-6 max-w-xl mx-auto">
            {t('footer.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/member-register" className="inline-flex items-center justify-center gap-2 bg-white text-green-700 font-bold px-7 py-3 rounded-xl hover:bg-green-50 transition-all duration-300 shadow-md">
              <Heart size={18} className="fill-green-500 text-green-500" />
              {t('footer.ctaMember')}
            </Link>
            <Link to="/transparency" className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-7 py-3 rounded-xl hover:bg-white/10 transition-all duration-300">
              {t('footer.ctaTransparency')}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                {/* Fixed Logo Display */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white-500 to-white-700 flex items-center justify-center overflow-hidden">
                  {logoImg ? (
                    <img src={logoImg} alt="Nek Kaam Foundation" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-600">
                      <span className="text-white font-bold text-xs">NKF</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-extrabold text-white text-base leading-none">Nek Kaam</div>
                  <div className="text-green-400 text-[10px] font-semibold tracking-wider uppercase">Foundation</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {t('footer.ctaSubtitle')}
              </p>
              {/* Social Links - Hidden for now */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map(({ href, label, svg }, i) => (
                    <a key={i} href={href} aria-label={label} className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-green-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300">
                      {svg}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links - FIXED: Now using t() for labels */}
            <div>
              <h4 className="text-white font-bold text-base mb-5">{t('footer.quickLinks')}</h4>
              <ul className="space-y-3">
                {[
                  { label: t('navigation.about'), to: '/about' },
                  { label: t('navigation.projects'), to: '/projects' },
                  { label: t('navigation.activities'), to: '/activities' },
                  { label: t('navigation.impactStories'), to: '/impact-stories' },
                  { label: t('navigation.gallery'), to: '/gallery' },
                  { label: t('navigation.contact'), to: '/contact' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-green-500 group-hover:w-3 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Work - FIXED: Now using t() for labels */}
            <div>
              <h4 className="text-white font-bold text-base mb-5">{t('footer.ourWork')}</h4>
              <ul className="space-y-3">
                {[
                  { label: t('navigation.transparency'), to: '/transparency' },
                  { label: t('navigation.committee'), to: '/committee' },
                  { label: t('common.joinUs'), to: '/member-register' },
                  { label: t('whatWeDo.categories.marriage.title'), to: '/activities' },
                  { label: t('whatWeDo.categories.schools.title'), to: '/activities' },
                ].map((link, i) => (
                  <li key={i}>
                    <Link to={link.to} className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-green-500 group-hover:w-3 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold text-base mb-5">{t('footer.contactInfo')}</h4>
              <div className="space-y-4">
                {/* Mobile Number 1 */}
                <a href="tel:+919794820273" className="flex items-start gap-3 text-gray-400 hover:text-green-400 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-green-600/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone size={14} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('footer.phone')} (President)</p>
                    <p className="text-sm font-medium">+91 97948 20273</p>
                  </div>
                </a>
                {/* Mobile Number 2 */}
                <a href="tel:+919450362140" className="flex items-start gap-3 text-gray-400 hover:text-green-400 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-green-600/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone size={14} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('footer.phone')}</p>
                    <p className="text-sm font-medium">+91 9559057411</p>
                  </div>
                </a>
                {/* Email */}
                <a href="mailto:abdurrahman.mohdusman@gmail.com" className="flex items-start gap-3 text-gray-400 hover:text-green-400 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-green-600/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Mail size={14} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('footer.email')}</p>
                    <p className="text-sm font-medium truncate">abdurrahman.mohdusman@gmail.com</p>
                  </div>
                </a>
                {/* Address */}
                <div className="flex items-start gap-3 text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('footer.address')}</p>
                    <p className="text-sm font-medium">Akbapur Biswan Sitapur 261201 UP India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {currentYear} Nek Kaam Foundation. {t('footer.copyright')}</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-green-400 transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms-conditions" className="hover:text-green-400 transition-colors">{t('footer.terms')}</Link>
          </div>
          <p className="flex items-center gap-1.5">
            <span>{t('footer.developedBy')}</span>
            <a
              href="https://www.bytesoft.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-80 transition-opacity"
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