import { useEffect, useState } from 'react';
import { committeeAPI } from '../services/api';
import Loader from '../components/common/Loader';

const Committee = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await committeeAPI.getAll();
        setMembers(response.data);
      } catch (error) {
        console.error('Failed to fetch committee members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Committee Members</h1>
          <p className="text-xl text-gray-100">Meet the people guiding our mission</p>
        </div>
      </section>

      {/* Members List */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <Loader />
          ) : members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member) => (
                <div key={member._id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-40" />
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-2">{member.position}</p>
                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                    {member.email && (
                      <p className="text-sm text-gray-500">
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                          {member.email}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No committee members found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Committee;
