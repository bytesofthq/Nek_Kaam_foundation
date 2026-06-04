import { useEffect, useState } from 'react';
import { committeeAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, User } from 'lucide-react';

const demoMembers = [
  { _id: '1', name: 'Mohammed Rafiq Ahmed', position: 'President', phone: '+91 98765 43210', bio: 'Founder and President of Nek Kaam Foundation. Has been serving the community for over 15 years.', address: 'Patna, Bihar' },
  { _id: '2', name: 'Abdul Wahid Khan', position: 'Vice President', phone: '+91 98765 43211', bio: 'Co-founder and Vice President. Expert in community development and charity management.', address: 'Gaya, Bihar' },
  { _id: '3', name: 'Mohammed Iqbal Ansari', position: 'Secretary', phone: '+91 98765 43212', bio: 'Handles all official communications, records, and member registrations.', address: 'Nalanda, Bihar' },
  { _id: '4', name: 'Khalid Hussain Siddiqui', position: 'Treasurer', phone: '+91 98765 43213', bio: 'Manages the foundation\'s finances and ensures complete transparency in fund management.', address: 'Muzaffarpur, Bihar' },
  { _id: '5', name: 'Dr. Zubair Ahmed', position: 'Medical Committee Head', phone: '+91 98765 43214', bio: 'MBBS, MD. Leads all medical assistance programs and free medical camps.', address: 'Vaishali, Bihar' },
  { _id: '6', name: 'Hafiz Abdul Rahim', position: 'Religious Advisor', phone: '+91 98765 43215', bio: 'Provides Islamic guidance for all foundation activities and ensures Shariah compliance.', address: 'Patna, Bihar' },
  { _id: '7', name: 'Mohammed Salim Qureshi', position: 'Project Coordinator', phone: '+91 98765 43216', bio: 'Oversees all ongoing projects and ensures timely completion and quality standards.', address: 'Bihar Sharif, Bihar' },
  { _id: '8', name: 'Arshad Ali Mirza', position: 'Committee Member', phone: '+91 98765 43217', bio: 'Active volunteer and committee member focused on youth engagement and education.', address: 'Darbhanga, Bihar' },
];

const positionColors = {
  'President': 'from-yellow-400 to-amber-600',
  'Vice President': 'from-green-500 to-emerald-700',
  'Secretary': 'from-blue-500 to-blue-700',
  'Treasurer': 'from-purple-500 to-purple-700',
  default: 'from-green-400 to-green-700',
};

const Committee = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await committeeAPI.getAll();
        const data = response.data?.members || response.data || [];
        setMembers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch committee members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const displayMembers = members.length > 0 ? members : demoMembers;

  return (
    <div>
      <Helmet>
        <title>Committee Members - Nek Kaam Foundation</title>
        <meta name="description" content="Meet the dedicated committee members of Nek Kaam Foundation — the people guiding our mission with integrity and compassion." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/15 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">Our Team</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Committee Members</h1>
            <p className="text-green-100 text-xl max-w-2xl">Meet the dedicated individuals who guide our foundation with integrity, compassion, and unwavering commitment to community service.</p>
          </motion.div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayMembers.map((member, index) => {
                const gradientClass = positionColors[member.position] || positionColors.default;
                return (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 group"
                  >
                    {/* Avatar area */}
                    <div className={`h-32 bg-gradient-to-br ${gradientClass} relative flex items-center justify-center`}>
                      {member.photo ? (
                        <img src={member.photo.url || member.photo} alt={member.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                          <User size={36} className="text-white" />
                        </div>
                      )}
                    </div>

                    <div className="p-5 text-center">
                      <h3 className="font-extrabold text-gray-800 text-base mb-1 group-hover:text-green-700 transition-colors">{member.name}</h3>
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 bg-gradient-to-r ${gradientClass} text-white`}>
                        {member.position || member.designation}
                      </span>
                      {member.bio && (
                        <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">{member.bio}</p>
                      )}
                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        {(member.phoneNumber || member.phone) && (
                          <a href={`tel:${member.phoneNumber || member.phone}`} className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-green-600 transition-colors">
                            <Phone size={12} className="text-green-500" />
                            {member.phoneNumber || member.phone}
                          </a>
                        )}
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-green-600 transition-colors">
                            <Mail size={12} className="text-green-500" />
                            {member.email}
                          </a>
                        )}
                        {member.address && (
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                            <MapPin size={12} className="text-green-500" />
                            {member.address}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Committee;
