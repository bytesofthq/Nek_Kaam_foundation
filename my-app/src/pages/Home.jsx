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

  // NGO Organization Schema - richly described for Google Knowledge Panel
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["NGO", "Organization"],
    "@id": "https://nekkamfoundation.in/#organization",
    "name": "Nek Kaam Foundation",
    "alternateName": ["Nek Kam Foundation", "nekkamfoundation", "نیک کام فاؤنڈیشن", "नेक काम फाउंडेशन"],
    "url": "https://nekkamfoundation.in",
    "logo": {
      "@type": "ImageObject",
      "url": "https://nekkamfoundation.in/FinalNek.png",
      "width": 512,
      "height": 512
    },
    "image": "https://nekkamfoundation.in/FinalNek.png",
    "description": "Nek Kaam Foundation is a 100% transparent charitable NGO based in Akbapur, Biswan, Sitapur, Uttar Pradesh. Founded by Abdur Rahman, we help underprivileged families with marriage assistance, medical aid, school support, clean water, and disaster relief.",
    "foundingDate": "2025",
    "founder": [
      {
        "@type": "Person",
        "name": "Abdur Rahman",
        "jobTitle": "Founder & President",
        "url": "https://nekkamfoundation.in/committee"
      },
      {
        "@type": "Person",
        "name": "Mohd Nehal",
        "jobTitle": "Co-Founder",
        "url": "https://nekkamfoundation.in/committee"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Akbapur, Biswan",
      "addressLocality": "Sitapur",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "261201",
      "addressCountry": "IN"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Sitapur"
      },
      {
        "@type": "City",
        "name": "Biswan"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Uttar Pradesh"
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-97948-20273",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Urdu"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+91-70077-65521",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    ],
    "email": "abdurrahman.mohdusman@gmail.com",
    "sameAs": [
      "https://nekkamfoundation.in"
    ],
    "knowsAbout": [
      "Marriage Assistance",
      "Medical Aid",
      "School Support",
      "Clean Water Projects",
      "Disaster Relief",
      "Community Development",
      "Charity Transparency"
    ],
    "nonprofitStatus": "Nonprofit501c3",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Community Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Marriage Assistance for poor families" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Medical Aid and Health Camps" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "School and Madrasa Support" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Clean Water / Handpump Installation" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Disaster and Emergency Relief" } }
      ]
    }
  };

  // Website/Sitelinks Search Box Schema
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://nekkamfoundation.in/#website",
    "url": "https://nekkamfoundation.in",
    "name": "Nek Kaam Foundation",
    "description": "Official website of Nek Kaam Foundation - NGO in Akbapur, Biswan, Sitapur, UP",
    "inLanguage": ["en", "hi"],
    "publisher": {
      "@id": "https://nekkamfoundation.in/#organization"
    }
  };

  // FAQ Schema - captures "who is founder" type queries
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who is the founder of Nek Kaam Foundation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nek Kaam Foundation was founded by Abdur Rahman, who serves as the Founder & President. Mohd Nehal is the Co-Founder. The foundation is based in Akbapur, Biswan, Sitapur, Uttar Pradesh."
        }
      },
      {
        "@type": "Question",
        "name": "Who is the president of Nek Kaam Foundation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Abdur Rahman is the Founder and President of Nek Kaam Foundation. He has been serving the community for years with dedication and compassion."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Nek Kaam Foundation located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nek Kaam Foundation is located in Akbapur, Biswan, Sitapur, Uttar Pradesh, India - 261201. Contact: +91 97948 20273."
        }
      },
      {
        "@type": "Question",
        "name": "What does Nek Kaam Foundation do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nek Kaam Foundation provides marriage assistance to poor families, medical aid and health camps, school and madrasa support, handpump and clean water installation, community cleaning drives, and disaster/emergency relief in Sitapur and surrounding areas of Uttar Pradesh."
        }
      },
      {
        "@type": "Question",
        "name": "How to donate to Nek Kaam Foundation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can donate to Nek Kaam Foundation via UPI. Visit https://nekkamfoundation.in/donate for UPI ID and QR code. All donations are 100% transparent and publicly reported."
        }
      },
      {
        "@type": "Question",
        "name": "Is Nek Kaam Foundation transparent about funds?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Nek Kaam Foundation maintains 100% financial transparency. All funds received and utilized are publicly available in the Transparency Center on their website at https://nekkamfoundation.in/transparency."
        }
      }
    ]
  };

  return (
    <>
      <SEO 
        title="Nek Kaam Foundation - NGO in Akbapur Biswan Sitapur UP | 100% Transparent Charity"
        description="Nek Kaam Foundation | nekkamfoundation | Nek Kam Foundation Akbapur, Biswan, Sitapur, UP. Founded by Abdur Rahman. Marriage assistance, medical aid, school support, clean water. 100% transparent NGO."
        keywords="Nek Kaam Foundation, Nek Kam Foundation, nekkamfoundation, nek kaam foundation akbapur, nek kaam foundation sitapur, nek kaam foundation biswan, who is founder of nek kaam foundation, who is president of nek kaam foundation, Abdur Rahman NGO, NGO Sitapur, charity Biswan, NGO Akbapur, transparent NGO UP, marriage assistance NGO, medical aid Sitapur, school support UP, handpump installation UP, disaster relief Uttar Pradesh, community NGO India"
        jsonLd={organizationJsonLd}
        extraJsonLd={[websiteJsonLd, faqJsonLd]}
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
