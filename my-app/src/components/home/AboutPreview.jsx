import { Link } from 'react-router-dom';
import Button from '../common/Button';

const AboutPreview = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg h-96 shadow-lg" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Nek Kaam Foundation</h2>
            <p className="text-gray-600 mb-4">
              Nek Kaam Foundation is a non-profit organization dedicated to social welfare and community development. We work on multiple initiatives including education, healthcare, skill development, and environmental conservation.
            </p>
            <p className="text-gray-600 mb-6">
              Our mission is to empower underprivileged communities and create sustainable solutions for social challenges. Through the efforts of dedicated volunteers and community partners, we have been able to impact thousands of lives.
            </p>
            <Link to="/about">
              <Button variant="primary" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
