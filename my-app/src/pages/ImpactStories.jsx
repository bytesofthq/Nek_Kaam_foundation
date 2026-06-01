import { useEffect, useState } from 'react';
import { impactStoryAPI } from '../services/api';
import Loader from '../components/common/Loader';

const ImpactStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await impactStoryAPI.getAll();
        setStories(response.data);
      } catch (error) {
        console.error('Failed to fetch impact stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Impact Stories</h1>
          <p className="text-xl text-gray-100">Real stories of transformation</p>
        </div>
      </section>

      {/* Stories List */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <Loader />
          ) : stories.length > 0 ? (
            <div className="space-y-8">
              {stories.map((story) => (
                <div key={story._id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-40 md:h-full" />
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-4">{story.title}</h3>
                      <p className="text-gray-700 mb-4">{story.description}</p>
                      <p className="text-gray-600 text-sm mb-4">
                        <strong>Beneficiary:</strong> {story.beneficiary}
                      </p>
                      <p className="text-gray-600 text-sm mb-4">
                        <strong>Date:</strong> {new Date(story.date).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                          Success
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No impact stories found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ImpactStories;
