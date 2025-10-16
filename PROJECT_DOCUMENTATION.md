# GNK Hotel Platform - Kapsamlı Proje Dokümantasyonu

## 🏨 Proje Genel Bakış

**GNK Hotel Platform** - Modern otel rezervasyon ve yönetim platformu
- **Teknoloji Stack:** Next.js 13 (App Router), TypeScript, Tailwind CSS, Firebase
- **Veritabanı:** Firebase Firestore + Local Storage (Fake Data Store)
- **Dosya Depolama:** Firebase Storage
- **UI Kütüphanesi:** Shadcn/ui + Lucide React Icons
- **Geliştirme Ortamı:** WebContainer (Tarayıcı içi Node.js)

---

## 📁 Proje Yapısı ve Dosya Organizasyonu

```
gnk-hotel-platform/
├── app/                          # Next.js 13 App Router
│   ├── layout.tsx               # Ana layout (Header + SearchFilters)
│   ├── page.tsx                 # Ana sayfa (HomePageClient wrapper)
│   ├── globals.css              # Global stiller
│   ├── admin/                   # Admin paneli
│   │   ├── layout.tsx          # Admin layout (Sidebar)
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── otel-ekle/page.tsx  # Otel ekleme/düzenleme (Firebase Storage)
│   │   ├── otel-listesi/page.tsx # Otel listesi (Firebase CRUD)
│   │   ├── anasayfa-yonetimi/page.tsx # Grup yönetimi
│   │   ├── main-page-tags/page.tsx # Ana sayfa etiket yönetimi
│   │   └── search-terms/page.tsx # Arama terimleri yönetimi
│   ├── search/page.tsx          # Arama sonuçları sayfası
│   ├── otel/[id]/page.tsx      # Otel detay sayfası
│   └── etiket-yonetimi/page.tsx # Tüm etiketler yönetimi
├── components/                   # Yeniden kullanılabilir bileşenler
│   ├── Header.tsx              # Site başlığı ve navigasyon
│   ├── SearchFilters.tsx       # Arama ve filtre bileşeni
│   ├── HotelCard.tsx          # Otel kartı bileşeni
│   ├── HotelListItem.tsx      # Liste görünümü için otel öğesi
│   ├── Sidebar.tsx            # Admin paneli yan menü
│   └── HomePageClient.tsx     # Ana sayfa client bileşeni
├── data/                        # Veri yönetimi
│   ├── fakeData.ts            # Ana veri deposu (Local Storage + Types)
│   ├── mockData.ts            # Test verileri
│   ├── mockHotels.ts          # Örnek otel verileri
│   └── mockGroups.ts          # Örnek grup verileri
├── lib/
│   └── utils.ts               # Yardımcı fonksiyonlar (cn)
├── firebase.ts                 # Firebase yapılandırması
├── package.json               # Bağımlılıklar ve scriptler
├── next.config.js             # Next.js yapılandırması
├── tailwind.config.ts         # Tailwind CSS yapılandırması
├── tsconfig.json              # TypeScript yapılandırması
└── components.json            # Shadcn/ui yapılandırması
```

---

## 🎯 Proje Özellikleri ve Fonksiyonaliteler

### **🏨 Otel Yönetimi**
- ✅ **CRUD İşlemleri:** Otel ekleme, düzenleme, silme, listeleme
- ✅ **Resim Yükleme:** Firebase Storage ile kapak + galeri fotoğrafları
- ✅ **Video Entegrasyonu:** Instagram/YouTube video linkleri
- ✅ **GPS Koordinatları:** Harita konumu desteği
- ✅ **Etiket Sistemi:** Kategorilendirme ve filtreleme
- ✅ **Detaylı Açıklamalar:** Otel hakkında, tesis kuralları, özellikler

### **🔍 Arama ve Filtreleme**
- ✅ **Dinamik Arama:** Otel adı, konum, özellik bazlı
- ✅ **Akıllı Öneriler:** Otomatik tamamlama sistemi
- ✅ **Fiyat Filtreleri:** Aralık bazlı filtreleme
- ✅ **Etiket Filtreleri:** Çoklu seçim desteği
- ✅ **Sıralama:** Puan, fiyat, isim bazlı
- ✅ **Öne Çıkan Etiketler:** Ana sayfada popüler özellikler

### **👥 Admin Paneli**
- ✅ **Dashboard:** Genel istatistikler ve hızlı erişim
- ✅ **Otel Yönetimi:** Tam CRUD işlemleri
- ✅ **Grup Yönetimi:** Ana sayfa bölümleri oluşturma
- ✅ **Etiket Yönetimi:** Özellik etiketleri ve fiyat aralıkları
- ✅ **Arama Terimleri:** Popüler arama önerileri
- ✅ **Yayınlama Kontrolü:** Grup yayınlama/gizleme

### **📱 Kullanıcı Deneyimi**
- ✅ **Responsive Tasarım:** Mobil uyumlu
- ✅ **Modern UI:** Tailwind CSS ile şık tasarım
- ✅ **Smooth Animasyonlar:** Hover efektleri ve geçişler
- ✅ **Loading States:** Yükleme göstergeleri
- ✅ **Error Handling:** Hata yönetimi ve kullanıcı bildirimleri

---

## 🗄️ Veri Yapısı ve Tipler

### **Hotel Type:**
```typescript
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
```

### **Group Type:**
```typescript
export type Group = {
  id: string;
  title: string;
  isPublished: boolean;
  hotelIds: string[];
};
```

### **Tag Type:**
```typescript
export type Tag = {
  id: string;
  name: string;
  icon: string;
  slug: string;
  isFeatured?: boolean;
};
```

### **PriceTag Type:**
```typescript
export type PriceTag = {
  id: string;
  label: string;
  slug: string;
  minPrice: number;
  maxPrice: number;
};
```

### **SearchTerm Type:**
```typescript
export type SearchTerm = {
  id: string;
  term: string;
  slug: string;
};
```

---

## 🔥 Firebase Yapılandırması

### **Firebase Config (firebase.ts):**
```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKQ_ZA3tmz0ofymv3T0I55OWG4TjQOrvc",
  authDomain: "gnkgnkgnkreal.firebaseapp.com",
  projectId: "gnkgnkgnkreal",
  storageBucket: "gnkgnkgnkreal.appspot.com", // ÖNEMLİ: .appspot.com ile bitmeli
  messagingSenderId: "896678053649",
  appId: "1:896678053649:web:1d87bd864191216ce1eeb0",
  measurementId: "G-VHRZ75L9WC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### **Firebase Collections:**
- **`hotels`** - Otel verileri
- **`groups`** - Ana sayfa grupları
- **`tags`** - Özellik etiketleri
- **`priceTags`** - Fiyat aralığı etiketleri
- **`searchTerms`** - Arama önerileri

### **Firebase Storage:**
- **Klasör:** `images/`
- **Dosya Adlandırma:** `timestamp-filename.ext`
- **Desteklenen Formatlar:** JPG, PNG, WebP

---

## 💾 Veri Yönetimi Sistemi

### **FakeDataStore Class:**
Local Storage tabanlı veri yönetimi sistemi. Firebase ile paralel çalışır.

**Temel Fonksiyonlar:**
- `getHotels()` - Tüm otelleri getir
- `addHotel()` - Yeni otel ekle
- `updateHotel()` - Otel güncelle
- `deleteHotel()` - Otel sil
- `getTags()` - Etiketleri getir
- `updateTag()` - Etiket güncelle
- `getGroups()` - Grupları getir
- `updateGroup()` - Grup güncelle

**Storage Keys:**
- `gnk_tags` - Etiketler
- `gnk_price_tags` - Fiyat etiketleri
- `gnk_search_terms` - Arama terimleri

---

## 🎨 Tasarım Sistemi

### **Renk Paleti:**
- **Primary:** Blue (#2563eb)
- **Success:** Green (#16a34a)
- **Warning:** Yellow (#eab308)
- **Error:** Red (#dc2626)
- **Gray Scale:** Tailwind varsayılan

### **Typography:**
- **Font:** Inter (Google Fonts)
- **Başlıklar:** Bold, çeşitli boyutlar
- **Gövde:** Regular, 14-16px
- **Küçük:** 12-14px

### **Bileşen Stilleri:**
- **Kartlar:** Hover efektleri ile
- **Butonlar:** Geçiş animasyonları
- **Formlar:** Validation desteği
- **Modal/Overlay:** Backdrop blur
- **Grid:** Responsive düzen

---

## 🔧 Teknik Detaylar

### **Next.js 13 App Router:**
- **Server Components:** Layout ve statik sayfalar
- **Client Components:** Interaktif bileşenler (`'use client'`)
- **Dynamic Routes:** `[id]` parametreli sayfalar
- **Nested Layouts:** Admin paneli için ayrı layout

### **State Management:**
- **React Hooks:** useState, useEffect
- **Local Storage:** Ayarlar için kalıcı depolama
- **Firebase Realtime:** onSnapshot ile canlı veri
- **Form State:** Controlled components

### **File Upload System:**
```typescript
// Firebase Storage yükleme mantığı
const uploadFile = (file: File, onProgress: (progress: number) => void): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => onProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      (error) => reject(error),
      async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
    );
  });
};
```

---

## 🚀 Kurulum ve Çalıştırma

### **Gereksinimler:**
- Node.js 18+
- npm veya yarn
- Firebase projesi
- Modern web tarayıcısı

### **Kurulum Adımları:**
```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run typecheck
```

### **Firebase Kurulumu:**
1. Firebase Console'da yeni proje oluştur
2. Firestore Database'i etkinleştir
3. Storage'ı etkinleştir
4. Web uygulaması ekle ve config'i al
5. `firebase.ts` dosyasını güncelle

---

## 🔍 Mevcut Sorunlar ve Çözümler

### **Firebase Storage CORS Sorunu:**
**Problem:** Resim yükleme sırasında CORS hatası
**Çözüm:** Firebase Console → Storage → Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### **Debug Sayfası:**
`app/admin/otel-ekle/page.tsx` dosyası şu anda debug modunda. Konsol mesajları ile yükleme sürecini takip eder.

**Debug Adımları:**
1. Dosya seçimi kontrolü
2. Firebase Storage referansı oluşturma
3. Yükleme ilerlemesi takibi
4. Hata yakalama
5. URL alma işlemi

---

## 📋 Yapılacaklar Listesi

### **Kısa Vadeli:**
- [ ] Firebase Storage CORS sorununun kesin çözümü
- [ ] Resim yükleme sisteminin tam entegrasyonu
- [ ] Form validation iyileştirmeleri
- [ ] Error boundary eklenmesi

### **Orta Vadeli:**
- [ ] Kullanıcı authentication sistemi
- [ ] Rezervasyon sistemi
- [ ] Email bildirimleri
- [ ] SEO optimizasyonları

### **Uzun Vadeli:**
- [ ] Mobile app geliştirme
- [ ] Payment gateway entegrasyonu
- [ ] Multi-language desteği
- [ ] Advanced analytics

---

## 🔐 Güvenlik ve Performans

### **Güvenlik:**
- TypeScript ile tip güvenliği
- Input validation (Zod ile)
- XSS koruması
- Firebase security rules

### **Performans:**
- Next.js optimizasyonları
- Image optimization
- Lazy loading
- Code splitting
- Caching strategies

---

## 📞 Önemli Notlar ve İpuçları

### **Geliştirme İpuçları:**
1. **TypeScript'i sıkı kullan** - Hata yakalamak için
2. **Component patterns'ı takip et** - Tutarlılık için
3. **Mobile-first yaklaşım** - Responsive tasarım
4. **Performance monitoring** - Yavaş sayfaları tespit et

### **Firebase İpuçları:**
1. **Storage bucket adresinin** `.appspot.com` ile bitmesi gerekli
2. **Firestore rules** production'da güvenli olmalı
3. **Storage rules** geliştirme için açık, production'da kısıtlı
4. **Offline support** için caching stratejileri

### **Yaygın Hatalar:**
1. **"use client" direktifi** eksikliği
2. **Firebase config** hataları
3. **CORS** ayar sorunları
4. **TypeScript** tip uyumsuzlukları

---

## 🎯 Proje Hedefleri ve Vizyon

### **Kısa Vadeli Hedefler:**
- Stabil ve hızlı çalışan platform
- Kullanıcı dostu admin paneli
- Mobil uyumlu tasarım
- Temel CRUD işlemleri

### **Uzun Vadeli Vizyon:**
- Türkiye'nin önde gelen otel platformu
- AI destekli öneri sistemi
- Gerçek zamanlı rezervasyon
- Kapsamlı analitik dashboard

---

## 📚 Kaynak ve Referanslar

### **Teknoloji Dokümantasyonları:**
- [Next.js 13 Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### **UI/UX Kaynakları:**
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Tailwind UI](https://tailwindui.com)

---

## 🔄 Son Güncelleme Durumu

**Tarih:** 2025-01-27
**Durum:** Firebase Storage entegrasyonu devam ediyor
**Son Değişiklik:** Debug sayfası eklendi, CORS sorunu araştırılıyor
**Aktif Geliştirici:** AI Assistant (Claude Sonnet 4)

**Mevcut Çalışma Durumu:**
- ✅ Temel CRUD işlemleri çalışıyor
- ✅ Admin paneli fonksiyonel
- ✅ Arama ve filtreleme aktif
- ⚠️ Firebase Storage yükleme sorunu var
- ⚠️ CORS ayarları düzeltilmeli

---

**Bu dokümantasyon, projenin mevcut durumunu ve gelecek planlarını kapsamlı şekilde açıklamaktadır. Yeni geliştirici bu bilgilerle projeye hızlıca adapte olabilir ve kaldığı yerden devam edebilir.**