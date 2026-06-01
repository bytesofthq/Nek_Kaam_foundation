import { useEffect, useState } from 'react';
import { galleryAPI } from '../services/api';
import Loader from '../components/common/Loader';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await galleryAPI.getAll();
        setImages(response.data);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-gray-100">Visual stories of our impact</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <Loader />
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((image) => (
                <div key={image._id} className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer group">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-48 relative overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-white text-center p-4">
                      <p className="text-sm">{image.title}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{image.title}</h3>
                    <p className="text-gray-600 text-sm">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No gallery items found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
