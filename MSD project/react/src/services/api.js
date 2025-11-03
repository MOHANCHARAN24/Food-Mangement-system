import axios from 'axios';
import { sampleRestaurants, mockSearch } from './mockData';
import { SUGGESTED_LOCATIONS, getSuggestedLocations } from '../utils/geo';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const safeRequest = async (method, endpoint, data, config) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      withCredentials: true,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.warn(`API fallback triggered for ${endpoint}`, error.message);
    throw error;
  }
};

export const restaurantService = {
  async getTopPicks() {
    try {
      return await safeRequest('get', '/restaurants/top');
    } catch (error) {
      return sampleRestaurants.filter((restaurant) => restaurant.isTopPick);
    }
  },
  async getNearby({ lat, lng, radius = 6000 }) {
    try {
      return await safeRequest('get', `/restaurants?lat=${lat}&lng=${lng}&radius=${radius}`);
    } catch (error) {
      return sampleRestaurants;
    }
  },
  async search({ query, coords, limit = 20 }) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (coords?.lat && coords?.lng) {
      params.append('lat', coords.lat);
      params.append('lng', coords.lng);
    }
    params.append('limit', limit);
    try {
      return await safeRequest('get', `/restaurants?${params.toString()}`);
    } catch (error) {
      return mockSearch({ query });
    }
  },
  async getById(id) {
    try {
      return await safeRequest('get', `/restaurants/${id}`);
    } catch (error) {
      return sampleRestaurants.find((restaurant) => restaurant._id === id || restaurant.slug === id);
    }
  },
};

export const orderService = {
  async createOrder(payload) {
    try {
      return await safeRequest('post', '/orders', payload);
    } catch (error) {
      return {
        ...payload,
        _id: `mock-order-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        isMock: true,
      };
    }
  },
};

export const locationService = {
  async list({ query } = {}) {
    const trimmed = query?.trim();
    const searchParam = trimmed ? `?q=${encodeURIComponent(trimmed)}` : '';
    try {
      return await safeRequest('get', `/locations${searchParam}`);
    } catch (error) {
      return getSuggestedLocations(trimmed, SUGGESTED_LOCATIONS);
    }
  },
  async getById(id) {
    if (!id) return null;
    try {
      return await safeRequest('get', `/locations/${id}`);
    } catch (error) {
      return SUGGESTED_LOCATIONS.find((entry) => entry.id === id || entry.label === id) || null;
    }
  },
};

export default {
  restaurantService,
  orderService,
  locationService,
};
