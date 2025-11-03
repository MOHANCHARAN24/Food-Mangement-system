import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant.js';
import { buildRestaurantSearchFilter } from '../utils/search.js';

const parseNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const getRestaurants = async (req, res, next) => {
  try {
    const {
      q,
      lat,
      lng,
      radius = 6000,
      limit = 20,
      isTopPick,
      tags,
    } = req.query;

    const filters = buildRestaurantSearchFilter({ q, isTopPick, tags });
    const limitNumber = Math.min(parseInt(limit, 10) || 20, 50);

    const latNumber = parseNumber(lat);
    const lngNumber = parseNumber(lng);
    const radiusMeters = (parseInt(radius, 10) || 6000);

    let restaurants = [];

    if (latNumber !== undefined && lngNumber !== undefined) {
      const pipeline = [
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [lngNumber, latNumber],
            },
            distanceField: 'distanceKm',
            maxDistance: radiusMeters,
            distanceMultiplier: 0.001,
            spherical: true,
          },
        },
      ];

      if (Object.keys(filters).length) {
        pipeline.push({ $match: filters });
      }

      pipeline.push(
        { $addFields: { distanceKm: { $round: ['$distanceKm', 2] } } },
        { $limit: limitNumber }
      );

      restaurants = await Restaurant.aggregate(pipeline);
    } else {
      restaurants = await Restaurant.find(filters)
        .limit(limitNumber)
        .sort({ isTopPick: -1, rating: -1, createdAt: -1 });
    }

    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

export const getTopRestaurants = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 24);
    const restaurants = await Restaurant.find({ isTopPick: true })
      .sort({ rating: -1, ratingCount: -1 })
      .limit(limit);

    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

export const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let restaurant = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      restaurant = await Restaurant.findById(id);
    }

    if (!restaurant) {
      restaurant = await Restaurant.findOne({ slug: id.toLowerCase() });
    }

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
    return undefined;
  } catch (error) {
    return next(error);
  }
};

export default {
  getRestaurants,
  getTopRestaurants,
  getRestaurantById,
};
