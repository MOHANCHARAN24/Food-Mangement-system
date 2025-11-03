import featuredLocations from '../data/locationSeed.js';
import Restaurant from '../models/Restaurant.js';
import { restaurantSeedData } from '../data/restaurantSeed.js';

const EARTH_RADIUS_KM = 6371;

const toRadians = (value) => (value * Math.PI) / 180;

const calculateDistanceKm = (from, to) => {
  if (!from || !to || from.lat === undefined || from.lng === undefined || to.lat === undefined || to.lng === undefined) {
    return undefined;
  }
  const latDiff = toRadians(to.lat - from.lat);
  const lngDiff = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const a = Math.sin(latDiff / 2) ** 2 + Math.sin(lngDiff / 2) ** 2 * Math.cos(fromLat) * Math.cos(toLat);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 10) / 10;
};

let restaurantSeedIndex;

const getRestaurantSeedIndex = () => {
  if (!restaurantSeedIndex) {
    restaurantSeedIndex = restaurantSeedData.reduce((acc, restaurant) => {
      acc[restaurant.slug] = restaurant;
      return acc;
    }, {});
  }
  return restaurantSeedIndex;
};

const getSeedRestaurantsBySlug = (slugs = []) => {
  const seedIndex = getRestaurantSeedIndex();
  return slugs
    .map((slug) => seedIndex[slug])
    .filter(Boolean)
    .map((restaurant) => ({ ...restaurant }));
};

const fetchRestaurantsBySlugs = async (slugs = []) => {
  if (!slugs.length) return [];
  try {
    const dbRestaurants = await Restaurant.find({ slug: { $in: slugs } })
      .select('name slug cuisine heroImage address rating ratingCount priceLevel averageOrderValue reservationDeposit isTopPick')
      .lean();

    const lookup = new Map(dbRestaurants.map((restaurant) => [restaurant.slug, restaurant]));
    const ordered = slugs
      .map((slug) => lookup.get(slug))
      .filter(Boolean)
      .map((restaurant) => ({ ...restaurant, source: 'database' }));

    const missing = slugs.filter((slug) => !lookup.has(slug));
    if (missing.length) {
      ordered.push(
        ...getSeedRestaurantsBySlug(missing).map((restaurant) => ({
          ...restaurant,
          source: 'seed',
        }))
      );
    }
    return ordered;
  } catch (error) {
    return getSeedRestaurantsBySlug(slugs).map((restaurant) => ({
      ...restaurant,
      source: 'seed',
      error: error.message,
    }));
  }
};

const serialiseLocation = async (location, { includeRestaurants = false, origin } = {}) => {
  const distanceKm = calculateDistanceKm(origin, location.coordinates);
  const payload = {
    ...location,
    coordinates: { ...location.coordinates },
    ...(distanceKm !== undefined ? { distanceKm } : {}),
  };

  if (includeRestaurants) {
    payload.restaurants = await fetchRestaurantsBySlugs(location.restaurantSlugs);
  }

  return payload;
};

export const getLocations = async (req, res, next) => {
  try {
    const { q, withRestaurants, lat, lng, limit } = req.query;
    const includeRestaurants = ['1', 'true', 'yes'].includes(String(withRestaurants || '').toLowerCase());
    const latNumber = Number.parseFloat(lat);
    const lngNumber = Number.parseFloat(lng);
    const origin = Number.isFinite(latNumber) && Number.isFinite(lngNumber)
      ? { lat: latNumber, lng: lngNumber }
      : undefined;

    let matches = featuredLocations;

    if (q) {
      const regex = new RegExp(q.trim(), 'i');
      matches = matches.filter((location) =>
        regex.test(location.label) || regex.test(location.city) || regex.test(location.stats?.topTags?.join(' '))
      );
    }

    const serialised = await Promise.all(matches.map((location) => serialiseLocation(location, { includeRestaurants, origin })));

    if (origin) {
      serialised.sort((a, b) => {
        if (a.distanceKm === undefined) return 1;
        if (b.distanceKm === undefined) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    const limitNumber = Math.min(parseInt(limit, 10) || serialised.length, serialised.length);

    return res.json(serialised.slice(0, limitNumber));
  } catch (error) {
    return next(error);
  }
};

export const getLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { withRestaurants, lat, lng } = req.query;
    const includeRestaurants = ['1', 'true', 'yes'].includes(String(withRestaurants || '').toLowerCase());
    const latNumber = Number.parseFloat(lat);
    const lngNumber = Number.parseFloat(lng);
    const origin = Number.isFinite(latNumber) && Number.isFinite(lngNumber)
      ? { lat: latNumber, lng: lngNumber }
      : undefined;

    const location = featuredLocations.find((entry) => entry.id === id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const payload = await serialiseLocation(location, { includeRestaurants, origin });

    return res.json(payload);
  } catch (error) {
    return next(error);
  }
};

export default {
  getLocations,
  getLocationById,
};
