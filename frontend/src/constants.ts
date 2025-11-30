import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Khmer Premium Rice (50kg)',
    nameKm: 'អង្ករផ្កាម្លិះ ៥០គីឡូក្រាម',
    price: 45.00,
    image: 'https://picsum.photos/400/400?random=1',
    basisPoints: 100, // User gets 50 points
    description: 'High quality jasmine rice from Battambang.',
    category: 'Food'
  },
  {
    id: 'p2',
    name: 'Organic Cashew Nuts',
    nameKm: 'គ្រាប់ស្វាយចន្ទី',
    price: 12.50,
    image: 'https://picsum.photos/400/400?random=2',
    basisPoints: 20, // User gets 10 points
    description: 'Freshly roasted cashew nuts.',
    category: 'Snacks'
  },
  {
    id: 'p3',
    name: 'Natural Honey',
    nameKm: 'ទឹកឃ្មុំធម្មជាតិ',
    price: 18.00,
    image: 'https://picsum.photos/400/400?random=3',
    basisPoints: 40,
    description: 'Pure wild honey from Mondulkiri.',
    category: 'Health'
  },
  {
    id: 'p4',
    name: 'Silk Scarf',
    nameKm: 'ក្រមាខ្មែរ',
    price: 8.00,
    image: 'https://picsum.photos/400/400?random=4',
    basisPoints: 10,
    description: 'Traditional handmade silk scarf.',
    category: 'Clothing'
  },
  {
    id: 'p5',
    name: 'Durian Chips',
    nameKm: 'ទុរេនបំពង',
    price: 5.50,
    image: 'https://picsum.photos/400/400?random=5',
    basisPoints: 8,
    description: 'Crispy and sweet durian chips.',
    category: 'Snacks'
  }
];

export const EXCHANGE_RATE = 10; // 10 Points = $1 Shopping Balance