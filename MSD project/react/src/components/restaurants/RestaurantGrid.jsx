import React from 'react';
import RestaurantCard from './RestaurantCard';

const RestaurantGrid = ({ restaurants = [] }) => (
  <div className="restaurant-grid">
    {restaurants.map((restaurant) => (
      <RestaurantCard key={restaurant._id || restaurant.slug} restaurant={restaurant} />
    ))}
  </div>
);

export default RestaurantGrid;
