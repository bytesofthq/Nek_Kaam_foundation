import { Link } from 'react-router-dom';
import Button from '../common/Button';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Nek Kaam Foundation</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Empowering communities and creating lasting positive change through innovative programs and dedicated service.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/projects">
              <Button variant="secondary" size="lg">
                Explore Our Projects
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                Get Involved
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-2xl p-8 text-gray-800">
            <p className="text-center text-lg font-semibold mb-4">
              Together, we can make a difference
            </p>
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
