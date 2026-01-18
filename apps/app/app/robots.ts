import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/waitlist',
        ],
        disallow: [
          '/dashboard',
          '/api',
          '/admin',
        ],
      },
    ],
    sitemap: 'https://crowdtest.dev/sitemap.xml',
  };
}
