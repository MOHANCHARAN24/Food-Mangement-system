import React from 'react';
import LocationSearch from './LocationSearch';

const SearchHero = () => (
  <section className="hero">
    <div className="hero__content">
      <p className="hero__eyebrow">#1 pre-ordering platform for premium dining</p>
      <h1>
        Book tables, pre-order signature menus,
        <span> and skip the waitlist.</span>
      </h1>
      <p className="hero__subtitle">
        Discover curated chef specials and reserve restaurant experiences minutes before you arrive.
      </p>
      <LocationSearch />
      <div className="hero__stats">
        <div>
          <strong>500+</strong>
          <span>Chef-driven menus</span>
        </div>
        <div>
          <strong>₹2Cr</strong>
          <span>Cashback unlocked</span>
        </div>
        <div>
          <strong>8 mins</strong>
          <span>Average confirmation</span>
        </div>
      </div>
    </div>
    <div className="hero__visual" aria-hidden>
      <div className="hero__card hero__card--primary">
        <span className="hero__pill">Tonight 8 PM</span>
        <h3>Chef Table · Masala Story Kitchen</h3>
        <p>Two seaters confirmed, amuse bouche on the house.</p>
      </div>
      <div className="hero__card hero__card--secondary">
        <h4>Pre-order running late?</h4>
        <p>We hold your table for 20 minutes and warm up courses before you arrive.</p>
      </div>
    </div>
  </section>
);

export default SearchHero;
