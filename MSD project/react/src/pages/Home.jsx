import React from 'react';
import { Link } from 'react-router-dom';
import SearchHero from '../components/search/SearchHero';
import HighlightStrip from '../components/common/HighlightStrip';
import SectionHeader from '../components/common/SectionHeader';
import RestaurantGrid from '../components/restaurants/RestaurantGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAppContext } from '../context/AppContext';
import FeaturedLocationsSection from '../components/locations/FeaturedLocationsSection';

const Home = () => {
  const { topRestaurants, nearbyRestaurants, loading } = useAppContext();

  return (
    <div className="page">
      <SearchHero />
      <HighlightStrip />
  <FeaturedLocationsSection />

      <section className="section">
        <SectionHeader
          title="Tonight's Top Chef Tables"
          subtitle="Reserve exclusive menus handpicked by our culinary concierge"
          action={<Link to="/restaurants" className="btn btn--ghost">View all</Link>}
        />
        {loading && topRestaurants.length === 0 ? (
          <LoadingSpinner label="Loading top restaurants" />
        ) : (
          <RestaurantGrid restaurants={topRestaurants} />
        )}
      </section>

      <section className="section">
        <SectionHeader
          title="Near you right now"
          subtitle="Settle in faster with kitchens that specialise in pre-ordering"
        />
        {loading && nearbyRestaurants.length === 0 ? (
          <LoadingSpinner label="Scanning neighbourhood" />
        ) : (
          <RestaurantGrid restaurants={nearbyRestaurants} />
        )}
      </section>

      <section className="section section--secondary">
        <div className="cta-card">
          <h2>Run a restaurant? Join our invite-only pre-order program.</h2>
          <p>
            Unlock guaranteed covers, revenue forecasts, and marketing support tailored towards high intent diners.
          </p>
          <a className="btn btn--primary" href="mailto:partners@preorder.io">Partner with us</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
