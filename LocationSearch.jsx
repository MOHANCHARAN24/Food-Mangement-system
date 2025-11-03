import React, { useCallback, useEffect, useState } from 'react';
import { FiMapPin, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const LocationSearch = () => {
  const { searchRestaurants, location, setLocation, getLocationSuggestions, locations } = useAppContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState(location?.label || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState('');
  const [suggestions, setSuggestions] = useState(locations);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

  useEffect(() => {
    setSuggestions(locations);
  }, [locations]);

  useEffect(() => {
    setQuery(location?.label || '');
  }, [location?.label]);

  useEffect(() => {
    let isMounted = true;
    const trimmed = query?.trim();
    setIsFetchingSuggestions(true);
    const handle = setTimeout(() => {
      getLocationSuggestions(trimmed || '')
        .then((results) => {
          if (isMounted) {
            setSuggestions(results);
          }
        })
        .catch(() => {
          /* swallow errors in suggestion lookup */
        })
        .finally(() => {
          if (isMounted) {
            setIsFetchingSuggestions(false);
          }
        });
    }, 180);

    return () => {
      isMounted = false;
      clearTimeout(handle);
    };
  }, [query, getLocationSuggestions]);

  const resolveSuggestion = useCallback(
    async (input) => {
      const candidate = input?.trim();
      if (!candidate) return null;
      const localMatch = suggestions.find((entry) => entry.label.toLowerCase() === candidate.toLowerCase());
      if (localMatch) {
        return localMatch;
      }
      const fresh = await getLocationSuggestions(candidate);
      if (fresh.length > 0) {
        setSuggestions(fresh);
        return fresh[0];
      }
      return null;
    },
    [suggestions, getLocationSuggestions]
  );

  const handleSearch = useCallback(
    async (input, presetSuggestion) => {
      setIsLoading(true);
      setErrors('');
      try {
        const suggestion = presetSuggestion || (await resolveSuggestion(input));
        const coordinates = suggestion?.coordinates;
        await searchRestaurants({ query: input, coords: coordinates });
        if (suggestion) {
          setLocation(suggestion);
        } else if (coordinates) {
          setLocation((prev) => ({
            ...(prev || {}),
            label: input,
            coordinates,
          }));
        }
        navigate('/restaurants?near=' + encodeURIComponent(input));
      } catch (error) {
        setErrors('Unable to fetch restaurants right now.');
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, resolveSuggestion, searchRestaurants, setLocation]
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    const suggestion = await resolveSuggestion(query);
    await handleSearch(query, suggestion);
  };

  return (
    <div className="location-search">
      <form onSubmit={onSubmit}>
        <FiMapPin />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by area, restaurant, or cuisine"
          aria-label="Search restaurants"
        />
        <button className="btn btn--primary" disabled={isLoading} type="submit">
          <FiSearch />
          {isLoading ? 'Searching...' : 'Find dining'}
        </button>
      </form>
      {!!query && suggestions.length > 0 && (
        <ul className="location-search__suggestions">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id || suggestion.label}>
              <button
                type="button"
                onClick={() => {
                  setQuery(suggestion.label);
                  handleSearch(suggestion.label, suggestion);
                }}
              >
                <FiMapPin />
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {isFetchingSuggestions && <p className="location-search__hint">Searching neighbourhoods…</p>}
      {errors && <p className="location-search__error">{errors}</p>}
    </div>
  );
};

export default LocationSearch;
