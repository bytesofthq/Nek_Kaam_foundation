import { useEffect, useState } from 'react';
import { testimonialAPI } from '../../services/api';
import Loader from '../common/Loader';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialAPI.getAll();
        setTestimonials(response.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) return <Loader />;

  const defaultTestimonials = [
    {
      name: 'John Doe',
      role: 'Beneficiary',
      message: 'Nek Kaam Foundation changed my life. Their education program gave me the skills I needed to get a job.',
      rating: 5,
    },
    {
      name: 'Jane Smith',
      role: 'Volunteer',
      message: 'Being part of this foundation is truly rewarding. We are making a real difference in people\'s lives.',
      rating: 5,
    },
    {
      name: 'Ahmed Khan',
      role: 'Community Member',
      message: 'The healthcare initiatives have been instrumental in improving health awareness in our community.',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(testimonials.length > 0 ? testimonials : defaultTestimonials).map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.message}"</p>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
