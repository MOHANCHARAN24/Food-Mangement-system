import React from 'react';
import { FiMapPin, FiTrendingUp } from 'react-icons/fi';

const LocationCard = ({ location, onSelect }) => {
  if (!location) return null;
  const { label, city, stats, heroImage } = location;
  const handleSelect = () => {
    if (onSelect) {
      onSelect(location);
    }
  };

  return (
    <article className="location-card">
      <div
        className="location-card__media"
        style={{ backgroundImage: heroImage ? `url(${heroImage})` : undefined }}
        aria-label={label}
      >
        <span className="location-card__badge">
          <FiMapPin size={14} />
          {city || 'Featured area'}
        </span>
      </div>
      <div className="location-card__body">
        <div className="location-card__title">
          <h3>{label}</h3>
          {!!stats?.restaurants && (
            <span className="location-card__stat">
              <FiTrendingUp size={14} />
              {stats.restaurants} curated restaurants
            </span>
          )}
        </div>
        {!!stats?.topTags?.length && (
          <ul className="location-card__tags">
            {stats.topTags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        <button type="button" className="btn btn--ghost location-card__action" onClick={handleSelect}>
          View dining
        </button>
      </div>
    </article>
  );
};

export default LocationCard;
