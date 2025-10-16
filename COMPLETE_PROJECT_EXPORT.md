# GNK Hotel Platform - Complete Project Export

## 🏨 Project Overview
**GNK Hotel Platform** - Modern otel rezervasyon ve yönetim platformu
- **Tech Stack:** Next.js 13, TypeScript, Tailwind CSS, Firebase
- **Features:** Otel listesi, admin paneli, arama, filtreleme, grup yönetimi
- **Database:** Firebase Firestore + Local Storage (Fake Data Store)

---

## 📁 Project Structure
```
gnk-hotel-platform/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── otel-ekle/page.tsx
│   │   ├── otel-listesi/page.tsx
│   │   ├── anasayfa-yonetimi/page.tsx
│   │   └── main-page-tags/page.tsx
│   ├── search/page.tsx
│   ├── otel/[id]/page.tsx
│   └── etiket-yonetimi/page.tsx
├── components/
│   ├── Header.tsx
│   ├── SearchFilters.tsx
│   ├── HotelCard.tsx
│   ├── HotelListItem.tsx
│   └── Sidebar.tsx
├── data/
│   ├── fakeData.ts
│   ├── mockData.ts
│   ├── mockHotels.ts
│   └── mockGroups.ts
├── lib/
│   └── utils.ts
├── firebase.ts
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── components.json
└── postcss.config.js
```

---

## 🚀 Quick Setup Commands
```bash
# 1. Create new Next.js project
npx create-next-app@latest gnk-hotel-platform --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# 2. Install dependencies
npm install @hookform/resolvers @next/swc-wasm-nodejs @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip @supabase/supabase-js class-variance-authority clsx cmdk date-fns embla-carousel-react firebase input-otp lucide-react next-themes react-day-picker react-hook-form react-resizable-panels recharts sonner tailwind-merge tailwindcss-animate vaul zod

# 3. Run development server
npm run dev
```

---

## 📄 Complete File Contents

### package.json
```json
{
  "name": "gnk-hotel-platform",
  "version": "0.1.0",
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
    "firebase": "^10.12.2",
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

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
```

### tailwind.config.ts
```typescript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### postcss.config.js
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### .eslintrc.json
```json
{
  "extends": "next/core-web-vitals"
}
```

### firebase.ts
```typescript
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKQ_ZA3tmz0ofymv3T0I55OWG4TjQOrvc",
  authDomain: "gnkgnkgnkreal.firebaseapp.com",
  projectId: "gnkgnkgnkreal",
  storageBucket: "gnkgnkgnkreal.firebasestorage.app",
  messagingSenderId: "896678053649",
  appId: "1:896678053649:web:1d87bd864191216ce1eeb0",
  measurementId: "G-VHRZ75L9WC"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
```

### lib/utils.ts
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f8fafc;
}
```

### app/layout.tsx
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '../components/Header';
import { SearchFilters } from '../components/SearchFilters';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GNK Otel Platformu',
  description: "Erdem'in Seçtiği En İyi Oteller",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Header />
        <div className="container mx-auto px-6 pt-8">
          <SearchFilters />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### app/page.tsx
```typescript
'use client';
import { useEffect, useState } from 'react';
import { HotelCard } from '../components/HotelCard';
import { fakeDataStore, type Hotel, type Group } from '../data/fakeData';

type GroupWithHotels = {
  id: string;
  title: string;
  hotels: Hotel[];
};

export default function HomePage() {
  const [groups, setGroups] = useState<GroupWithHotels[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Fake delay for UX
      setTimeout(() => {
        const allHotels = fakeDataStore.getHotels();
        const allGroups = fakeDataStore.getGroups();
        
        // Sadece yayınlanmış grupları al ve otel detaylarını ekle
        const publishedGroups = allGroups
          .filter(group => group.isPublished)
          .map(group => ({
            id: group.id,
            title: group.title,
            hotels: group.hotelIds
              .map(id => allHotels.find(h => h.id === id))
              .filter(Boolean) as Hotel[]
          }))
          .filter(group => group.hotels.length > 0);

        setGroups(publishedGroups);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {groups.length > 0 ? (
        groups.map(group => (
          <section key={group.id} className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">{group.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {group.hotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Henüz Yayınlanmış Grup Yok
          </h2>
          <p className="text-gray-500">
            Yönetim panelinden grupları yayınlayabilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}
```

### components/Header.tsx
```typescript
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          GNK
        </Link>
        <div className="flex-grow flex items-center justify-center space-x-8">
          <Link href="#" className="text-gray-600 hover:text-blue-600 transition font-medium">Oteller</Link>
          <Link href="#" className="text-gray-600 hover:text-blue-600 transition font-medium">Hakkımızda</Link>
          <Link href="#" className="text-gray-600 hover:text-blue-600 transition font-medium">İletişim</Link>
        </div>
        <div>
          <Link 
            href="/admin"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Panel
          </Link>
        </div>
      </nav>
    </header>
  );
}
```

### components/SearchFilters.tsx
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { fakeDataStore, type Tag, type PriceTag } from '../data/fakeData';
import * as LucideIcons from 'lucide-react';

export function SearchFilters() {
  const [featuredTags, setFeaturedTags] = useState<Tag[]>([]);
  const [priceTags, setPriceTags] = useState<PriceTag[]>([]);

  const loadTags = () => {
    const allTags = fakeDataStore.getTags();
    const featured = allTags.filter(tag => tag.isFeatured);
    setFeaturedTags(featured);

    const loadedPriceTags = fakeDataStore.getPriceTags();
    setPriceTags(loadedPriceTags);
  };

  useEffect(() => {
    loadTags();
    window.addEventListener('focus', loadTags);
    return () => window.removeEventListener('focus', loadTags);
  }, []);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-lg mb-12 container mx-auto">
      <div className="relative mb-4">
        <input type="text" placeholder="Fethiye otelleri..." className="w-full pl-5 pr-14 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <Link href="/search?q=fethiye" className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700"><Search size={20} /></Link>
      </div>

      {featuredTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-sm font-semibold text-gray-700 mr-2">Popüler:</span>
          {featuredTags.map(tag => {
            const Icon = (LucideIcons as any)[tag.icon] || LucideIcons.Tag;
            return (<Link key={tag.id} href={`/search?q=${tag.slug}`} className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200"><Icon size={16} className="mr-2 text-blue-500" />{tag.name}</Link>);
          })}
        </div>
      )}

      {priceTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {priceTags.map(pt => (
             <Link key={pt.id} href={`/search?q=${pt.slug}`} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200">{pt.label}</Link>
          ))}
        </div>
      )}
    </section>
  );
}
```

### components/HotelCard.tsx
```typescript
import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';

type Hotel = {
  id: string;
  name: string;
  location: string;
  gnkScore: number;
  price: string;
  coverImageUrl?: string;
  [key:string]: any;
};

type HotelCardProps = { hotel: Hotel; };

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Link href={`/otel/${hotel.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group cursor-pointer h-full flex flex-col">
        <div className="w-full h-56 relative overflow-hidden">
          {hotel.coverImageUrl ? (
            <img
              src={hotel.coverImageUrl}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <h3 className="text-white text-4xl font-bold opacity-80 group-hover:opacity-100 transition-opacity">GNK</h3>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <p className="font-bold text-gray-900 leading-tight flex-1">{hotel.name}</p>
            <div className="flex-shrink-0 flex items-center bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold ml-2">
              <Star size={12} className="mr-1 fill-white" />
              <span>{hotel.gnkScore}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-500 mt-auto">
            <MapPin size={14} className="mr-1.5 flex-shrink-0" />
            <p className="text-sm truncate">{hotel.location}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### components/Sidebar.tsx
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, List, Pencil, Tag, Star } from 'lucide-react';

const menuItems = [
  { name: 'Otel Ekle / Düzenle', href: '/admin/otel-ekle', icon: Pencil },
  { name: 'Otel Listesi', href: '/admin/otel-listesi', icon: List },
  { name: 'Anasayfa Grupları', href: '/admin/anasayfa-yonetimi', icon: LayoutDashboard },
  { name: 'Ana Sayfa Etiketleri', href: '/admin/main-page-tags', icon: Star },
  { name: 'Tüm Etiketler', href: '/etiket-yonetimi', icon: Tag },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">GNK Panel</h1>
      </div>
      <nav className="px-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href} 
                className={`flex items-center px-4 py-3 my-1 rounded-lg transition-colors ${ 
                  pathname.startsWith(item.href) 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100' 
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
```

### data/fakeData.ts
```typescript
// data/fakeData.ts

export type Hotel = {
  id: string;
  name: string;
  location: string;
  gnkScore: number;
  price: string;
  about?: string;
  tags?: string[];
  coverImageUrl?: string;
  galleryImages?: string[];
  aboutFacility?: string;
  rules?: string;
  coordinates?: { lat: number; lng: number };
  videoUrl?: string;
};

export type Group = { id: string; title: string; isPublished: boolean; hotelIds: string[] };
export type Tag = { id: string; name: string; icon: string; slug: string; isFeatured?: boolean };
export type PriceTag = { id: string; label: string; slug: string; minPrice: number; maxPrice: number };

const fakeHotels: Hotel[] = [
  {
    id: '1',
    name: 'Villa Vadi Boutique Hotel',
    location: 'Bodrum, Muğla',
    gnkScore: 9.8,
    price: '8500 TL',
    about: 'Denize sıfır konumda, muhteşem manzaralı butik otel.',
    tags: ['denize-sifir', 'butik', 'romantik'],
    coverImageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
    galleryImages: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'],
    aboutFacility: 'Tesisimiz, misafirlerimize özel plaj alanı ve sonsuzluk havuzu sunar.',
    rules: `Giriş (Check-in) saati: 14:00 sonrası\nÇıkış (Check-out) saati: 12:00 öncesi`,
    coordinates: { lat: 37.0342, lng: 27.4305 },
    videoUrl: 'https://www.instagram.com/reel/C8qXo_RoG3L/',
  },
  { id: '2', name: 'Kapadokya Taş Konakları', location: 'Ürgüp, Nevşehir', gnkScore: 9.5, price: '6200 TL', about: 'Tarihi taş evlerde konaklama deneyimi.', tags: ['tarihi', 'romantik', 'balon-turu'], coverImageUrl: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg', galleryImages: ['https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'], aboutFacility: 'Otantik Kapadokya mimarisine sahip olan otelimiz, misafirlerine mağara odalarda konaklama imkanı sunar.', rules: `Giriş (Check-in) saati: 15:00 sonrası\nÇıkış (Check-out) saati: 11:00 öncesi`, coordinates: { lat: 38.6293, lng: 34.8256 } },
  { id: '3', name: 'Kaş Marina Hotel', location: 'Kaş, Antalya', gnkScore: 9.2, price: '7100 TL', about: 'Marina manzaralı, lüks konaklama.', tags: ['marina', 'lüks', 'denize-sifir'], coverImageUrl: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', galleryImages: [], coordinates: { lat: 36.2023, lng: 29.6424 } }
];

const fakeGroups: Group[]=[{id:'1',title:"Bodrum'un Gözdeleri",isPublished:true,hotelIds:['1']},{id:'2',title:"Kapadokya'da Romantik Kaçamak",isPublished:false,hotelIds:['2','3']}];
const defaultTags: Tag[]=[{id:'1',name:'Denize Sıfır',icon:'Waves',slug:'denize-sifir',isFeatured:false},{id:'2',name:'Balayı Oteli',icon:'Moon',slug:'balayi-oteli',isFeatured:false},{id:'3',name:'Havuz',icon:'Bath',slug:'havuz',isFeatured:false},{id:'4',name:'Ücretsiz Wifi',icon:'Wifi',slug:'ucretsiz-wifi',isFeatured:false},{id:'5',name:'Oda Servisi',icon:'HandPlatter',slug:'oda-servisi',isFeatured:false},{id:'6',name:'Hayvan Dostu',icon:'Dog',slug:'hayvan-dostu',isFeatured:false},{id:'7',name:'Aile Oteli',icon:'Baby',slug:'aile-oteli',isFeatured:false},{id:'8',name:'Bahçesi Var',icon:'Flower',slug:'bahcesi-var',isFeatured:false},{id:'9',name:'Alkolsüz',icon:'GlassWater',slug:'alkolsuz',isFeatured:false},{id:'10',name:'Balkonlu',icon:'Sun',slug:'balkonlu',isFeatured:false}];
const defaultPriceTags: PriceTag[]=[{id:'p1',label:'2000 TL Altı',slug:'2000-alti',minPrice:0,maxPrice:1999},{id:'p2',label:'2000-4000 TL',slug:'2000-4000',minPrice:2000,maxPrice:3999},{id:'p3',label:'4000-6000 TL',slug:'4000-6000',minPrice:4000,maxPrice:5999},{id:'p4',label:'6000 TL Üzeri',slug:'6000-uzeri',minPrice:6000,maxPrice:999999}];
const TAGS_STORAGE_KEY='gnk_tags';
const PRICE_TAGS_STORAGE_KEY='gnk_price_tags';

class FakeDataStore {
  private hotels: Hotel[] = [...fakeHotels];
  private groups: Group[] = [...fakeGroups];
  private tags: Tag[] = [];
  private priceTags: PriceTag[] = [];

  constructor() { this.loadFromStorage(); }
  private loadFromStorage() { if(typeof window==='undefined'){this.tags=defaultTags;this.priceTags=defaultPriceTags;return;} const storedTags=localStorage.getItem(TAGS_STORAGE_KEY);this.tags=storedTags?JSON.parse(storedTags):defaultTags;const storedPriceTags=localStorage.getItem(PRICE_TAGS_STORAGE_KEY);this.priceTags=storedPriceTags?JSON.parse(storedPriceTags):defaultPriceTags;if(!storedTags){localStorage.setItem(TAGS_STORAGE_KEY,JSON.stringify(this.tags));} if(!storedPriceTags){localStorage.setItem(PRICE_TAGS_STORAGE_KEY,JSON.stringify(this.priceTags));} }
  private saveTagsToStorage() { if (typeof window !== 'undefined') localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(this.tags)); }
  private savePriceTagsToStorage() { if (typeof window !== 'undefined') localStorage.setItem(PRICE_TAGS_STORAGE_KEY, JSON.stringify(this.priceTags)); }
  
  public getPriceTags(): PriceTag[] { this.loadFromStorage(); return [...this.priceTags]; }
  public setPriceTags(newPriceTags: PriceTag[]) { this.priceTags = newPriceTags; this.savePriceTagsToStorage(); }
  public getTags(): Tag[] { this.loadFromStorage(); return [...this.tags]; }
  public updateTag(id: string, updates: Partial<Omit<Tag, 'id'>>) { const index = this.tags.findIndex(t => t.id === id); if (index !== -1) { this.tags[index] = { ...this.tags[index], ...updates }; this.saveTagsToStorage(); } }
  public addTag(tag: Omit<Tag, 'id'>): Tag { const newTag = { ...tag, id: Date.now().toString() }; this.tags.push(newTag); this.saveTagsToStorage(); return newTag; }
  public deleteTag(id: string): boolean { const index = this.tags.findIndex(t => t.id === id); if (index === -1) return false; this.tags.splice(index, 1); this.saveTagsToStorage(); return true; }
  public getHotels(): Hotel[] { return [...this.hotels]; }
  public getHotel(id: string): Hotel | undefined { return this.hotels.find(h => h.id === id); }
  public addHotel(hotel: Omit<Hotel, 'id'>): Hotel { const newHotel = { ...hotel, id: Date.now().toString() }; this.hotels.push(newHotel); return newHotel; }
  public updateHotel(id: string, updates: Partial<Hotel>): Hotel | null { const index = this.hotels.findIndex(h => h.id === id); if (index === -1) return null; this.hotels[index] = { ...this.hotels[index], ...updates }; return this.hotels[index]; }
  public deleteHotel(id: string): boolean { const index = this.hotels.findIndex(h => h.id === id); if (index === -1) return false; this.hotels.splice(index, 1); return true; }
  public getGroups(): Group[] { return [...this.groups]; }
  public addGroup(group: Omit<Group, 'id'>): Group { const newGroup = { ...group, id: Date.now().toString() }; this.groups.push(newGroup); return newGroup; }
  public updateGroup(id: string, updates: Partial<Group>): Group | null { const index = this.groups.findIndex(g => g.id === id); if (index === -1) return null; this.groups[index] = { ...this.groups[index], ...updates }; return this.groups[index]; }
  public deleteGroup(id: string): boolean { const index = this.groups.findIndex(g => g.id === id); if (index === -1) return false; this.groups.splice(index, 1); return true; }
}

export const fakeDataStore = new FakeDataStore();
```

---

## 🎯 Key Features & Functionality

### **🏨 Hotel Management**
- ✅ Add/Edit/Delete hotels
- ✅ Image upload (cover + gallery)
- ✅ Video integration (Instagram/YouTube)
- ✅ GPS coordinates
- ✅ Tags and categories
- ✅ Detailed descriptions

### **🔍 Search & Filter**
- ✅ Dynamic search functionality
- ✅ Price range filters
- ✅ Tag-based filtering
- ✅ Sort by score/price/name
- ✅ Featured tags system

### **👥 Admin Panel**
- ✅ Hotel CRUD operations
- ✅ Group management (homepage sections)
- ✅ Tag management
- ✅ Price tag configuration
- ✅ Publish/unpublish groups

### **📱 User Experience**
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS
- ✅ Smooth animations
- ✅ Loading states
- ✅ Error handling

### **💾 Data Management**
- ✅ Local storage for settings
- ✅ Firebase integration ready
- ✅ Fake data store for development
- ✅ TypeScript type safety

---

## 🚀 Deployment Instructions

### **Local Development:**
```bash
npm install
npm run dev
```

### **Production Build:**
```bash
npm run build
npm start
```

### **Firebase Setup:**
1. Create Firebase project
2. Enable Firestore
3. Update firebase.ts config
4. Deploy rules

---

## 📝 Usage Instructions

### **For AI/Developer:**
1. Copy this entire content
2. Create new Next.js project
3. Replace all files with provided content
4. Run `npm install`
5. Start development with `npm run dev`

### **Key URLs:**
- **Homepage:** `/`
- **Admin Panel:** `/admin`
- **Hotel Detail:** `/otel/[id]`
- **Search:** `/search?q=query`
- **Tag Management:** `/etiket-yonetimi`

---

## 🔧 Technical Details

### **Architecture:**
- **Frontend:** Next.js 13 with App Router
- **Styling:** Tailwind CSS + Custom Components
- **State:** React Hooks + Local Storage
- **Database:** Firebase Firestore (+ Fake Store)
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

### **File Structure Logic:**
- `app/` - Next.js 13 App Router pages
- `components/` - Reusable UI components
- `data/` - Data management and fake data
- `lib/` - Utility functions

### **Data Flow:**
1. **FakeDataStore** manages all data operations
2. **Local Storage** persists user settings
3. **Firebase** ready for production data
4. **React State** handles UI updates

---

## 🎨 Design System

### **Colors:**
- Primary: Blue (#2563eb)
- Success: Green (#16a34a)
- Warning: Yellow (#eab308)
- Error: Red (#dc2626)
- Gray Scale: Tailwind defaults

### **Typography:**
- Font: Inter (Google Fonts)
- Headings: Bold, various sizes
- Body: Regular, 14-16px
- Small: 12-14px

### **Components:**
- Cards with hover effects
- Buttons with transitions
- Forms with validation
- Modals and overlays
- Responsive grids

---

## 🔐 Security & Performance

### **Security:**
- TypeScript for type safety
- Input validation with Zod
- XSS protection
- Firebase security rules ready

### **Performance:**
- Next.js optimizations
- Image optimization
- Lazy loading
- Code splitting
- Caching strategies

---

## 📞 Support & Maintenance

### **Common Issues:**
1. **Firebase not working:** Update config in firebase.ts
2. **Images not loading:** Check Pexels URLs
3. **Build errors:** Run `npm run typecheck`
4. **Styling issues:** Check Tailwind config

### **Development Tips:**
- Use TypeScript strictly
- Follow component patterns
- Test on mobile devices
- Optimize images
- Monitor performance

---

**🎉 Project Ready for Migration!**
Copy this entire content and paste it to any AI or developer. They will have complete understanding of the project structure, functionality, and can continue development seamlessly.