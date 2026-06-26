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
  extraJsonLd,
}) => {
  const { language } = useLanguage();
  
  // Default values
  const defaultTitle = 'Nek Kaam Foundation - Building Trust Through Transparency | Akbapur Biswan Sitapur UP';
  const defaultDescription = language === 'hi' 
    ? 'नेक काम फाउंडेशन - अकबरपुर बिसवां सीतापुर उत्तर प्रदेश। गरीब और जरूरतमंद परिवारों की मदद, स्कूलों में सुधार और समाज में सकारात्मक बदलाव। 100% पारदर्शी NGO।'
    : 'Nek Kaam Foundation - NGO based in Akbapur, Biswan, Sitapur, Uttar Pradesh. Helping underprivileged families, schools, and communities with 100% financial transparency.';
  
  const siteName = 'Nek Kaam Foundation';
  
  // Build clean absolute URLs
  const origin = 'https://nekkamfoundation.in';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentUrl = canonicalUrl || `${origin}${pathname}`;
  
  // Resolve final metadata strings
  const finalTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  
  // Base og:image fallback
  const finalOgImage = ogImage || `${origin}/FinalNek.png`;
  
  // Default keywords that always appear
  const defaultKeywords = 'Nek Kaam Foundation, nekkamfoundation, nek kam foundation, NGO Akbapur,nek kam foundation akbapur,nek kam foundation biswan,nek kam foundation sitapur,nekkamfoundation.in,nekkamfoundation akbapur,nekkamfoundation biswan,nekkamfoundation sitapur, Nek Kaam Foundation Akbapur, Nek Kaam Foundation Biswan, Nek Kaam Foundation Sitapur, nekkamfoundation Akbapur, nekkamfoundation Biswan, nekkamfoundation Sitapur, Nek Kam Foundation Akbapur, Nek Kam Foundation Biswan, Nek Kam Foundation Sitapur, nek kam foundation akbapur, nek kam foundation biswan, nek kam foundation sitapur, NGO Akbapur, NGO Biswan, NGO Sitapur, charity Uttar Pradesh, transparent NGO India, community service UP, نیک کام فاؤنڈیشن';
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content={robots} />
      <meta name="author" content="Nek Kaam Foundation" />
      <meta name="copyright" content="Nek Kaam Foundation" />
      <meta name="language" content={language === 'hi' ? 'Hindi' : 'English'} />
      
      {/* Geo-targeting - Critical for local SEO */}
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Akbapur, Biswan, Sitapur, Uttar Pradesh" />
      <meta name="geo.position" content="27.1235;80.9876" />
      <meta name="ICBM" content="27.1235, 80.9876" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={ogTitle || finalTitle} />
      <meta property="og:description" content={ogDescription || finalDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={language === 'hi' ? 'hi_IN' : 'en_IN'} />
      <meta property="og:locale:alternate" content={language === 'hi' ? 'en_IN' : 'hi_IN'} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || finalTitle} />
      <meta name="twitter:description" content={ogDescription || finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:site" content="@nekkamfoundation" />
      
      {/* Canonical link */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en-IN" href={`${origin}${pathname}`} />
      <link rel="alternate" hrefLang="hi" href={`${origin}${pathname}`} />
      <link rel="alternate" hrefLang="x-default" href={`${origin}${pathname}`} />
      
      {/* HTML Lang attribute updates dynamically */}
      <html lang={language} />

      {/* Primary JSON-LD Structured Data Schema */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
      
      {/* Extra JSON-LD - supports single object or array of schemas */}
      {extraJsonLd && Array.isArray(extraJsonLd)
        ? extraJsonLd.map((schema, i) => (
            <script key={i} type="application/ld+json">
              {JSON.stringify(schema)}
            </script>
          ))
        : extraJsonLd && (
            <script type="application/ld+json">
              {JSON.stringify(extraJsonLd)}
            </script>
          )
      }
    </Helmet>
  );
};

export default SEO;
