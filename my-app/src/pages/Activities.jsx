import { useEffect, useState } from 'react';
import { activityAPI } from '../services/api';
import Loader from '../components/common/Loader';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await activityAPI.getAll();
        setActivities(response.data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Activities</h1>
          <p className="text-xl text-gray-100">Regular initiatives making a difference</p>
        </div>
      </section>

      {/* Activities List */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <Loader />
          ) : activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <div key={activity._id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-40" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                    <p className="text-gray-600 mb-4">{activity.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                        {activity.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No activities found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Activities;
