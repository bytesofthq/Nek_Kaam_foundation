import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import AboutPreview from '../components/home/AboutPreview';
import WhatWeDo from '../components/home/WhatWeDo';
import ProjectsPreview from '../components/home/ProjectsPreview';
import NewsPreview from '../components/home/NewsPreview';
import Testimonials from '../components/home/Testimonials';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Nek Kaam Foundation - Building Trust Through Transparency</title>
        <meta name="description" content="Nek Kaam Foundation helps communities, supports families, strengthens madrasas, and improves mosques through collective efforts. 100% transparent NGO." />
        <meta name="keywords" content="Nek Kaam Foundation, NGO, charity, mosque support, madrasa, community help, Bihar" />
        <meta property="og:title" content="Nek Kaam Foundation" />
        <meta property="og:description" content="Together We Help Communities, Support Families, Strengthen Madrasas, Improve Mosques and Bring Positive Change." />
        <meta property="og:type" content="website" />
      </Helmet>

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
        <NewsPreview />
        <Testimonials />
      </motion.div>
    </>
  );
};

export default Home;
