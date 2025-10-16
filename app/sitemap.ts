// app/sitemap.ts

import { MetadataRoute } from 'next';
import { db } from '@/lib/db'; // Veritabanı fonksiyonlarımızı import ediyoruz

// !! ÖNEMLİ !!
// Proje canlıya alındığında buraya sitenin gerçek alan adını yazacağız.
// Şimdilik bir yer tutucu olarak kalabilir.
const BASE_URL = 'https://www.gnkhotels.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Veritabanından tüm otelleri çekiyoruz.
  // Sadece yayınlanmış ve silinmemiş otelleri çeken bir fonksiyon kullanmak daha verimli olur.
  // Şimdilik getAll() olduğunu varsayıyoruz.
  const hotels = await db.hotels.getAll();

  // 2. Çektiğimiz her otel için bir sitemap URL'i oluşturuyoruz.
  const hotelUrls = hotels.map(hotel => ({
    url: `${BASE_URL}/otel/${hotel.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Statik sayfalarımızı (Ana Sayfa, Arama Sayfası vb.) listeye manuel ekliyoruz.
  const staticUrls = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }
  ];

  // 4. Statik ve dinamik tüm URL'leri birleştirip Next.js'e sunuyoruz.
  return [...staticUrls, ...hotelUrls];
}
