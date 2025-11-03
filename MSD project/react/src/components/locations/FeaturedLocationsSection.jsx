import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationCard from './LocationCard';
import SectionHeader from '../common/SectionHeader';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAppContext } from '../../context/AppContext';

const FeaturedLocationsSection = () => {
  const { locations, locationsLoading, searchRestaurants, setLocation } = useAppContext();
  const navigate = useNavigate();

  const visibleLocations = useMemo(() => locations.slice(0, 6), [locations]);

  const handleSelect = useCallback(
    async (entry) => {
      if (!entry?.coordinates) return;
      setLocation(entry);
      await searchRestaurants({ query: entry.label, coords: entry.coordinates });
      navigate('/restaurants?near=' + encodeURIComponent(entry.label));
    },
    [navigate, searchRestaurants, setLocation]
  );

  if (!locationsLoading && visibleLocations.length === 0) {
    return null;
  }

  return (
    <section className="section">
      <SectionHeader
        title="Plan your evening by neighbourhood"
        subtitle="Discover Bengaluru districts famed for chef tables, hidden bars, and pre-order exclusives"
      />
      {locationsLoading && visibleLocations.length === 0 ? (
        <LoadingSpinner label="Mapping neighbourhoods" />
      ) : (
        <div className="location-grid">
          {visibleLocations.map((entry) => (
            <LocationCard key={entry.id || entry.label} location={entry} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedLocationsSection;
