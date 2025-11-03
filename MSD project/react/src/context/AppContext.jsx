import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { locationService, restaurantService, orderService } from '../services/api';
import { SUGGESTED_LOCATIONS, getFallbackLocation, getSuggestedLocations } from '../utils/geo';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(() => getFallbackLocation());
  const [locations, setLocations] = useState(() => SUGGESTED_LOCATIONS);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState([]);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  const refreshTopRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getTopPicks();
      setTopRestaurants(response);
    } catch (error) {
      console.error('Failed to fetch top picks', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshNearbyRestaurants = useCallback(
    async (coords = location?.coordinates) => {
      if (!coords) return;
      try {
        setLoading(true);
        const response = await restaurantService.getNearby({
          lat: coords.lat,
          lng: coords.lng,
        });
        setNearbyRestaurants(response);
      } catch (error) {
        console.error('Failed to fetch nearby restaurants', error.message);
      } finally {
        setLoading(false);
      }
    },
    [location?.coordinates]
  );

  const searchRestaurants = useCallback(async ({ query, coords, limit }) => {
    try {
      setLoading(true);
      const results = await restaurantService.search({ query, coords, limit });
      setSearchResults(results);
      setLastSearchQuery(query || '');
      if (coords) {
        setLocation((prev) => ({
          ...(prev || {}),
          coordinates: coords,
          label: query || prev?.label,
        }));
      }
      return results;
    } catch (error) {
      console.error('Search error', error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLocations = useCallback(async () => {
    setLocationsLoading(true);
    try {
      const results = await locationService.list();
      setLocations(results);
      setLocation((prev) => {
        if (prev?.coordinates) return prev;
        if (results.length > 0) return results[0];
        return prev || getFallbackLocation();
      });
      return results;
    } catch (error) {
      console.error('Failed to fetch locations', error.message);
      setLocations(SUGGESTED_LOCATIONS);
      setLocation((prev) => prev || getFallbackLocation());
      return SUGGESTED_LOCATIONS;
    } finally {
      setLocationsLoading(false);
    }
  }, []);

  const getLocationSuggestions = useCallback(
    async (query = '') => {
      try {
        return await locationService.list({ query });
      } catch (error) {
        console.error('Failed to search locations', error.message);
        return getSuggestedLocations(query, SUGGESTED_LOCATIONS);
      }
    },
    []
  );

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.name === item.name && entry.restaurantId === item.restaurantId);
      if (existing) {
        return prev.map((entry) =>
          entry.name === item.name && entry.restaurantId === item.restaurantId
            ? { ...entry, quantity: entry.quantity + (item.quantity || 1) }
            : entry
        );
      }
      return [
        ...prev,
        {
          ...item,
          quantity: item.quantity || 1,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((name) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const placeOrder = useCallback(
    async ({ restaurantId, reservation, payment }) => {
      if (!cart.length) {
        throw new Error('Cart is empty');
      }
      const payload = {
        restaurantId,
        customer: user || { name: 'Guest User' },
        reservation,
        items: cart,
        payment,
      };
      const order = await orderService.createOrder(payload);
      clearCart();
      return order;
    },
    [cart, clearCart, user]
  );

  useEffect(() => {
    refreshTopRestaurants();
  }, [refreshTopRestaurants]);

  useEffect(() => {
    if (location?.coordinates) {
      refreshNearbyRestaurants(location.coordinates);
    }
  }, [location?.coordinates, refreshNearbyRestaurants]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      location,
      setLocation,
      topRestaurants,
      nearbyRestaurants,
      searchResults,
      loading,
      favorites,
      toggleFavorite,
      addToCart,
      removeFromCart,
      clearCart,
      cart,
      placeOrder,
      searchRestaurants,
      lastSearchQuery,
      refreshTopRestaurants,
      refreshNearbyRestaurants,
      locations,
      locationsLoading,
      getLocationSuggestions,
      loadLocations,
    }),
    [
      user,
      location,
      topRestaurants,
      nearbyRestaurants,
      searchResults,
      loading,
      favorites,
      toggleFavorite,
      addToCart,
      removeFromCart,
      clearCart,
      cart,
      placeOrder,
      searchRestaurants,
      lastSearchQuery,
      refreshTopRestaurants,
      refreshNearbyRestaurants,
      locations,
      locationsLoading,
      getLocationSuggestions,
      loadLocations,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
