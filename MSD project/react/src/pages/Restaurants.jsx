import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import SectionHeader from '../components/common/SectionHeader';
import RestaurantGrid from '../components/restaurants/RestaurantGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useAppContext } from '../context/AppContext';

const categoryFilters = ['All', 'Fine Dining', 'Vegan', 'Late Night', 'Chef Specials'];

const Restaurants = () => {
  const { searchResults, nearbyRestaurants, loading, lastSearchQuery } = useAppContext();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [activeFilter, setActiveFilter] = useState('All');

  const restaurants = useMemo(() => {
    const base = searchResults.length ? searchResults : nearbyRestaurants;
    if (activeFilter === 'All') return base;
    const regex = new RegExp(activeFilter, 'i');
    return base.filter((restaurant) => regex.test(restaurant.tags?.join(' ')) || regex.test(restaurant.cuisine));
  }, [activeFilter, nearbyRestaurants, searchResults]);

  useEffect(() => {
    const fromQuery = params.get('filter');
    if (fromQuery && categoryFilters.includes(fromQuery)) {
      setActiveFilter(fromQuery);
    }
  }, [params]);

  return (
    <div className="page page--compact">
      <SectionHeader
        title={lastSearchQuery ? `Results for “${lastSearchQuery}”` : 'Discover restaurants'}
        subtitle={
          searchResults.length
            ? `${searchResults.length} curated experiences sorted by distance`
            : 'Refine by cuisine, price point, or chef-led experiences'
        }
        action={
          <button type="button" className="btn btn--ghost">
            <FiFilter /> Refine
          </button>
        }
      />

      <div className="filter-row">
        {categoryFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`chip ${activeFilter === filter ? 'chip--active' : ''}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading && restaurants.length === 0 ? (
        <LoadingSpinner label="Curating menus" />
      ) : restaurants.length ? (
        <RestaurantGrid restaurants={restaurants} />
      ) : (
        <EmptyState
          title="No experiences yet"
          message="Try exploring another neighbourhood or expand your filters to see more chef-led menus."
        />
      )}
    </div>
  );
};

export default Restaurants;
