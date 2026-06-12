import { useEffect, useState } from 'react';
import { galleryAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { X, ZoomIn, Tag } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

const Gallery = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const CATEGORIES = [
    { key: 'All', label: t('gallery.categories.all') },
    { key: 'Schools Projects', label: t('gallery.categories.schools') },
    { key: 'Marriage Assistance', label: t('gallery.categories.marriage') },
    { key: 'Water Projects', label: t('gallery.categories.water') },
    { key: 'Medical Help', label: t('gallery.categories.medical') },
    { key: 'Community Activities', label: t('gallery.categories.community') }
  ];

  const categoryEmojis = {
    'Schools Projects': '🏫',
    'Marriage Assistance': '💒',
    'Water Projects': '🚰',
    'Medical Help': '🏥',
    'Community Activities': '🤝',
  };

  const categoryLabels = CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = cat.label;
    return acc;
  }, {});
  const categoryGradients = {
    'Schools Projects': 'from-green-500 to-emerald-700',
    'Marriage Assistance': 'from-pink-400 to-rose-600',
    'Water Projects': 'from-blue-400 to-cyan-600',
    'Medical Help': 'from-red-400 to-rose-500',
    'Community Activities': 'from-teal-400 to-teal-600',
    default: 'from-green-400 to-green-700',
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await galleryAPI.getAll();
        const data = response.data?.images || response.data?.gallery || response.data || [];
        setImages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filtered = category === 'All' ? images : images.filter(img => img.category === category);

  const displayImages = filtered;

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div>
      <Helmet>
        <title>{t('gallery.tag')} - Nek Kaam Foundation</title>
        <meta name="description" content="View photos from Nek Kaam Foundation's community projects — mosques, madrasas, water projects, medical camps and more." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-900 text-white py-20 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/15 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">{t('gallery.tag')}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('gallery.title')}</h1>
            <p className="text-green-100 text-xl max-w-2xl">{t('gallery.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-100 py-5 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 flex items-center gap-2 cursor-pointer ${category === cat.key ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'}`}
              >
                {categoryEmojis[cat.key] && <span>{categoryEmojis[cat.key]}</span>}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayImages.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {displayImages.map((image) => {
                const grad = categoryGradients[image.category] || categoryGradients.default;
                return (
                  <motion.div
                    key={image._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.4 }}
                    className="break-inside-avoid cursor-pointer group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    onClick={() => setLightbox(image)}
                  >
                    {image.image || image.imageUrl || (image.images && image.images[0]) ? (
                      <img
                        src={image.image || image.imageUrl || image.images[0].url}
                        alt={image.title}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-56 bg-gradient-to-br ${grad} flex flex-col items-center justify-center text-white group-hover:scale-105 transition-transform duration-500`}>
                        <span className="text-5xl mb-3">{categoryEmojis[image.category] || '🖼️'}</span>
                        <p className="font-bold text-sm text-center px-4">{image.title}</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <p className="text-white font-bold text-sm">{image.title}</p>
                      {image.category && (
                        <span className="text-white/70 text-xs flex items-center gap-1 mt-1">
                          <Tag size={10} /> {categoryLabels[image.category] || image.category}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={14} className="text-white" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🖼️</div>
              <p className="text-gray-500 text-lg">No gallery items found for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.image || lightbox.imageUrl || (lightbox.images && lightbox.images[0]) ? (
                <img
                  src={lightbox.image || lightbox.imageUrl || lightbox.images[0].url}
                  alt={lightbox.title}
                  className="w-full max-h-[80vh] object-contain rounded-2xl"
                />
              ) : (
                <div className={`w-full h-80 bg-gradient-to-br ${categoryGradients[lightbox.category] || categoryGradients.default} rounded-2xl flex items-center justify-center text-white`}>
                  <span className="text-8xl">{categoryEmojis[lightbox.category] || '🖼️'}</span>
                </div>
              )}
              <div className="mt-4 text-center">
                <h3 className="text-white font-bold text-xl">{lightbox.title}</h3>
                {lightbox.description && <p className="text-gray-300 text-sm mt-1">{lightbox.description}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
