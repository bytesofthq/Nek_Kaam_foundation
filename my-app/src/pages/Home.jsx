import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/seo/SEO';
import { useTranslation } from '../i18n/useTranslation';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import AboutPreview from '../components/home/AboutPreview';
import WhatWeDo from '../components/home/WhatWeDo';
import ProjectsPreview from '../components/home/ProjectsPreview';
import ActivitiesPreview from '../components/home/ActivitiesPreview';
import Testimonials from '../components/home/Testimonials';

const Home = () => {
  const { t } = useTranslation();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "Nek Kaam Foundation",
    "url": "https://nekkamfoundation.in",
    "logo": "https://nekkamfoundation.in/FinalNek.png",
    "description": t('seo.homeDesc'),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Akbapur, Biswan",
      "addressLocality": "Sitapur",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "261201",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 97948 20273",
      "contactType": "Enquiry",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  return (
    <>
      <SEO 
        title={t('seo.homeTitle')}
        description={t('seo.homeDesc')}
        keywords="Nek Kaam Foundation, NGO, charity, Schools support, community help, marriage assistance Sitapur, Handpump installation UP, transparent charity India"
        jsonLd={organizationJsonLd}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Hero />
        <Stats />
        <AboutPreview />
        <WhatWeDo />
        <ProjectsPreview />
        <ActivitiesPreview />
        <Testimonials />
      </motion.div>
    </>
  );
};

export default Home;
