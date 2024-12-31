import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://moneybowl.xyz',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://moneybowl.xyz/international',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}