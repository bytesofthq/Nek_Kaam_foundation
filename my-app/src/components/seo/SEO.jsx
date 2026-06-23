import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../context/LanguageContext';

const SEO = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  robots = 'index, follow',
  jsonLd,
}) => {
  const { language } = useLanguage();
  
  // Default values
  const defaultTitle = 'Nek Kaam Foundation - Building Trust Through Transparency';
  const defaultDescription = language === 'hi' 
    ? 'गरीब और जरूरतमंद परिवारों की मदद करने, स्कूलों में सुधार करने और समाज में सकारात्मक बदलाव लाने के लिए हमारा एक सामूहिक प्रयास।'
    : 'Nek Kaam Foundation helps communities, supports families, strengthens madrasas, and improves schools through collective efforts. 100% transparent NGO.';
  
  const siteName = 'Nek Kaam Foundation';
  
  // Build clean absolute URLs
  const origin = 'https://nekkamfoundation.in';
  const pathname = window.location.pathname || '';
  const currentUrl = canonicalUrl || `${origin}${pathname}`;
  
  // Resolve final metadata strings
  const finalTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  
  // Base og:image fallback
  const finalOgImage = ogImage || `${origin}/FinalNek.png`;
  
  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={ogTitle || title || siteName} />
      <meta property="og:description" content={ogDescription || finalDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title || siteName} />
      <meta name="twitter:description" content={ogDescription || finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      
      {/* Canonical link */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en" href={`${origin}${pathname}`} />
      <link rel="alternate" hrefLang="hi" href={`${origin}${pathname}`} />
      <link rel="alternate" hrefLang="x-default" href={`${origin}${pathname}`} />
      
      {/* HTML Lang attribute updates dynamically */}
      <html lang={language} />

      {/* JSON-LD Structured Data Schema */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
