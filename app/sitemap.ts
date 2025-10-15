import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hostilian.org';
  const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'cs', 'uk', 'vi', 'tr', 'ru', 'pl', 'ar', 'zh'];
  const currentDate = new Date();

  // Static pages that exist for all languages
  const staticPages = [
    '',           // Home
    '/request',   // Request delivery
    '/track',     // Track delivery
    '/help',      // Help & FAQ
    '/about',     // About us
    '/contact',   // Contact
    '/privacy',   // Privacy policy
    '/terms',     // Terms of service
    '/courier/register', // Courier registration
    '/courier/login',    // Courier login
  ];

  // Generate URLs for all language combinations
  const urls: MetadataRoute.Sitemap = [];

  // Add default language pages
  staticPages.forEach(page => {
    urls.push({
      url: `${baseUrl}${page}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: page === '' ? 1.0 : 0.8,
    });
  });

  // Add localized pages
  languages.forEach(lang => {
    staticPages.forEach(page => {
      urls.push({
        url: `${baseUrl}/${lang}${page}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            languages.map(l => [l, `${baseUrl}/${l}${page}`])
          ),
        },
      });
    });
  });

  return urls;
}
