import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Shield, ChevronDown, Users, Star } from 'lucide-react';

const Hero = () => {
  const scrollToStats = () => {
    const el = document.getElementById('stats-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgNDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8"
        >
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white/90 text-sm font-medium">Trusted by 500+ Families Across India</span>
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
        >
          Nek Kaam{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
            Foundation
          </span>
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-green-100/90 max-w-4xl mx-auto mb-12 leading-relaxed font-light"
        >
          Together We Help Communities, Support Families, Strengthen Madrasas,{' '}
          Improve Mosques and Bring Positive Change Through Collective Efforts.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
        >
          <Link to="/member-register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-yellow-400/30 transition-all duration-300 text-lg"
            >
              <Users size={20} />
              Become a Member
            </motion.button>
          </Link>
          <Link to="/activities">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 text-lg"
            >
              <Eye size={20} />
              View Activities
            </motion.button>
          </Link>
          <Link to="/transparency">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 text-lg"
            >
              <Shield size={20} />
              Transparency Center
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 text-white/80 text-sm"
        >
          {[
            { icon: '✅', text: '100% Transparent' },
            { icon: '🏡', text: 'Community Driven' },

            { icon: '💝', text: 'Family Welfare' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToStats}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <ChevronDown size={32} />
      </motion.button>
    </section>
  );
};

export default Hero;
