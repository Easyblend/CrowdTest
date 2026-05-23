import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://crowdtest.dev/sitemap.xml',
    host: 'https://crowdtest.dev',
  };
}
