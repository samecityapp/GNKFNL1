// app/robots.ts

import { MetadataRoute } from 'next';

// !! ÖNEMLİ !!
// Bu adresin sitemap.ts dosyasında belirttiğin adresle aynı olması gerekiyor.
const BASE_URL = 'https://www.gnkhotels.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*', // Kurallar tüm arama motoru botları için geçerli
        allow: '/', // Sitenin tamamını taramaya izin ver
        disallow: '/admin/', // Gelecekte oluşturabileceğimiz bir admin panelini tarama dışı bırak
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`, // Site haritamızın adresini Google'a burada bildiriyoruz
  };
}
