import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Target, Eye, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6 },
};

const About = () => {
  const coreValues = [
    { title: 'Integrity', desc: 'We act with honesty and uphold the highest ethical standards in all our work.', emoji: '🤝' },
    { title: 'Transparency', desc: 'Every rupee is accounted for. We publish detailed reports of all fund usage.', emoji: '📊' },
    { title: 'Compassion', desc: 'We serve with empathy, understanding the real needs of those we help.', emoji: '💝' },
    { title: 'Community', desc: 'We believe in the collective strength of united communities.', emoji: '🏘️' },
    { title: 'Excellence', desc: 'We strive for the highest quality in every project and initiative.', emoji: '⭐' },
    { title: 'Accountability', desc: 'We are answerable to our members, donors, and the communities we serve.', emoji: '📋' },
  ];

  return (
    <div>
      <Helmet>
        <title>About Us - Nek Kaam Foundation</title>
        <meta name="description" content="Learn about Nek Kaam Foundation, our mission, vision, core values and our commitment to community development with transparency." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgNDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] " />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div {...fadeIn} className="max-w-3xl">
            <span className="inline-block bg-white/15 text-white/90 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
              About Nek Kaam Foundation
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              A community-driven organization dedicated to uplifting lives through compassionate action, transparent governance, and collective strength.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeIn}>
            <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">Who We Are</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              Built on <span className="text-green-600">Trust</span>, Powered by Community
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Nek Kaam Foundation is a charitable organization established to serve the underprivileged communities of India — with a strong focus on UP. We were founded by a group of concerned community members who believed that real change starts at the grassroots level.
              </p>
              <p>
                Our work spans across marriage assistance, medical help, madrasa support, mosque renovation, water projects, and emergency relief. Every initiative is driven by the needs of the community and executed with full transparency.
              </p>
              <p>
                What sets us apart is our unwavering commitment to financial transparency. We maintain detailed records of every rupee received and spent, making it all publicly available through our Transparency Center.
              </p>
            </div>
          </motion.div>
          <motion.div
            {...fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { emoji: '📅', stat: '2020', label: 'Founded' },
              { emoji: '👥', stat: '500+', label: 'Members' },
              { emoji: '🏡', stat: '200+', label: 'Families Helped' },
              { emoji: '₹', stat: '5L+', label: 'Funds Managed' },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">{item.emoji}</div>
                <div className="text-2xl font-extrabold text-green-700">{item.stat}</div>
                <div className="text-gray-600 text-sm font-medium">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why We Started */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeIn} className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Why We <span className="text-green-600">Started</span></h2>
          </motion.div>
          <motion.div {...fadeIn} className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-10 border border-gray-100">
            <div className="text-5xl mb-6 text-center">🌱</div>
            <p className="text-gray-700 text-lg leading-relaxed text-center mb-6">
              We saw families unable to marry off their daughters due to financial constraints. We saw villages without clean water. We saw mosques in disrepair. We saw students dropping out because their madrasas lacked resources.
            </p>
            <p className="text-gray-700 leading-relaxed text-center">
              We started Nek Kaam Foundation because we believed that together — through transparency, trust, and collective action — we could solve these problems. And we have. But there is still much more to be done, and we continue to grow stronger every day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div {...fadeIn} className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Target size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-extrabold">Our Mission</h2>
              </div>
              <p className="text-green-100 leading-relaxed text-lg">
                To empower underprivileged communities across India through compassionate service, comprehensive support programs, and absolute financial transparency — ensuring that every contribution creates measurable, lasting impact.
              </p>
              <ul className="mt-6 space-y-3">
                {['Support poor families with marriage assistance', 'Provide medical help to those in need', 'Strengthen madrasas & mosques', 'Deliver clean water to villages'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-green-100">
                    <CheckCircle size={16} className="text-yellow-300 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fadeIn} transition={{ duration: 0.6, delay: 0.15 }} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Eye size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-extrabold">Our Vision</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                A society where no family struggles alone — where communities are supported, mosques flourish, madrasas educate, and every person has access to clean water, healthcare, and dignity.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { emoji: '🏘️', text: 'United Communities' },
                  { emoji: '📚', text: 'Helping madarsas & Mosque' },
                  { emoji: '🚰', text: 'Feeding Food' },
                  { emoji: '💊', text: 'Healthcare Support' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-xs font-medium text-gray-200">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeIn} className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">What We Believe</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Our Core <span className="text-green-600">Values</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-green-200 p-7 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{val.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">{val.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Promise */}
      <section className="py-20 bg-gradient-to-br from-green-900 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fadeIn}>
            <div className="text-5xl mb-6">🤲</div>
            <span className="inline-block bg-white/10 text-white font-semibold text-sm px-4 py-1.5 rounded-full mb-4">Our Promise</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">The Transparency <span className="text-yellow-400">Pledge</span></h2>
            <p className="text-green-100 text-lg leading-relaxed mb-8">
              We solemnly promise to our members, donors, and the communities we serve: <strong className="text-white">every single rupee will be accounted for</strong>. 
              We will always publish detailed records of all fund collections and how they were spent. 
              Your trust is our greatest asset — and we will never compromise it.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/transparency" className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg">
                View Transparency Report <ArrowRight size={18} />
              </Link>
              <Link to="/member-register" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300">
                Join the Foundation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
