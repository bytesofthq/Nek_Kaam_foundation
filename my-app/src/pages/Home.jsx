import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import AboutPreview from '../components/home/AboutPreview';
import WhatWeDo from '../components/home/WhatWeDo';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Nek Kaam Foundation - Building Trust Through Transparency</title>
        <meta name="description" content="Nek Kaam Foundation helps communities, supports families, strengthens madrasas, and improves mosques through collective efforts." />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero />
        <Stats />
        <AboutPreview />
        <WhatWeDo />
      </motion.div>
    </>
  );
};

export default Home;
