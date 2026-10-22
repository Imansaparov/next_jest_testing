import type { MetadataRoute } from 'next';

import { isProduction, siteUrl } from '@/shared/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      ...(isProduction ? { allow: '/' } : { disallow: '/' }),
    },
    ...(isProduction ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
