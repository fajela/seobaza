import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/*?_rsc=',
    },
    sitemap: 'https://seobaza.com.ua/sitemap.xml',
  }
}
