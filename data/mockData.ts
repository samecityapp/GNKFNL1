export const mockHotels = [
  { id: '1', name: 'De Marine Hotel & Resort', location: 'Bodrum, Ortakent Yalısı', gnkScore: 7.9, price: "3450 TL" },
  { id: '2', name: 'Yalıkavak Butik Otel', location: 'Yalıkavak, Bodrum', gnkScore: 9.7, price: "7800 TL" },
  { id: '3', name: 'Bitez Kır Evi', location: 'Bitez, Bodrum', gnkScore: 9.4, price: "5500 TL" },
  { id: '4', name: 'Turgutreis Deniz Otel', location: 'Turgutreis, Bodrum', gnkScore: 9.1, price: "4800 TL" },
]

export const mockGroups = [
  {
    id: 'g1',
    title: "Bodrum'un En Sakinleri",
    hotels: [mockHotels[0], mockHotels[1], mockHotels[2], mockHotels[3]],
  },
  {
    id: 'g2',
    title: "Fethiye'nin İncileri",
    hotels: [mockHotels[2], mockHotels[0], mockHotels[1]],
  },
]