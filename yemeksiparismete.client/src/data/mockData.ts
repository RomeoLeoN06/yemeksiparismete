export interface Restaurant {
  id: any;
  Id?: any;
  name: string;
  logo: string;
  address: string;
  rating: number;
  description: string;
  category: string;
  Category?: any;
  deliveryTime: string;
  logoUrl?: string;
}

export interface Product {
  id: any;
  Id?: any;
  restaurantId: any;
  name: string;
  price: number;
  description: string;
  stock: number;
  image: string;
  imageUrl?: string;
  category: string;
}

export interface Order {
  id: any;
  userId: any;
  items: { productId: any; quantity: number; name: string; price: number }[];
  total: number;
  status: 'preparing' | 'on the way' | 'delivered';
  date: string;
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Gourmet Burger King',
    logo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop&q=60',
    address: 'Karaköy, İstanbul',
    rating: 4.8,
    description: 'En lezzetli gurme burgerler ve el yapımı soslar.',
    category: 'Burger',
    deliveryTime: '25-35 dk'
  },
  {
    id: '2',
    name: 'Sushi Zen Master',
    logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60',
    address: 'Beşiktaş, İstanbul',
    rating: 4.9,
    description: 'Taze ve otantik Japon mutfağı deneyimi.',
    category: 'Sushi',
    deliveryTime: '30-45 dk'
  },
  {
    id: '3',
    name: 'Pizza Di Napoli',
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
    address: 'Kadıköy, İstanbul',
    rating: 4.7,
    description: 'Odun ateşinde pişen gerçek İtalyan pizzası.',
    category: 'Pizza',
    deliveryTime: '20-30 dk'
  },
  {
    id: '4',
    name: 'Kebapçı Haydar',
    logo: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&auto=format&fit=crop&q=60',
    address: 'Şişli, İstanbul',
    rating: 4.6,
    description: 'Yöresel lezzetler ve eşsiz kebap çeşitleri.',
    category: 'Kebap',
    deliveryTime: '35-50 dk'
  }
];

export const products: Product[] = [
  {
    id: 'p1',
    restaurantId: '1',
    name: 'Truffle Mushroom Burger',
    price: 245,
    description: 'Trüf yağı, karamelize soğan, mantar ve özel sos.',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    category: 'Ana Yemek'
  },
  {
    id: 'p2',
    restaurantId: '1',
    name: 'Double Cheese Overload',
    price: 280,
    description: 'Çift kat köfte, bol cheddar ve turşu.',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60',
    category: 'Ana Yemek'
  },
  {
    id: 'p3',
    restaurantId: '2',
    name: 'Dragon Roll',
    price: 320,
    description: 'Yılan balığı, avokado ve özel sos ile.',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1559466273-d95e72debaf8?w=500&auto=format&fit=crop&q=60',
    category: 'Roll'
  },
  {
    id: 'p4',
    restaurantId: '3',
    name: 'Margherita Speciale',
    price: 195,
    description: 'Buffalo mozzarella, taze fesleğen ve sızma zeytinyağı.',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?w=500&auto=format&fit=crop&q=60',
    category: 'Pizza'
  }
];
