import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import bytesoftlogo from '../../assets/image.png';
import { useTranslation } from '../../i18n/useTranslation';

const socialLinks = [
  { href: '#', label: 'Facebook', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  { href: '#', label: 'Twitter', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> },
  { href: '#', label: 'Instagram', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path fill="white" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke="white" strokeWidth="2"/></svg> },
  { href: '#', label: 'YouTube', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg> },
];

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
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <Heart size={18} className="text-white fill-white" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-base leading-none">Nek Kaam</div>
                  <div className="text-green-400 text-[10px] font-semibold tracking-wider uppercase">Foundation</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {t('footer.ctaSubtitle')}
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map(({ href, label, svg }, i) => (
                  <a key={i} href={href} aria-label={label} className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-green-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300">
                    {svg}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-base mb-5">{t('footer.quickLinks')}</h4>
              <ul className="space-y-3">
                {[
                  { label: 'About Us', to: '/about' },
                  { label: 'Our Projects', to: '/projects' },
                  { label: 'Activities', to: '/activities' },
                  { label: 'Impact Stories', to: '/impact-stories' },
                  { label: 'Gallery', to: '/gallery' },
                  { label: 'Contact Us', to: '/contact' },
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

            {/* Our Work */}
            <div>
              <h4 className="text-white font-bold text-base mb-5">{t('footer.ourWork')}</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Transparency Center', to: '/transparency' },
                  { label: 'Committee Members', to: '/committee' },
                  { label: 'Member Registration', to: '/member-register' },
                  { label: 'Marriage Assistance', to: '/activities' },
                  { label: 'Mosque Support', to: '/activities' },
                  { label: 'Madrasa Development', to: '/activities' },
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
                <a href="tel:+919876543210" className="flex items-start gap-3 text-gray-400 hover:text-green-400 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-green-600/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone size={14} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('footer.phone')}</p>
                    <p className="text-sm font-medium">+91 98765 43210</p>
                  </div>
                </a>
                <a href="mailto:info@nekkaam.org" className="flex items-start gap-3 text-gray-400 hover:text-green-400 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-green-600/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Mail size={14} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('footer.email')}</p>
                    <p className="text-sm font-medium">info@nekkaam.org</p>
                  </div>
                </a>
                <div className="flex items-start gap-3 text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('footer.address')}</p>
                    <p className="text-sm font-medium">Patna, Bihar, India</p>
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
            <Link to="#" className="hover:text-green-400 transition-colors">{t('footer.privacy')}</Link>
            <Link to="#" className="hover:text-green-400 transition-colors">{t('footer.terms')}</Link>
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
