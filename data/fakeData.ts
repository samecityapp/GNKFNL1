// data/fakeData.ts

export type Hotel = { id: string; name: string; location: string; gnkScore: number; price: number; about?: string; tags?: string[]; coverImageUrl?: string; galleryImages?: string[]; aboutFacility?: string; rules?: string; coordinates?: { lat: number; lng: number; }; videoUrl?: string; };
export type Group = { id: string; title: string; isPublished: boolean; hotelIds: string[]; };
export type Tag = { id: string; name: string; icon: string; slug: string; isFeatured?: boolean; };
export type PriceTag = { id: string; label: string; slug: string; minPrice: number; maxPrice: number; };

// --- YENİ VERİ TİPİ EKLENDİ ---
export type SearchTerm = {
  id: string;
  term: string; // Örn: "Fethiye Otelleri"
  slug: string; // Örn: "fethiye"
};

const fakeHotels: Hotel[] = [
  {
    id: "1",
    name: "Paloma Finesse",
    location: "Side, Antalya",
    gnkScore: 9.8,
    price: 8500,
    tags: ["denize-sifir", "aile-oteli", "jakuzili"],
    coverImageUrl: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    about: "Muhteşem deniz manzarası ve birinci sınıf hizmet anlayışı ile unutulmaz bir tatil deneyimi.",
    aboutFacility: "5 yıldızlı lüks tesisin içerisinde spa merkezi, fitness salonu ve çocuk kulübü bulunmaktadır. Tesiste 3 açık havuz, kapalı havuz, aquapark, plaj voleybol sahası ve su sporları imkanları mevcuttur. A'la carte restoranlar, snack barlar ve 24 saat oda servisi hizmet vermektedir.",
    rules: "Check-in: 14:00 | Check-out: 12:00\n\nTesis içerisinde sigara içilmesi yasaktır.\nEvcil hayvan kabul edilmemektedir.\n18 yaş altı misafirler veli/vasi eşliğinde kabul edilir.\nHavuz kullanım saatleri: 08:00 - 19:00"
  },
  {
    id: "2",
    name: "Argos in Cappadocia",
    location: "Uçhisar, Nevşehir",
    gnkScore: 9.7,
    price: 6200,
    tags: ["tarihi", "romantik", "alkolsuz"],
    coverImageUrl: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    about: "Tarihi doku içinde modern lüks. Kapadokya'nın eşsiz manzarasıyla buluşun.",
    aboutFacility: "Mağara odalar, spa merkezi ve panoramik restoran. Tarihi taş evlerde butik konaklama deneyimi. Her oda özenle restore edilmiş ve modern konfor ile donatılmıştır. Kapadokya turları, balon turu organizasyonu ve rehberli geziler düzenlenmektedir.",
    rules: "Check-in: 15:00 | Check-out: 11:00\n\nSessiz bir konaklama deneyimi için lütfen diğer misafirlerimizi rahatsız etmeyiniz.\nEvcil hayvan kabul edilmemektedir.\nAlkol servis edilmemektedir."
  },
  {
    id: "3",
    name: "D-Maris Bay",
    location: "Marmaris, Muğla",
    gnkScore: 9.9,
    price: 12000,
    tags: ["denize-sifir", "jakuzili"],
    coverImageUrl: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    about: "Ege'nin incisi, özel koy ve muhteşem hizmet anlayışı.",
    aboutFacility: "Özel plaj, marina ve gourmet restoranlar."
  },
  {
    id: "4",
    name: "Rixos Premium Belek",
    location: "Belek, Antalya",
    gnkScore: 9.4,
    price: 7800,
    tags: ["aile-oteli", "havuz"],
    coverImageUrl: "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    about: "Ailenizle birlikte unutulmaz bir tatil için ideal.",
    aboutFacility: "Aquapark, çocuk kulübü ve geniş aile odaları."
  },
  {
    id: "5",
    name: "Hillside Beach Club",
    location: "Fethiye, Muğla",
    gnkScore: 9.6,
    price: 5500,
    tags: ["denize-sifir", "aile-oteli"],
    coverImageUrl: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    about: "Doğa ile iç içe, butik bir tatil deneyimi.",
    aboutFacility: "Özel plaj, yoga merkezi ve organik restoran."
  },
  {
    id: "6",
    name: "Museum Hotel",
    location: "Uçhisar, Nevşehir",
    gnkScore: 9.8,
    price: 9500,
    tags: ["tarihi", "romantik"],
    coverImageUrl: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    about: "Tarihi peri bacalarının arasında, eşsiz bir konaklama.",
    aboutFacility: "Tarihi mağara odaları, teras restoran ve hamam."
  }
];

const fakeGroups: Group[] = [
  {
    id: "g1",
    title: "Akdeniz'in İncileri",
    isPublished: true,
    hotelIds: ["1", "3", "4", "5"]
  },
  {
    id: "g2",
    title: "Kapadokya'da Bir Rüya",
    isPublished: true,
    hotelIds: ["2", "6"]
  }
];
const defaultTags: Tag[] = [
  { id: "t1", name: "Denize Sıfır", icon: "Waves", slug: "denize-sifir", isFeatured: true },
  { id: "t2", name: "Jakuzili", icon: "Bath", slug: "jakuzili", isFeatured: true },
  { id: "t3", name: "Romantik", icon: "Heart", slug: "romantik", isFeatured: false },
  { id: "t4", name: "Alkolsüz", icon: "GlassWater", slug: "alkolsuz", isFeatured: true },
  { id: "t5", name: "Aile Oteli", icon: "Users", slug: "aile-oteli", isFeatured: true },
  { id: "t6", name: "Tarihi", icon: "Landmark", slug: "tarihi", isFeatured: false },
  { id: "t7", name: "Havuz", icon: "Droplets", slug: "havuz", isFeatured: true }
];

const defaultPriceTags: PriceTag[] = [
  { id: "p1", label: "2000 TL Altı", slug: "2000-alti", minPrice: 0, maxPrice: 1999 },
  { id: "p2", label: "2000-4000 TL", slug: "2000-4000", minPrice: 2000, maxPrice: 3999 },
  { id: "p3", label: "4000-6000 TL", slug: "4000-6000", minPrice: 4000, maxPrice: 5999 },
  { id: "p4", label: "6000-8000 TL", slug: "6000-8000", minPrice: 6000, maxPrice: 7999 },
  { id: "p5", label: "8000 TL Üzeri", slug: "8000-uzeri", minPrice: 8000, maxPrice: 999999 }
];

// --- YENİ VARSAYILAN ARAMA TERİMLERİ ---
const defaultSearchTerms: SearchTerm[] = [
    { id: 'st1', term: 'Fethiye Otelleri', slug: 'fethiye' },
    { id: 'st2', term: 'Bodrum Otelleri', slug: 'bodrum' },
    { id: 'st3', term: 'Herşey Dahil', slug: 'hersey-dahil' },
];

const TAGS_STORAGE_KEY='gnk_tags';
const PRICE_TAGS_STORAGE_KEY='gnk_price_tags';
const SEARCH_TERMS_STORAGE_KEY = 'gnk_search_terms'; // --- YENİ ---

class FakeDataStore {
  private hotels: Hotel[] = [...fakeHotels];
  private groups: Group[] = [...fakeGroups];
  private tags: Tag[] = [];
  private priceTags: PriceTag[] = [];
  private searchTerms: SearchTerm[] = []; // --- YENİ ---

  constructor() { this.loadFromStorage(); }

  private loadFromStorage() {
    if(typeof window === 'undefined') {
        this.tags = defaultTags;
        this.priceTags = defaultPriceTags;
        this.searchTerms = defaultSearchTerms;
        return;
    }
    const storedTags = localStorage.getItem(TAGS_STORAGE_KEY);
    this.tags = storedTags ? JSON.parse(storedTags) : defaultTags;
    if (!storedTags) localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(this.tags));

    const storedPriceTags = localStorage.getItem(PRICE_TAGS_STORAGE_KEY);
    this.priceTags = storedPriceTags ? JSON.parse(storedPriceTags) : defaultPriceTags;
    if (!storedPriceTags) localStorage.setItem(PRICE_TAGS_STORAGE_KEY, JSON.stringify(this.priceTags));
    
    // --- YENİ ---
    const storedSearchTerms = localStorage.getItem(SEARCH_TERMS_STORAGE_KEY);
    this.searchTerms = storedSearchTerms ? JSON.parse(storedSearchTerms) : defaultSearchTerms;
    if (!storedSearchTerms) localStorage.setItem(SEARCH_TERMS_STORAGE_KEY, JSON.stringify(this.searchTerms));
  }
  
  private saveTagsToStorage = () => { if (typeof window !== 'undefined') localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(this.tags)); }
  private savePriceTagsToStorage = () => { if (typeof window !== 'undefined') localStorage.setItem(PRICE_TAGS_STORAGE_KEY, JSON.stringify(this.priceTags)); }
  private saveSearchTermsToStorage = () => { if (typeof window !== 'undefined') localStorage.setItem(SEARCH_TERMS_STORAGE_KEY, JSON.stringify(this.searchTerms)); } // --- YENİ ---

  // --- YENİ ARAMA TERİMİ FONKSİYONLARI ---
  public getSearchTerms(): SearchTerm[] { this.loadFromStorage(); return [...this.searchTerms]; }
  public addSearchTerm(term: Omit<SearchTerm, 'id'>): SearchTerm { const newTerm = { ...term, id: `st${Date.now()}` }; this.searchTerms.push(newTerm); this.saveSearchTermsToStorage(); return newTerm; }
  public deleteSearchTerm(id: string): boolean { const index = this.searchTerms.findIndex(t => t.id === id); if (index === -1) return false; this.searchTerms.splice(index, 1); this.saveSearchTermsToStorage(); return true; }
  
  // Diğer tüm fonksiyonlar aynı...
  public getPriceTags(): PriceTag[] { this.loadFromStorage(); return [...this.priceTags]; }
  public setPriceTags(newPriceTags: PriceTag[]) { this.priceTags = newPriceTags; this.savePriceTagsToStorage(); }
  public addPriceTag(data: Omit<PriceTag, 'id' | 'slug'>): PriceTag { const slug = `${data.minPrice}-${data.maxPrice}`; const newPriceTag: PriceTag = { ...data, id: `pt-${Date.now()}`, slug }; this.priceTags.push(newPriceTag); this.savePriceTagsToStorage(); return newPriceTag; }
  public deletePriceTag(id: string): boolean { const initialLength = this.priceTags.length; this.priceTags = this.priceTags.filter(pt => pt.id !== id); this.savePriceTagsToStorage(); return this.priceTags.length < initialLength; }
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