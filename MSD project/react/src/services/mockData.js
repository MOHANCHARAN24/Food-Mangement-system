export const sampleRestaurants = [
  {
    _id: 'masala-story-kitchen',
    name: 'Masala Story Kitchen',
    slug: 'masala-story-kitchen',
    cuisine: 'Progressive Indian',
    rating: 4.8,
    ratingCount: 2103,
    priceLevel: 3,
    description: 'Chef-driven tasting menus celebrating regional Indian flavours with a modern twist.',
    address: {
      area: 'Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
    },
    highlights: ['Chef Table Experience', 'Sommelier Pairings', 'Advance Reservations'],
    popularDishes: ['Cocoa Butter Scallops', '48 Hr Dal Makhani'],
    heroImage: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=1200&q=80',
    ],
    location: {
      type: 'Point',
      coordinates: [77.6408, 12.9716],
    },
    deliveryEta: { min: 25, max: 40, unit: 'mins' },
    distanceKm: 1.2,
    menu: [
      {
        name: 'Smoked Butter Chicken',
        price: 480,
        description: 'Charcoal-smoked chicken simmered in velvety tomato makhani.',
        category: 'Signature Mains',
      },
      {
        name: 'Truffle Mushroom Kulcha',
        price: 260,
        description: 'Black truffle scented mushrooms stuffed into hand-stretched kulcha.',
        category: 'Small Plates',
      },
      {
        name: 'Virgin Jamun Mojito',
        price: 210,
        description: 'Jamun, mint and lime Highball shaken with pink salt.',
        category: 'Beverages',
      },
    ],
    isTopPick: true,
  },
  {
    _id: 'bao-and-bun-district',
    name: 'Bao & Bun District',
    slug: 'bao-and-bun-district',
    cuisine: 'Asian Comfort',
    rating: 4.6,
    ratingCount: 980,
    priceLevel: 2,
    heroImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Bao Bar', 'Late Night Service'],
    popularDishes: ['Korean Fried Chicken Bao', 'Crispy Lotus Stem'],
    location: {
      type: 'Point',
      coordinates: [77.6056, 12.9719],
    },
    distanceKm: 2.4,
    deliveryEta: { min: 20, max: 30, unit: 'mins' },
    menu: [
      {
        name: 'Crispy Lotus Stem Chilli Caramel',
        price: 320,
        category: 'Tapas',
      },
      {
        name: 'Korean Fried Chicken Bao',
        price: 350,
        category: 'Bao',
      },
    ],
  },
  {
    _id: 'sourdough-society-cafe',
    name: 'Sourdough Society Café',
    slug: 'sourdough-society-cafe',
    cuisine: 'Artisanal Bakery & Brunch',
    rating: 4.9,
    ratingCount: 3021,
    priceLevel: 3,
    heroImage: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80',
    highlights: ['48 Hr Cold Ferment', 'Pet Friendly', 'Brunch Destination'],
    popularDishes: ['Blueberry Mascarpone Cruffin', 'Cured Salmon Benedict'],
    location: {
      type: 'Point',
      coordinates: [77.6002, 12.9745],
    },
    distanceKm: 0.8,
    deliveryEta: { min: 15, max: 25, unit: 'mins' },
    menu: [
      {
        name: 'Blueberry Mascarpone Cruffin',
        price: 220,
        category: 'Viennoiserie',
      },
      {
        name: 'Cured Salmon Benedict',
        price: 420,
        category: 'Brunch',
      },
    ],
    isTopPick: true,
  },
];

export const mockSearch = ({ query }) => {
  if (!query) return sampleRestaurants;
  const regex = new RegExp(query, 'i');
  return sampleRestaurants.filter((restaurant) => regex.test(restaurant.name) || regex.test(restaurant.cuisine));
};

export default {
  sampleRestaurants,
  mockSearch,
};
