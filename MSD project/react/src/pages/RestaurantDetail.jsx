import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiMapPin, FiStar } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { restaurantService } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/format';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { addToCart } = useAppContext();
  const [restaurant, setRestaurant] = useState(state?.restaurant || null);
  const [loading, setLoading] = useState(!state?.restaurant);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!restaurant) {
      (async () => {
        try {
          setLoading(true);
          const response = await restaurantService.getById(id);
          setRestaurant(response);
        } catch (err) {
          setError('We couldn’t find this restaurant.');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, restaurant]);

  const menuByCategory = useMemo(() => {
    if (!restaurant?.menu?.length) return {};
    return restaurant.menu.reduce((accumulator, item) => {
      const category = item.category || 'Chef Specials';
      if (!accumulator[category]) accumulator[category] = [];
      accumulator[category].push(item);
      return accumulator;
    }, {});
  }, [restaurant]);

  if (loading) {
    return <LoadingSpinner label="Loading menu" />;
  }

  if (error || !restaurant) {
    return <EmptyState title="Restaurant unavailable" message={error} />;
  }

  return (
    <div className="page page--compact restaurant-detail">
      <button className="btn btn--ghost" onClick={() => navigate(-1)} type="button">
        <FiArrowLeft /> Back
      </button>

      <div className="restaurant-detail__hero" style={{ backgroundImage: `url(${restaurant.heroImage})` }}>
        <div className="restaurant-detail__overlay">
          <span className="pill">{restaurant.cuisine}</span>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className="restaurant-detail__meta">
            <span><FiStar /> {restaurant.rating?.toFixed(1)} ({restaurant.ratingCount?.toLocaleString()} ratings)</span>
            <span><FiClock /> {restaurant.deliveryEta?.min}-{restaurant.deliveryEta?.max} {restaurant.deliveryEta?.unit}</span>
            <span><FiMapPin /> {restaurant.address?.area}, {restaurant.address?.city}</span>
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate('/checkout', { state: { restaurant } })}
          >
            Pre-order a table
          </button>
        </div>
      </div>

      <section>
        <h2>Highlights</h2>
        <ul className="restaurant-detail__highlights">
          {restaurant.highlights?.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </section>

      <section className="restaurant-detail__menu">
        <h2>Chef curated menu</h2>
        {Object.entries(menuByCategory).map(([category, items]) => (
          <div key={category} className="menu-section">
            <h3>{category}</h3>
            <ul>
              {items.map((item) => (
                <li key={item.name}>
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="menu-section__actions">
                    <span>{formatCurrency(item.price)}</span>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => addToCart({ name: item.name, price: item.price, restaurantId: restaurant._id })}
                    >
                      Add
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};

export default RestaurantDetail;
