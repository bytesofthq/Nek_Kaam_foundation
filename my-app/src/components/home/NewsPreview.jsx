import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsAPI } from '../../services/api';
import Loader from '../common/Loader';
import Button from '../common/Button';

const NewsPreview = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsAPI.getAll();
        setNews(response.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <Loader />;

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item._id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-40" />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{formatDate(item.createdAt)}</p>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>
                <Link to={`#`} className="text-blue-600 hover:text-blue-800">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="primary" size="lg">
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;
