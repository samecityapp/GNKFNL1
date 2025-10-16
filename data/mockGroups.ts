import { mockHotels } from './mockHotels';

export const mockGroups = [
  {
    id: 1,
    title: "Bodrum'un Gözdeleri",
    isPublished: true,
    hotels: [mockHotels[0]], // Villa Vadi Boutique Hotel
  },
  {
    id: 2,
    title: "Kapadokya'da Romantik Bir Kaçamak",
    isPublished: false,
    hotels: [mockHotels[1], mockHotels[2]], // Kapadokya ve Kaş otelleri
  },
];