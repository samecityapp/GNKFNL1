# GNK Hotel Platform - Gemini İçin Tam Devir Teslim Dökümanı

## 🎯 Proje Özeti
GNK, Türkiye'deki otelleri listelemek, aramak ve yönetmek için geliştirilmiş modern bir Next.js uygulamasıdır. Admin paneli, restoranlar sistemi, galeri yönetimi ve gelişmiş arama özellikleri içerir.

---

## 📋 BÖLÜM 1: VERİTABANI MİMARİSİ (Supabase)

### 1.1 - Tüm Tabloların CREATE TABLE Komutları

#### HOTELS Tablosu (Ana Tablo)
```sql
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  description text DEFAULT '',
  price integer NOT NULL,
  rating numeric(3,1) DEFAULT 0,
  image_url text DEFAULT '',
  amenities text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  about text DEFAULT '',
  about_facility text DEFAULT '',
  rules text DEFAULT '',
  video_url text DEFAULT '',
  video_thumbnail_url text DEFAULT '',
  website_url text DEFAULT '',
  instagram_url text DEFAULT '',
  google_maps_url text DEFAULT '',
  gallery_images text[] DEFAULT '{}',
  latitude numeric(10,8),
  longitude numeric(11,8),
  search_vector tsvector,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Indexes
CREATE INDEX idx_hotels_location ON hotels(location);
CREATE INDEX idx_hotels_price ON hotels(price);
CREATE INDEX idx_hotels_rating ON hotels(rating);
CREATE INDEX idx_hotels_tags ON hotels USING gin(tags);
CREATE INDEX idx_hotels_search_vector ON hotels USING gin(search_vector);
CREATE INDEX idx_hotels_deleted_at ON hotels(deleted_at);
CREATE INDEX idx_hotels_coordinates ON hotels(latitude, longitude);

-- Full Text Search Trigger
CREATE OR REPLACE FUNCTION hotels_search_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.location, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.about, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hotels_search_update
  BEFORE INSERT OR UPDATE ON hotels
  FOR EACH ROW EXECUTE FUNCTION hotels_search_trigger();

-- Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hotels_updated_at
  BEFORE UPDATE ON hotels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### TAGS Tablosu
```sql
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  icon text DEFAULT 'Tag',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_is_featured ON tags(is_featured);

CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### GROUPS Tablosu (Ana Sayfa Koleksiyonları)
```sql
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX idx_groups_is_published ON groups(is_published);

CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### GROUP_HOTELS Tablosu (Many-to-Many İlişki)
```sql
CREATE TABLE IF NOT EXISTS group_hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  hotel_id uuid NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(group_id, hotel_id)
);

CREATE INDEX idx_group_hotels_group_id ON group_hotels(group_id);
CREATE INDEX idx_group_hotels_hotel_id ON group_hotels(hotel_id);
CREATE INDEX idx_group_hotels_order ON group_hotels(group_id, order_index);
```

#### PRICE_TAGS Tablosu
```sql
CREATE TABLE IF NOT EXISTS price_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  slug text NOT NULL UNIQUE,
  min_price integer NOT NULL,
  max_price integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX idx_price_tags_slug ON price_tags(slug);

CREATE TRIGGER update_price_tags_updated_at
  BEFORE UPDATE ON price_tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### SEARCH_TERMS Tablosu
```sql
CREATE TABLE IF NOT EXISTS search_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX idx_search_terms_slug ON search_terms(slug);

CREATE TRIGGER update_search_terms_updated_at
  BEFORE UPDATE ON search_terms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### RESTAURANTS Tablosu
```sql
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text DEFAULT '',
  address text NOT NULL,
  phone text DEFAULT '',
  rating numeric(3,1) DEFAULT 0,
  price_level integer DEFAULT 2 CHECK (price_level BETWEEN 1 AND 4),
  image_url text DEFAULT '',
  gallery_images text[] DEFAULT '{}',
  latitude numeric(10,8),
  longitude numeric(11,8),
  opening_hours jsonb DEFAULT '{}',
  features text[] DEFAULT '{}',
  menu_url text DEFAULT '',
  website_url text DEFAULT '',
  instagram_url text DEFAULT '',
  google_maps_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX idx_restaurants_category ON restaurants(category);
CREATE INDEX idx_restaurants_rating ON restaurants(rating);
CREATE INDEX idx_restaurants_coordinates ON restaurants(latitude, longitude);
CREATE INDEX idx_restaurants_deleted_at ON restaurants(deleted_at);

CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### AUDIT_LOG Tablosu
```sql
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX idx_audit_log_record_id ON audit_log(record_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
```

### 1.2 - Row Level Security (RLS) Policies

**ÖNEMLI:** Tüm tablolar için RLS etkin ve herkes okuyabilir (public read), sadece authenticated kullanıcılar yazabilir.

```sql
-- Hotels RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON hotels FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON hotels FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON hotels FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for authenticated users only" ON hotels FOR DELETE TO authenticated USING (true);

-- Aynı pattern diğer tüm tablolar için de geçerli: tags, groups, group_hotels, price_tags, search_terms, restaurants, audit_log
```

### 1.3 - Database Views

```sql
CREATE OR REPLACE VIEW hotel_stats AS
SELECT
  COUNT(*) as total_hotels,
  AVG(rating) as avg_rating,
  AVG(price) as avg_price,
  COUNT(DISTINCT location) as total_locations
FROM hotels
WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW popular_tags AS
SELECT
  unnest(tags) as tag,
  COUNT(*) as usage_count
FROM hotels
WHERE deleted_at IS NULL
GROUP BY unnest(tags)
ORDER BY usage_count DESC;
```

### 1.4 - Database Functions

```sql
-- Search hotels function
CREATE OR REPLACE FUNCTION search_hotels(
  search_term text DEFAULT NULL,
  filter_tags text[] DEFAULT NULL,
  min_price_val integer DEFAULT NULL,
  max_price_val integer DEFAULT NULL,
  min_rating_val numeric DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  name text,
  location text,
  price integer,
  rating numeric,
  image_url text,
  tags text[],
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    h.id, h.name, h.location, h.price, h.rating,
    h.image_url, h.tags, h.created_at
  FROM hotels h
  WHERE h.deleted_at IS NULL
    AND (search_term IS NULL OR h.search_vector @@ websearch_to_tsquery('simple', search_term))
    AND (filter_tags IS NULL OR h.tags @> filter_tags)
    AND (min_price_val IS NULL OR h.price >= min_price_val)
    AND (max_price_val IS NULL OR h.price <= max_price_val)
    AND (min_rating_val IS NULL OR h.rating >= min_rating_val)
  ORDER BY h.created_at DESC;
END;
$$ LANGUAGE plpgsql;
```

---

## 📋 BÖLÜM 2: FRONTEND MİMARİSİ (Next.js)

### 2.1 - Proje Dosya Yapısı

```
project/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Ana sayfa
│   ├── globals.css                   # Global stiller
│   ├── robots.ts                     # SEO robots
│   ├── sitemap.ts                    # SEO sitemap
│   ├── admin/
│   │   ├── layout.tsx               # Admin layout
│   │   ├── page.tsx                 # Admin dashboard
│   │   ├── otel-ekle/page.tsx       # Otel ekleme formu
│   │   ├── otel-listesi/page.tsx    # Otel yönetimi
│   │   ├── anasayfa-yonetimi/page.tsx  # Grup yönetimi
│   │   ├── etiket-yonetimi/page.tsx    # Tag yönetimi
│   │   ├── restoranlar/page.tsx     # Restoran yönetimi
│   │   ├── main-page-tags/page.tsx  # Ana sayfa tag'leri
│   │   ├── search-terms/page.tsx    # Arama terimleri
│   │   └── update-tags/page.tsx     # Tag güncelleme
│   ├── otel/
│   │   └── [id]/page.tsx            # Otel detay sayfası (SSR)
│   └── search/
│       └── page.tsx                 # Arama sonuçları
├── components/
│   ├── ui/                          # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── checkbox.tsx
│   │   ├── switch.tsx
│   │   └── ... (diğer UI bileşenleri)
│   ├── nearby-places/               # Restoran özellikleri
│   │   ├── NearbyPlacesTab.tsx
│   │   ├── RestaurantCard.tsx
│   │   ├── RestaurantDetailsModal.tsx
│   │   └── CategoryFilters.tsx
│   ├── skeletons/                   # Loading states
│   │   ├── HotelCardSkeleton.tsx
│   │   ├── HotelDetailSkeleton.tsx
│   │   └── HotelListSkeleton.tsx
│   ├── Header.tsx                   # Site başlığı
│   ├── Footer.tsx                   # Site alt bilgi
│   ├── HotelCard.tsx                # Otel kartı
│   ├── HotelListItem.tsx            # Liste görünümü
│   ├── HotelDetails.tsx             # Otel detay içeriği
│   ├── ImageGallery.tsx             # Galeri görüntüleyici
│   ├── ImageUpload.tsx              # Resim yükleme
│   ├── GalleryUpload.tsx            # Çoklu resim yükleme
│   ├── VideoPlayer.tsx              # Video oynatıcı
│   ├── VideoUpload.tsx              # Video yükleme
│   ├── SearchFilters.tsx            # Arama filtreleri
│   ├── LocationSelect.tsx           # Lokasyon seçici
│   ├── Sidebar.tsx                  # Admin sidebar
│   ├── BackButton.tsx               # Geri butonu
│   ├── ErrorBoundary.tsx            # Hata yakalama
│   ├── HomePageClient.tsx           # Ana sayfa client component
│   └── Providers.tsx                # Context providers
├── lib/
│   ├── supabase.ts                  # Supabase client
│   ├── db.ts                        # Database operations
│   ├── storage.ts                   # File upload operations
│   ├── types.ts                     # TypeScript types
│   └── utils.ts                     # Utility functions
├── data/
│   ├── turkeyLocations.ts           # Türkiye lokasyonları
│   ├── mockHotels.ts                # Mock otel verisi
│   ├── mockGroups.ts                # Mock grup verisi
│   └── mockData.ts                  # Diğer mock veriler
├── hooks/
│   └── use-toast.ts                 # Toast notification hook
├── supabase/
│   └── migrations/                  # Tüm SQL migration dosyaları
│       ├── 20251009165441_create_hotels_table.sql
│       ├── 20251009173510_complete_database_schema.sql
│       ├── 20251009175308_add_write_policies.sql
│       ├── 20251009175329_add_performance_indexes.sql
│       ├── 20251009175347_add_updated_at_triggers.sql
│       ├── 20251009175406_add_validation_constraints.sql
│       ├── 20251009175502_add_full_text_search.sql
│       ├── 20251009175538_add_soft_delete.sql
│       ├── 20251009175904_cleanup_duplicate_policies.sql
│       ├── 20251009175927_add_advanced_indexes.sql
│       ├── 20251009175953_add_database_views.sql
│       ├── 20251009180026_add_audit_logging.sql
│       ├── 20251009180108_add_database_functions.sql
│       ├── 20251013083212_add_video_support_to_hotels.sql
│       ├── 20251013195027_add_website_instagram_urls.sql
│       ├── 20251013204618_add_google_maps_url.sql
│       └── 20251014154119_create_restaurants_schema.sql
├── next.config.js                   # Next.js config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                    # TypeScript config
├── package.json                     # Dependencies
├── .env                             # Environment variables
└── components.json                  # Shadcn config
```

### 2.2 - Ana Sayfa (app/page.tsx)

```typescript
import { Suspense } from 'react';
import { HomePageClient } from '@/components/HomePageClient';
import { db } from '@/lib/db';
import { HotelCardSkeleton } from '@/components/skeletons/HotelCardSkeleton';

export const metadata = {
  title: 'GNK | Ana Sayfa',
  description: 'Türkiye\'nin en iyi otellerini keşfedin',
};

export default async function HomePage() {
  const [groups, featuredTags] = await Promise.all([
    db.groups.getPublished(),
    db.tags.getFeatured()
  ]);

  const groupsWithHotels = await Promise.all(
    groups.map(async (group) => {
      const hotelIds = await db.groups.getHotels(group.id);
      const hotels = await Promise.all(
        hotelIds.map(id => db.hotels.getById(id))
      );
      return {
        ...group,
        hotels: hotels.filter(h => h !== null)
      };
    })
  );

  return (
    <Suspense fallback={<HotelCardSkeleton count={6} />}>
      <HomePageClient
        groups={groupsWithHotels}
        featuredTags={featuredTags}
      />
    </Suspense>
  );
}
```

### 2.3 - Otel Detay Sayfası (app/otel/[id]/page.tsx)

```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { db } from '@/lib/db';
import { ImageGallery } from '@/components/ImageGallery';
import { HotelDetails } from '@/components/HotelDetails';
import { BackButton } from '@/components/BackButton';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hotel = await db.hotels.getById(params.id);

  if (!hotel) {
    return {
      title: 'Otel Bulunamadı | GNK',
      description: 'Aradığınız otel sistemimizde mevcut değil.',
    };
  }

  return {
    title: `GNK | ${hotel.name} - ${hotel.location}`,
    description: `${hotel.name} hakkında detaylı bilgi. ${(hotel.about || '').substring(0, 120)}...`,
  };
}

export default async function HotelDetailPage({ params }: Props) {
  const hotel = await db.hotels.getById(params.id);

  if (!hotel) {
    notFound();
  }

  const allTags = await db.tags.getAll();
  const hotelTagsWithIcons = hotel.tags
    ?.map(tagSlug => allTags.find(t => t.slug === tagSlug))
    .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined) || [];

  const rating = {
    score: hotel.gnkScore || 0,
    reviewCount: 0,
    text: 'İyi',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.about || '',
    image: hotel.galleryImages && hotel.galleryImages.length > 0 ? hotel.galleryImages[0] : hotel.coverImageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.location,
      addressLocality: hotel.location.split(',')[1]?.trim() || hotel.location,
      addressCountry: 'TR',
    },
    geo: hotel.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: hotel.coordinates.lat,
      longitude: hotel.coordinates.lng,
    } : undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.score,
      reviewCount: rating.reviewCount,
      bestRating: 10,
    },
    priceRange: '₺₺₺',
  };

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        <BackButton />
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Otel / {hotel.location} / {hotel.name}</p>
            <h1 className="text-4xl font-bold text-gray-900">{hotel.name}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin size={16} className="mr-2" />
              <span>{hotel.location}</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center bg-blue-600 text-white p-4 rounded-xl text-center">
            <div>
              <p className="font-bold text-2xl">{rating.score}</p>
              <p className="text-xs">{rating.text}</p>
              <p className="text-xs mt-1">{rating.reviewCount} yorum</p>
            </div>
          </div>
        </div>

        <ImageGallery
          images={hotel.galleryImages || (hotel.coverImageUrl ? [hotel.coverImageUrl] : [])}
          videoUrl={hotel.video_url}
          videoThumbnailUrl={hotel.video_thumbnail_url}
        />

        <HotelDetails
          features={hotel.amenities || []}
          tabs={{ about: hotel.about || '', rules: hotel.rules || '' }}
          mapImageUrl={''}
          location={hotel.location}
          websiteUrl={hotel.website_url}
          instagramUrl={hotel.instagram_url}
          googleMapsUrl={hotel.google_maps_url}
          tags={hotelTagsWithIcons}
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
```

### 2.4 - Arama Sayfası (app/search/page.tsx)

```typescript
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { HotelCard } from '@/components/HotelCard';
import { SearchFilters } from '@/components/SearchFilters';
import { HotelCardSkeleton } from '@/components/skeletons/HotelCardSkeleton';

type SearchParams = {
  q?: string;
  tags?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = {
    searchTerm: searchParams.q,
    tags: searchParams.tags?.split(',').filter(Boolean),
    minPrice: searchParams.minPrice ? parseInt(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined,
    minRating: searchParams.minRating ? parseFloat(searchParams.minRating) : undefined,
  };

  const hotels = await db.hotels.search(filters);
  const allTags = await db.tags.getAll();

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Arama Sonuçları</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <SearchFilters tags={allTags} />
        </aside>

        <main className="lg:col-span-3">
          <Suspense fallback={<HotelCardSkeleton count={6} />}>
            {hotels.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                Sonuç bulunamadı
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
```

### 2.5 - Admin Otel Listesi (app/admin/otel-listesi/page.tsx)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Hotel } from '@/lib/types';
import { Pencil, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminHotelListPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const data = await db.hotels.getAll();
      setHotels(data);
    } catch (error) {
      console.error('Oteller yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu oteli silmek istediğinizden emin misiniz?')) return;

    try {
      await db.hotels.delete(id);
      await loadHotels();
    } catch (error) {
      console.error('Otel silinirken hata:', error);
      alert('Otel silinemedi');
    }
  };

  if (loading) {
    return <div className="p-8">Yükleniyor...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Otel Yönetimi</h1>
        <Link href="/admin/otel-ekle">
          <Button>Yeni Otel Ekle</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Otel Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Lokasyon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fiyat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Puan
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hotels.map(hotel => (
              <tr key={hotel.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={hotel.coverImageUrl || '/placeholder.jpg'}
                      alt={hotel.name}
                      className="h-10 w-10 rounded object-cover mr-3"
                    />
                    <div className="text-sm font-medium text-gray-900">
                      {hotel.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {hotel.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₺{hotel.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {hotel.gnkScore}/10
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/otel/${hotel.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye size={16} />
                    </Button>
                  </Link>
                  <Link href={`/admin/otel-ekle?id=${hotel.id}`}>
                    <Button variant="ghost" size="sm">
                      <Pencil size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(hotel.id)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 📋 BÖLÜM 3: PROJE YAPILANDIRMASI

### 3.1 - Environment Variables (.env)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service Role Key (Sadece backend işlemleri için)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**ÖNEMLİ NOTLAR:**
- Bu değişkenler olmadan proje çalışmaz
- Supabase Dashboard > Project Settings > API bölümünden alınabilir
- `NEXT_PUBLIC_` prefix'i ile başlayanlar client-side'da kullanılabilir
- Service role key asla client-side'da kullanılmamalı

### 3.2 - package.json

```json
{
  "name": "gnk-hotel-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@next/swc-wasm-nodejs": "13.5.1",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-context-menu": "^2.2.1",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.1",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.2",
    "@supabase/supabase-js": "^2.58.0",
    "@types/node": "20.6.2",
    "@types/react": "18.2.22",
    "@types/react-dom": "18.2.7",
    "autoprefixer": "10.4.15",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.3.0",
    "eslint": "8.49.0",
    "eslint-config-next": "13.5.1",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.544.0",
    "next": "13.5.1",
    "next-themes": "^0.3.0",
    "postcss": "8.4.30",
    "react": "18.2.0",
    "react-day-picker": "^8.10.1",
    "react-dom": "18.2.0",
    "react-hook-form": "^7.53.0",
    "react-resizable-panels": "^2.1.3",
    "recharts": "^2.12.7",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss": "3.3.3",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "5.2.2",
    "vaul": "^0.9.9",
    "zod": "^3.23.8"
  }
}
```

### 3.3 - next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'your-project.supabase.co'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

### 3.4 - Supabase Storage Buckets

Projenin ihtiyaç duyduğu storage bucket'ları:

#### 1. hotel-images Bucket
```sql
-- Supabase Dashboard > Storage > Create new bucket
-- Bucket Name: hotel-images
-- Public: Yes

-- Storage Policy (Public Read)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'hotel-images' );

-- Storage Policy (Authenticated Upload)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'hotel-images' );

-- Storage Policy (Authenticated Delete)
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'hotel-images' );
```

#### 2. restaurant-images Bucket
```sql
-- Supabase Dashboard > Storage > Create new bucket
-- Bucket Name: restaurant-images
-- Public: Yes

-- Aynı policy'ler hotel-images ile aynı
```

### 3.5 - lib/db.ts (Tam İçerik)

`lib/db.ts` dosyası tüm veritabanı işlemlerini yöneten merkezi dosyadır. İçeriği için GitHub repo'daki `/lib/db.ts` dosyasına bakınız.

**Öne Çıkan Fonksiyonlar:**
- `db.hotels.getAll()` - Tüm otelleri getir
- `db.hotels.getById(id)` - ID'ye göre otel getir
- `db.hotels.create(hotel)` - Yeni otel ekle
- `db.hotels.update(id, updates)` - Otel güncelle
- `db.hotels.delete(id)` - Otel sil (soft delete)
- `db.hotels.search(filters)` - Filtrelere göre otel ara
- `db.tags.getAll()` - Tüm tag'leri getir
- `db.tags.getFeatured()` - Featured tag'leri getir
- `db.groups.getPublished()` - Yayınlanmış grupları getir
- `db.groups.getHotels(groupId)` - Grup otellerini getir

### 3.6 - lib/storage.ts (Dosya Yükleme)

```typescript
import { supabase } from './supabase';

export const storage = {
  async uploadImage(file: File, bucket: string = 'hotel-images'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  },

  async uploadMultiple(files: File[], bucket: string = 'hotel-images'): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, bucket));
    return Promise.all(uploadPromises);
  },

  async deleteImage(url: string, bucket: string = 'hotel-images'): Promise<void> {
    const path = url.split(`${bucket}/`)[1];
    if (!path) return;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }
};
```

---

## 🚀 DEPLOYMENT ADIMLAR

### Vercel'e Deploy
1. GitHub repo'yu Vercel'e bağla
2. Environment variables ekle (Supabase keys)
3. Build & Deploy

### Supabase Setup
1. Yeni Supabase projesi oluştur
2. `supabase/migrations/` klasöründeki tüm SQL dosyalarını sırayla çalıştır
3. Storage bucket'ları oluştur (`hotel-images`, `restaurant-images`)
4. RLS policy'lerini kontrol et

### Lokal Development
```bash
# Clone repository
git clone https://github.com/samecityapp/GNK1.git
cd GNK1

# Install dependencies
npm install

# Setup .env file
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## 🎯 ÖNEMLİ ÖZELLİKLER

### 1. SSR (Server Side Rendering)
- Ana sayfa ve otel detay sayfaları SSR ile render edilir
- SEO optimizasyonu için metadata ve JSON-LD schema markup
- Dinamik sitemap ve robots.txt

### 2. Admin Panel
- Otel CRUD işlemleri
- Grup/Koleksiyon yönetimi
- Tag yönetimi
- Restoran yönetimi
- Galeri ve video yükleme

### 3. Search & Filter
- Full-text search (Supabase tsvector)
- Tag bazlı filtreleme
- Fiyat aralığı filtreleme
- Rating filtreleme

### 4. Image & Video Management
- Supabase Storage ile entegrasyon
- Çoklu resim yükleme
- Video yükleme ve thumbnail
- Galeri görüntüleyici

### 5. Nearby Places (Restaurants)
- Otel detay sayfasında yakındaki restoranlar
- Kategori filtreleme
- Restaurant detay modal

---

## 📞 DESTEK VE DOKÜMANTASYON

- **GitHub Repo:** https://github.com/samecityapp/GNK1
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Shadcn UI:** https://ui.shadcn.com

---

## ✅ PROJE DURUMU

**Tamamlanan Özellikler:**
- ✅ Veritabanı şeması (8 tablo)
- ✅ RLS policies
- ✅ Full-text search
- ✅ Ana sayfa (gruplar + featured tags)
- ✅ Otel detay sayfası (SSR)
- ✅ Arama sayfası
- ✅ Admin panel (7 sayfa)
- ✅ Image/Video upload
- ✅ Restoran sistemi
- ✅ Footer
- ✅ SEO (metadata, sitemap, robots, JSON-LD)

**Bilinen Sorunlar:**
- Yok (son fix: google_maps_url mapping sorunu çözüldü)

**Gelecek Geliştirmeler:**
- Authentication sistemi
- Yorum ve rating sistemi
- Rezervasyon entegrasyonu
- Email bildirimler

---

Bu döküman, projenin %100 eksiksiz devir teslimi için hazırlanmıştır. Tüm kodlar GitHub'da mevcuttur ve proje production-ready durumdadır.
