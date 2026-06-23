import { useEffect, useState } from 'react';
import { committeeAPI } from '../services/api';
import { motion } from 'framer-motion';
import SEO from '../components/seo/SEO';
import { Mail, MapPin, User, Phone } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

// Import images from assets/founders folder
import RahmanImg from '../assets/Founders/rahman.jpeg';
import NihalImg from '../assets/Founders/Nihal.jpeg';
import SaleemImg from '../assets/Founders/saleem.jpeg';
import KamilImg from '../assets/Founders/kamil.jpeg';
import ArmanImg from '../assets/Founders/Arman.jpeg';
import KamalImg from '../assets/Founders/kamal.jpeg';
import NaushadImg from '../assets/Founders/noushad.jpeg';
import ShuaibImg from '../assets/Founders/Wshuaib.jpeg';
import AzmatImg from '../assets/Founders/azmat.jpeg';
import NafeesImg from '../assets/Founders/Nafees.png';
import SheebuImg from '../assets/Founders/Sheebu.jpeg';
import ShuaibbImg from '../assets/Founders/Shuaib.jpeg';
import NishanrImg from '../assets/Founders/Nishar.png';
import AsadImg from '../assets/Founders/Asad.png';

const Committee = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const positionColors = {
    'Founder & President': 'from-yellow-400 to-amber-600',
    'Co-Founder': 'from-orange-400 to-amber-600',
    'President': 'from-yellow-400 to-amber-600',
    'Vice President': 'from-green-500 to-emerald-700',
    'Genral Secretary': 'from-blue-500 to-blue-700',
    'Joint Secretary': 'from-cyan-500 to-blue-600',  
    'Secretary': 'from-indigo-500 to-purple-600',    
    'Treasurer': 'from-purple-500 to-purple-700',
    'Assistant Treasurer': 'from-indigo-500 to-purple-600',
    'Media & Public Relation Incharge': 'from-pink-500 to-rose-600',
    'Environment Incharge': 'from-teal-500 to-green-600',
    'Disaster Relief & Service': 'from-red-500 to-orange-600',
    'Health & Medical Incharge': 'from-red-500 to-pink-600',  
    'Executive Member': 'from-gray-500 to-gray-700',  
    default: 'from-green-400 to-green-700',
  };

  const getRoleLabel = (position) => {
  const roleMap = {
    'Founder & President': t('committee.roles.founderPresident'),
    'Co-Founder': t('committee.roles.coFounder'),
    'President': t('committee.roles.president'),
    'Vice President': t('committee.roles.vicePresident'),
    'Genral Secretary': t('committee.roles.generalSecretary'),  
    'General Secretary': t('committee.roles.generalSecretary'),
    'Secretary': t('committee.roles.secretary'),
    'Joint Secretary': t('committee.roles.jointSecretary'),
    'Treasurer': t('committee.roles.treasurer'),
    'Assistant Treasurer': t('committee.roles.assistantTreasurer'),
    'Media & Public Relation Incharge': t('committee.roles.mediaPRIncharge'),
    'Environment Incharge': t('committee.roles.environmentIncharge'),
    'Health & Medical Incharge': t('committee.roles.healthMedicalIncharge'),
    'Executive Member': t('committee.roles.executiveMember'),
  };
  return roleMap[position] || position;
};

  const positionOrder = [
    'Founder & President',
    'Co-Founder',
    'Vice President', 
    'Genral Secretary',     
    'Secretary',
    'Joint Secretary',
    'Health & Medical Incharge',
    'Treasurer',
    'Assistant Treasurer',
    'Media & Public Relation Incharge',
    'Environment Incharge',
    'Executive Member'
  ];

  const demoMembers = [
    { 
      _id: '1', 
      name: 'Abdur Rahman', 
      position: 'Founder & President', 
      bio: 'Founder and President of Nek Kaam Foundation. Has been serving the community for over 15 years with dedication and compassion.', 
      address: 'India, UP',
      email: 'abdurrahman.mohdusman@gmail.com',
      phone: '+91 9794820273',
      photo: RahmanImg 
    },
    { 
      _id: '2', 
      name: 'Mohd Nehal', 
      position: 'Co-Founder', 
      bio: 'Co-Founder of Nek Kaam Foundation. Expert in community development and charity management, leading various initiatives.', 
      address: 'India, UP',
      email: 'Nihalkhan31561@gmail.com',
      phone: '+91 79058 93742',
      photo: NihalImg 
    },
    { 
      _id: '3', 
      name: 'Salim Subhan', 
      position: 'Vice President', 
      bio: 'Dedicated Vice President focused on strategic planning and organizational growth.', 
      address: 'India, UP',
      email: 'salim@nekkaamfoundation.org',
      phone: '+91 70077 65521',
      photo: SaleemImg 
    },
    { 
      _id: '4', 
      name: 'Kamil Khan', 
      position: 'Vice President', 
      bio: 'Vice President handling strategic initiatives and community outreach programs efficiently.', 
      address: 'India, Mumbai',
      email: 'kamilkhan8424@gmail.com',
      phone: '+91 91522 56053',
      photo: KamilImg 
    },
    { 
      _id: '5', 
      name: 'Kamal Khan', 
      position: 'Genral Secretary', 
      bio: 'Managing secretarial duties and ensuring smooth coordination between all departments.', 
      address: 'India, UP',
      email: 'kamalkhan902678@gmail.com',
      phone: '+91 98216 80440',
      photo: KamalImg 
    },
    { 
      _id: '6', 
      name: 'Naushad Khan', 
      position: 'Secretary', 
      bio: 'Manages administrative tasks and supports the general secretary in daily operations.', 
      address: 'India, UP',
      email: 'naushad@nekkaamfoundation.org',
      phone: '+91 95590 57411',
      photo: NaushadImg 
    },
    { 
      _id: '7', 
      name: 'Mohd Arman', 
      position: 'Health & Medical Incharge', 
      bio: 'Oversees health camps, medical assistance programs, and healthcare initiatives for the community.', 
      address: 'India, UP',
      email: 'armanbvn261201@gmail.com',
      phone: '+91 94503 62140',
      photo: ArmanImg 
    },
    { 
      _id: '8', 
      name: 'Shuaib Khan', 
      position: 'Joint Secretary', 
      bio: 'Assists the general secretary in administrative tasks and helps coordinate community outreach programs.', 
      address: 'India, Mumbai',
      email: 'shuaib@nekkaamfoundation.org',
      phone: '+91 98765 43217',
      photo: ShuaibImg 
    },
    { 
      _id: '9', 
      name: 'Azmat Ali', 
      position: 'Treasurer', 
      bio: 'Manages the foundation\'s finances and ensures complete transparency in fund management.', 
      address: 'India, UP',
      email: 'azmatali6809@gmail.com',
      phone: '+91 7860477523',
      photo: AzmatImg 
    },
    { 
      _id: '10', 
      name: 'Nafees Ahmad Khan', 
      position: 'Assistant Treasurer', 
      bio: 'Assists in financial management and maintains accurate records of all transactions.', 
      address: 'Kuwait',
      email: 'nafeeskhan98096377@gmail.com',
      phone: '+965 1234 5678',
      photo: NafeesImg 
    },
    { 
      _id: '11', 
      name: 'Mohd Arif', 
      position: 'Media & Public Relation Incharge', 
      bio: 'Manages media relations, social media presence, and public communications for the foundation.', 
      address: 'India, UP',
      email: 'arifkhan000779@gmail.com',
      phone: '+91 8009822257',
      photo: SheebuImg 
    },
    { 
      _id: '12', 
      name: 'Mohd Shuaib', 
      position: 'Environment Incharge', 
      bio: 'Leads environmental initiatives, tree plantation drives, and sustainability programs.', 
      address: 'India, Delhi',
      email: '-',
      phone: '+91 ',
      photo: ShuaibbImg 
    },
    { 
      _id: '13', 
      name: 'Nishar Khan', 
      position: 'Executive Member', 
      bio: 'Active volunteer supporting various foundation activities and community events.', 
      address: 'India, UP',
      email: 'Rk8745675@gmail.com',
      phone: '+91 9265866064',
      photo: NishanrImg 
    },
    { 
      _id: '14', 
      name: 'Asad Usman', 
      position: 'Executive Member', 
      bio: 'Supports disaster response coordination and helps in emergency relief operations.', 
      address: 'India, UP',
      email: 'asad@nekkaamfoundation.org',
      phone: '+91 78974 71731',
      photo: AsadImg 
    },
  ];

  // Sort members by position order
  const sortedMembers = [...demoMembers].sort((a, b) => {
    const indexA = positionOrder.indexOf(a.position);
    const indexB = positionOrder.indexOf(b.position);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await committeeAPI.getAll();
        const data = response.data?.members || response.data || [];
        if (Array.isArray(data) && data.length > 0) {
          const sortedApiData = [...data].sort((a, b) => {
            const indexA = positionOrder.indexOf(a.position);
            const indexB = positionOrder.indexOf(b.position);
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
          });
          setMembers(sortedApiData);
        } else {
          setMembers(sortedMembers);
        }
      } catch (error) {
        console.error('Failed to fetch committee members:', error);
        setMembers(sortedMembers);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const displayMembers = members.length > 0 ? members : sortedMembers;

  return (
    <div>
      <SEO 
        title={t('seo.committeeTitle')}
        description={t('seo.committeeDesc')}
        keywords="Nek Kaam Foundation committee, board members, NGO founders, Abdur Rahman, Mohd Nehal, Saleem Subhan, NGO team Sitapur"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/15 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">{t('committee.tag')}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('committee.title')}</h1>
            <p className="text-green-100 text-xl max-w-2xl">{t('committee.subtitle')}</p>
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
                    <div className={`h-32 bg-gradient-to-br ${gradientClass} relative flex items-center justify-center`}>
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={member.name} 
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                          <User size={40} className="text-white" />
                        </div>
                      )}
                    </div>

                    <div className="p-5 text-center">
                      <h3 className="font-extrabold text-gray-800 text-base mb-1 group-hover:text-green-700 transition-colors">
                        {member.name}
                      </h3>
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 bg-gradient-to-r ${gradientClass} text-white`}>
                        {getRoleLabel(member.position)}
                      </span>
                      {member.bio && (
                        <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">
                          {member.bio}
                        </p>
                      )}
                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        {member.email && member.email !== '-' && (
                          <a 
                            href={`mailto:${member.email}`} 
                            className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-green-600 transition-colors group"
                          >
                            <Mail size={12} className="text-green-500 group-hover:text-green-600 flex-shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </a>
                        )}
                        {member.phone && member.phone !== '-' && member.phone !== '+91-' && member.phone !== '+-' && (
                          <a 
                            href={`tel:${member.phone.replace(/[\s\-\(\)]/g, '')}`} 
                            className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-green-600 transition-colors group"
                          >
                            <Phone size={12} className="text-green-500 group-hover:text-green-600 flex-shrink-0" />
                            <span>{member.phone}</span>
                          </a>
                        )}
                        {member.address && (
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                            <MapPin size={12} className="text-green-500 flex-shrink-0" />
                            <span>{member.address}</span>
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
