import { useEffect, useState } from 'react';
import { restaurantService } from '../services/api';

export const useRestaurantSearch = ({ query, coords, debounce = 250 }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeout;
    if (query || coords) {
      setLoading(true);
      timeout = setTimeout(async () => {
        try {
          const response = await restaurantService.search({ query, coords });
          setResults(response);
        } catch (error) {
          console.error('Search error', error.message);
        } finally {
          setLoading(false);
        }
      }, debounce);
    } else {
      setResults([]);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [query, coords, debounce]);

  return { results, loading };
};

export default useRestaurantSearch;
