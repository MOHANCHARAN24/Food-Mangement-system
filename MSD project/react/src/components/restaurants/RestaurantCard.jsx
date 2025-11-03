import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { formatDistance } from '../../utils/geo';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const { toggleFavorite, favorites } = useAppContext();
  const isFavourite = favorites.has(restaurant._id || restaurant.slug);

  return (
    <article className="restaurant-card">
      <div
        className="restaurant-card__image"
        role="presentation"
        style={{ backgroundImage: `url(${restaurant.heroImage || restaurant.gallery?.[0]})` }}
        onClick={() => navigate(`/restaurants/${restaurant._id || restaurant.slug}`)}
      >
        {restaurant.isTopPick && (
          <span className="restaurant-card__badge">
            <FiTrendingUp /> Top pick
          </span>
        )}
        <button
          type="button"
          className={`restaurant-card__favourite ${isFavourite ? 'restaurant-card__favourite--active' : ''}`}
          onClick={(event) => {
            event.stopPropagation();
            toggleFavorite(restaurant._id || restaurant.slug);
          }}
          aria-label={isFavourite ? 'Remove favourite' : 'Add to favourites'}
        >
          ♥
        </button>
      </div>

      <div className="restaurant-card__body">
        <header>
          <h3>{restaurant.name}</h3>
          <p>{restaurant.cuisine}</p>
        </header>

        <div className="restaurant-card__meta">
          <span>
            <FiStar />
            {restaurant.rating?.toFixed(1)} · {restaurant.ratingCount?.toLocaleString()} ratings
          </span>
          {restaurant.deliveryEta && (
            <span>
              <FiClock /> {restaurant.deliveryEta.min}-{restaurant.deliveryEta.max} {restaurant.deliveryEta.unit}
            </span>
          )}
          {restaurant.distanceKm && <span>{formatDistance(restaurant.distanceKm)}</span>}
        </div>

        {restaurant.highlights?.length ? (
          <ul className="restaurant-card__highlights">
            {restaurant.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}

        <footer>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate(`/restaurants/${restaurant._id || restaurant.slug}`)}
          >
            View menu
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate('/checkout', { state: { restaurant } })}
          >
            Pre-order from {formatCurrency(restaurant.averageOrderValue || 299)}
          </button>
        </footer>
      </div>
    </article>
  );
};

export default RestaurantCard;
